# AgentPay Stream - Development Environment Setup

This guide will help you set up the complete development environment for AgentPay Stream, a decentralized micro-streaming payment application built on Movement L1 (Move language) with a React/Next.js frontend.

## Prerequisites

### System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v18 or higher (currently installed: v22.17.1)
- **Package Manager**: Yarn (recommended) or npm
- **Docker**: Optional, for local blockchain development

### Required Tools

1. **Aptos CLI** (for Move development)
   - Installation: https://aptos.dev/tools/aptos-cli/install-cli/
   - Verify: `aptos --version`

2. **Privy Account** (for wallet authentication)
   - Sign up at: https://privy.io
   - Create an app and get your App ID

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
└── deploy-dev.sh         # Unix/Mac deployment script
```

## Setup Instructions

### Phase 1: Move Contract Setup

1. **Navigate to contract directory:**
   ```bash
   cd contract
   ```

2. **Install Aptos CLI** (if not already installed):
   - **Windows**: Download from https://github.com/aptos-labs/aptos-core/releases
   - **macOS/Linux**: 
     ```bash
     curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
     ```

3. **Verify installation:**
   ```bash
   aptos --version
   ```

4. **Initialize your account** (for deployment):
   ```bash
   aptos init --network testnet
   ```
   This will create a `.aptos/config.yaml` file with your account information.

5. **Update Move.toml with your address:**
   - Open `contract/Move.toml`
   - Replace `agentpay_stream = "_"` with your address:
     ```toml
     [addresses]
     agentpay_stream = "0xYOUR_ADDRESS_HERE"
     ```

6. **Compile the contract:**
   ```bash
   aptos move compile
   ```

7. **Run tests:**
   ```bash
   aptos move test
   ```

### Phase 2: Frontend Setup

1. **Navigate to web directory:**
   ```bash
   cd web
   ```

2. **Install dependencies** (if not already done):
   ```bash
   yarn install
   ```

3. **Create environment file:**
   Create `web/.env.local` with the following content:
   ```env
   # Movement L1 / Aptos Network Configuration
   NEXT_PUBLIC_MOVEMENT_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
   
   # Privy Configuration
   NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
   
   # Contract Address (update after deployment)
   NEXT_PUBLIC_CONTRACT_ADDRESS=
   
   # Network Chain ID
   NEXT_PUBLIC_CHAIN_ID=2
   ```

4. **Configure Privy:**
   - Sign up at https://privy.io
   - Create a new application
   - Copy your App ID and paste it into `NEXT_PUBLIC_PRIVY_APP_ID` in `.env.local`

### Phase 3: Contract Deployment

1. **Deploy to Testnet:**
   ```bash
   cd contract
   aptos move publish --named-addresses agentpay_stream=<YOUR_ADDRESS> --network testnet
   ```

2. **Copy the deployed contract address** from the output

3. **Update frontend environment:**
   - Open `web/.env.local`
   - Set `NEXT_PUBLIC_CONTRACT_ADDRESS` to the deployed address

4. **Generate TypeScript client:**
   ```bash
   cd web
   yarn generate-client
   ```

### Phase 4: Running the Application

1. **Start the development server:**
   ```bash
   cd web
   yarn dev
   ```

2. **Open your browser:**
   Navigate to http://localhost:3000

3. **Test the connection:**
   - Click "Connect Wallet" to test Privy integration
   - Verify the frontend can connect to the configured network

## Deployment Scripts

### Using the Automated Script

**Windows (PowerShell):**
```powershell
.\deploy-dev.ps1
```

**Unix/Mac/Linux:**
```bash
chmod +x deploy-dev.sh
./deploy-dev.sh
```

The script will:
1. Compile the Move contract
2. Display deployment instructions
3. Generate TypeScript client (if contract address is set)

## Development Workflow

### Building the Contract

```bash
cd contract
aptos move compile
```

### Testing the Contract

```bash
cd contract
aptos move test
```

### Deploying to Testnet

```bash
cd contract
aptos move publish --named-addresses agentpay_stream=<YOUR_ADDRESS> --network testnet
```

### Starting the Frontend

```bash
cd web
yarn dev
```

### Building for Production

```bash
cd web
yarn build
yarn start
```

## Troubleshooting

### Contract Compilation Errors

- **Error: Address not found**: Make sure you've updated `Move.toml` with your address
- **Error: Dependency not found**: Run `aptos move compile` to fetch dependencies

### Frontend Connection Issues

- **Privy not loading**: Check that `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly
- **Contract not found**: Verify `NEXT_PUBLIC_CONTRACT_ADDRESS` matches the deployed address
- **Network errors**: Ensure `NEXT_PUBLIC_MOVEMENT_NODE_URL` points to a valid node

### Environment Variables

- Make sure `.env.local` exists in the `web/` directory
- Restart the Next.js dev server after changing environment variables
- Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser

## Project Files Overview

### Contract Files

- `contract/sources/agent_pay_stream.move`: Main Move module with stream functionality
- `contract/tests/agent_pay_stream_test.move`: Unit tests for the contract
- `contract/Move.toml`: Package configuration and dependencies

### Frontend Files

- `web/app/layout.tsx`: Root layout with Privy provider
- `web/app/page.tsx`: Main application page
- `web/components/PrivyProvider.tsx`: Privy authentication wrapper
- `web/lib/aptosClient.ts`: Aptos SDK client initialization
- `web/lib/AgentPayStreamClient.ts`: TypeScript client for contract interaction

## Next Steps

1. **Implement full wallet integration**: Connect Privy wallet to Aptos SDK
2. **Add stream creation UI**: Build forms for creating payment streams
3. **Add stream management**: Display active streams and allow withdrawals
4. **Add event listening**: Listen for stream events on the blockchain
5. **Add error handling**: Implement comprehensive error handling and user feedback

## Resources

- [Aptos Documentation](https://aptos.dev)
- [Move Language Documentation](https://move-language.github.io/move/)
- [Privy Documentation](https://docs.privy.io)
- [Next.js Documentation](https://nextjs.org/docs)
- [Movement L1](https://movementlabs.xyz)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the Aptos and Privy documentation
3. Check the contract and frontend logs for detailed error messages

---

**Last Updated**: December 2024

