import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getSupabaseClient } from '@/lib/supabase';
import styles from '../styles/SubscriptionModal.module.scss';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentForm: React.FC<{
    priceId: string | null;
    onSuccess: (sessionId: string) => void;
    onCancel: () => void;
}> = ({ priceId, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe has not been initialized');
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const result = await stripe.confirmPayment({
                elements,
                redirect: 'if_required',
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success`,
                    payment_method_data: {
                        billing_details: {
                            address: {
                                country: 'US'
                            }
                        }
                    }
                }
            });

            if (result.error) {
                if (result.error.type === 'card_error' || result.error.type === 'validation_error') {
                    setError(result.error.message || 'Payment failed. Please check your card details and try again.');
                } else {
                    setError('An unexpected error occurred. Please try again.');
                }
                return;
            }

            if (result.paymentIntent) {
                if (result.paymentIntent.status === 'succeeded') {
                    onSuccess(result.paymentIntent.id);
                } else {
                    setError('Payment is still processing. Please wait a moment and try again.');
                }
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.paymentForm}>
            <PaymentElement />
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
            <div className={styles.paymentButtons}>
                <button
                    type="button"
                    onClick={onCancel}
                    className={styles.cancelButton}
                    disabled={isProcessing}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={styles.subscribeButton}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [tokensAdded, setTokensAdded] = useState<number | null>(null);
    const [newBalance, setNewBalance] = useState<number | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    const handlePaymentSuccess = useCallback(async (sessionId: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch('/api/add-tokens', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId }),
            });
            
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            setPaymentSuccess(true);
            setTokensAdded(data.tokensAdded);
            setNewBalance(data.newBalance);
            
            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const tier = selectedPlan === import.meta.env.VITE_PLUS_PRODUCT_ID ? 'plus' : 'ultra';
                
                const { error: updateError } = await supabase.rpc('update_subscription_tier', {
                    p_user_id: user.id,
                    p_tier: tier
                });

                if (updateError) {
                    console.error('Error updating subscription tier:', updateError);
                    throw new Error('Failed to update subscription tier');
                }

                const { error: subscriptionError } = await supabase
                    .from('subscriptions')
                    .insert({
                        user_id: user.id,
                        tier: tier,
                        status: 'active',
                        current_period_start: new Date().toISOString(),
                        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                        cancel_at_period_end: false
                    });

                if (subscriptionError) {
                    console.error('Error creating subscription:', subscriptionError);
                    throw new Error('Failed to create subscription');
                }
            }
            
            setTimeout(() => {
                onClose();
                setPaymentSuccess(false);
                setTokensAdded(null);
                setNewBalance(null);
                setSelectedPlan(null);
                setClientSecret(null);
            }, 3000);
            
        } catch (err: any) {
            setError(err.message || 'Failed to process payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }, [onClose, selectedPlan]);

    const handlePlanSelect = async (priceId: string) => {
        if (!priceId) {
            setError('Please select a plan');
            return;
        }

        setSelectedPlan(priceId);
        
        try {
            setIsLoading(true);
            setError(null);

            const supabase = getSupabaseClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                throw new Error('User not authenticated');
            }

            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userId: user.id,
                }),
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            setClientSecret(data.clientSecret);
        } catch (err: any) {
            setError(err.message || 'Failed to initialize payment. Please try again.');
            setSelectedPlan(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelPayment = () => {
        setSelectedPlan(null);
        setClientSecret(null);
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Choose Your Plan</h2>
                    <button className={styles.closeButton} onClick={onClose}>×</button>
                </div>
                
                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}
                
                {paymentSuccess ? (
                    <div className={styles.successMessage}>
                        <div className={styles.successIcon}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className={styles.successTitle}>Payment Successful!</h3>
                        <p className={styles.successText}>
                            {tokensAdded?.toLocaleString()} tokens have been added to your account.
                        </p>
                        <p className={styles.successBalance}>
                            Your new token balance: {newBalance?.toLocaleString()}
                        </p>
                    </div>
                ) : selectedPlan && clientSecret ? (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm 
                            priceId={selectedPlan} 
                            onSuccess={handlePaymentSuccess} 
                            onCancel={handleCancelPayment}
                        />
                    </Elements>
                ) : (
                    <div className={styles.subscriptionCards}>
                        <div className={styles.subscriptionCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.planName}>Plus</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.price}>$14.99</span>
                                    <span className={styles.period}>/one-time</span>
                                </div>
                            </div>
                            <ul className={styles.featuresList}>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>250,000 Tokens</span>
                                </li>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>10+ Legal Draft / Risk Analysis</span>
                                </li>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Priority Support</span>
                                </li>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Advanced Agreement Analysis</span>
                                </li>
                            </ul>
                            <button
                                className={styles.subscribeButton}
                                onClick={() => handlePlanSelect(import.meta.env.VITE_PLUS_PRODUCT_ID!)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Purchase Now'}
                            </button>
                        </div>
                        
                        <div className={styles.subscriptionCard}>
                            <div className={styles.cardHeader}>
                                <h3 className={styles.planName}>Ultra</h3>
                                <div className={styles.priceContainer}>
                                    <span className={styles.price}>$24.99</span>
                                    <span className={styles.period}>/one-time</span>
                                </div>
                            </div>
                            <ul className={styles.featuresList}>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>600,000 Tokens</span>
                                </li>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>30 Legal Draft / Risk Analysis</span>
                                </li>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Usage History</span>
                                </li>
                                <li className={styles.featureItem}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span>Advanced Agreement analysis</span>
                                </li>
                            </ul>
                            <button
                                className={styles.subscribeButton}
                                onClick={() => handlePlanSelect(import.meta.env.VITE_ULTRA_PRODUCT_ID!)}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Loading...' : 'Purchase Now'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubscriptionModal; 