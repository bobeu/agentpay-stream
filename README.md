# AgentPay Stream

Decentralized micro-streaming payment application built on Movement L1 (Move language) with a modern React/Next.js frontend.

## Overview

AgentPay Stream enables real-time, micro-streaming payments on the blockchain. Built with Move smart contracts on Movement L1 and a user-friendly web interface powered by Next.js and Privy authentication.

## Features

- 🚀 **Micro-Streaming Payments**: Real-time payment streams with configurable rates
- 🔒 **Secure**: Built on Move language with resource safety guarantees
- 💼 **User-Friendly**: Privy-powered wallet authentication for seamless onboarding
- ⚡ **Fast**: Optimized for Movement L1 performance
- 🧪 **Tested**: Comprehensive unit tests for smart contracts

## Quick Start

See [SETUP_README.md](./SETUP_README.md) for detailed setup instructions.

### Prerequisites

- Node.js v18+
- Yarn package manager
- Aptos CLI (for Move development)
- Privy account (for authentication)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bobeu/agentpay-stream.git
   cd agentpay-stream
   ```

2. **Set up the contract:**
   ```bash
   cd contract
   aptos init --network testnet
   # Update Move.toml with your address
   aptos move compile
   ```

3. **Set up the frontend:**
   ```bash
   cd ../web
   yarn install
   cp .env.example .env.local
   # Update .env.local with your Privy App ID
   ```

4. **Deploy and run:**
   ```bash
   # Deploy contract (from contract directory)
   aptos move publish --named-addresses agentpay_stream=<YOUR_ADDRESS> --network testnet
   
   # Update .env.local with contract address
   # Start frontend
   cd web
   yarn dev
   ```

## Project Structure

```
agentpay-stream/
├── contract/              # Move smart contract
│   ├── sources/          # Move source files
│   ├── tests/            # Move unit tests
│   └── Move.toml         # Move package configuration
├── web/                   # Next.js frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utility libraries and clients
│   └── scripts/          # Build and deployment scripts
├── deploy-dev.ps1        # Windows deployment script
├── deploy-dev.sh         # Unix/Mac deployment script
└── SETUP_README.md       # Detailed setup guide
```

## Development

### Contract Development

```bash
cd contract
aptos move compile    # Compile contract
aptos move test       # Run tests
```

### Frontend Development

```bash
cd web
yarn dev              # Start development server
yarn build            # Build for production
yarn generate-client  # Generate TypeScript client from ABI
```

## Documentation

- [SETUP_README.md](./SETUP_README.md) - Complete setup and deployment guide
- [Aptos Documentation](https://aptos.dev)
- [Move Language Documentation](https://move-language.github.io/move/)
- [Privy Documentation](https://docs.privy.io)

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

Built with ❤️ on Movement L1

