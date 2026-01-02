/**
 * Footer Component
 */
import { Shield, Github, Twitter } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-zinc-950 border-t border-zinc-800 mt-20">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Shield className="w-6 h-6 text-[#0284FE]" />
                            <span className="text-xl font-bold">Sentinel</span>
                        </div>
                        <p className="text-zinc-400 text-sm max-w-md">
                            AI-powered security auditor for Sui Move smart contracts. Analyze vulnerabilities,
                            get security scores, and implement fixes in seconds using Gemini 3.
                        </p>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-zinc-400 hover:text-[#0284FE] transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-zinc-400 hover:text-[#0284FE] transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                            <li><a href="/analyzer" className="hover:text-white transition-colors">Analyzer</a></li>
                            <li><a href="/demo" className="hover:text-white transition-colors">Demo</a></li>
                            <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li><a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Sui Docs</a></li>
                            <li><a href="https://move-book.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Move Book</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Security Best Practices</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-zinc-800 mt-8 pt-8 text-center text-sm text-zinc-500">
                    <p>© 2026 Sentinel.</p>
                </div>
            </div>
        </footer>
    );
}
