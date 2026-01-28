const https = require('https');
const fs = require('fs');
const path = require('path');

// Load env
try {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.*)/);
    if (match) {
        process.env.GEMINI_API_KEY = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local");
}

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found in .env.local");
    process.exit(1);
}

const KNOWLEDGE_BASE_LITE = [
    { type: "Capability Leak", description: "Exposing a privileged Capability in a public function", explanation: "Destroys permission system" },
    { type: "Witness Pattern Misuse", description: "Using a struct with 'drop' as a witness", explanation: "Fails uniqueness guarantee" },
    // ... just a few for testing the "Lite" structure
];

const knowledgeBaseContext = KNOWLEDGE_BASE_LITE.map(item =>
    `- ${item.type}: ${item.description} (Why: ${item.explanation})`
).join('\n');

const prompt = `You are a Sui Move security auditor. Analyze this contract for vulnerabilities.

\`\`\`move
module example::test {
    struct AdminCap has key { id: UID }
    public fun dangerous(cap: AdminCap) { /* ... */ }
}
\`\`\`

### Knowledge Base (Patterns to check)
${knowledgeBaseContext}

### Output Instructions
Identify security issues related to: defaults, capabilities, shared objects, transfer rules, upgrades, and arithmetic.

Return JSON ONLY:
{
  "summary": "Brief summary",
  "vulnerabilities": [],
  "recommendations": []
}`;

const data = JSON.stringify({
    contents: [{
        parts: [{ text: prompt }]
    }],
    generationConfig: {
        maxOutputTokens: 8192,
        temperature: 1.0,
        topP: 0.95,
    }
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models/gemini-2.0-flash-exp:generateContent?key=' + API_KEY, // Trying 2.0 Flash for speed
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("Starting API Speed Test...");
console.log("Model: gemini-2.0-flash-exp (Testing for speed)");
const start = Date.now();

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        const duration = (Date.now() - start) / 1000;
        console.log(`\nStatus Code: ${res.statusCode}`);
        console.log(`Duration: ${duration} seconds`);

        if (duration > 9) {
            console.error("❌ CRITICAL: Too slow for Vercel (Limit 10s)");
        } else {
            console.log("✅ GOOD: Within Vercel limits");
        }

        console.log("\nResponse Preview:");
        console.log(body.substring(0, 200) + "...");
    });
});

req.on('error', (error) => {
    console.error(error);
});

req.write(data);
req.end();
