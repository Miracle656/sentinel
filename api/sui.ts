/**
 * Vercel Serverless Function - Sui GraphQL Proxy
 * 
 * Proxies requests to Sui Mainnet GraphQL to bypass CORS restrictions in the browser.
 * Endpoint: /api/sui
 */

// @ts-ignore
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query, variables } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const endpoint = 'https://sui-mainnet.mystenlabs.com/graphql';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Sui API Error: ${response.statusText}` });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error('Sui Proxy Error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        });
    }
}
