/**
 * Sui GraphQL Service - Fetches contract code from on-chain
 */

const SUI_GRAPHQL_ENDPOINT = 'https://sui-mainnet.mystenlabs.com/graphql'; // Kept for reference

interface SuiMovePackage {
    address: string;
    modules: {
        nodes: {
            name: string;
            disassembly: string;
        }[];
    };
}

interface GraphQLResponse {
    data?: {
        object?: {
            asMovePackage?: SuiMovePackage;
        };
    };
    errors?: any[];
}

export async function fetchPackageCode(packageId: string): Promise<string> {
    // Ensure package ID starts with 0x
    const formattedId = packageId.startsWith('0x') ? packageId : `0x${packageId}`;

    const query = `
        query GetPackage($id: SuiAddress!) {
            object(address: $id) {
                asMovePackage {
                    address
                    modules {
                        nodes {
                            name
                            disassembly
                        }
                    }
                }
            }
        }
    `;

    try {
        const endpoint = '/api/sui';

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query,
                variables: { id: formattedId }
            }),
        });

        if (!response.ok) {
            throw new Error(`GraphQL request failed: ${response.statusText}`);
        }

        const json: GraphQLResponse = await response.json();

        if (json.errors) {
            throw new Error(`GraphQL Errors: ${json.errors.map(e => e.message).join(', ')}`);
        }

        const movePackage = json.data?.object?.asMovePackage;

        if (!movePackage) {
            throw new Error('Package not found or identifier is not a Move Package');
        }

        // Combine all modules into a single string for analysis
        let completeCode = `// Decompiled Move Package: ${movePackage.address}\n\n`;

        movePackage.modules.nodes.forEach((mod) => {
            completeCode += `// Module: ${mod.name}\n`;
            completeCode += mod.disassembly;
            completeCode += '\n\n';
        });

        return completeCode;

    } catch (error) {
        console.error('Failed to fetch package code:', error);
        throw error;
    }
}
