/**
 * Header Component - Detached Floating Navbar (Sui Style)
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 pt-6">
            {/* Detached Container */}
            <div className="max-w-7xl mx-auto">
                {/* Floating Nav Bar */}
                <nav className="bg-black/80 backdrop-blur-xl border border-sui-blue/20 px-6 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <ShieldCheckIcon className="w-7 h-7 text-sui-blue group-hover:text-sui-blue-bright transition-colors" />
                        <span className="text-xl font-bold">Sentinel</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            to="/"
                            className="text-sm font-medium hover:text-sui-blue transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/analyzer"
                            className="text-sm font-medium hover:text-sui-blue transition-colors"
                        >
                            Analyzer
                        </Link>
                        <Link
                            to="/demo"
                            className="text-sm font-medium hover:text-sui-blue transition-colors"
                        >
                            Demo
                        </Link>
                        <Link
                            to="/about"
                            className="text-sm font-medium hover:text-sui-blue transition-colors"
                        >
                            About
                        </Link>

                        <Link to="/analyzer">
                            <button className="bg-gradient-to-r from-sui-blue to-sui-blue-bright px-6 py-2.5 text-sm font-semibold text-white border-none shadow-glow hover:shadow-glow-lg hover:scale-105 transition-all duration-300">
                                Get Started
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white hover:text-sui-blue transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </nav>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 bg-black/95 backdrop-blur-xl border border-sui-blue/20 p-6">
                        <div className="flex flex-col gap-4">
                            <Link
                                to="/"
                                className="text-sm font-medium hover:text-sui-blue transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/analyzer"
                                className="text-sm font-medium hover:text-sui-blue transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Analyzer
                            </Link>
                            <Link
                                to="/demo"
                                className="text-sm font-medium hover:text-sui-blue transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Demo
                            </Link>
                            <Link
                                to="/about"
                                className="text-sm font-medium hover:text-sui-blue transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                About
                            </Link>

                            <Link to="/analyzer" onClick={() => setMobileMenuOpen(false)}>
                                <button className="w-full bg-gradient-to-r from-sui-blue to-sui-blue-bright px-6 py-3 text-sm font-semibold text-white mt-2">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
