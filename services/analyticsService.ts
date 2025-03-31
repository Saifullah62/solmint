import { TokenConfig } from '@/types/token';

// Define analytics event types
export enum AnalyticsEventType {
  TOKEN_CREATION_STARTED = 'token_creation_started',
  TOKEN_CREATION_SUCCESS = 'token_creation_success',
  TOKEN_CREATION_ERROR = 'token_creation_error',
  WALLET_CONNECTED = 'wallet_connected',
  WALLET_DISCONNECTED = 'wallet_disconnected',
  NETWORK_CHANGED = 'network_changed',
  MARKETPLACE_VIEW = 'marketplace_view',
  TOKEN_VIEW = 'token_view'
}

// Define analytics event interface
export interface AnalyticsEvent {
  type: AnalyticsEventType;
  timestamp: number;
  data?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

// Define analytics service interface
export interface AnalyticsService {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  getEvents(type?: AnalyticsEventType, limit?: number): Promise<AnalyticsEvent[]>;
}

// Production analytics service implementation
class ProductionAnalyticsService implements AnalyticsService {
  private events: AnalyticsEvent[] = [];
  
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    this.events.push({
      ...event,
      timestamp: event.timestamp || Date.now()
    });
    
    // In production, this would send the event to a backend service
    // For now, we'll just log it to the console in a structured way
    console.log(`[Analytics] ${event.type}`, event.data || event.error || {});
    
    // Here you would implement the actual analytics tracking
    // This could be sending to a database, API, or third-party service
    try {
      // Example API call (commented out)
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      // Silently fail to prevent analytics from breaking the app
      console.error('Failed to track analytics event:', error);
    }
  }

  async getEvents(type?: AnalyticsEventType, limit: number = 100): Promise<AnalyticsEvent[]> {
    // In production, this would fetch events from a backend service
    // For now, we'll just return the in-memory events
    let filteredEvents = this.events;
    
    if (type) {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }
    
    return filteredEvents
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }
}

// Create the analytics service
const analyticsService: AnalyticsService = new ProductionAnalyticsService();

// Helper functions for common analytics events
export const trackTokenCreationStarted = (tokenConfig: TokenConfig, network: string) => {
  return analyticsService.trackEvent({
    type: AnalyticsEventType.TOKEN_CREATION_STARTED,
    timestamp: Date.now(),
    data: {
      tokenName: tokenConfig.name,
      tokenSymbol: tokenConfig.symbol,
      decimals: tokenConfig.decimals,
      initialSupply: tokenConfig.initialSupply,
      network
    }
  });
};

export const trackTokenCreationSuccess = (
  tokenConfig: TokenConfig, 
  network: string, 
  tokenAddress: string, 
  signature: string
) => {
  return analyticsService.trackEvent({
    type: AnalyticsEventType.TOKEN_CREATION_SUCCESS,
    timestamp: Date.now(),
    data: {
      tokenName: tokenConfig.name,
      tokenSymbol: tokenConfig.symbol,
      decimals: tokenConfig.decimals,
      initialSupply: tokenConfig.initialSupply,
      network,
      tokenAddress,
      signature
    }
  });
};

export const trackTokenCreationError = (
  tokenConfig: TokenConfig, 
  network: string, 
  errorCode: string, 
  errorMessage: string,
  errorDetails?: Record<string, any>
) => {
  return analyticsService.trackEvent({
    type: AnalyticsEventType.TOKEN_CREATION_ERROR,
    timestamp: Date.now(),
    data: {
      tokenName: tokenConfig.name,
      tokenSymbol: tokenConfig.symbol,
      decimals: tokenConfig.decimals,
      initialSupply: tokenConfig.initialSupply,
      network
    },
    error: {
      code: errorCode,
      message: errorMessage,
      details: errorDetails
    }
  });
};

export const trackWalletConnected = (walletType: string, publicKey: string) => {
  return analyticsService.trackEvent({
    type: AnalyticsEventType.WALLET_CONNECTED,
    timestamp: Date.now(),
    data: {
      walletType,
      publicKey
    }
  });
};

export const trackNetworkChanged = (network: string) => {
  return analyticsService.trackEvent({
    type: AnalyticsEventType.NETWORK_CHANGED,
    timestamp: Date.now(),
    data: {
      network
    }
  });
};

export default analyticsService;
