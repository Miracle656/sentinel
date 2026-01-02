/**
 * Badge Component - Sharp Edges with Glow
 */
import React from 'react';
import type { BadgeVariant } from '../../types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: BadgeVariant;
    children: React.ReactNode;
}

export default function Badge({ children, variant = 'default', className = '', ...props }: BadgeProps) {
    const baseStyles = 'inline-flex items-center px-3 py-1.5 text-xs font-bold border backdrop-blur-sm';

    const variants: Record<BadgeVariant, string> = {
        default: 'bg-zinc-800/60 text-zinc-300 border-zinc-700',
        critical: 'bg-red-500/20 text-red-400 border-red-500/60 shadow-glow-red',
        high: 'bg-orange-500/20 text-orange-400 border-orange-500/60 shadow-[0_0_16px_rgba(249,115,22,0.4)]',
        medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/60 shadow-[0_0_16px_rgba(234,179,8,0.3)]',
        low: 'bg-blue-500/20 text-blue-300 border-blue-500/60 shadow-[0_0_16px_rgba(59,130,246,0.3)]',
        success: 'bg-green-500/20 text-green-400 border-green-500/60 shadow-glow-green',
        info: 'bg-sui-blue/20 text-sui-blue border-sui-blue/60 shadow-glow-sm',
    };

    return (
        <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
            {children}
        </span>
    );
}
