/**
 * Features Component - Sui Design with Heroicons
 */
import {
    BoltIcon,
    CpuChipIcon,
    ShareIcon,
    WrenchScrewdriverIcon,
    StarIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Card from '../shared/Card';

export default function Features() {
    const features = [
        {
            icon: BoltIcon,
            title: 'Instant Analysis',
            description: 'Analyze Move contracts in seconds with AI-powered vulnerability detection. No manual review needed.',
        },
        {
            icon: CpuChipIcon,
            title: 'Move-Specific Intelligence',
            description: 'Understands Sui Move patterns like capability leaks, shared object issues, and witness pattern misuse.',
        },
        {
            icon: ShareIcon,
            title: 'Visual Attack Diagrams',
            description: 'See exactly how exploits work with interactive Mermaid.js flowcharts showing attack paths.',
        },
        {
            icon: WrenchScrewdriverIcon,
            title: 'Smart Fix Suggestions',
            description: 'Get secure code alternatives with side-by-side diff views and detailed explanations.',
        },
        {
            icon: StarIcon,
            title: 'Security Scoring',
            description: 'Understand risk at a glance with 0-100 scores color-coded by severity level.',
        },
        {
            icon: ShieldCheckIcon,
            title: 'Compare with Audited Contracts',
            description: 'Learn from the best with examples of secure implementations and best practices.',
        },
    ];

    return (
        <section className="relative py-24 bg-black overflow-hidden">
            {/* Radial Gradient Background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(41, 141, 255, 0.08), transparent 70%)'
                }}
            />

            <div className="relative z-10 container mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-4"
                        style={{
                            textShadow: '0 0 40px rgba(41, 141, 255, 0.3)'
                        }}
                    >
                        Why Choose <span className="text-sui-blue">Sentinel</span>?
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Professional-grade security auditing powered by AI. Built specifically for Sui Move smart contracts.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <Card key={index} hover className="group">
                            <div className="flex flex-col h-full">
                                <div className="w-12 h-12 bg-sui-blue/10 border border-sui-blue/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-glow-sm transition-all">
                                    <feature.icon className="w-6 h-6 text-sui-blue" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
