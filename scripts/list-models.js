import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env locally
try {
    const envPath = path.join(__dirname, '../.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GEMINI_API_KEY="(.*)"/);
    if (match) {
        process.env.GEMINI_API_KEY = match[1];
    } else {
        // Try without quotes
        const match2 = envContent.match(/GEMINI_API_KEY=(.*)/);
        if (match2) process.env.GEMINI_API_KEY = match2[1].trim();
    }
} catch (e) {
    console.log("Could not read .env.local");
}

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found");
    process.exit(1);
}

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: '/v1beta/models?key=' + API_KEY,
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
};

console.log("Fetching available models...");

const req = https.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
        try {
            const data = JSON.parse(body);
            if (data.models) {
                data.models.forEach(m => {
                    if (m.name.includes('gemini')) {
                        console.log(m.name.replace('models/', ''));
                    }
                });
            } else {
                console.error("Error:", data);
            }
        } catch (e) {
            console.error("Parse Error:", body);
        }
    });
});

req.on('error', (e) => console.error(e));
req.end();
