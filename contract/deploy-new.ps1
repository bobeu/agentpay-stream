# AgentPay Stream Contract Deployment Script (New Account)
# This script creates a new account and deploys the contract to Movement L1 Testnet
# Use this when you need to deploy to a fresh account address

Write-Host "=== AgentPay Stream Contract Deployment (New Account) ===" -ForegroundColor Cyan
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
    exit 1
}

Write-Host "✓ Aptos CLI found" -ForegroundColor Green
Write-Host ""

# Create new account
Write-Host "[1/5] Creating new testnet account..." -ForegroundColor Yellow
$profileName = "agentpay-deploy-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
aptos init --network testnet --profile $profileName --assume-yes

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to create account" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Account created with profile: $profileName" -ForegroundColor Green
Write-Host ""

# Get the account address
$accountAddress = (aptos config show-profiles --profile $profileName | Select-String "account:" | ForEach-Object { $_.Line.Split(":")[1].Trim() })
if (-not $accountAddress) {
    $configPath = ".aptos\config.yaml"
    if (Test-Path $configPath) {
        $configContent = Get-Content $configPath -Raw
        if ($configContent -match "$profileName.*?account:\s*0x([a-fA-F0-9]+)") {
            $accountAddress = "0x$($matches[1])"
        }
    }
}

if (-not $accountAddress) {
    Write-Host "Error: Could not detect account address" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Account address: $accountAddress" -ForegroundColor Green
Write-Host ""

# Fund the account (if needed)
Write-Host "[2/5] Checking account balance..." -ForegroundColor Yellow
$balance = aptos account list --profile $profileName 2>&1
if ($LASTEXITCODE -ne 0 -or $balance -match "0 APT") {
    Write-Host "Account needs funding. Please fund the account:" -ForegroundColor Yellow
    Write-Host "  Address: $accountAddress" -ForegroundColor Cyan
    Write-Host "  Faucet: https://faucet.testnet.aptoslabs.com/" -ForegroundColor White
    Write-Host ""
    $funded = Read-Host "Press Enter after funding the account, or 'q' to quit"
    if ($funded -eq 'q') {
        exit 1
    }
}

Write-Host ""

# Update Move.toml with the account address
Write-Host "[3/5] Updating Move.toml with account address..." -ForegroundColor Yellow
$moveToml = Get-Content "Move.toml" -Raw
$moveToml = $moveToml -replace 'agentpay_stream = "_"', "agentpay_stream = `"$accountAddress`""
Set-Content -Path "Move.toml" -Value $moveToml
Write-Host "✓ Move.toml updated" -ForegroundColor Green
Write-Host ""

# Compile contract
Write-Host "[4/5] Compiling contract..." -ForegroundColor Yellow
aptos move compile --named-addresses agentpay_stream=$accountAddress

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Contract compilation failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Contract compiled successfully" -ForegroundColor Green
Write-Host ""

# Deploy to testnet
Write-Host "[5/5] Deploying contract to Movement L1 Testnet..." -ForegroundColor Yellow
Write-Host "This may take a few moments..." -ForegroundColor Gray

$deployOutput = aptos move publish --named-addresses agentpay_stream=$accountAddress --profile $profileName 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Contract deployment failed" -ForegroundColor Red
    Write-Host $deployOutput -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Deployment Successful! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Contract Address: $accountAddress" -ForegroundColor Cyan
Write-Host "Profile Name: $profileName" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Update web/.env.local with:" -ForegroundColor White
$envLine = "   NEXT_PUBLIC_CONTRACT_ADDRESS=$accountAddress"
Write-Host $envLine -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Restart the Next.js dev server" -ForegroundColor White
Write-Host ""
