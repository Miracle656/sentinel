/**
 * LoadingSpinner Component - Animated loading indicator
 */
import { Loader2 } from 'lucide-react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

interface LoadingSpinnerProps {
    size?: SpinnerSize;
    text?: string;
    className?: string;
}

export default function LoadingSpinner({ size = 'md', text = '', className = '' }: LoadingSpinnerProps) {
    const sizes: Record<SpinnerSize, string> = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className={`${sizes[size]} text-[#0284FE] animate-spin`} />
            {text && <p className="text-sm text-zinc-400">{text}</p>}
        </div>
    );
}
