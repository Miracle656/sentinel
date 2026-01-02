/**
 * Card Component - Sharp Edges Sui Design
 */
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    glow?: boolean;
    padding?: boolean;
    children: React.ReactNode;
}

export default function Card({
    children,
    className = '',
    hover = false,
    glow = false,
    padding = true,
    ...props
}: CardProps) {
    const baseStyles = 'bg-gradient-to-br from-sui-card/80 to-sui-card/40 border border-sui-blue/15 backdrop-blur-sm transition-all duration-300';
    const hoverStyles = hover ? 'hover:border-sui-blue/40 hover:shadow-glow-sm cursor-pointer hover:-translate-y-1' : '';
    const glowStyles = glow ? 'shadow-glow' : '';
    const paddingStyles = padding ? 'p-8' : '';

    return (
        <div
            className={`${baseStyles} ${hoverStyles} ${glowStyles} ${paddingStyles} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
