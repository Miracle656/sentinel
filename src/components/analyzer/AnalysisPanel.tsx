/**
 * AnalysisPanel Component - Right panel showing analysis results with Heroicons
 */

import SecurityScore from './SecurityScore';
import VulnerabilityCard from './VulnerabilityCard';
import LoadingSpinner from '../shared/LoadingSpinner';
import { ExclamationTriangleIcon, CheckCircleIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Button from '../shared/Button';
import type { AnalysisResults } from '../../types';

interface AnalysisPanelProps {
    state: 'empty' | 'loading' | 'error' | 'results';
    results: AnalysisResults | null;
    onExport: () => void;
}

export default function AnalysisPanel({ state, results, onExport }: AnalysisPanelProps) {
    // Empty State
    if (state === 'empty') {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-sui-navy/40 to-black p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-zinc-800/50 border-2 border-zinc-700 flex items-center justify-center mx-auto mb-6">
                        <ExclamationTriangleIcon className="w-10 h-10 text-zinc-600" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-3">No Analysis Yet</h3>
                    <p className="text-zinc-400 mb-6">
                        Paste a Sui Move contract in the editor and click "Analyze" to get started.
                        Or select an example from the dropdown above.
                    </p>
                </div>
            </div>
        );
    }

    // Loading State
    if (state === 'loading') {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-sui-navy/40 to-black p-8">
                <LoadingSpinner
                    size="xl"
                    text="Analyzing contract with Gemini 3..."
                />
            </div>
        );
    }

    // Error State
    if (state === 'error') {
        return (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-sui-navy/40 to-black p-8">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 border-2 border-red-500/50 flex items-center justify-center mx-auto mb-6 shadow-glow-red">
                        <ExclamationTriangleIcon className="w-10 h-10 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-semibold text-red-400 mb-3">Analysis Failed</h3>
                    <p className="text-zinc-400 mb-6">
                        An error occurred while analyzing the contract. Please try again.
                    </p>
                </div>
            </div>
        );
    }

    // Results State
    if (state === 'results' && results) {
        const vulnCount = results.vulnerabilities?.length || 0;
        const criticalCount = results.vulnerabilities?.filter(v => v.severity === 'Critical').length || 0;
        const highCount = results.vulnerabilities?.filter(v => v.severity === 'High').length || 0;

        return (
            <div className="h-full overflow-y-auto bg-gradient-to-br from-sui-navy/40 to-black">
                {/* Header with Score - Part of scrollable content */}
                <div className="bg-gradient-to-b from-sui-navy/90 to-sui-navy/80 border-b border-sui-blue/20">
                    <SecurityScore score={results.score} />

                    {/* Summary */}
                    {results.summary && (
                        <div className="px-6 pb-4">
                            <div className="bg-sui-card/60 border border-sui-blue/20 p-4">
                                <p className="text-sm text-zinc-300 leading-relaxed">{results.summary}</p>
                            </div>
                        </div>
                    )}

                    {/* Stats Bar */}
                    <div className="px-6 pb-4 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="text-sm">
                                <span className="text-zinc-400">Total Issues: </span>
                                <span className="font-semibold">{vulnCount}</span>
                            </div>
                            {criticalCount > 0 && (
                                <div className="text-sm">
                                    <span className="text-red-400">Critical: {criticalCount}</span>
                                </div>
                            )}
                            {highCount > 0 && (
                                <div className="text-sm">
                                    <span className="text-orange-400">High: {highCount}</span>
                                </div>
                            )}
                        </div>

                        <Button size="sm" variant="outline" icon={ArrowDownTrayIcon} onClick={onExport}>
                            Export
                        </Button>
                    </div>
                </div>

                {/* Vulnerabilities List - Part of scrollable content */}
                <div className="p-6">
                    {vulnCount === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-500/10 border-2 border-green-500/50 flex items-center justify-center mx-auto mb-4 shadow-glow-green">
                                <CheckCircleIcon className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-green-400 mb-2">No Vulnerabilities Found!</h3>
                            <p className="text-zinc-400">
                                This contract appears to follow security best practices.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold mb-4">Vulnerabilities Found</h3>
                            {results.vulnerabilities.map((vuln, index) => (
                                <VulnerabilityCard key={index} vulnerability={vuln} />
                            ))}
                        </div>
                    )}

                    {/* Recommendations */}
                    {results.recommendations && results.recommendations.length > 0 && (
                        <div className="mt-8 bg-sui-card/60 border border-sui-blue/20 p-6">
                            <h3 className="text-lg font-semibold mb-4">General Recommendations</h3>
                            <ul className="space-y-2">
                                {results.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm text-zinc-400 flex items-start gap-2">
                                        <span className="text-sui-blue mt-1">•</span>
                                        <span>{rec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
