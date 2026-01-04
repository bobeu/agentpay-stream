# Manual Contract Deployment Instructions

Since Aptos CLI needs to be installed manually, follow these steps:

## Step 1: Install Aptos CLI

**Option A: Download Binary (Recommended for Windows)**
1. Visit: https://github.com/aptos-labs/aptos-core/releases
2. Download the latest `aptos-cli-*-windows-x86_64.zip`
3. Extract and add to your PATH

**Option B: Install via Cargo**                                                                                                                                                                                                                         
```powershell
cargo install --git https://github.com/aptos-labs/aptos-core.git aptos --tag aptos-cli-latest
```
                                                    
**Verify Installation:**
```powershell
aptos --version
```

## Step 2: Initialize Account

```powershell
cd contract
aptos init --network testnet --seed-phrase "kitten shiver river cash crucial reflect jeans warm hero maximum hip cactus" --profile testnet
```

## Step 3: Get Account Address

```powershell
aptos config show-profiles --profile testnet
```

Copy the account address (starts with `0x`). Example: `0x1234...abcd`

## Step 4: Update Move.toml

Edit `Move.toml` and replace:
```toml
agentpay_stream = "_"
```

With:
```toml
agentpay_stream = "0xYOUR_ACCOUNT_ADDRESS"
```

## Step 5: Compile Contract

```powershell
aptos move compile --named-addresses agentpay_stream=0xYOUR_ACCOUNT_ADDRESS
```

## Step 6: Deploy to Testnet

```powershell
aptos move publish --named-addresses agentpay_stream=0xYOUR_ACCOUNT_ADDRESS --network testnet --profile testnet
```

## Step 7: Update Environment Variables

Create or update `web/.env.local`:

```env
NEXT_PUBLIC_MOVEMENT_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_ACCOUNT_ADDRESS
NEXT_PUBLIC_CHAIN_ID=2
```

Replace `0xYOUR_ACCOUNT_ADDRESS` with the address from Step 3.

## Step 8: Verify Deployment

1. Start the dev server: `cd web && yarn dev`
2. Check that the warning bar disappears
3. The contract address should be displayed on the homepage

