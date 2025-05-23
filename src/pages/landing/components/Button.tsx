import React from "react";
import { clsx } from "clsx";
import styles from "./Button.module.scss";

interface ButtonProps {
    className?: string;
    title: string;
    href?: string;
    onClick?: () => void;
    popular?: boolean;
    [key: string]: any;
}

const Button = ({ className, title, href, onClick, popular, ...props }: ButtonProps) => {
    const buttonClasses = clsx(
        styles.button,
        popular ? styles.popular : styles.default,
        className
    );

    if (href) {
        return (
            <a href={href} className={buttonClasses} {...props}>
                <span>{title}</span>
                <span className={styles.arrow}>→</span>
            </a>
        );
    }

    return (
        <button onClick={onClick} className={buttonClasses} {...props}>
            <span>{title}</span>
            <span className={styles.arrow}>→</span>
        </button>
    );
};

export default Button; 