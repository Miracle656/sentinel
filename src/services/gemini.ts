/**
 * Gemini API Service - Serverless Proxy Integration
 */
import { SEVERITY_WEIGHTS } from '../utils/constants';
import type { AnalysisResults, Vulnerability } from '../types';

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{
                text: string;
            }>;
        };
    }>;
}

interface AnalysisResponse {
    summary: string;
    vulnerabilities: Vulnerability[];
    recommendations: string[];
}

/**
 * Analyze a Sui Move contract using the secure serverless backend
 */
export async function analyzeContract(contractCode: string): Promise<AnalysisResults> {
    try {
        // We now call our own backend API instead of Google directly
        // This protects the API Key from being exposed in the browser
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: contractCode })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Server request failed: ${response.statusText}`);
        }

        const data: GeminiResponse = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from AI service');
        }

        const analysisText = data.candidates[0].content.parts[0].text;
        const parsedResults = parseAnalysisResults(analysisText);
        const score = calculateSecurityScore(parsedResults.vulnerabilities);

        return {
            score,
            vulnerabilities: parsedResults.vulnerabilities || [],
            summary: parsedResults.summary || '',
            recommendations: parsedResults.recommendations || [],
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error('Analysis error:', error);
        throw new Error(`Failed to analyze contract: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

function parseAnalysisResults(responseText: string): AnalysisResponse {
    try {
        let jsonText = responseText.trim();

        // Remove markdown code blocks if present
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.slice(7);
        }
        if (jsonText.startsWith('```')) {
            jsonText = jsonText.slice(3);
        }
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3);
        }

        return JSON.parse(jsonText.trim());
    } catch (error) {
        console.error('Parse error:', error);
        console.error('Response text:', responseText);
        throw new Error('Failed to parse analysis results');
    }
}

export function calculateSecurityScore(vulnerabilities: Vulnerability[]): number {
    if (!vulnerabilities || vulnerabilities.length === 0) {
        return 100;
    }

    let deductions = 0;
    vulnerabilities.forEach(vuln => {
        const weight = SEVERITY_WEIGHTS[vuln.severity] ?? 0;
        deductions += weight;
    });

    const score = Math.max(0, 100 - deductions);
    return score;
}

// Note: generateFix would follow a similar pattern, moving logic to a /api/fix endpoint if implemented.
export async function generateFix(_vulnerability: Vulnerability, _originalCode: string): Promise<{ fixed_code: string; explanation: string; additional_notes: string }> {
    throw new Error("Fix generation required backend migration. Please use analysis for now.");
}
