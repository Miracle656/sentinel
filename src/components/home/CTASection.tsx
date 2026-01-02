/**
 * CTASection Component - Final call-to-action
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield } from 'lucide-react';
import Button from '../shared/Button';

export default function CTASection() {
    return (
        <section className="py-24 bg-black">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* CTA Card */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0284FE]/20 to-transparent border border-[#0284FE]/30 p-12 text-center">
                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(2,132,254,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(2,132,254,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                        <div className="relative z-10">
                            {/* Icon */}
                            <div className="w-20 h-20 rounded-full bg-[#0284FE]/20 border-2 border-[#0284FE] flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-[#0284FE]" />
                            </div>

                            {/* Content */}
                            <h2 className="text-4xl md:text-5xl font-bold mb-4">
                                Ready to Secure Your Contracts?
                            </h2>
                            <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
                                Join developers using Sentinel to build more secure Sui Move applications.
                                Start analyzing your contracts for free today.
                            </p>

                            {/* CTA Button */}
                            <Link to="/analyzer">
                                <Button size="lg" icon={ArrowRight}>
                                    Start Analyzing Now
                                </Button>
                            </Link>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-zinc-800">
                                <div>
                                    <div className="text-3xl font-bold text-[#0284FE]">8+</div>
                                    <div className="text-sm text-zinc-400 mt-1">Vulnerability Types</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#0284FE]">&lt;10s</div>
                                    <div className="text-sm text-zinc-400 mt-1">Analysis Time</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-[#0284FE]">100%</div>
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
