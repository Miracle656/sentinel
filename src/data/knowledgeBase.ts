/**
 * Sentinel Knowledge Base - Common Move Vulnerabilities
 * Derived from MoveBit, OtterSec, and Zellic audit reports.
 * Used for In-Context Learning (Few-Shot Prompting).
 */

export interface VulnerabilityPattern {
    type: string;
    description: string;
    bad_code: string;
    good_code: string;
    explanation: string;
}

export const KNOWLEDGE_BASE: VulnerabilityPattern[] = [
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
