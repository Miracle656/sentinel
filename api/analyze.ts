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

### Scoring Rubric
Start with 100 points. Deduct for each vulnerability found:
- Critical: -60 points (Direct fund loss, capability leaks that allow unauthorized admin actions)
- High: -25 points (Predictable randomness, timestamp manipulation, logic errors that impact fairness)
- Medium: -10 points (Missing checks, potential DoS)
- Low: -5 points (Code quality, gas optimization)
Minimum score is 0.

### IMPORTANT: False Positive Prevention
1. **Centralization is NOT a Vulnerability**: If an Admin/Owner holds a Capability (e.g., AdminCap, MintCap), this is standard design. Do NOT mark it as a vulnerability unless that Capability is publicly exposed to *unauthorized* users.
2. **Missing Input Validation**: Only flag if it leads to funds stealing or state corruption.
3. **Store Ability - When It IS Dangerous**: A Capability having the store ability IS a critical vulnerability if it is transferred using public_transfer or made available in a Shared Object. If the Capability only uses transfer (private) and stays with the owner, it is safe.

### Output Instructions
Identify security issues related to: leaks, shared objects, logic errors, and access control.

Return JSON ONLY. Do not use Markdown code blocks.
CRITICAL RULES:
- Maximum 3 vulnerabilities total (prioritize by severity)
- No quotes in code_snippet field, use single quotes instead
- Keep ALL text fields extremely concise
{
  "summary": "Brief summary (Max 20 words)",
  "score": 0-100 (integer, calculated using rubric),
  "attack_diagram": "REQUIRED. Mermaid sequenceDiagram string illustrating the attack flow. Use \\n for newlines. Start with 'sequenceDiagram'. Participant names must be simple words (no '::' or special chars).",
  "vulnerabilities": [
    {
      "severity": "Critical" | "High" | "Medium" | "Low",
      "type": "Vulnerability Type",
      "location": "Function name",
      "title": "Short title (Max 5 words)",
      "description": "Concise explanation (Max 10 words).",
      "code_snippet": "Relevant code (Max 100 chars, use single quotes)",
      "fix": "Fixed code snippet (Max 150 chars, use single quotes)",
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
                    maxOutputTokens: 4096,
                    temperature: 0.1,
                    topP: 0.8,
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
