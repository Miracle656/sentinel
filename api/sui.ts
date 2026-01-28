/**
 * Vercel Serverless Function - Sui GraphQL Proxy
 * 
 * Proxies requests to Sui Mainnet GraphQL to bypass CORS restrictions in the browser.
 * Endpoint: /api/sui
 */

export default async function handler(request: Request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { query, variables } = body;

        if (!query) {
            return new Response(JSON.stringify({ error: 'Query is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const endpoint = 'https://sui-mainnet.mystenlabs.com/graphql';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add any necessary headers here if Mysten requires auth in future
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            return new Response(JSON.stringify({ error: `Sui API Error: ${response.statusText}` }), {
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
        console.error('Sui Proxy Error:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Internal Server Error'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
