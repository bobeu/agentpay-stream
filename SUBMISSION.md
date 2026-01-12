# AgentPay Stream: The Liquidity Layer for Autonomous Agents

## Executive Summary
**AgentPay Stream** is a high-performance, decentralized micro-streaming payment protocol built on **Movement L1 (Aptos)**. It facilitates real-time, continuous value transfer specifically engineered for the AI agent economy. By shifting from discrete batch transactions to continuous flow-based settlement, AgentPay Stream enables a "Pay-as-you-Go" architecture for AI services, automated infrastructure, and content subscriptions. 

The platform leverages the **Move Language's** resource-oriented security to provide a trustless escrow system wrapped in a high-fidelity "Agentic Flow" interface.

---

## The Problem: The Batch Settlement Bottleneck
Traditional Web3 and Web2 payment systems rely on "Request-and-Respond" batch models. This creates four primary friction points for the AI economy:
1. **Service Interruption**: AI agents requiring continuous compute power are at risk of shutdown if a batch payment is delayed.
2. **Capital Inefficiency**: Users must often over-fund accounts or lock large amounts in escrow to ensure service continuity.
3. **Escrow Friction**: High trust requirements between unknown parties or the complexity of managing thousands of micro-transactions.
4. **Opaque Utilization**: Difficulty in tracking real-time expenditure against service consumption.

## The Solution: Continuous Flow Protocol
AgentPay Stream introduces a **Linear Settlement Engine** where funds flow at a configurable rate (tokens-per-second). 
- **Deterministic Escrow**: Funds are locked in a Move-based resource and streamed per-second.
- **Dynamic Access**: Recipients (AI Agents/Services) can withdraw accrued funds at any time without ending the stream.
- **Instant Finality**: Senders can terminate flows instantly, reclaiming unspent liquidity.
- **Agentic Design**: A specialized UI/UX providing a second-by-second visualization of capital movement.

---

## Revenue Model
AgentPay Stream is designed as a sustainable protocol with a triple-stream revenue architecture:

1. **Protocol Service Fee (Primary)**: 
   - A **0.5% - 1% fee** is applied to the total amount of successfully completed streams. 
   - These fees are automatically deducted at the moment of withdrawal and routed to the Protocol Treasury.

2. **Integration & API Licensing (B2B)**: 
   - Premium API access for AI Service Providers (e.g., LLM hosting platforms) to integrate "Stream-to-Access" gates directly into their infrastructure.

3. **Treasury Yield (Future)**: 
   - Utilizing locked escrow funds (with user consent) in low-risk Movement L1 liquid staking protocols to generate yield for the platform's development fund.

---

## Technical Implementation
### Core Smart Contract (Move)
- **Linear Math Engine**: Calculates accrued funds using `(total_amount * elapsed_time) / total_duration` to ensure 0-precision loss.
- **Resource Ownership**: Utilizes Move's `key` and `store` abilities to ensure that `Stream` resources are non-clonable and non-discardable.
- **Global Escrow**: A centralized, type-safe escrow container for managing multiple `Coin<T>` types within a single contract instance.

### Frontend Architecture
- **Framework**: Next.js 16 (App Router) + TypeScript.
- **Real-time Engine**: A custom React hook synchronization layer that mirrors the blockchain’s linear math for a 0-latency UI counter.
- **Onboarding**: Integrated **Privy** for Web2.5 social login, lowering the barrier to entry for non-crypto native AI developers.

---

## Deployment Data
- **Contract Address**: `0x1a04c8ca4ec3c4acc3214e544d7fcfa8b1ca471c649fa562f44bea22572fdfb9`
- **Explorer**: `https://explorer.movementnetwork.xyz/account/0x1a04c8ca4ec3c4acc3214e544d7fcfa8b1ca471c649fa562f44bea22572fdfb9?network=bardock+testnet`
- **Network**: Movement L1 Testnet
- **Key Features**: Stream Creation, Real-time Counter, Partial Withdrawals, and Instant Cancellation.

---

## Conclusion
AgentPay Stream isn't just a payment tool; it’s a fundamental primitive for the next generation of autonomous agents. By aligning capital flow with agentic activity, we provide the financial infrastructure required for a truly automated world.

*Built on Movement. Powering Agents.*