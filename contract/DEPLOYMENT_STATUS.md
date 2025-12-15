# Contract Deployment Status

## Current Status

**Account Initialized**: `0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff`
**Move.toml Updated**: Contract address configured
**Contract Compiled**: Successfully compiled
**Deployment Pending**: Account needs funding

## Next Steps

### 1. Fund the Account

The deployment account needs APT tokens to pay for gas fees. Fund it using one of these methods:

**Option A: Web Faucet (Recommended)**
Visit: https://aptos.dev/network/faucet?address=0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff

**Option B: CLI Faucet**
```powershell
aptos account fund-with-faucet --account testnet --profile testnet --faucet-url https://faucet.testnet.aptoslabs.com
```

### 2. Deploy the Contract

After funding, run this command:

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
aptos move publish --named-addresses agentpay_stream=0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff --profile testnet --assume-yes
```

### 3. Update Environment File

After successful deployment, update `web/.env.local`:

```env
NEXT_PUBLIC_MOVEMENT_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff
NEXT_PUBLIC_CHAIN_ID=2
```

Or use the helper script:
```powershell
cd contract
.\update-env.ps1 -ContractAddress "0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff"
```

### 4. Verify Deployment

1. Check the transaction hash from the deployment output
2. View on explorer: https://explorer.aptoslabs.com/txn/{txn_hash}?network=testnet
3. Start the frontend: `cd web && yarn dev`
4. Verify the warning bar disappears on the homepage

## Contract Details

- **Contract Address**: `0x0aa1dd24263b325205d18478737d6c15adcf439e688b0cce01176583eb9759ff`
- **Module Name**: `agent_pay_stream`
- **Network**: Aptos Testnet
- **Package Size**: 2589 bytes

## Troubleshooting

- **INSUFFICIENT_BALANCE**: Fund the account using the faucet
- **MAX_GAS_UNITS_BELOW_MIN**: The CLI should auto-calculate, but if it fails, try: `--max-gas 1000000`
- **Compilation Errors**: Ensure Move.toml has the correct address and dependencies are accessible

