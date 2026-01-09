# AgentPay Stream Development Deployment Script
# This script compiles the Move contract and prepares for deployment

Write-Host "=== AgentPay Stream Development Deployment ===" -ForegroundColor Cyan

# Step 1: Compile Move Contract
Write-Host "`n[1/3] Compiling Move contract..." -ForegroundColor Yellow
Set-Location contract

# Check if aptos CLI is installed
$aptosInstalled = Get-Command aptos -ErrorAction SilentlyContinue
if (-not $aptosInstalled) {
    Write-Host "Error: Aptos CLI is not installed." -ForegroundColor Red
    Write-Host "Please install it from: https://aptos.dev/tools/aptos-cli/install-cli/" -ForegroundColor Yellow
    Set-Location ..
    exit 1
}

# Compile the contract
Write-Host "Running: aptos move compile" -ForegroundColor Gray
aptos move compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Contract compilation failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "Contract compiled successfully!" -ForegroundColor Green
Set-Location ..

# Step 2: Display deployment instructions
Write-Host "`n[2/3] Deployment Instructions:" -ForegroundColor Yellow
Write-Host "To deploy to testnet, run:" -ForegroundColor White
Write-Host "  cd contract" -ForegroundColor Gray
Write-Host "  aptos move publish --named-addresses agentpay_stream=<YOUR_ADDRESS>" -ForegroundColor Gray
Write-Host "`nAfter deployment, update NEXT_PUBLIC_CONTRACT_ADDRESS in web/.env.local" -ForegroundColor White

# Step 3: Generate TypeScript client (if contract address is set)
Write-Host "`n[3/3] TypeScript Client Generation:" -ForegroundColor Yellow
Set-Location web

if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_CONTRACT_ADDRESS=(.+)") {
        Write-Host "Contract address found. Generating client..." -ForegroundColor Gray
        yarn generate-client
    } else {
        Write-Host "Contract address not set. Skipping client generation." -ForegroundColor Yellow
        Write-Host "Set NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local after deployment." -ForegroundColor White
    }
} else {
    Write-Host ".env.local not found. Create it with NEXT_PUBLIC_CONTRACT_ADDRESS after deployment." -ForegroundColor Yellow
}

Set-Location ..

Write-Host "`n=== Deployment script completed ===" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Deploy the contract using the command above" -ForegroundColor White
Write-Host "  2. Update web/.env.local with the contract address" -ForegroundColor White
Write-Host "  3. Run 'yarn generate-client' in the web directory" -ForegroundColor White
Write-Host "  4. Start the frontend with 'cd web && yarn dev'" -ForegroundColor White

