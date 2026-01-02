/**
 * CTASection Component - Sui Design Final CTA
 */
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Button from '../shared/Button';

export default function CTASection() {
    return (
        <section className="relative py-24 bg-black overflow-hidden">
            {/* Radial Gradient Background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(41, 141, 255, 0.12), transparent 70%)'
                }}
            />

            <div className="relative z-10 container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* CTA Card */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-sui-blue/20 to-transparent border border-sui-blue/30 p-12 text-center">
                        {/* Background Grid Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(41,141,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(41,141,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="w-20 h-20 bg-sui-blue/20 border-2 border-sui-blue flex items-center justify-center mx-auto mb-6 shadow-glow-sm animate-pulse-glow">
                                <ShieldCheckIcon className="w-10 h-10 text-sui-blue" />
                            </div>

                            {/* Content */}
                            <h2
                                className="text-4xl md:text-5xl font-bold mb-4"
                                style={{
                                    textShadow: '0 0 50px rgba(41, 141, 255, 0.4)'
                                }}
                            >
                                Ready to Secure Your Contracts?
                            </h2>
                            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                                Join developers using Sentinel to build more secure Sui Move applications.
                                Start analyzing your contracts for free today.
                            </p>

                            {/* CTA Button */}
                            <Link to="/analyzer">
                                <Button size="lg" icon={ArrowRightIcon}>
                                    Start Analyzing Now
                                </Button>
                            </Link>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-sui-blue/20">
                                <div>
                                    <div
                                        className="text-3xl font-bold text-sui-blue"
                                        style={{
                                            textShadow: '0 0 30px rgba(41, 141, 255, 0.4)'
                                        }}
                                    >
                                        8+
                                    </div>
                                    <div className="text-sm text-zinc-400 mt-1">Vulnerability Types</div>
                                </div>
                                <div>
                                    <div
                                        className="text-3xl font-bold text-sui-blue"
                                        style={{
                                            textShadow: '0 0 30px rgba(41, 141, 255, 0.4)'
                                        }}
                                    >
                                        &lt;10s
                                    </div>
                                    <div className="text-sm text-zinc-400 mt-1">Analysis Time</div>
                                </div>
                                <div>
                                    <div
                                        className="text-3xl font-bold text-sui-blue"
                                        style={{
                                            textShadow: '0 0 30px rgba(41, 141, 255, 0.4)'
                                        }}
                                    >
                                        100%
                                    </div>
                                    <div className="text-sm text-zinc-400 mt-1">AI-Powered</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
