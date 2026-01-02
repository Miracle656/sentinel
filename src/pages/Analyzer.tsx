/**
 * Analyzer Page - Main analysis interface
 */
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import CodeEditor from '../components/analyzer/CodeEditor';
import AnalysisPanel from '../components/analyzer/AnalysisPanel';
import Button from '../components/shared/Button';
import { analyzeContract } from '../services/gemini';
import { demoContracts } from '../data/demoContracts';

export default function Analyzer() {
    const [code, setCode] = useState('// Paste your Sui Move contract here\n\nmodule example::contract {\n    // Your code...\n}');
    const [analysisState, setAnalysisState] = useState('empty'); // empty, loading, results, error
    const [analysisResults, setAnalysisResults] = useState(null);
    const [selectedDemo, setSelectedDemo] = useState('');

    const handleAnalyze = async () => {
        if (!code.trim()) {
            setAnalysisState('error');
            setAnalysisResults({ error: 'Please enter some code to analyze' });
            return;
        }

        setAnalysisState('loading');

        try {
            const results = await analyzeContract(code);
            setAnalysisResults(results);
            setAnalysisState('results');
        } catch (error) {
            setAnalysisState('error');
            setAnalysisResults({ error: error.message });
        }
    };

    const handleDemoSelect = (e) => {
        const contractKey = e.target.value;
        setSelectedDemo(contractKey);

        if (contractKey && demoContracts[contractKey]) {
            setCode(demoContracts[contractKey].code);
            // Reset analysis when new demo is selected
            setAnalysisState('empty');
            setAnalysisResults(null);
        }
    };

    const handleExport = () => {
        if (!analysisResults) return;

        const report = {
            timestamp: new Date().toISOString(),
            score: analysisResults.score,
            summary: analysisResults.summary,
            vulnerabilities: analysisResults.vulnerabilities,
            recommendations: analysisResults.recommendations,
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

                    {/* Demo Selector */}
                    <div className="relative">
                        <select
                            value={selectedDemo}
                            onChange={handleDemoSelect}
                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 pr-10 text-sm appearance-none cursor-pointer hover:border-[#0284FE] transition-colors"
                        >
                            <option value="">Select Example Contract...</option>
                            <option value="vulnerable_defi">🔴 Vulnerable DeFi Protocol</option>
                            <option value="secure_nft">🟢 Secure NFT Contract</option>
                            <option value="timestamp_vuln">🟠 Timestamp Manipulation</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    </div>
                </div>

                <Button onClick={handleAnalyze} disabled={analysisState === 'loading'}>
                    {analysisState === 'loading' ? 'Analyzing...' : 'Analyze Contract'}
                </Button>
            </div>

            {/* Split View */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Code Editor */}
                <div className="w-1/2 border-r border-zinc-800">
                    <CodeEditor value={code} onChange={setCode} />
                </div>

                {/* Right: Analysis Panel */}
                <div className="w-1/2">
                    <AnalysisPanel
                        state={analysisState}
                        results={analysisResults}
                        onExport={handleExport}
                    />
                </div>
            </div>
        </div>
    );
}
