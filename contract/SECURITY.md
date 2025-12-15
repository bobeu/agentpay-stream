# Security Guidelines

## Sensitive Files

The following files contain or may contain sensitive information and **MUST NOT** be committed to version control:

- `account.txt` - Contains the mnemonic seed phrase
- `derive-key.js` - Script that reads from account.txt (excluded as a precaution)
- `.aptos/config.yaml` - Contains private keys and account information
- `web/.env.local` - Contains API keys and configuration

## Security Best Practices

### 1. Account Management

- **Never commit `account.txt`** - This file contains your mnemonic seed phrase
- Store `account.txt` locally only and ensure it's in `.gitignore`
- Use environment variables or secure key management for production deployments
- Consider using hardware wallets or secure key management services for production

### 2. Private Keys

- Private keys are stored in `.aptos/config.yaml` (automatically gitignored)
- Never share or commit private keys or seed phrases
- Use different accounts for development and production

### 3. Environment Variables

- `web/.env.local` contains sensitive configuration
- Never commit `.env.local` files
- Use `.env.example` as a template without sensitive values
- Rotate API keys and secrets regularly

### 4. Script Security

- `derive-key.js` reads from `account.txt` at runtime
- The script is excluded from git as an extra security measure
- Always verify that sensitive files are in `.gitignore` before committing

## Verification

Before committing code, verify sensitive files are excluded:

```bash
git status
# Ensure account.txt, .env.local, and .aptos/ are not listed
```

## Production Deployment

For production deployments:

1. Use environment variables or secure vaults for secrets
2. Implement proper key rotation policies
3. Use multi-signature wallets for contract deployment
4. Enable audit logging for sensitive operations
5. Use hardware security modules (HSM) for key storage when possible

