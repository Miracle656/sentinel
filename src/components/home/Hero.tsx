/**
 * Hero Component - Sui Design with Sharp Edges
 */
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlayIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Button from '../shared/Button';

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

                    {/* Visual Placeholder - Sharp Edges */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="bg-gradient-to-br from-sui-card/50 to-sui-card/20 border border-sui-blue/20 p-8 backdrop-blur-sm">
                            <div className="aspect-video flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-sui-blue/20 to-transparent border-2 border-sui-blue/50 flex items-center justify-center animate-pulse-glow">
                                        <ShieldCheckIcon className="w-16 h-16 text-sui-blue" />
                                    </div>
                                    <p className="text-lg font-semibold text-sui-blue mb-2">Interactive Attack Flow Diagrams</p>
                                    <p className="text-sm text-zinc-400 mb-4">Visualize vulnerabilities with Mermaid diagrams in the analyzer</p>
                                    <Link to="/analyzer">
                                        <span className="text-sui-blue hover:text-white transition-colors text-sm font-medium">
                                            Try the Analyzer →
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Sharp */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-zinc-700 flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-sui-blue" />
                </div>
            </div>
        </section>
    );
}
