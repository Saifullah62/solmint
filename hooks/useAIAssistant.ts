'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { getAIResponse, analyzeTokenConfig, ChatMessage } from '../services/openai';
import { useAccount } from './useAccount';
import { useTokenConfig } from './useTokenConfig';

export interface AIAssistantState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}

// Create a singleton instance to store messages across component instances
// This prevents duplicate welcome messages when the component remounts
let globalMessages: ChatMessage[] = [];
let welcomeMessageSent = false;

/**
 * Custom hook for AI assistant functionality
 * @returns AI assistant state and functions
 */
export const useAIAssistant = () => {
  // Initialize state with global messages
  const [state, setState] = useState<AIAssistantState>({
    messages: globalMessages,
    isLoading: false,
    error: null,
  });

  // Get account and token configuration
  const { account } = useAccount();
  const { tokenConfig } = useTokenConfig();

  // Update global messages when state.messages changes
  useEffect(() => {
    globalMessages = state.messages;
  }, [state.messages]);

  /**
   * Send a message to the AI assistant
   * @param message The message to send
   * @returns The AI response
   */
  const sendMessage = useCallback(
    async (message: string) => {
      try {
        // Set loading state
        setState((prevState) => ({
          ...prevState,
          isLoading: true,
          error: null,
        }));

        // Add user message to the state
        const userMessage: ChatMessage = { role: 'user', content: message };
        
        // Create a context-enriched message that includes token configuration if available
        let contextEnrichedMessage = message;
        
        if (tokenConfig && Object.keys(tokenConfig).length > 0) {
          contextEnrichedMessage = `
${message}

Current Token Configuration Context:
- Name: ${tokenConfig.name || 'Not set'}
- Symbol: ${tokenConfig.symbol || 'Not set'}
- Decimals: ${tokenConfig.decimals !== undefined ? tokenConfig.decimals : 'Not set'}
- Initial Supply: ${tokenConfig.initialSupply !== undefined ? tokenConfig.initialSupply : 'Not set'}
- Mint Authority: ${tokenConfig.mintAuthority || 'Not set'}
- Freeze Authority: ${tokenConfig.freezeAuthority || 'Not set'}
- Network: Mainnet (Production)
`;
        }

        // Add wallet connection status if available
        if (account) {
          contextEnrichedMessage += `\nUser is connected with wallet: ${account.address}`;
        } else {
          contextEnrichedMessage += `\nUser is not connected with a wallet.`;
        }

        // Create the enriched user message
        const enrichedUserMessage: ChatMessage = { 
          role: 'user', 
          content: contextEnrichedMessage 
        };

        // Get messages without the system prompt
        const messagesForAPI = [...state.messages, enrichedUserMessage];

        // Get AI response
        const aiResponse = await getAIResponse(messagesForAPI);

        // Add AI response to the state
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: aiResponse.content,
        };

        // Update state with new messages and loading state
        setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, userMessage, assistantMessage],
          isLoading: false,
        }));

        // Return the AI response
        return aiResponse;
      } catch (error) {
        // Handle error
        console.error('Error sending message to AI assistant:', error);
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: 'Failed to get response from AI assistant',
        }));
        throw error;
      }
    },
    [state.messages, tokenConfig, account]
  );

  /**
   * Analyze the current token configuration
   */
  const analyzeCurrentTokenConfig = async () => {
    try {
      setState((prevState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      // Get the current token configuration
      const currentTokenConfig = tokenConfig;
      
      // Check if token configuration has required fields
      if (!currentTokenConfig || !currentTokenConfig.name || !currentTokenConfig.symbol) {
        // Add a system message indicating missing fields
        const systemMessage: ChatMessage = {
          role: 'assistant',
          content: "⚠️ I need more information about your token to provide a thorough analysis. Please fill in at least the token name and symbol in the configuration form."
        };
        
        // Add the message to the list of messages
        setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, systemMessage],
        }));
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
        return;
      }

      // Create a user message for token analysis
      const userMessage: ChatMessage = {
        role: 'user',
        content: `Please analyze my token configuration for mainnet deployment and provide recommendations.`
      };

      // Add the user message to the list of messages
      setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, userMessage],
      }));

      try {
        // Call the API to analyze the token configuration
        const response = await analyzeTokenConfig(currentTokenConfig);

        // Create an assistant message with the analysis
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.content
        };

        // Add the assistant message to the list of messages
        setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, assistantMessage],
        }));
      } catch (analysisError) {
        console.error('Error analyzing token configuration:', analysisError);
        
        // Create an error message
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: "I'm sorry, I encountered an issue while analyzing your token configuration. Please try again later or check your network connection. In the meantime, here are some general tips for token creation on Solana mainnet:\n\n" +
            "- Ensure your token name and symbol are unique and descriptive\n" +
            "- Standard decimals for Solana tokens is 9 (6 for stablecoins)\n" +
            "- Consider your tokenomics carefully before setting initial supply\n" +
            "- For production tokens, consider using a multi-sig wallet for mint authority\n" +
            "- Double-check all parameters before deployment as they cannot be changed afterward"
        };
        
        // Add the error message to the list of messages
        setState((prevState) => ({
          ...prevState,
          messages: [...prevState.messages, errorMessage],
        }));
      }
    } catch (error) {
      console.error('Error in analyzeCurrentTokenConfig:', error);
      setState((prevState) => ({
        ...prevState,
        error: 'Failed to analyze token configuration. Please try again later.',
      }));
    } finally {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      messages: [],
    }));
    // Reset global messages and welcome message flag
    globalMessages = [];
    welcomeMessageSent = false;
  }, []);

  /**
   * Get the welcome message based on the current application context
   */
  const getWelcomeMessage = useCallback(() => {
    let welcomeMessage = "Hello! I'm CLIO, your AI assistant for the SOLMINT platform. How can I help you with creating or managing your Solana tokens today?";
    
    // Add context-specific welcome message
    if (tokenConfig && Object.keys(tokenConfig).length > 0) {
      // If token configuration exists, provide specific guidance
      if (tokenConfig.name && tokenConfig.symbol) {
        welcomeMessage = `Hello! I see you're configuring a token named "${tokenConfig.name}" (${tokenConfig.symbol}) for deployment on the Solana mainnet. I can help you optimize your token parameters, explain any settings, or guide you through the creation process. What would you like to know?`;
      } else {
        welcomeMessage = "Hello! I see you're in the process of configuring a new token for the Solana mainnet. I can help you set optimal parameters for your use case, explain any settings, or guide you through the creation process. What would you like to know?";
      }
    } else if (typeof window !== 'undefined' && window.location.pathname.includes('launchpad')) {
      // If on the launchpad page
      welcomeMessage = "Welcome to the SOLMINT Launchpad! I can help you select the right launch package for your mainnet token, explain the launch process, or provide guidance on marketing and community building strategies. How can I assist you today?";
    } else if (typeof window !== 'undefined' && window.location.pathname.includes('dashboard')) {
      // If on the dashboard page
      welcomeMessage = "Welcome to your SOLMINT Dashboard! I can help you manage your mainnet tokens, analyze their performance, or suggest next steps for your token project. What would you like to know?";
    }
    
    return welcomeMessage;
  }, [tokenConfig]);

  /**
   * Send the welcome message
   */
  const sendWelcomeMessage = useCallback(() => {
    // Only send welcome message if it hasn't been sent yet and there are no messages
    if (globalMessages.length === 0 && !welcomeMessageSent) {
      const welcomeMessage = getWelcomeMessage();
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: welcomeMessage,
      };
      
      // Update global messages directly
      globalMessages = [assistantMessage];
      
      // Update state
      setState((prevState) => ({
        ...prevState,
        messages: globalMessages,
      }));
      
      // Mark welcome message as sent globally
      welcomeMessageSent = true;
    }
  }, [getWelcomeMessage]);

  // Return the state and functions
  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    analyzeCurrentTokenConfig,
    clearMessages,
    sendWelcomeMessage,
  };
};
