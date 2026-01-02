/**
 * HowItWorks Component - Sui Design with Heroicons
 */
import {
    DocumentTextIcon,
    CpuChipIcon,
    CheckCircleIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            icon: DocumentTextIcon,
            title: 'Paste Your Contract',
            description: 'Upload or paste your Sui Move smart contract code into the Monaco editor. Support for modules, functions, and full contracts.',
        },
        {
            number: '02',
            icon: CpuChipIcon,
            title: 'AI Analysis',
            description: 'Gemini 3 examines your code for 8+ vulnerability types specific to Sui Move, including capability leaks and access control flaws.',
        },
        {
            number: '03',
            icon: CheckCircleIcon,
            title: 'Get Results',
            description: 'Receive a comprehensive security score (0-100) with detailed findings, attack diagrams, and affected code snippets.',
        },
        {
            number: '04',
            icon: RocketLaunchIcon,
            title: 'Implement Fixes',
            description: 'Apply AI-suggested improvements with side-by-side diffs showing vulnerable vs secure code. Export reports for documentation.',
        },
    ];

    return (
        <section className="relative py-24 bg-zinc-950 overflow-hidden">
            {/* Radial Gradient Background */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(41, 141, 255, 0.06), transparent 70%)'
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
                        How It Works
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        From code to security in 4 simple steps
                    </p>
                </div>

                {/* Steps */}
                <div className="max-w-5xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                {/* Connecting Line (for desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-20 left-[calc(100%+1rem)] w-8 h-px bg-gradient-to-r from-sui-blue to-transparent" />
                                )}

                                <div className="bg-gradient-to-br from-sui-card/60 to-sui-card/20 border border-sui-blue/20 p-8 hover:border-sui-blue/50 hover:shadow-glow-sm transition-all group">
                                    <div className="flex items-start gap-6">
                                        {/* Number */}
                                        <div className="text-6xl font-bold text-sui-blue/20 group-hover:text-sui-blue/40 transition-colors">
                                            {step.number}
                                        </div>

                                        <div className="flex-1">
                                            {/* Icon */}
                                            <div className="w-12 h-12 bg-sui-blue/10 border border-sui-blue/30 flex items-center justify-center mb-4 group-hover:shadow-glow-sm transition-shadow">
                                                <step.icon className="w-6 h-6 text-sui-blue" />
                                            </div>

                                            {/* Content */}
                                            <h3 className="text-2xl font-semibold mb-3">{step.title}</h3>
                                            <p className="text-zinc-400 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
