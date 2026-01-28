/**
 * Analyzer Page - Main analysis interface with history tracking
 */
import React, { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import CodeEditor from '../components/analyzer/CodeEditor';
import InputSelection from '../components/analyzer/InputSelection';
import AnalysisPanel from '../components/analyzer/AnalysisPanel';
import Button from '../components/shared/Button';
import { useAnalysis } from '../hooks/useAnalysis';
import { demoContracts } from '../data/demoContracts';

export default function Analyzer() {
    const [code, setCode] = useState('// Paste your Sui Move contract here\n\nmodule example::contract {\n    // Your code...\n}');
    const [selectedDemo, setSelectedDemo] = useState('');
    const [viewMode, setViewMode] = useState<'input' | 'editor'>('input');
    const [sourceLabel, setSourceLabel] = useState<string>('');

    // Use custom hook for analysis state management with history
    const { state, results, analyze } = useAnalysis();

    const handleAnalyze = () => {
        analyze(code);
    };

    const handleDemoSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const contractKey = e.target.value;
        setSelectedDemo(contractKey);

        if (contractKey && demoContracts[contractKey]) {
            setCode(demoContracts[contractKey].code);
            setSourceLabel(`Demo: ${demoContracts[contractKey].name}`);
            setViewMode('editor');
        } else {
            setViewMode('input');
        }
    };

    const handleCodeLoaded = (newCode: string, source: string) => {
        setCode(newCode);
        setSourceLabel(source);
        setViewMode('editor');
    };

    const handleExport = () => {
        if (!results) return;

        const report = {
            timestamp: new Date().toISOString(),
            score: results.score,
            summary: results.summary,
            vulnerabilities: results.vulnerabilities,
            recommendations: results.recommendations,
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sentinel-analysis-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-screen flex flex-col bg-black">
            {/* Top Bar */}
            <div className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center px-6 gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <h1 className="text-xl font-semibold">Contract Analyzer</h1>

                    {viewMode === 'editor' && (
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-600 text-lg">/</span>
                            <span className="text-sm text-zinc-400 flex items-center gap-2">
                                {sourceLabel || 'Custom Code'}
                            </span>
                        </div>
                    )}

                    {viewMode === 'editor' && (
                        <button
                            onClick={() => setViewMode('input')}
                            className="ml-4 text-xs text-sui-blue hover:text-white transition-colors flex items-center gap-1"
                        >
                            ← Back to Upload
                        </button>
                    )}

                    {/* Demo Selector */}
                    <div className="relative ml-auto mr-4">
                        <select
                            value={selectedDemo}
                            onChange={handleDemoSelect}
                            className="bg-zinc-800 border border-zinc-700 px-4 py-2 pr-10 text-sm appearance-none cursor-pointer hover:border-sui-blue transition-colors w-64"
                        >
                            <option value="">Load Example Contract...</option>
                            <option value="vulnerable_defi">🔴 Vulnerable DeFi Protocol</option>
                            <option value="secure_nft">🟢 Secure NFT Contract</option>
                            <option value="timestamp_vuln">🟠 Timestamp Manipulation</option>
                        </select>
                        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                </div>

                <Button onClick={handleAnalyze} disabled={state === 'loading' || viewMode === 'input'}>
                    {state === 'loading' ? 'Analyzing...' : 'Analyze Contract'}
                </Button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Input Selection OR Code Editor */}
                <div className="w-1/2 border-r border-zinc-800">
                    {viewMode === 'input' ? (
                        <InputSelection onCodeLoaded={handleCodeLoaded} />
                    ) : (
                        <CodeEditor value={code} onChange={setCode} />
                    )}
                </div>

                {/* Right: Analysis Panel */}
                <div className="w-1/2 h-full">
                    <AnalysisPanel
                        state={state}
                        results={results}
                        onExport={handleExport}
                    />
                </div>
            </div>
        </div>
    );
}
