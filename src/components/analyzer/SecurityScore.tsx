/**
 * SecurityScore Component - Circular progress with Sui glow
 */
import { useEffect, useState } from 'react';

interface SecurityScoreProps {
    score: number;
}

interface ScoreColor {
    color: string;
    label: string;
    textColor: string;
}

export default function SecurityScore({ score }: SecurityScoreProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const duration = 1500;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            setAnimatedScore(Math.floor(progress * score));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    const getScoreColor = (score: number): ScoreColor => {
        if (score >= 71) return { color: '#10b981', label: 'Good', textColor: 'text-green-400' };
        if (score >= 41) return { color: '#f59e0b', label: 'Warning', textColor: 'text-yellow-400' };
        return { color: '#ef4444', label: 'Critical', textColor: 'text-red-400' };
    };

    const { color, label, textColor } = getScoreColor(score);

    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    return (
        <div className="flex flex-col items-center p-8">
            <div className="relative w-56 h-56">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke="#1a1a1a"
                        strokeWidth="14"
                        fill="none"
                    />
                    <circle
                        cx="112"
                        cy="112"
                        r={radius}
                        stroke={color}
                        strokeWidth="14"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{
                            transition: 'stroke-dashoffset 0.5s ease',
                            filter: `drop-shadow(0 0 12px ${color}80)`
                        }}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className={`text-6xl font-bold ${textColor}`} style={{
                        textShadow: `0 0 30px ${color}60`
                    }}>
                        {animatedScore}
                    </div>
                    <div className="text-sm text-zinc-500 mt-1">out of 100</div>
                </div>
            </div>

            <div className="mt-6 text-center">
                <div className="text-xl font-bold mb-2">Security Score</div>
                <div className={`text-sm font-semibold ${textColor} px-4 py-1.5  bg-${label === 'Good' ? 'green' : label === 'Warning' ? 'yellow' : 'red'}-500/20 border border-${label === 'Good' ? 'green' : label === 'Warning' ? 'yellow' : 'red'}-500/50`}>
                    {label}
                </div>
            </div>
        </div>
    );
}
