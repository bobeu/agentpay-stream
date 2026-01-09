# Privy Wallet Integration with Movement Network

This document explains how Privy is configured as the primary wallet connection method for Movement Network in the AgentPay Stream project.

## Overview

Privy is the **primary wallet connection method** for this project. It handles wallet connections and automatically routes them to Movement Network based on the configured chain settings.

## Privy Configuration

### Movement Network Setup

The `PrivyProvider` component is configured with Movement Network settings:

```typescript
supportedChains: [
  {
    id: 250, // Movement Testnet Chain ID (126 for Mainnet)
    name: 'Movement Testnet',
    network: 'testnet',
    nativeCurrency: {
      name: 'MOVE',
      symbol: 'MOVE',
      decimals: 8,
    },
    rpcUrls: {
      default: {
        http: ['https://full.testnet.movementinfra.xyz/v1'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Movement Explorer',
        url: 'https://explorer.movementnetwork.xyz',
      },
    },
  },
]
```

### How Privy Connects to Movement Network

1. **Chain Configuration**: Privy uses the `supportedChains` configuration to know which network to connect wallets to.

2. **Automatic Routing**: When a user connects a wallet through Privy, it automatically routes the connection to Movement Network based on the chain ID (250 for testnet, 126 for mainnet).

3. **Wallet Support**: Privy supports Aptos-compatible wallets including:
   - Nightly Wallet (recommended for Movement)
   - Petra Wallet
   - Other Aptos-compatible wallets

4. **Network Detection**: Privy detects the configured network and ensures wallets connect to Movement Network, not Aptos.

## Connection Flow

### Primary Method: Privy

When users click "Connect Wallet":

1. **Privy Login Modal**: Privy shows a wallet selection modal
2. **Wallet Selection**: User selects their preferred wallet (Nightly, Petra, etc.)
3. **Automatic Routing**: Privy automatically connects the wallet to Movement Network
4. **Connection Complete**: Wallet is connected and ready to use on Movement Network

### Fallback Method: Direct Wallet Connection

If Privy is not available or fails:
- The app falls back to direct Aptos wallet adapter connections
- Still attempts to connect to Movement Network using `aptos:connect` feature

## Implementation Details

### useUnifiedWallet Hook

The `useUnifiedWallet` hook prioritizes Privy connections:

```typescript
// Priority 1: Privy authentication (Primary method)
if (privy.authenticated && privy.user?.wallet?.address) {
  // Use Privy connection
}

// Priority 2: Direct Aptos wallet adapter (Fallback)
if (aptosWallet.connected && aptosWallet.account) {
  // Use direct wallet connection
}
```

### Connection Process

1. **User clicks "Connect Wallet"**
2. **Privy login is called** (`privy.login()`)
3. **Privy shows wallet selection modal**
4. **User selects wallet** (e.g., Nightly Wallet)
5. **Privy connects wallet to Movement Network** (based on `supportedChains` config)
6. **Connection complete** - wallet is ready for Movement Network transactions

## Benefits of Using Privy

1. **Unified Interface**: Single wallet connection interface for all supported wallets
2. **Automatic Network Routing**: Privy handles Movement Network routing automatically
3. **Multiple Wallet Support**: Supports Nightly, Petra, and other Aptos-compatible wallets
4. **User-Friendly**: Simple, consistent wallet connection experience
5. **Embedded Wallets**: Can create embedded wallets for users without existing wallets

## Environment Setup

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
NEXT_PUBLIC_MOVEMENT_NODE_URL=https://full.testnet.movementinfra.xyz/v1
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
```

## Privy Dashboard Configuration

In the Privy Dashboard, you should:

1. **Configure Networks**: Ensure Movement Network (Chain ID 250 for testnet) is configured
2. **Enable Wallet Options**: Enable the wallets you want to support (Nightly, Petra, etc.)
3. **Set Network Priority**: Movement Network should be the primary network

## Testing Privy Connection

1. **Start the app**: `cd web && yarn dev`
2. **Click "Connect Wallet"**: Should show Privy wallet selection modal
3. **Select a wallet**: Choose Nightly Wallet or another supported wallet
4. **Verify connection**: Check that wallet is connected to Movement Network (Chain ID 250)
5. **Test transaction**: Create a stream to verify Movement Network connection

## Troubleshooting

### Privy Not Showing Wallets

- Check that `NEXT_PUBLIC_PRIVY_APP_ID` is set correctly
- Verify Privy Dashboard configuration
- Check browser console for errors

### Wallet Not Connecting to Movement Network

- Verify `supportedChains` configuration in `PrivyProvider`
- Check that chain ID matches Movement Network (250 for testnet)
- Ensure RPC URL is correct: `https://full.testnet.movementinfra.xyz/v1`

### Network Mismatch

- Privy should automatically route to Movement Network based on `supportedChains`
- If wallet connects to wrong network, check Privy Dashboard network configuration
- Verify chain ID in `PrivyProvider` matches Movement Network

## References

- [Privy Documentation](https://docs.privy.io)
- [Privy Wallet Configuration](https://docs.privy.io/guide/react/wallets/smart-wallets/configuration)
- [Movement Network Documentation](https://docs.movementnetwork.xyz)
- [Privy Dashboard](https://dashboard.privy.io)

---

**Status**: ✅ Privy is configured as the primary wallet connection method for Movement Network

