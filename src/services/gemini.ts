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
    attack_diagram?: string;
    score?: number;
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

        // Use AI score if provided, otherwise cleanup and fallback
        const score = parsedResults.score !== undefined
            ? parsedResults.score
            : calculateSecurityScore(parsedResults.vulnerabilities);

        return {
            score,
            vulnerabilities: parsedResults.vulnerabilities || [],
            summary: parsedResults.summary || '',
            recommendations: parsedResults.recommendations || [],
            attack_diagram: parsedResults.attack_diagram,
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
        console.error('Standard JSON parse failed, attempting regex extraction:', error);

        // Fallback: Try to extract fields via Regex if JSON is truncated or malformed
        try {
            const summaryMatch = responseText.match(/"summary"\s*:\s*"([^"]*)"/);
            const scoreMatch = responseText.match(/"score"\s*:\s*(\d+)/);
            // Simple extraction for attack_diagram - might fail if it contains escaped quotes, but better than nothing
            const diagramMatch = responseText.match(/"attack_diagram"\s*:\s*"((?:[^"\\]|\\.)*)"/);


            const vulns: Vulnerability[] = [];
            // Regex to match individual vulnerability objects within the array
            // Matches { ... "confidence": "..." } patterns
            const vulnRegex = /{\s*"severity":\s*"([^"]+)",\s*"type":\s*"([^"]+)",\s*"location":\s*"([^"]+)",\s*"title":\s*"([^"]+)",\s*"description":\s*"([^"]+)",\s*"code_snippet":\s*"([^"]*)",\s*"fix":\s*"((?:[^"\\]|\\.)*)",\s*"confidence":\s*"([^"]+)"\s*}/g;

            let match;
            while ((match = vulnRegex.exec(responseText)) !== null) {
                vulns.push({
                    severity: match[1] as any,
                    type: match[2] as any,
                    location: match[3],
                    title: match[4],
                    description: match[5],
                    code_snippet: match[6],
                    fix: match[7],
                    confidence: match[8] as any
                });
            }

            if (summaryMatch) {
                let cleanDiagram = diagramMatch ? diagramMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : undefined;
                if (cleanDiagram) {
                    // Fix Mermaid syntax errors caused by Move '::' syntax
                    cleanDiagram = cleanDiagram.replace(/::/g, '_');
                }

                return {
                    summary: summaryMatch[1],
                    score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
                    vulnerabilities: vulns, // Return extracted vulns instead of empty array
                    recommendations: ["Analysis data was truncated, but key components were recovered."],
                    attack_diagram: cleanDiagram
                };
            }
        } catch (e) {
            console.error('Regex extraction failed:', e);
        }

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
