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

// Lite version of Knowledge Base to prevent 504 Timeouts
function buildAnalysisPrompt(code: string): string {
    // We strictly limit the context to key concepts to save tokens and processing time
    const knowledgeBaseContext = KNOWLEDGE_BASE.map(item =>
        `- ${item.type}: ${item.description} (Why: ${item.explanation})`
    ).join('\n');

    return `You are a Sui Move security auditor. Analyze this contract for vulnerabilities.

\`\`\`move
${code}
\`\`\`

### Knowledge Base (Patterns to check)
${knowledgeBaseContext}

### Output Instructions
Identify security issues related to: defaults, capabilities, shared objects, transfer rules, upgrades, and arithmetic.

Return JSON ONLY:
{
Return JSON ONLY:
{
  "summary": "Brief summary",
  "score": 0-100 (integer, lower is worse security),
  "attack_diagram": "REQUIRED. Mermaid sequenceDiagram string illustrating the attack flow. Use \\n for newlines. Start with 'sequenceDiagram'. Participant names must be simple words (no '::' or special chars).",
  "vulnerabilities": [
    {
      "severity": "Critical" | "High" | "Medium" | "Low",
      "type": "Vulnerability Type",
      "location": "Function name",
      "title": "Short title",
      "description": "Concise explanation.",
      "code_snippet": "Relevant code",
      "fix": "Fixed code snippet",
      "confidence": "High"
    }
  ],
  "recommendations": ["Action item 1", "Action item 2"]
}`;
}

// @ts-ignore
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Contract code is required' });
        }

        const prompt = buildAnalysisPrompt(code);

        // Manual loading for local dev fallback
        if (!process.env.GEMINI_API_KEY) {
            try {
                // @ts-ignore
                const dotenv = await import('dotenv');
                dotenv.config({ path: '.env.local' });
            } catch (e) { console.log('dotenv not found'); }
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error('Server Configuration Error: GEMINI_API_KEY is missing');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

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
            return res.status(response.status).json({ error: `Gemini API failed: ${response.statusText}` });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Handler Error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        });
    }
}
