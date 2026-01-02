/**
 * Gemini API Service - Core analysis functions
 */
import { API_CONFIG, SEVERITY_WEIGHTS } from '../utils/constants';
import type { AnalysisResults, SeverityLevel, Vulnerability } from '../types';

interface AnalysisResponse {
    summary: string;
    vulnerabilities: Vulnerability[];
    recommendations: string[];
}

interface FixResponse {
    fixed_code: string;
    explanation: string;
    additional_notes: string;
}

/**
 * Analyze a Sui Move contract for security vulnerabilities
 */
export async function analyzeContract(contractCode: string): Promise<AnalysisResults> {
    try {
        const prompt = buildAnalysisPrompt(contractCode);

        const response = await fetch(API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'anthropic-version': API_CONFIG.apiVersion,
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                max_tokens: API_CONFIG.maxTokens,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        const analysisText = data.content[0].text;
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
        console.error('Analysiserror:', error);
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
- **title**: Short descriptive title (max 60 chars)
- **description**: Detailed explanation (2-3 paragraphs)
- **code_snippet**: The exact problematic code section
- **attack_scenario**: Step-by-step how an attacker would exploit this
- **mermaid_diagram**: Mermaid.js graph syntax showing attack flow
- **fix**: Corrected version of the code with explanation
- **confidence**: "High" | "Medium" | "Low"

Also provide:
- **summary**: 2-3 sentence overview of the contract's security posture
- **recommendations**: 3-5 general security improvements

Return your response in this JSON structure:
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
      "mermaid_diagram": "graph TD\\n    A[...]",
      "fix": "...",
      "confidence": "High"
    }
  ],
  "recommendations": ["...", "...", "..."]
}

IMPORTANT: Return ONLY valid JSON, no markdown formatting or explanations outside the JSON.`;
}

function parseAnalysisResults(responseText: string): AnalysisResponse {
    try {
        let jsonText = responseText.trim();
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

export async function generateFix(vulnerability: Vulnerability, originalCode: string): Promise<FixResponse> {
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
                'anthropic-version': API_CONFIG.apiVersion,
            },
            body: JSON.stringify({
                model: API_CONFIG.model,
                max_tokens: 2048,
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        const fixText = data.content[0].text;

        return JSON.parse(fixText.trim()) as FixResponse;
    } catch (error) {
        console.error('Fix generation error:', error);
        throw new Error('Failed to generate fix');
    }
}
