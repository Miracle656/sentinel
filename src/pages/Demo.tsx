/**
 * Demo Page - Interactive demo with pre-loaded contracts
 */
import { useState } from 'react';
import { Play, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { demoContracts } from '../data/demoContracts';
import { Link } from 'react-router-dom';

export default function Demo() {
    const [selectedContract, setSelectedContract] = useState<string | null>(null);

    const contracts = Object.entries(demoContracts).map(([key, contract]) => ({
        key,
        ...contract,
    }));

    return (
        <div className="min-h-screen bg-black py-24">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 mt-10">
                        <h1 className="text-5xl font-bold mb-4">Interactive Demo</h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Explore how Sentinel analyzes real Sui Move contracts for security vulnerabilities.
                            Select a demo contract to see expected issues.
                        </p>
                    </div>

                    {/* Contract Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {contracts.map((contract) => (
                            <Card
                                key={contract.key}
                                hover
                                className={`cursor-pointer ${selectedContract === contract.key ? 'border-[#0284FE]' : ''
                                    }`}
                                onClick={() => setSelectedContract(contract.key)}
                            >
                                <div className="flex items-start gap-3 mb-3">
                                    {contract.expectedIssues.length > 0 ? (
                                        <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                                    ) : (
                                        <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-semibold mb-2">{contract.name}</h3>
                                        <p className="text-sm text-zinc-400">{contract.description}</p>
                                    </div>
                                </div>

                                {contract.expectedIssues.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800">
                                        <p className="text-xs text-zinc-500 mb-2">Expected Issues:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {contract.expectedIssues.map((issue, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/30"
                                                >
                                                    {issue}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>

                    {/* Selected Contract Detail */}
                    {selectedContract && (
                        <Card className="mb-8">
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold mb-2">
                                    {demoContracts[selectedContract].name}
                                </h2>
                                <p className="text-zinc-400">{demoContracts[selectedContract].description}</p>
                            </div>

                            <div className="bg-black border border-zinc-800 rounded-lg p-4 overflow-x-auto mb-6">
                                <pre className="text-sm font-mono text-zinc-300">
                                    <code>{demoContracts[selectedContract].code}</code>
                                </pre>
                            </div>

                            <div className="flex gap-4">
                                <Link to="/analyzer" state={{ code: demoContracts[selectedContract].code }}>
                                    <Button icon={Play}>Analyze in Full Editor</Button>
                                </Link>
                            </div>
                        </Card>
                    )}

                    {/* CTA */}
                    <div className="text-center">
                        <p className="text-zinc-400 mb-6">
                            Ready to analyze your own contracts?
                        </p>
                        <Link to="/analyzer">
                            <Button size="lg">
                                Start Analyzing
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
