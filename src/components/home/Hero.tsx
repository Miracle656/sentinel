/**
 * Hero Component - Landing page hero section
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';
import Button from '../shared/Button';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0284FE]/10 via-transparent to-transparent"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 py-24 text-center">
                <div className="max-w-4xl mx-auto">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0284FE]/10 border border-[#0284FE]/30 rounded-full text-sm text-[#0284FE] mb-8">
                        <span className="w-2 h-2 bg-[#0284FE] rounded-full animate-pulse"></span>
                        Powered by Gemini 3 AI
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                        Secure Your Sui Smart Contracts in{' '}
                        <span className="bg-gradient-to-r from-[#0284FE] to-cyan-400 bg-clip-text text-transparent">
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
                            <Button size="lg" icon={ArrowRight}>
                                Analyze Contract
                            </Button>
                        </Link>
                        <Link to="/demo">
                            <Button size="lg" variant="outline" icon={Play}>
                                View Demo
                            </Button>
                        </Link>
                    </div>

                    {/* Isometric Illustration Placeholder */}
                    <div className="relative max-w-2xl mx-auto">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 backdrop-blur-sm">
                            <div className="aspect-video flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#0284FE]/20 to-transparent border-2 border-[#0284FE]/50 flex items-center justify-center">
                                        <svg className="w-16 h-16 text-[#0284FE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-zinc-500">Visual attack flow diagrams coming soon</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-zinc-700 rounded-full flex items-start justify-center p-2">
                    <div className="w-1 h-2 bg-[#0284FE] rounded-full"></div>
                </div>
            </div>
        </section>
    );
}
