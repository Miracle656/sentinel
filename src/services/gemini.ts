/**
 * Gemini API Service - Google Gemini 3 Flash Integration
 */
import { API_CONFIG, SEVERITY_WEIGHTS } from '../utils/constants';
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
 * Analyze a Sui Move contract for security vulnerabilities using Gemini 3 Flash
 */
export async function analyzeContract(contractCode: string): Promise<AnalysisResults> {
    try {
        const prompt = buildAnalysisPrompt(contractCode);

        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_CONFIG.apiKey,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: API_CONFIG.maxTokens,
                    temperature: 1.0,
                    topP: 0.95,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed: ${response.statusText}. ${errorText}`);
        }

        const data: GeminiResponse = await response.json();

        if (!data.candidates || data.candidates.length === 0) {
            throw new Error('No response from Gemini API');
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

function buildAnalysisPrompt(code: string): string {
    return `You are an expert security auditor specializing in Sui Move smart contracts.

Analyze this Move contract for security vulnerabilities:

\`\`\`move
${code}
\`\`\`

Focus on these Move-specific vulnerability types:
1. **Capability Leaks**: Improper handling of capability objects that could grant unauthorized access
2. **Shared Object Issues**: Race conditions or improper synchronization with shared objects
3. **Object Wrapping Bugs**: Incorrect wrapping/unwrapping patterns that could expose internals
4. **Transfer Policy Violations**: Missing or improper transfer restrictions
5. **Witness Pattern Misuse**: Incorrect one-time witness implementation
6. **Access Control Flaws**: Missing ownership checks or improper permission validation
7. **Timestamp Manipulation**: Unsafe reliance on clock objects
8. **Integer Overflow/Underflow**: Arithmetic operations without proper bounds checking

For EACH vulnerability found, provide:
- **severity**: "Critical" | "High" | "Medium" | "Low"
- **type**: The vulnerability category from above
- **location**: "module_name::function_name" or "line X-Y"
 **title**: Short descriptive title (max 60 chars)
- **description**: Detailed explanation (2-3 paragraphs)
- **code_snippet**: The exact problematic code section
- **attack_scenario**: Step-by-step how an attacker would exploit this
- **mermaid_diagram**: Mermaid.js graph syntax showing attack flow (use "graph TD" format)
- **fix**: Corrected version of the code with explanation
- **confidence**: "High" | "Medium" | "Low"

Also provide:
- **summary**: 2-3 sentence overview of the contract's security posture
- **recommendations**: 3-5 general security improvements

Return your response in this EXACT JSON structure (no markdown formatting):
{
  "summary": "...",
  "vulnerabilities": [
    {
      "severity": "Critical",
      "type": "Capability Leak",
      "location": "defi::withdraw",
      "title": "...",
      "description": "...",
      "code_snippet": "...",
      "attack_scenario": "...",
      "mermaid_diagram": "graph TD\\n    A[Attacker] --> B[...]",
      "fix": "...",
      "confidence": "High"
    }
  ],
  "recommendations": ["...", "...", "..."]
}

CRITICAL: Return ONLY valid JSON, no markdown code blocks, no explanations outside the JSON.`;
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
        throw new Error('Failed to parse analysis results from Gemini');
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

/**
 * Generate a fix for a specific vulnerability (optional feature)
 */
export async function generateFix(vulnerability: Vulnerability, _originalCode: string): Promise<{ fixed_code: string; explanation: string; additional_notes: string }> {
    const prompt = `You are a Sui Move security expert.

This code has a ${vulnerability.type} vulnerability:

\`\`\`move
${vulnerability.code_snippet}
\`\`\`

Vulnerability details: ${vulnerability.description}

Provide:
1. A secure, fixed version of this code
2. Detailed explanation of what changed and why
3. Any additional security considerations

Format as JSON:
{
  "fixed_code": "...",
  "explanation": "...",
  "additional_notes": "..."
}`;

    try {
        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_CONFIG.apiKey,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 2048,
                    temperature: 1.0,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data: GeminiResponse = await response.json();
        const fixText = data.candidates[0].content.parts[0].text;

        return JSON.parse(fixText.trim());
    } catch (error) {
        console.error('Fix generation error:', error);
        throw new Error('Failed to generate fix');
    }
}
