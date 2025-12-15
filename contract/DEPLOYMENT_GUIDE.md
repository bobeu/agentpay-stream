# Contract Deployment Guide

## Prerequisites

1. **Aptos CLI Installation**
   - Download from: https://github.com/aptos-labs/aptos-core/releases
   - Or install via cargo: `cargo install --git https://github.com/aptos-labs/aptos-core.git aptos --tag aptos-cli-latest`
   - Verify: `aptos --version`

2. **Account Setup**
   - The seed phrase is in `account.txt`
   - Account is pre-funded with MOVE tokens

## Deployment Steps

### Option 1: Automated Script (Recommended)

1. **Run the deployment script:**
   ```powershell
   cd contract
   .\deploy.ps1
   ```

2. **The script will:**
   - Check for Aptos CLI
   - Initialize account with seed phrase
   - Update Move.toml with account address
   - Compile the contract
   - Deploy to testnet
   - Display the contract address

3. **Update environment:**
   - Copy the contract address from the output
   - Update `web/.env.local` with the address

### Option 2: Manual Deployment

1. **Initialize Account:**
   ```powershell
   cd contract
   aptos init --network testnet --seed-phrase "kitten shiver river cash crucial reflect jeans warm hero maximum hip cactus" --profile testnet
   ```

2. **Get Account Address:**
   ```powershell
   aptos config show-profiles --profile testnet
   ```
   Copy the account address (starts with 0x)

3. **Update Move.toml:**
   - Open `Move.toml`
   - Replace `agentpay_stream = "_"` with `agentpay_stream = "0xYOUR_ADDRESS"`

4. **Compile:**
   ```powershell
   aptos move compile --named-addresses agentpay_stream=0xYOUR_ADDRESS
   ```

5. **Deploy:**
   ```powershell
   aptos move publish --named-addresses agentpay_stream=0xYOUR_ADDRESS --network testnet --profile testnet
   ```

6. **Update Environment:**
   - Create/update `web/.env.local`
   - Add: `NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_ADDRESS`

## Verification

After deployment:

1. **Check Frontend:**
   - Start dev server: `cd web && yarn dev`
   - The warning bar should disappear
   - Contract address should be displayed

2. **Test Functionality:**
   - Connect wallets
   - Create a test stream
   - Verify transaction on explorer

## Troubleshooting

- **CLI not found**: Install Aptos CLI and add to PATH
- **Compilation errors**: Check Move.toml address matches account
- **Deployment fails**: Verify account has sufficient funds
- **Address not updating**: Clear browser cache and restart dev server

