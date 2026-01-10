# Contract Deployment Summary

## Current Status

The contract deployment requires **Aptos CLI** to be installed on your system. The CLI is not currently installed, so you'll need to complete the installation first.

## Quick Start

### 1. Install Aptos CLI

**Windows (Recommended):**
- Download from: https://github.com/aptos-labs/aptos-core/releases
- Look for: `aptos-cli-*-windows-x86_64.zip`
- Extract and add to PATH

**Or via Cargo:**
```powershell
cargo install --git https://github.com/aptos-labs/aptos-core.git aptos --tag aptos-cli-latest
```

### 2. Deploy Contract

Once Aptos CLI is installed, run:

```powershell
cd contract
aptos init --network testnet --seed-phrase "kitten shiver river cash crucial reflect jeans warm hero maximum hip cactus" --profile testnet
aptos config show-profiles --profile testnet  # Copy the account address
```

Then update `Move.toml` with your account address and deploy:

```powershell
# Update Move.toml: agentpay_stream = "0xYOUR_ADDRESS"
aptos move compile --named-addresses agentpay_stream=0xYOUR_ADDRESS
aptos move publish --named-addresses agentpay_stream=0xYOUR_ADDRESS --network testnet --profile testnet
```

### 3. Update Environment

After deployment, update `web/.env.local`:

```powershell
cd contract
.\update-env.ps1 -ContractAddress "0xYOUR_DEPLOYED_ADDRESS"
```

Or manually edit `web/.env.local`:
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_ADDRESS
```

## Files Created

- `contract/deploy.ps1` - Automated deployment script (requires Aptos CLI)
- `contract/MANUAL_DEPLOY.md` - Detailed manual deployment instructions
- `contract/update-env.ps1` - Helper script to update environment variables
- `contract/DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide

## Next Steps

1. **Install Aptos CLI** (see above)
2. **Deploy the contract** using the manual steps or the deployment script
3. **Update environment variables** with the deployed contract address
4. **Test the frontend** - the warning bar should disappear once the address is set

## Verification

After deployment:
- Contract address is set in `web/.env.local`
- Frontend warning bar disappears
- Stream creation form is interactive
- Dashboard can fetch stream data

