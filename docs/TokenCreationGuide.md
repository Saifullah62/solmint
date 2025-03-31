# Solana Token Creation Guide

## Overview

This guide explains how to create a Solana token using our platform. Our token creation service allows you to:

1. Create SPL tokens on Solana's devnet or mainnet-beta
2. Configure token properties like name, symbol, decimals, and initial supply
3. Choose from different marketplace placement tiers (Basic, Growth, Premium)
4. Track your token's performance in the marketplace

## Prerequisites

Before creating a token, ensure you have:

1. A Phantom or Solflare wallet installed as a browser extension
2. Sufficient SOL in your wallet for token creation fees and placement tier costs:
   - Basic tier: 0.2 SOL
   - Growth tier: 1.5 SOL
   - Premium tier: 5 SOL
   - Plus transaction fees (approximately 0.005 SOL)

## Token Creation Process

### Step 1: Configure Your Token

1. Enter your token name (required)
2. Enter your token symbol (required, max 10 characters)
3. Select the number of decimals (0-9, default is 9)
4. Set the initial supply (must be greater than 0)
5. Choose a network (devnet for testing, mainnet-beta for production)
6. Select a marketplace placement tier (Basic, Growth, Premium)

### Step 2: Review Your Configuration

Review all token details before proceeding. This is your last chance to make changes before deployment.

### Step 3: Deploy Your Token

1. Connect your wallet when prompted
2. Approve the transaction in your wallet
3. Wait for the transaction to be confirmed on the blockchain
4. For mainnet transactions, you'll be asked to confirm before proceeding

### Step 4: Success

Once your token is created, you'll see:
- Your token's address
- Transaction signature
- Links to view your token and transaction on Solana Explorer
- Option to view your token in the marketplace

## Troubleshooting

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| NO_WALLET | No wallet provider found | Install Phantom or Solflare wallet extension |
| WALLET_CONNECTION | Failed to connect to wallet | Refresh the page and try again |
| INSUFFICIENT_FUNDS | Not enough SOL in wallet | Add more SOL to your wallet |
| USER_REJECTED | Transaction rejected by user | Approve the transaction in your wallet |
| TRANSACTION_FAILED | Transaction failed on the blockchain | Check the error details and try again |
| NETWORK_ERROR | Connection issues with Solana network | Check your internet connection or try again later |
| INVALID_TOKEN_CONFIG | Invalid token configuration | Fix the configuration errors and try again |
| RATE_LIMIT_EXCEEDED | Too many requests | Wait a few minutes and try again |

### Still Having Issues?

If you continue to experience problems, please:
1. Check the Solana network status at https://status.solana.com/
2. Try creating your token on devnet first to test the process
3. Contact our support team with your transaction signature and error details

## Best Practices

1. **Test on devnet first**: Always test your token on devnet before deploying to mainnet
2. **Choose decimals carefully**: Most tokens use 9 decimals, similar to SOL
3. **Set an appropriate initial supply**: Consider your tokenomics carefully
4. **Secure your wallet**: The wallet used to create the token will have mint authority
5. **Consider your tier**: Choose a marketplace placement tier that matches your project's needs

## Technical Details

Your token is created using the Solana SPL Token program. The process:
1. Creates a new mint account
2. Initializes the mint with your specified decimals
3. Sets the mint and freeze authorities to your wallet
4. Creates an associated token account for your wallet
5. Mints the initial supply to your wallet

The token follows the SPL Token standard and is fully compatible with all Solana wallets and exchanges that support SPL tokens.
