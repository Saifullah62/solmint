# SOLMINT: Solana Token Creation Platform

<div align="center">
  <img src="public/images/solmint-logo.png" alt="SOLMINT Logo" width="200"/>
  <p><strong>Create, Launch, and Manage Solana Tokens with Zero Code</strong></p>
  <p>
    <a href="https://solana.com" target="_blank">
      <img src="https://img.shields.io/badge/Blockchain-Solana-14F195?style=for-the-badge" alt="Solana" />
    </a>
    <a href="https://nextjs.org/" target="_blank">
      <img src="https://img.shields.io/badge/Built%20with-Next.js-000000?style=for-the-badge" alt="Next.js" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="https://img.shields.io/badge/Language-TypeScript-3178C6?style=for-the-badge" alt="TypeScript" />
    </a>
  </p>
</div>

---

SOLMINT is a comprehensive platform for creating and launching Solana SPL tokens with zero coding required. This platform allows users to create tokens on both devnet and mainnet-beta networks, with different marketplace placement tiers.

## 🚀 Features

- **Token Creation**: Create SPL tokens on Solana with customizable parameters
- **Wallet Integration**: Direct connection to Phantom and Solflare wallets
- **Network Support**: Deploy tokens on devnet (for testing) or mainnet-beta (for production)
- **Marketplace Tiers**: Choose from Basic, Growth, or Premium placement tiers
- **Analytics**: Track token creation success and monitor platform performance
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Testing**: Unit and integration tests for all core functionality
- **AI-Powered Tools**: Marketing content generation and community management tools
- **Dashboard**: Real-time token performance monitoring and management
- **Launchpad**: Streamlined token launch process with tiered packages

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Quick Start Examples](#quick-start-examples)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Token Creation Process](#token-creation-process)
- [Real Solana Integration](#real-solana-integration)
- [Marketplace Integration](#marketplace-integration)
- [Error Handling](#error-handling)
- [Monitoring and Analytics](#monitoring-and-analytics)
- [Marketplace Tiers](#marketplace-tiers)
- [Dashboard Features](#dashboard-features)
- [Launchpad Experience](#launchpad-experience)
- [Deployment Guidelines](#deployment-guidelines)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Future Roadmap](#future-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## 🏁 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- A Phantom or Solflare wallet browser extension
- SOL for transaction fees and marketplace placement

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solmint.git
cd solmint
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Quick Start Examples

### Creating a Basic Token

```javascript
// Example code for creating a token using the SOLMINT API
const tokenConfig = {
  name: "My Token",
  symbol: "MTK",
  decimals: 9,
  initialSupply: 1000000,
  placementTier: "basic"
};

// Connect wallet
await connectWallet();

// Create token
const result = await createSolanaToken(tokenConfig, "devnet");
console.log(`Token created at address: ${result.tokenAddress}`);
console.log(`Transaction signature: ${result.signature}`);
```

### Monitoring Token Creation

```bash
# Run the monitoring script to track token creation events
node scripts/monitor.js --endpoint=http://localhost:3000/api --interval=30000
```

### Using the Dashboard API

```javascript
// Fetch user tokens
const response = await fetch('/api/user/tokens?wallet=YOUR_WALLET_ADDRESS');
const data = await response.json();

// Access token data
const tokens = data.data;
console.log(`You have ${tokens.length} tokens`);
```

## 🧪 Testing

The project includes comprehensive testing for all core functionality:

### Unit Tests

Run unit tests with:
```bash
npm test
# or
yarn test
```

To run tests with coverage report:
```bash
npm run test:coverage
# or
yarn test:coverage
```

### Integration Tests

Run integration tests with:
```bash
npm run test:integration
# or
yarn test:integration
```

### Test Coverage

The test suite covers:
- Token creation functionality
- Error handling and validation
- Wallet connection and transaction signing
- Fee estimation
- Analytics tracking

## 📁 Project Structure

```
solmint/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Dashboard pages
│   ├── launchpad/          # Launchpad pages
│   ├── marketplace/        # Marketplace pages
├── components/             # React components
│   ├── admin/              # Admin dashboard components
│   ├── token/              # Token creation components
│   ├── dashboard/          # Dashboard UI components
│   ├── layouts/            # Layout components
│   └── ui/                 # Reusable UI components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
│   ├── solanaTokenService.ts  # Solana token creation service
├── services/               # Service layer
│   ├── analyticsService.ts # Analytics tracking service
├── store/                  # State management
│   ├── useAppStore.ts      # Global application state
├── types/                  # TypeScript type definitions
├── scripts/                # Utility scripts
│   ├── monitor.js          # Token creation monitoring script
├── pages/                  # Next.js pages
│   ├── api/                # API routes
│       ├── analytics.ts    # Analytics API endpoint
│       ├── health.ts       # Health check endpoint
├── __tests__/              # Test files
├── docs/                   # Documentation
└── public/                 # Static assets
```

## 🪙 Token Creation Process

The token creation process follows these steps:

1. **Select Package**: Choose from Basic, Growth, or Premium tiers based on your needs
2. **Configure**: Set token name, symbol, decimals, and initial supply
3. **Review**: Verify configuration before deployment
4. **Deploy**: Connect wallet and sign the transaction
5. **Success**: View token details and explorer links

Each step includes validation to ensure successful token creation:

- Token name and symbol validation
- Decimal and supply range checks
- Wallet balance verification
- Network connection status
- Transaction confirmation monitoring

For detailed documentation, see [Token Creation Guide](./docs/TokenCreationGuide.md).

## ⛓️ Real Solana Integration

SOLMINT uses the official Solana Web3.js and SPL Token libraries to create real tokens on the Solana blockchain:

- **@solana/web3.js**: For blockchain interactions and transaction management
- **@solana/spl-token**: For token creation and management

The platform supports:
- Token creation on both devnet and mainnet-beta
- Transaction signing via connected wallets
- Explorer links for created tokens and transactions
- Fee estimation before token creation

### Technical Implementation

```typescript
// Example of token creation implementation
export async function createSolanaToken(
  tokenConfig: TokenConfig,
  network: string
): Promise<{ tokenAddress: string, signature: string } | null> {
  // Connect to the Solana network
  const connection = new Connection(
    network === 'devnet' 
      ? clusterApiUrl('devnet') 
      : clusterApiUrl('mainnet-beta')
  );
  
  // Create mint account
  const mintAccount = Keypair.generate();
  
  // Initialize token with specified decimals
  const transaction = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintAccount.publicKey,
      space: MINT_SIZE,
      lamports: await connection.getMinimumBalanceForRentExemption(MINT_SIZE),
      programId: TOKEN_PROGRAM_ID
    }),
    createInitializeMintInstruction(
      mintAccount.publicKey,
      tokenConfig.decimals,
      wallet.publicKey,
      wallet.publicKey,
      TOKEN_PROGRAM_ID
    )
  );
  
  // Sign and send transaction
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    wallet.payer,
    mintAccount
  ]);
  
  return {
    tokenAddress: mintAccount.publicKey.toString(),
    signature
  };
}
```

## 🏪 Marketplace Integration

The marketplace is fully integrated with the token creation process:

- **Token Visibility**: Tokens are displayed according to their placement tier
- **Search & Filter**: Find tokens by name, symbol, or category
- **Token Details**: View comprehensive information about each token
- **Direct Links**: Navigate directly from marketplace to token creation

### Marketplace Features

- **Featured Tokens**: Premium tokens are highlighted at the top of the marketplace
- **Category Browsing**: Browse tokens by category (Utility, Governance, NFT, etc.)
- **Token Cards**: Visual representation of tokens with key metrics
- **Token Pages**: Dedicated pages for each token with detailed information
- **Social Integration**: Share tokens on social media platforms

## 🛠️ Error Handling

The platform includes comprehensive error handling with specific error codes:

- `NO_WALLET`: No wallet provider found
- `WALLET_CONNECTION`: Failed to connect to wallet
- `INSUFFICIENT_FUNDS`: Not enough SOL in wallet
- `USER_REJECTED`: Transaction rejected by user
- `TRANSACTION_FAILED`: Transaction failed on the blockchain
- `NETWORK_ERROR`: Connection issues with Solana network
- `INVALID_TOKEN_CONFIG`: Invalid token configuration
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `UNKNOWN_ERROR`: Unexpected error

Each error is tracked in the analytics system for monitoring and improvement.

### Error Handling Implementation

```typescript
try {
  // Attempt token creation
  const result = await createSolanaToken(tokenConfig, network);
  // Handle success
} catch (err) {
  // Determine error type
  let errorCode = 'UNKNOWN_ERROR';
  let errorMessage = 'An unknown error occurred';
  
  if (err.name === 'WalletNotConnectedError') {
    errorCode = 'NO_WALLET';
    errorMessage = 'Wallet not connected. Please connect your wallet to continue.';
  } else if (err.message.includes('insufficient funds')) {
    errorCode = 'INSUFFICIENT_FUNDS';
    errorMessage = 'Insufficient funds in wallet. Please add more SOL and try again.';
  }
  
  // Track error
  await trackTokenCreationError(
    tokenConfig,
    network,
    errorCode,
    errorMessage
  );
  
  // Display error to user
  setError(errorMessage);
}
```

## 📊 Monitoring and Analytics

The platform includes a comprehensive analytics and monitoring system:

### Analytics Tracking

- **Event Types**: Token creation, wallet connections, marketplace views
- **Success Metrics**: Token creation success rates and user engagement
- **Error Tracking**: Detailed error tracking with error types and messages
- **User Journey**: Track user flow through the token creation process

### Health Monitoring

- **API Status**: Real-time API health checks
- **Solana RPC**: Solana network connection monitoring
- **Database**: Database connection and performance monitoring
- **System Resources**: CPU, memory, and disk usage monitoring

The monitoring script (`scripts/monitor.js`) provides real-time monitoring of the platform's health and performance.

### Analytics Dashboard

The analytics dashboard provides insights into:

- **Token Creation**: Number of tokens created over time
- **Network Distribution**: Distribution of tokens between devnet and mainnet
- **Error Rates**: Token creation error rates and common error types
- **User Engagement**: User activity and engagement metrics
- **Marketplace Performance**: Token views, clicks, and conversions

## 💎 Marketplace Tiers

SOLMINT offers three marketplace placement tiers:

1. **Basic Tier (0.2 SOL)**:
   - Standard listing in the "All Tokens" section
   - Basic analytics dashboard
   - Community tools
   - Token explorer integration
   - Social sharing capabilities

2. **Growth Tier (1.5 SOL)**:
   - Premium listing section with blue badge
   - Higher visibility in search results
   - Advanced analytics dashboard
   - AI-generated marketing content
   - Community management tools
   - Email notifications
   - Token performance alerts

3. **Premium Tier (5 SOL)**:
   - Featured placement with special highlighting
   - "Featured Token" badge
   - Top placement in search results
   - Premium analytics dashboard
   - AI-generated marketing campaign
   - Advanced community tools
   - Priority support
   - Customizable token page
   - Promotional opportunities
   - Early access to new features

## 📈 Dashboard Features

The token dashboard provides comprehensive management and analytics:

- **Token Stats**: Real-time performance metrics for your tokens
- **Growth Tools**: AI-powered marketing and community growth tools
- **Token Management**: Manage multiple tokens from a single interface
- **Community Insights**: Track community engagement and growth
- **Events Calendar**: Schedule and manage token-related events

### Dashboard Sections

1. **Overview**: High-level metrics and token performance
2. **Analytics**: Detailed analytics and charts
3. **Community**: Community management and engagement tools
4. **Marketing**: Marketing tools and campaign management
5. **Settings**: Token and account settings

## 🚀 Launchpad Experience

The Launchpad provides a streamlined token creation experience:

- **Package Selection**: Choose from Basic, Growth, or Premium packages
- **Token Configuration**: Customize your token with a user-friendly form
- **Logo Upload**: Upload and preview your token logo
- **AI-Generated Content**: Get AI-generated marketing content based on your token
- **Launch Confirmation**: Review and confirm your token before launch

### Launchpad Features

- **Guided Process**: Step-by-step guidance through the token creation process
- **Real-time Validation**: Instant feedback on token configuration
- **Fee Estimation**: Estimate transaction fees before deployment
- **Network Selection**: Choose between devnet and mainnet-beta
- **Success Confirmation**: Confirmation page with explorer links and next steps

## 🚢 Deployment Guidelines

### Pre-Deployment Checklist

- [ ] Run all tests and ensure they pass
- [ ] Verify error handling for all edge cases
- [ ] Test token creation on devnet
- [ ] Check analytics tracking is working
- [ ] Ensure proper wallet connection for both Phantom and Solflare
- [ ] Verify marketplace tier integration
- [ ] Test monitoring script functionality
- [ ] Validate health check endpoints
- [ ] Review security considerations
- [ ] Check browser compatibility
- [ ] Verify mobile responsiveness

### Production Deployment

1. Build the production bundle:
```bash
npm run build
# or
yarn build
```

2. Start the production server:
```bash
npm start
# or
yarn start
```

3. Run the monitoring script:
```bash
node scripts/monitor.js --endpoint=https://your-api-endpoint.com --interval=60000
```

### Deployment Environments

- **Development**: Local development environment
- **Staging**: Testing environment with devnet integration
- **Production**: Live environment with mainnet-beta integration

## 🔒 Security Considerations

- **Wallet Security**: Private keys never leave the user's wallet
- **Transaction Signing**: All transactions are signed locally in the user's wallet
- **API Security**: Rate limiting and validation on all API endpoints
- **Error Handling**: Secure error handling that doesn't expose sensitive information
- **Data Protection**: Sensitive data is encrypted at rest and in transit
- **Access Control**: Role-based access control for administrative functions
- **Audit Logging**: Comprehensive logging of all system activities
- **Dependency Management**: Regular updates of dependencies to patch security vulnerabilities

## ❓ Troubleshooting

### Common Issues

#### Wallet Connection Issues

**Problem**: Unable to connect to wallet or wallet not detected.

**Solution**: 
1. Ensure you have Phantom or Solflare wallet extension installed
2. Check if you're logged into your wallet
3. Try refreshing the page
4. Clear browser cache and cookies

#### Transaction Failures

**Problem**: Token creation transaction fails.

**Solution**:
1. Check your wallet balance (need SOL for transaction fees)
2. Verify network connection
3. Check Solana network status
4. Try again with a smaller initial supply

#### Dashboard Not Loading

**Problem**: Dashboard doesn't load or shows no tokens.

**Solution**:
1. Ensure your wallet is connected
2. Check if you've created any tokens
3. Try switching networks (devnet/mainnet)
4. Clear browser cache and refresh

### Support Resources

- **Documentation**: Comprehensive guides in the `/docs` directory
- **FAQ**: Common questions answered at [solmint.io/faq](https://solmint.io/faq)
- **Discord**: Join our community at [discord.gg/solmint](https://discord.gg/solmint)
- **GitHub Issues**: Report bugs on our GitHub repository

## 🔮 Future Roadmap

### Q2 2025
- **Multi-wallet Support**: Integration with additional Solana wallets
- **Token Governance**: Advanced governance features for community-driven tokens
- **Enhanced Analytics**: More detailed analytics and reporting

### Q3 2025
- **Token Staking**: Built-in staking functionality for tokens
- **Mobile App**: Native mobile applications for iOS and Android
- **API Expansion**: Extended API for developers

### Q4 2025
- **Cross-chain Support**: Integration with additional blockchains
- **DEX Integration**: Direct integration with decentralized exchanges
- **Advanced AI Tools**: Enhanced AI capabilities for marketing and community management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the code style and formatting
- Write tests for new features
- Update documentation as needed
- Respect the code of conduct

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue on the GitHub repository or contact the development team at support@solmint.io.
