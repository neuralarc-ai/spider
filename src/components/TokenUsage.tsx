import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { getTokenUsage } from '@/services/tokenService';
import { getSupabaseClient } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import styles from '../styles/TokenUsage.module.scss';

interface TokenUsageProps {
    className?: string;
}

const TokenUsage: React.FC<TokenUsageProps> = ({ className }) => {
    const [tokenUsage, setTokenUsage] = useState({ used_tokens: 0, max_tokens: 20000 });
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const supabase = getSupabaseClient();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        fetchUser();
    }, [supabase.auth]);

    useEffect(() => {
        const fetchTokenUsage = async () => {
            if (user) {
                const usage = await getTokenUsage(user.id);
                setTokenUsage(usage);
            }
        };

        fetchTokenUsage();

        // Subscribe to token usage changes
        const channel = supabase
            .channel('token_updates')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'token_usage',
                    filter: `user_id=eq.${user?.id}`,
                },
                async () => {
                    if (user) {
                        const usage = await getTokenUsage(user.id);
                        setTokenUsage(usage);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    const usagePercentage = (tokenUsage.used_tokens / tokenUsage.max_tokens) * 100;

    return (
        <div className={`${styles.tokenUsage} ${className || ''}`}>
            <div className={styles.tokenHeader}>
                <span className={styles.tokenLabel}>Token Usage</span>
                {error ? (
                    <span className={styles.errorText}>{error}</span>
                ) : (
                    <span className={styles.tokenCount}>
                        {tokenUsage.used_tokens.toLocaleString()} / {tokenUsage.max_tokens.toLocaleString()}
                    </span>
                )}
            </div>
            {!error && (
                <div className={styles.progressBar} >
                    <Progress value={usagePercentage} className="h-2 " />
                </div>
            )}
        </div>
    );
};

export default TokenUsage; 