/**
 * useAnalysis Hook - Analysis state management with history
 */
import { useState, useCallback } from 'react';
import { analyzeContract } from '../services/gemini';
import { useLocalStorage } from './useLocalStorage';
import type { AnalysisResults } from '../types';

export type AnalysisState = 'empty' | 'loading' | 'results' | 'error';

interface AnalysisHistoryItem {
    id: string;
    timestamp: string;
    code: string;
    results: AnalysisResults;
}

export function useAnalysis() {
    const [state, setState] = useState<AnalysisState>('empty');
    const [results, setResults] = useState<AnalysisResults | null>(null);
    const [history, setHistory] = useLocalStorage<AnalysisHistoryItem[]>('sentinel-history', []);

    const analyze = useCallback(async (code: string) => {
        if (!code.trim()) {
            setState('error');
            return;
        }

        setState('loading');

        try {
            const analysisResults = await analyzeContract(code);
            setResults(analysisResults);
            setState('results');

            // Save to history
            const historyItem: AnalysisHistoryItem = {
                id: Date.now().toString(),
                timestamp: new Date().toISOString(),
                code: code.substring(0, 200), // Save snippet
                results: analysisResults,
            };

            setHistory(prev => [historyItem, ...prev].slice(0, 10)); // Keep last 10
        } catch (error) {
            setState('error');
            console.error('Analysis error:', error);
        }
    }, [setHistory]);

    const clearHistory = useCallback(() => {
        setHistory([]);
    }, [setHistory]);

    const loadFromHistory = useCallback((item: AnalysisHistoryItem) => {
        setResults(item.results);
        setState('results');
    }, []);

    const reset = useCallback(() => {
        setState('empty');
        setResults(null);
    }, []);

    return {
        state,
        results,
        history,
        analyze,
        clearHistory,
        loadFromHistory,
        reset,
    };
}
