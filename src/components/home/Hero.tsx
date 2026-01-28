/**
 * Hero Component - Sui Design with Sharp Edges
 */
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Button from '../shared/Button';
import sentinelImg from '../../assets/sentinel.png';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
            {/* Radial Gradient Background - Sui Style */}
            <div className="absolute inset-0 bg-black">
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(41, 141, 255, 0.15), transparent 50%)'
                    }}
                />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-0 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-sui-blue/10 border border-sui-blue/30 text-sui-blue text-sm font-semibold mb-8">
                        <ShieldCheckIcon className="w-4 h-4" />
                        Powered by Gemini 3 AI
                    </div>

                    {/* Headline with Glow */}
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                        Secure Your Sui Smart Contracts in{' '}
                        <span
                            className="text-sui-blue"
                            style={{
                                textShadow: '0 0 60px rgba(41, 141, 255, 0.6), 0 0 30px rgba(41, 141, 255, 0.4)'
                            }}
                        >
                            Seconds
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto">
                        AI-powered security auditing for Move contracts. Get instant vulnerability reports,
                        visual attack diagrams, and secure code fixes.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <Link to="/analyzer">
                            <Button size="lg" icon={ArrowRightIcon}>
                                Analyze Contract
                            </Button>
                        </Link>
                        <Link to="/demo">
                            <Button size="lg" variant="outline" icon={PlayIcon}>
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Sentinel Visual - 3D Pop Out Effect */}
                    <div className="relative max-w-lg mx-auto mt-32 mb-12 perspective-1000">
                        {/* The "Platform" / Card Base - Tilted */}
                        <div className="relative z-10 bg-gradient-to-b from-sui-card/60 to-sui-card/20 border border-sui-blue/20 p-1 rounded-2xl backdrop-blur-md transform rotate-x-12 scale-90 shadow-2xl shadow-sui-blue/10">
                            <div className="bg-black/40 rounded-xl overflow-hidden relative h-64 border border-white/5">
                                {/* Grid Floor inside card */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(41,141,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(41,141,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] perspective-origin-bottom transform rotate-x-45 scale-150 opacity-50" />

                                {/* Holographic Projection Light */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-sui-blue/30 blur-[40px] rounded-full" />
                            </div>
                        </div>

                        {/* The Sentinel - Popping OUT of the card */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[100%] z-20 pointer-events-none transform -translate-y-4">
                            <img
                                src={sentinelImg}
                                alt="Sentinel AI"
                                className="w-full h-auto drop-shadow-2xl"
                                style={{
                                    filter: 'drop-shadow(0 0 10px rgba(41, 141, 255, 0.4))'
                                }}
                            />

                            {/* Floating UI Elements */}
                            <div className="absolute top-1/3 right-4 animate-bounce-slow bg-black/90 border border-sui-blue/50 px-3 py-1 rounded text-[10px] text-sui-blue shadow-lg shadow-sui-blue/20 backdrop-blur-sm">
                                ● PROTECTION ACTIVE
                            </div>
                            <div className="absolute top-1/2 left-8 animate-bounce-delay bg-black/90 border border-sui-blue/50 px-3 py-1 rounded text-[10px] text-sui-blue shadow-lg shadow-sui-blue/20 backdrop-blur-sm">
                                🛡️ THREAT SCANNING
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Sharp */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer opacity-50 hover:opacity-100 transition-opacity">
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500">Scroll</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-sui-blue/0 via-sui-blue/50 to-sui-blue/0" />
                </div>
            </div>
        </section>
    );
}
