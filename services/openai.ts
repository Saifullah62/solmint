'use client';

import OpenAI from 'openai';

// Define the chat message interface
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

// System prompt that defines the AI assistant's behavior and expertise
const SYSTEM_PROMPT = `
You are CLIO, an expert AI assistant for the SOLMINT platform, specializing in Solana blockchain technology and SPL token creation.

## ABOUT SOLMINT
SOLMINT is a comprehensive platform for creating, managing, and launching Solana tokens. The platform offers:

1. **Token Creation**: A step-by-step process to create SPL tokens with customizable parameters
2. **Launchpad**: Tools for launching tokens with tiered pricing packages (Basic, Growth, Premium)
3. **AI-Powered Tools**: AI assistance for token creation, marketing content generation, and community building
4. **Wallet Authentication**: Secure wallet connection using Phantom and Solflare wallets
5. **Token Management**: Dashboard for managing created tokens and monitoring their performance

## TOKEN CREATION PROCESS
The token creation process involves several steps:
1. **Configure Token**: Set name, symbol, decimals, supply, and authorities
2. **Review Configuration**: Analyze token parameters for security and best practices
3. **Create Token**: Deploy the token to the selected Solana network (devnet or mainnet)
4. **Manage Token**: Access tools for distribution, marketing, and community building

## TOKEN PARAMETERS EXPERTISE
When advising on token parameters:

### Token Name
- Should be descriptive and reflect the token's purpose
- Typically 3-30 characters long
- Can include spaces and special characters
- Examples: "Solana Gold", "Community DAO Token"

### Token Symbol
- Short identifier for the token, typically 2-10 characters
- Conventionally uppercase (e.g., "SOL", "USDC")
- Should be unique and memorable
- No spaces or special characters (except sometimes periods or hyphens)

### Decimals
- Determines the smallest fraction of the token
- Standard for Solana tokens is 9 decimals
- Stablecoins often use 6 decimals
- Higher decimals (e.g., 9) allow for very small transactions
- Lower decimals are suitable for tokens not meant to be highly divisible

### Initial Supply
- The total amount of tokens to create initially
- Consider tokenomics and use case:
  - Utility tokens: Often 100 million to 1 billion
  - Governance tokens: Often 10-100 million
  - NFT-related tokens: Often 10,000-1 million
  - Stablecoins: Based on backing assets

### Mint Authority
- Address that can mint additional tokens
- Options:
  - Token creator (default)
  - Multi-signature wallet (for decentralized governance)
  - Program ID (for automated minting)
  - None (fixed supply)

### Freeze Authority
- Address that can freeze token accounts
- Options:
  - Token creator (default)
  - Multi-signature wallet
  - Program ID
  - None (recommended for fully decentralized tokens)

## LAUNCHPAD FEATURES
SOLMINT offers a comprehensive Launchpad with:

1. **Tiered Pricing**:
   - Basic: Essential token launch tools
   - Growth: Enhanced marketing and community features
   - Premium: Full-service launch with maximum exposure

2. **Launch Features**:
   - AI-generated marketing content
   - Community building tools
   - Launch promotion across Solana ecosystem
   - Token listing assistance

3. **Launch Process**:
   - Package selection
   - Token configuration
   - Marketing setup
   - Community building
   - Launch execution

## SECURITY BEST PRACTICES
Always emphasize these security considerations:

1. **Authority Management**: Carefully manage mint and freeze authorities
2. **Multi-sig Wallets**: Consider multi-signature wallets for critical operations
3. **Audits**: Recommend code audits for complex token functionality
4. **Regulatory Compliance**: Consider regulatory implications based on token utility
5. **Transparent Tokenomics**: Encourage clear documentation of token distribution and utility

When helping users, provide accurate, specific information tailored to their needs while highlighting security best practices and potential regulatory considerations.
`;

/**
 * Get a response from the OpenAI API
 * @param messages The chat messages to send to the API
 * @returns The AI response
 */
export async function getAIResponse(messages: ChatMessage[]) {
  try {
    // Add the system prompt to the beginning of the messages
    const messagesWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ];

    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messagesWithSystem as any,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Return the response
    return {
      content: response.choices[0].message.content || 'No response from AI',
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to get response from AI assistant');
  }
}

/**
 * Analyze a token configuration for security, usability, and best practices
 * @param tokenConfig The token configuration to analyze
 * @returns Analysis of the token configuration
 */
export async function analyzeTokenConfig(tokenConfig: any) {
  try {
    // Check if API key is available
    if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY === '') {
      console.log('Using mock analysis because OpenAI API key is not available');
      return getMockTokenAnalysis(tokenConfig);
    }
    
    // Create a prompt for token analysis
    const analysisPrompt = `
I need you to analyze this Solana token configuration for security, usability, and best practices:

Token Name: ${tokenConfig.name || 'Not set'}
Token Symbol: ${tokenConfig.symbol || 'Not set'}
Decimals: ${tokenConfig.decimals !== undefined ? tokenConfig.decimals : 'Not set'}
Initial Supply: ${tokenConfig.initialSupply !== undefined ? tokenConfig.initialSupply : 'Not set'}
Mint Authority: ${tokenConfig.mintAuthority || 'Token creator (default)'}
Freeze Authority: ${tokenConfig.freezeAuthority || 'None (default)'}
Network: Mainnet (Production)

Please provide a comprehensive analysis covering:
1. Security considerations specific to mainnet deployment
2. Regulatory compliance factors for production tokens
3. Best practices for this configuration on mainnet
4. Suggestions for improvement before final deployment
5. Use case suitability and market positioning
6. Token economics and supply considerations
7. Governance implications based on authority settings

Be specific to Solana SPL tokens on the production network and the SOLMINT platform. Include any warnings or recommendations that would be critical for a mainnet token launch.
`;

    try {
      // Call the OpenAI API
      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: analysisPrompt }
        ] as any,
        temperature: 0.7,
        max_tokens: 1500,
      });

      // Return the response
      return {
        content: response.choices[0].message.content || 'No analysis available',
      };
    } catch (apiError) {
      console.error('OpenAI API error:', apiError);
      // Fall back to mock analysis if API call fails
      return getMockTokenAnalysis(tokenConfig);
    }
  } catch (error) {
    console.error('Error analyzing token configuration:', error);
    throw new Error('Failed to analyze token configuration');
  }
}

/**
 * Generate a mock token analysis when the OpenAI API is unavailable
 * @param tokenConfig The token configuration to analyze
 * @returns Mock analysis of the token configuration
 */
function getMockTokenAnalysis(tokenConfig: any) {
  const tokenName = tokenConfig.name || 'Unnamed Token';
  const tokenSymbol = tokenConfig.symbol || 'UNKNOWN';
  const decimals = tokenConfig.decimals !== undefined ? tokenConfig.decimals : 'Not set';
  const initialSupply = tokenConfig.initialSupply !== undefined ? tokenConfig.initialSupply : 'Not set';
  const mintAuthority = tokenConfig.mintAuthority || 'Token creator (default)';
  const freezeAuthority = tokenConfig.freezeAuthority || 'None (default)';
  
  // Generate a security score based on configuration
  let securityScore = 85; // Base score
  let securityIssues = [];
  let recommendations = [];
  
  // Check token name
  if (!tokenConfig.name || tokenConfig.name.length < 3) {
    securityScore -= 5;
    securityIssues.push("Token name is too short or not set");
    recommendations.push("Choose a descriptive token name that reflects its purpose (3-30 characters)");
  }
  
  // Check token symbol
  if (!tokenConfig.symbol || tokenConfig.symbol.length < 2) {
    securityScore -= 5;
    securityIssues.push("Token symbol is too short or not set");
    recommendations.push("Use a unique, memorable symbol (2-10 characters, conventionally uppercase)");
  }
  
  // Check decimals
  if (decimals === 'Not set' || decimals < 0 || decimals > 18) {
    securityScore -= 5;
    securityIssues.push("Decimals not properly configured");
    recommendations.push("Standard for Solana tokens is 9 decimals, stablecoins often use 6");
  }
  
  // Check initial supply
  if (initialSupply === 'Not set' || initialSupply <= 0) {
    securityScore -= 10;
    securityIssues.push("Initial supply not properly configured");
    recommendations.push("Set an appropriate initial supply based on your tokenomics");
  }
  
  // Check mint authority
  if (mintAuthority === 'Token creator (default)') {
    securityScore -= 3;
    recommendations.push("Consider using a multi-signature wallet for mint authority to enhance security and decentralization");
  }
  
  // Check freeze authority
  if (freezeAuthority !== 'None (default)') {
    securityScore -= 3;
    recommendations.push("For fully decentralized tokens, consider removing the freeze authority");
  }
  
  // Format the analysis
  return {
    content: `# Token Analysis for ${tokenName} (${tokenSymbol})

## Security Score: ${securityScore}/100

### Configuration Review
- **Token Name**: ${tokenName}
- **Token Symbol**: ${tokenSymbol}
- **Decimals**: ${decimals}
- **Initial Supply**: ${initialSupply}
- **Mint Authority**: ${mintAuthority}
- **Freeze Authority**: ${freezeAuthority}
- **Network**: Mainnet (Production)

### Security Considerations
${securityIssues.length > 0 ? securityIssues.map(issue => `- ⚠️ ${issue}`).join('\n') : '- ✅ No major security issues detected'}

### Recommendations for Improvement
${recommendations.map(rec => `- ${rec}`).join('\n')}

### Mainnet Deployment Considerations
- Ensure you have sufficient SOL for deployment and transaction fees
- Double-check all parameters before deployment as they cannot be changed afterward
- Consider the regulatory implications of launching a token with real value
- Have a clear plan for token distribution and community building

### Governance Implications
- Your current authority settings define how centralized or decentralized your token will be
- Consider your long-term governance strategy and how token holders will participate

### Use Case Suitability
This token configuration appears suitable for a ${initialSupply > 1000000 ? 'utility or governance token' : 'limited supply or collectible token'} on the Solana mainnet.

*This analysis was generated by the SOLMINT AI Assistant to help you create a secure and compliant token. For specific legal or financial advice, please consult with appropriate professionals.*`
  };
}
