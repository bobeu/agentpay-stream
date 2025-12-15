# Helper script to update web/.env.local with contract address
param(
    [Parameter(Mandatory=$true)]
    [string]$ContractAddress
)

$envFile = "..\web\.env.local"
$envExample = "..\web\env.example"

# Validate address format
if (-not $ContractAddress.StartsWith("0x")) {
    Write-Host "Error: Contract address must start with 0x" -ForegroundColor Red
    exit 1
}

# Read existing .env.local or create from example
if (Test-Path $envFile) {
    $content = Get-Content $envFile -Raw
} elseif (Test-Path $envExample) {
    $content = Get-Content $envExample -Raw
} else {
    Write-Host "Error: Neither .env.local nor env.example found" -ForegroundColor Red
    exit 1
}

# Update or add NEXT_PUBLIC_CONTRACT_ADDRESS
if ($content -match "NEXT_PUBLIC_CONTRACT_ADDRESS=") {
    $content = $content -replace "NEXT_PUBLIC_CONTRACT_ADDRESS=.*", "NEXT_PUBLIC_CONTRACT_ADDRESS=$ContractAddress"
} else {
    $content += "`nNEXT_PUBLIC_CONTRACT_ADDRESS=$ContractAddress`n"
}

# Write updated content
Set-Content -Path $envFile -Value $content

Write-Host "✓ Updated $envFile" -ForegroundColor Green
Write-Host "  NEXT_PUBLIC_CONTRACT_ADDRESS=$ContractAddress" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next: Restart your Next.js dev server" -ForegroundColor Yellow

