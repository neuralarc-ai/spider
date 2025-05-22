import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getSupabaseClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import TokenUsage from '@/components/TokenUsage';
import SubscriptionModal from '@/components/SubscriptionModal';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import styles from '../styles/Navbar.module.scss';
import menuIcon from "../../public/List item.svg"
import dropdown from  "../../public/List item (1).svg"
import profile from "../../public/userprofile.svg"
import logout from "../../public/LogoutOutline.svg"
import historyIcon from "../../public/SortAscending.svg"
import upgrade from "../../public/upgrade.svg"
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isHistoryPage = location.pathname === '/history';
    const isTermsPage = location.pathname === '/terms-of-use';
    const isPrivacyPage = location.pathname === '/privacy-policy';
    const isResponsibleAIPage = location.pathname === '/responsible-ai';
    const isSpiderPage = location.pathname === '/spider';
    const isInsightPage = location.pathname.startsWith('/insight/');
    const supabase = getSupabaseClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
        setIsOpen(false);
    };

    const handleBack = () => {
        if (isHistoryPage) {
            navigate('/spider');
        } else if (isTermsPage || isPrivacyPage || isResponsibleAIPage) {
            navigate('/');
        } else if (isInsightPage) {
            navigate('/history');
        }
    };

    const openSubscriptionModal = () => {
        setIsOpen(false);
        setIsSubscriptionModalOpen(true);
    };

    const closeSubscriptionModal = () => {
        setIsSubscriptionModalOpen(false);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                {(isHistoryPage || isTermsPage || isPrivacyPage || isResponsibleAIPage || isInsightPage) ? (
                    <button
                        className={styles.backButton}
                        onClick={handleBack}
                        aria-label="Back"
                    >
                        <div className={styles.menuSquare}>
                            <div className={styles.menuCircle}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5m7 7l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </button>
                ) : (
                    <div className={styles.placeholder} > 
                      Spider
                     </div>
                    
                )}
                <div className={styles.logoLink} onClick={() => navigate('/spider')}>
                    
                </div>
                <button
                    className={styles.menuButton}
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                     <img 
                                src={dropdown} 
                                alt="Menu" 
                                
                            />
                    <div className={styles.menuSquare}>
                        <div className={styles.menuCircle}>
                           
                        </div>
                    </div>
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className={styles.overlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={toggleMenu}
                        />
                        <motion.div
                            className={styles.dialog}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={styles.menuItems}>
                                <div className={styles.profileSection}>
                                    <div className={styles.profileImageWrapper}>
                                        <div className={styles.profileOuterCircle}>
                                            <div className={styles.profileInnerCircle}>
                                                {/* <Avatar className={styles.profileImage} style={{ borderRadius: '50%' }}>
                                                    <AvatarImage
                                                        src={user?.user_metadata?.avatar_url}
                                                        alt={user?.user_metadata?.full_name || user?.email || 'Profile'}
                                                    />
                                                    <AvatarFallback className={styles.profileFallbackIcon}>
                                                        {user?.email?.[0]?.toUpperCase() || (
                                                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10" stroke="#222" />
                                                                <path d="M12 16c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="#222" />
                                                            </svg>
                                                        )}
                                                    </AvatarFallback>
                                                </Avatar> */}
                                                <img src={profile} className={styles.profileImage}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.profileInfo}>
                                        <div className={styles.profileName}>
                                            {user?.user_metadata?.full_name || user?.email || 'Please Sign In'}
                                        </div>
                                        <div className={styles.profileEmail}>
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>

                                {user && (
                                    <div className={styles.menuSection}>
                                        <TokenUsage className={styles.tokenUsage} />
                                    </div>
                                )}

                                {user ? (
                                    <>
                                        <button onClick={() => navigate('/history')} className={styles.menuItem}>
                                            History
                                            <img src ={historyIcon} />
                                        </button>
                                        <button onClick={openSubscriptionModal} className={styles.menuItem}>
                                            <span>Upgrade Plan</span>
                                             <img src ={upgrade} />
                                        </button>
                                    
                                        <button onClick={handleLogout} className={styles.menuItem}>
                                        
                                                Logout
                                                <img src ={logout} />
                                         
                                           
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => navigate('/auth/login')} className={styles.menuItem}>
                                        Sign In
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <SubscriptionModal
                isOpen={isSubscriptionModalOpen}
                onClose={closeSubscriptionModal}
            />
        </nav>
    );
};

export default Navbar; 