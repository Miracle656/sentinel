/**
 * Vercel Serverless Function - Gemini Analysis Proxy
 * 
 * This runs securely on the server, protecting the API Key.
 * Endpoint: /api/analyze
 */

// We duplicate the Knowledge Base here to ensure the serverless function is self-contained
// and doesn't rely on complex frontend build aliasing.
const KNOWLEDGE_BASE = [
    {
        type: "Privilege Escalation / Capability Leak",
        description: "Exposing a privileged Capability (e.g., AdminCap, MintCap) in a public function or failing to check it properly.",
        bad_code: `
public fun withdraw(admin_cap: &AdminCap, vault: &mut Vault, amount: u64) {
    // ❌ Error: The function is public, but references an AdminCap. 
    // If the AdminCap is passed by reference, any module holding it *could* theoretically call this if they have access to the object.
    // However, the clearer issue is creating a capability and FREEZING it or making it Shared, which makes it public.
    
    // Example: A MintCap stored in a shared object that anyone can borrow mutable reference to.
}`,
        good_code: `
public fun withdraw(_: &AdminCap, vault: &mut Vault, amount: u64) {
    // Checks are implicit by requiring the AdminCap reference.
    // Ensure AdminCap is an Owned object, NOT Shared.
}`,
        explanation: "Capabilities in Move design the permission system. If a Capability object is made Shared or Frozen, it becomes accessible to everyone, effectively destroying the permission check."
    },
    {
        type: "Witness Pattern Misuse",
        description: "Using a struct that has 'drop' ability as a one-time witness, or failing to inspect the module publisher properly.",
        bad_code: `
struct MyWitness has drop {} // ❌ Vulnerable: Has 'drop', so anyone can construct it.

public fun init_token(witness: MyWitness, ctx: &mut TxContext) {
    // Logic that expects 'witness' to prove this is the original creator
}`,
        good_code: `
struct MY_WITNESS has drop {} // Still has drop, BUT...

// In init function, the specific One-Time Witness (OTW) pattern requires:
// 1. The struct name matches the module name (uppercase).
// 2. It is the first argument of init.
fun init(witness: MY_WITNESS, ctx: &mut TxContext) {
    // Compiler enforces OTW safety here.
}`,
        explanation: "A One-Time Witness (OTW) guarantees a function is called only once at module publication. If a regular struct (that can be created by anyone) is used instead, the security guarantee fails."
    },
    {
        type: "Coin Siphoning / Rounding Error",
        description: "Integer division rounding down to zero, or creating empty coin objects that clog storage, or losing dust.",
        bad_code: `
public fun split_and_transfer(coin: &mut Coin<SUI>, amount: u64, recipient: address, ctx: &mut TxContext) {
    let fee = amount * 1 / 100; // 1% fee
    // If amount < 100, fee is 0.
}`,
        good_code: `
public fun split_and_transfer(coin: &mut Coin<SUI>, amount: u64, recipient: address, ctx: &mut TxContext) {
    let fee = math::mul_div_up(amount, 1, 100); // 1% fee, rounding up to ensure protocol gets paid
}`,
        explanation: "In DeFi, integer math truncates decimals. Always consider the direction of rounding. For fees, round UP (favor the protocol). For user payouts, round DOWN (favor the vault safety)."
    },
    {
        type: "Shared Object Race Condition",
        description: "Assuming a shared object state remains constant between transaction steps or relying on wall-clock time in a way that can be manipulated.",
        bad_code: `
// Relying on specific object version or precise timestamp for randomness
let time = tx_context::epoch_timestamp_ms(ctx);
if (time % 2 == 0) { // ❌ Predictable / Manipulatable by validator
    winner = sender;
}`,
        good_code: `
// Use a verifiable randomness function (VRF) like sui::random (on newer versions) or commit-reveal schemes.
`,
        explanation: "Validators control timestamps to a degree. Logic strictly dependent on granular timestamps for critical outcome determination (like gambling) is vulnerable to validator manipulation."
    }
];

function buildAnalysisPrompt(code: string): string {
    const knowledgeBaseContext = KNOWLEDGE_BASE.map(item =>
        `- Pattern: ${item.type}\n  Context: ${item.description}\n  Bad Code: ${item.bad_code.trim()}\n  Fix: ${item.good_code.trim()}\n  Why: ${item.explanation}`
    ).join('\n\n');

    return `You are an expert security auditor specializing in Sui Move smart contracts.

Analyze this Move contract for security vulnerabilities:

\`\`\`move
${code}
\`\`\`

### 🧠 Reference Knowledge Base (Known Vulnerability Patterns)
Use these patterns derived from real audit reports to guide your analysis. If you see code matching these patterns, flag it immediately.

${knowledgeBaseContext}

### Analysis Instructions
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
- **description**: Detailed explanation (2-3 paragraphs). Cite specific patterns from the Knowledge Base if applicable.
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

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { code } = await request.json();

        if (!code) {
            return new Response(JSON.stringify({ error: 'Contract code is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const prompt = buildAnalysisPrompt(code);
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('Server Configuration Error: GEMINI_API_KEY is missing');
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    maxOutputTokens: 8192,
                    temperature: 1.0,
                    topP: 0.95,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            return new Response(JSON.stringify({ error: `Gemini API failed: ${response.statusText}` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Handler Error:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
