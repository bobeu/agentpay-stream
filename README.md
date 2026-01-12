# AgentPay Stream

A decentralized protocol for continuous, real-time value transfer on Movement L1. AgentPay Stream enables users to create verifiable payment flows for AI agents, services, and automated infrastructure using the Move language.

## Overview

Traditional blockchain transactions are discrete events. **AgentPay Stream** transforms payments into a continuous linear flow. By utilizing Move's resource-oriented security, the protocol locks funds in a specialized escrow and releases them second-by-second based on a defined flow rate. This architecture is purpose-built for the autonomous agent economy where compute and services are consumed continuously.



## Key Features

* **Linear Value Settlement**: Funds flow at a granular tokens-per-second rate, ensuring payment perfectly matches service consumption.
* **Move-Powered Security**: Built on Movement L1, leveraging Move's strict resource safety to prevent double-spending or unauthorized access to escrowed funds.
* **Web2.5 Onboarding**: Integrated with Privy for social authentication, making the protocol accessible to users without a pre-existing Web3 wallet.
* **Real-Time Synchronization**: A high-fidelity frontend counter provides 0-latency visualization of accrued balances, synchronized with the on-chain math engine.
* **Instant Finality**: Senders can terminate flows at any moment to reclaim unspent liquidity, while recipients can withdraw accrued funds whenever needed.

## Technical Stack

* **Smart Contracts**: Move Language (Movement L1 / Aptos Testnet)
* **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
* **Authentication**: Privy (Multi-wallet & Social support)
* **Blockchain Interaction**: Aptos TypeScript SDK v5

## Quick Start

### Prerequisites

* Node.js v18+ & Yarn
* Aptos CLI (for contract compilation and deployment)
* A Privy App ID (available at [dashboard.privy.io](https://dashboard.privy.io))

### 1. Installation

```bash
git clone [https://github.com/bobeu/agentpay-stream.git](https://github.com/bobeu/agentpay-stream.git)
cd agentpay-stream
```

## Smart Contract Setup

```bash
cd contract
```

### Initialize your local environment
```bash
aptos init --network testnet
```

### Compile the Move module
```bash
aptos move compile
```

## Frontend Setup
```bash
cd ../web
```

```bash
yarn install
```

```bash
cp .env.example .env.local
# Add your Privy App ID and Contract Address to .env.local
```

# Deployment

```bash
# Deploy to Movement Testnet
aptos move publish --named-addresses agentpay_addr=<YOUR_WALLET_ADDRESS> --network testnet

# Start the development server
yarn dev

```

# Repository Structure

agentpay-stream/

├── contract/             # Move Smart Contract Logic
│   ├── sources/          # Core protocol logic (agent_pay_stream.move)
│   ├── tests/            # Move unit tests
│   └── Move.toml         # Package manifest
├── web/                  # Next.js Frontend Application
│   ├── app/              # App Router pages and layouts
│   ├── components/       # UI components (Onboarding, Dashboard, StreamCards)
│   ├── hooks/            # Custom React hooks (useStreamData, useStreamActions)
│   ├── context/          # Provider context (AptoContext)
│   └── lib/              # SDK clients and helper utilities
├── deploy-dev.sh         # Unix deployment utility script
└── SUBMISSION.md         # Detailed hackathon project documentation


# Protocol Architecture

The protocol uses a Linear Math Engine to determine withdrawable amounts:$$withdrawable = \frac{total\_amount \times elapsed\_time}{total\_duration} - already\_withdrawn$$This ensures that even if the network experiences high latency, the value transfer remains mathematically precise to the second.

# Development Commands

Action	`Command`

Compile Contract	: `cd contract && aptos move compile`
Run Move Tests	: `cd contract && aptos move test`
Start Frontend	: `cd web && yarn dev`
Build Production:	`cd web && yarn build`


# License
This project is licensed under the MIT License - see the LICENSE file for details.

Built with ❤️ for the Movement L1 Hackathon.