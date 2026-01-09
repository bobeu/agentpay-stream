# AgentPay Stream Contract Deployment Script
# This script deploys the contract to Movement L1 Testnet

Write-Host "=== AgentPay Stream Contract Deployment ===" -ForegroundColor Cyan
Write-Host ""

# Check if Aptos CLI is installed
$aptosInstalled = Get-Command aptos -ErrorAction SilentlyContinue
if (-not $aptosInstalled) {
    Write-Host "Error: Aptos CLI is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Aptos CLI using one of these methods:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://github.com/aptos-labs/aptos-core/releases" -ForegroundColor White
    Write-Host "2. Or use: cargo install --git https://github.com/aptos-labs/aptos-core.git aptos --tag aptos-cli-latest" -ForegroundColor White
    Write-Host ""
    Write-Host "After installation, add aptos to your PATH and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Aptos CLI found" -ForegroundColor Green
Write-Host ""

# Read seed phrase from account.txt
$seedPhrase = Get-Content "account.txt" -Raw
$seedPhrase = $seedPhrase.Trim()

if (-not $seedPhrase) {
    Write-Host "Error: account.txt is empty or not found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Seed phrase loaded from account.txt" -ForegroundColor Green
Write-Host ""

# Initialize account with seed phrase (if not already initialized)
Write-Host "[1/4] Setting up account..." -ForegroundColor Yellow
Write-Host "Note: If account already exists, this will use the existing configuration." -ForegroundColor Gray

# Create .aptos directory if it doesn't exist
if (-not (Test-Path ".aptos")) {
    New-Item -ItemType Directory -Path ".aptos" | Out-Null
}

# Initialize with Movement testnet profile
# Movement Testnet uses custom network configuration
Write-Host "Initializing Aptos account for Movement testnet..." -ForegroundColor Gray
Write-Host "Using Movement testnet endpoint: https://full.testnet.movementinfra.xyz/v1" -ForegroundColor Gray

# Create custom network configuration for Movement testnet
aptos init --network custom --seed-phrase "$seedPhrase" --profile testnet --assume-yes --rest-url "https://full.testnet.movementinfra.xyz/v1" --faucet-url "https://faucet.testnet.movementinfra.xyz"

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to initialize account" -ForegroundColor Red
    exit 1
}

# Get the account address
$accountAddress = (aptos config show-profiles --profile testnet | Select-String "account:" | ForEach-Object { $_.Line.Split(":")[1].Trim() })
if (-not $accountAddress) {
    # Try alternative method to get address
    $configPath = ".aptos\config.yaml"
    if (Test-Path $configPath) {
        $configContent = Get-Content $configPath -Raw
        if ($configContent -match "account:\s*0x([a-fA-F0-9]+)") {
            $accountAddress = "0x$($matches[1])"
        }
    }
}

if (-not $accountAddress) {
    Write-Host "Warning: Could not automatically detect account address" -ForegroundColor Yellow
    Write-Host "Please run: aptos config show-profiles --profile testnet" -ForegroundColor White
    Write-Host "And manually update Move.toml with the account address" -ForegroundColor White
} else {
    Write-Host "✓ Account address: $accountAddress" -ForegroundColor Green
    
    # Update Move.toml with the account address
    Write-Host ""
    Write-Host "[2/4] Updating Move.toml with account address..." -ForegroundColor Yellow
    $moveToml = Get-Content "Move.toml" -Raw
    $moveToml = $moveToml -replace 'agentpay_stream = "_"', "agentpay_stream = `"$accountAddress`""
    Set-Content -Path "Move.toml" -Value $moveToml
    Write-Host "✓ Move.toml updated" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Compiling contract..." -ForegroundColor Yellow
aptos move compile --named-addresses agentpay_stream=$accountAddress

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Contract compilation failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Contract compiled successfully" -ForegroundColor Green
Write-Host ""

# Deploy to Movement testnet
Write-Host "[4/4] Deploying contract to Movement Testnet..." -ForegroundColor Yellow
Write-Host "Network: Movement Testnet (Chain ID: 250)" -ForegroundColor Cyan
Write-Host "RPC: https://full.testnet.movementinfra.xyz/v1" -ForegroundColor Cyan
Write-Host "This may take a few moments..." -ForegroundColor Gray
Write-Host "Note: If you get a 'BACKWARD_INCOMPATIBLE_MODULE_UPDATE' error," -ForegroundColor Yellow
Write-Host "      the contract already exists. You may need to deploy to a new account." -ForegroundColor Yellow

$deployOutput = aptos move publish --named-addresses agentpay_stream=$accountAddress --profile testnet 2>&1

if ($LASTEXITCODE -ne 0) {
    $errorText = $deployOutput -join "`n"
    if ($errorText -match "BACKWARD_INCOMPATIBLE_MODULE_UPDATE") {
        Write-Host "" -ForegroundColor Red
        Write-Host "Error: Cannot update existing module (incompatible changes)" -ForegroundColor Red
        Write-Host "The deployed contract has incompatible function signatures." -ForegroundColor Yellow
        Write-Host "" -ForegroundColor Yellow
        Write-Host "Solution: Deploy to a new account address" -ForegroundColor Cyan
        Write-Host "1. Create a new account: aptos init --network testnet --profile testnet-new" -ForegroundColor White
        Write-Host "2. Update Move.toml with the new address" -ForegroundColor White
        Write-Host "3. Run this script again" -ForegroundColor White
    } else {
        Write-Host "Error: Contract deployment failed" -ForegroundColor Red
        Write-Host $deployOutput -ForegroundColor Red
    }
    exit 1
}

Write-Host ""
Write-Host "=== Deployment Successful! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Contract Address: $accountAddress" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update web/.env.local with:" -ForegroundColor White
$envLine = "   NEXT_PUBLIC_CONTRACT_ADDRESS=" + $accountAddress
Write-Host $envLine -ForegroundColor Cyan
Write-Host ""
Write-Host '2. Restart the Next.js dev server' -ForegroundColor White
Write-Host ""

