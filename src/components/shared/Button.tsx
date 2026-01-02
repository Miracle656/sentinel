/**
 * Reusable Button Component - Sharp Edges Sui Design
 */
import React, { type ComponentType } from 'react';
import type { ButtonVariant, ButtonSize } from '../../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    icon?: ComponentType<{ className?: string }>;
    children: React.ReactNode;
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    onClick,
    className = '',
    type = 'button',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center gap-2.5 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants: Record<ButtonVariant, string> = {
        primary: 'bg-gradient-to-r from-sui-blue to-sui-blue-bright text-white border-none shadow-glow hover:shadow-glow-lg hover:scale-105',
        secondary: 'bg-sui-card hover:bg-sui-navy text-white border border-sui-blue/30 hover:border-sui-blue/60 hover:shadow-glow-sm',
        outline: 'bg-transparent hover:bg-sui-blue/10 text-sui-blue border border-sui-blue/50 hover:border-sui-blue hover:shadow-glow-sm',
        ghost: 'bg-transparent hover:bg-sui-blue/10 text-white border-none hover:text-sui-blue',
    };

    const sizes: Record<ButtonSize, string> = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : Icon ? (
                <Icon className="w-5 h-5" />
            ) : null}
            {children}
        </button>
    );
}
