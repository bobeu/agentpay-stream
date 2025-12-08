#!/bin/bash
# AgentPay Stream Development Deployment Script
# This script compiles the Move contract and prepares for deployment

set -e

echo "=== AgentPay Stream Development Deployment ==="

# Step 1: Compile Move Contract
echo ""
echo "[1/3] Compiling Move contract..."
cd contract

# Check if aptos CLI is installed
if ! command -v aptos &> /dev/null; then
    echo "Error: Aptos CLI is not installed."
    echo "Please install it from: https://aptos.dev/tools/aptos-cli/install-cli/"
    exit 1
fi

# Compile the contract
echo "Running: aptos move compile"
aptos move compile

if [ $? -ne 0 ]; then
    echo "Error: Contract compilation failed"
    exit 1
fi

echo "Contract compiled successfully!"
cd ..

# Step 2: Display deployment instructions
echo ""
echo "[2/3] Deployment Instructions:"
echo "To deploy to testnet, run:"
echo "  cd contract"
echo "  aptos move publish --named-addresses agentpay_stream=<YOUR_ADDRESS>"
echo ""
echo "After deployment, update NEXT_PUBLIC_CONTRACT_ADDRESS in web/.env.local"

# Step 3: Generate TypeScript client (if contract address is set)
echo ""
echo "[3/3] TypeScript Client Generation:"
cd web

if [ -f ".env.local" ]; then
    if grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS=" .env.local && ! grep -q "NEXT_PUBLIC_CONTRACT_ADDRESS=$" .env.local; then
        echo "Contract address found. Generating client..."
        yarn generate-client
    else
        echo "Contract address not set. Skipping client generation."
        echo "Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local after deployment."
    fi
else
    echo ".env.local not found. Create it with NEXT_PUBLIC_CONTRACT_ADDRESS after deployment."
fi

cd ..

echo ""
echo "=== Deployment script completed ==="
echo "Next steps:"
echo "  1. Deploy the contract using the command above"
echo "  2. Update web/.env.local with the contract address"
echo "  3. Run 'yarn generate-client' in the web directory"
echo "  4. Start the frontend with 'cd web && yarn dev'"

