import React from 'react';
import { Link } from 'react-router-dom';
import styles from '@/styles/Logo.module.scss';

interface LogoProps {
    width?: number;
    height?: number;
    className?: string;
    showLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({
    width = 150,
    height = 90,
    className = '',
    showLink = true
}) => {
    const LogoImage = (
        <div className={`${styles.logoWrapper} ${className}`}>
            <img
                src="/images/navlogo.svg"
                width={Math.round(width)}
                height={Math.round(height)}
                alt="LawBit"
                style={{
                    display: 'block',
                    imageRendering: 'crisp-edges',
                    transform: 'translateZ(0)'
                }}
            />
            <span className={styles.betaLabel}>BETA</span>
        </div>
    );

    if (showLink) {
        return (
            <Link to="/" className={styles.logoLink}>
                {LogoImage}
            </Link>
        );
    }

    return LogoImage;
};

export default Logo; 