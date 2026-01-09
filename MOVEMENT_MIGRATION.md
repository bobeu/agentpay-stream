# Movement Network Migration Guide

This document outlines the changes made to migrate the AgentPay Stream project from Aptos endpoints to Movement Network endpoints.

## Overview

The project has been updated to use **Movement Testnet** instead of Aptos Testnet. Movement Network is a Move-based blockchain that is compatible with Aptos tooling but uses its own network infrastructure.

## Network Configuration

### Movement Testnet (Bardock)
- **Chain ID**: 250
- **RPC Endpoint**: `https://full.testnet.movementinfra.xyz/v1`
- **Faucet**: `https://faucet.testnet.movementinfra.xyz`
- **Explorer**: `https://explorer.movementnetwork.xyz`

### Movement Mainnet
- **Chain ID**: 126
- **RPC Endpoint**: `https://mainnet.movementnetwork.xyz/v1`
- **Explorer**: `https://explorer.movementnetwork.xyz`

## Changes Made

### 1. Client Configuration (`web/lib/aptosClient.ts`)
- Updated to use Movement testnet endpoint by default
- Added Movement network configuration constants
- Exported `getCurrentMovementNetwork()` helper for wallet connections
- Uses `Network.CUSTOM` with Movement RPC endpoints

### 2. Wallet Provider (`web/components/AptosWalletProvider.tsx`)
- Updated to use Movement network configuration
- Configured with `Network.CUSTOM` for Movement endpoints
- Automatically detects wallets including Nightly Wallet (recommended for Movement)

### 3. Privy Provider (`web/components/PrivyProvider.tsx`)
- Updated chain ID to 250 for Movement Testnet (was 2 for Aptos Testnet)
- Updated chain ID to 126 for Movement Mainnet (was 1 for Aptos Mainnet)
- Updated RPC URLs to Movement endpoints
- Updated explorer URLs to Movement explorer

### 4. Wallet Connection (`web/hooks/useUnifiedWallet.ts`)
- Enhanced to connect wallets directly to Movement Network
- Uses `aptos:connect` feature with Movement network info (chain ID 250 for testnet)
- Prioritizes Nightly Wallet (best Movement support)
- Falls back gracefully if Movement connection fails

### 5. Deployment Scripts
- **`contract/deploy.ps1`**: Updated to use Movement testnet endpoint
- **`contract/deploy-new.ps1`**: Updated faucet URL to Movement faucet
- **`contract/MANUAL_DEPLOY.md`**: Updated instructions for Movement network

### 6. Explorer Links
- Updated transaction explorer links in:
  - `web/components/CreateStreamForm.tsx`
  - `web/components/StreamCard.tsx`
- Changed from `explorer.aptoslabs.com` to `explorer.movementnetwork.xyz`

### 7. Environment Variables
- Created `web/.env.example` with Movement network configuration
- Default endpoint: `https://full.testnet.movementinfra.xyz/v1`

## Environment Setup

Create `web/.env.local` with the following:

```env
# Movement Testnet Configuration
NEXT_PUBLIC_MOVEMENT_NODE_URL=https://full.testnet.movementinfra.xyz/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
```

## Deployment to Movement Testnet

### Using the Deployment Script

```powershell
cd contract
.\deploy.ps1
```

The script will:
1. Initialize account with Movement testnet configuration
2. Update Move.toml with account address
3. Compile the contract
4. Deploy to Movement Testnet

### Manual Deployment

```powershell
cd contract

# Initialize account for Movement testnet
aptos init --network custom --seed-phrase "YOUR_SEED_PHRASE" --profile testnet --rest-url "https://full.testnet.movementinfra.xyz/v1" --faucet-url "https://faucet.testnet.movementinfra.xyz"

# Get account address
aptos config show-profiles --profile testnet

# Update Move.toml with your address
# Edit Move.toml: agentpay_stream = "0xYOUR_ADDRESS"

# Compile
aptos move compile --named-addresses agentpay_stream=0xYOUR_ADDRESS

# Deploy
aptos move publish --named-addresses agentpay_stream=0xYOUR_ADDRESS --network custom --profile testnet --url "https://full.testnet.movementinfra.xyz/v1"
```

## Wallet Connection

### Recommended: Nightly Wallet

Nightly Wallet has the best support for Movement Network, including:
- Direct Movement network connection
- Network switching support
- Full compatibility with Movement features

### Connection Process

1. When users click "Connect Wallet", the app:
   - First tries to connect Nightly Wallet to Movement Network (Chain ID 250)
   - Falls back to other Aptos-compatible wallets
   - Uses Privy as final fallback

2. The connection uses the `aptos:connect` feature with Movement network info:
   ```typescript
   {
     chainId: 250, // Movement Testnet
     name: "custom",
     url: "https://full.testnet.movementinfra.xyz/v1"
   }
   ```

## Testing

1. **Install Nightly Wallet**: https://nightly.app
2. **Fund your wallet**: Use Movement testnet faucet
3. **Connect wallet**: Click "Connect Wallet" in the app
4. **Verify network**: Check that you're connected to Movement Testnet (Chain ID 250)
5. **Test transactions**: Create a stream and verify on Movement explorer

## Important Notes

- **Chain ID**: Movement Testnet uses Chain ID 250 (not 2 like Aptos Testnet)
- **Network Type**: Movement uses `Network.CUSTOM` in Aptos SDK
- **Wallet Support**: Not all Aptos wallets support Movement Network properly
  - ✅ Nightly Wallet (Full support)
  - ⚠️ Other wallets may work but without network switching
- **Explorer**: Use Movement explorer at `explorer.movementnetwork.xyz`
- **Faucet**: Use Movement faucet at `faucet.testnet.movementinfra.xyz`

## References

- [Movement Network Documentation](https://docs.movementnetwork.xyz)
- [Movement Wallet Adapter Guide](https://docs.movementnetwork.xyz/devs/interactonchain/wallet-adapter/useWallet/ConnectWallet)
- [Nightly Wallet](https://nightly.app)

## Migration Checklist

- [x] Update client configuration to Movement endpoints
- [x] Update wallet provider with Movement network config
- [x] Update Privy provider with Movement chain IDs
- [x] Enhance wallet connection for Movement network
- [x] Update deployment scripts
- [x] Update explorer links
- [x] Create environment variable examples
- [x] Update documentation

---

**Status**: ✅ Migration Complete

The project is now fully configured to use Movement Testnet. Deploy the contract and update your environment variables to start using Movement Network.

<!-- 0x677c6cd62b39f58e30f99943202b9203bd19ad9a79a930d0d45f4eb9b0457f55 -->
