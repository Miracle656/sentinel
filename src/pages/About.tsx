/**
 * About Page
 */
import { Shield, Cpu, Lock, Zap } from 'lucide-react';
import Card from '../components/shared/Card';

export default function About() {
    return (
        <div className="min-h-screen bg-black py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="w-20 h-20 rounded-full bg-[#0284FE]/20 border-2 border-[#0284FE] flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-[#0284FE]" />
                        </div>
                        <h1 className="text-5xl font-bold mb-4">About Sentinel</h1>
                        <p className="text-xl text-zinc-400">
                            AI-powered security auditing for the next generation of smart contracts
                        </p>
                    </div>

                    {/* Mission */}
                    <Card className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            Sentinel was built to make professional-grade smart contract security accessible to every developer
                            building on Sui. Traditional security audits can cost thousands of dollars and take weeks. We believe
                            every project deserves instant, accurate security analysis.
                        </p>
                        <p className="text-zinc-300 leading-relaxed">
                            By leveraging Gemini 3's advanced AI capabilities and our deep understanding of Sui Move patterns,
                            we provide instant vulnerability detection that would typically require expert security auditors.
                        </p>
                    </Card>

                    {/* Technology */}
                    <Card className="mb-8">
                        <h2 className="text-2xl font-semibold mb-6">Powered by AI</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Cpu className="w-5 h-5 text-[#0284FE]" />
                                    <h3 className="font-semibold">Gemini 3</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    State-of-the-art language model trained on billions of code examples
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Lock className="w-5 h-5 text-[#0284FE]" />
                                    <h3 className="font-semibold">Move-Specific</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Specialized prompts engineered for Sui Move vulnerability patterns
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="w-5 h-5 text-[#0284FE]" />
                                    <h3 className="font-semibold">8+ Vulnerability Types</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Comprehensive coverage of common Move security issues
                                </p>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Zap className="w-5 h-5 text-[#0284FE]" />
                                    <h3 className="font-semibold">Instant Analysis</h3>
                                </div>
                                <p className="text-sm text-zinc-400">
                                    Get results in under 10 seconds with actionable recommendations
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Built For Hackathon */}
                    <Card>
                        <h2 className="text-2xl font-semibold mb-4">Built for Gemini Hackathon</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Sentinel was created as part of the Google Gemini Hackathon to demonstrate the power of AI
                            in blockchain security. This project showcases how Gemini 3 can understand complex programming
                            patterns and provide expert-level security analysis for Sui Move smart contracts.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
}
