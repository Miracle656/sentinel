/**
 * Demo data - Example Sui Move contracts
 */
import type { DemoContract } from '../types';

export const demoContracts: Record<string, DemoContract> = {
    vulnerable_defi: {
        name: "Vulnerable DeFi Protocol",
        description: "A DeFi protocol with a capability leak vulnerability",
        code: `module defi::vault {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::transfer;
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    
    /// Admin capability - controls vault
    struct AdminCap has key, store {
        id: UID
    }
    
    /// Vault holding funds
    struct Vault has key {
        id: UID,
        balance: Coin<SUI>
    }
    
    /// VULNERABILITY: AdminCap has 'store' ability
    /// This allows it to be transferred freely
    public fun init(ctx: &mut TxContext) {
        let admin = AdminCap {
            id: object::new(ctx)
        };
        transfer::public_transfer(admin, tx_context::sender(ctx));
    }
    
    /// Withdraw function - requires admin cap
    public fun withdraw(
        _admin: &AdminCap,
        vault: &mut Vault,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let withdrawn = coin::split(&mut vault.balance, amount, ctx);
        transfer::public_transfer(withdrawn, tx_context::sender(ctx));
    }
}`,
        expectedIssues: ["Capability Leak", "Transfer Policy Violation"]
    },

    secure_nft: {
        name: "Secure NFT Contract",
        description: "A well-implemented NFT contract following best practices",
        code: `module nft::secure_nft {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use std::string::String;
    
    /// NFT object
    struct NFT has key, store {
        id: UID,
        name: String,
        creator: address
    }
    
    /// Mint capability - no 'store' ability
    struct MintCap has key {
        id: UID
    }
    
    /// One-time witness for initialization
    struct SECURE_NFT has drop {}
    
    /// Initialize with one-time witness
    fun init(witness: SECURE_NFT, ctx: &mut TxContext) {
        let mint_cap = MintCap {
            id: object::new(ctx)
        };
        transfer::transfer(mint_cap, tx_context::sender(ctx));
    }
    
    /// Mint NFT - requires capability
    public fun mint(
        _cap: &MintCap,
        name: String,
        ctx: &mut TxContext
    ): NFT {
        NFT {
            id: object::new(ctx),
            name,
            creator: tx_context::sender(ctx)
        }
    }
}`,
        expectedIssues: []
    },

    timestamp_vuln: {
        name: "Timestamp Manipulation",
        description: "Contract vulnerable to timestamp manipulation",
        code: `module game::lottery {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::clock::{Self, Clock};
    
    struct Lottery has key {
        id: UID,
        prize_pool: u64
    }
    
    /// VULNERABILITY: Using timestamp for randomness
    public fun claim_prize(
        lottery: &mut Lottery,
        clock: &Clock,
        ctx: &mut TxContext
    ): bool {
        // Predictable randomness based on timestamp
        let timestamp = clock::timestamp_ms(clock);
        let winner = timestamp % 100 < 10; // 10% win chance
        winner
    }
}`,
        expectedIssues: ["Timestamp Manipulation", "Weak Randomness"]
    }
};
