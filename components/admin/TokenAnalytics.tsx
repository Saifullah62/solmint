'use client';

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';
import analyticsService, { AnalyticsEventType, AnalyticsEvent } from '@/services/analyticsService';

export const TokenAnalytics: React.FC = () => {
  const [successEvents, setSuccessEvents] = useState<AnalyticsEvent[]>([]);
  const [errorEvents, setErrorEvents] = useState<AnalyticsEvent[]>([]);
  const [startedEvents, setStartedEvents] = useState<AnalyticsEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { network } = useAppStore();
  
  // Calculate success rate
  const totalAttempts = successEvents.length + errorEvents.length;
  const successRate = totalAttempts > 0 ? (successEvents.length / totalAttempts * 100).toFixed(1) : '0';
  
  // Group errors by error code
  const errorsByCode: Record<string, number> = {};
  errorEvents.forEach(event => {
    const code = event.error?.code || 'UNKNOWN_ERROR';
    errorsByCode[code] = (errorsByCode[code] || 0) + 1;
  });

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        const [success, error, started] = await Promise.all([
          analyticsService.getEvents(AnalyticsEventType.TOKEN_CREATION_SUCCESS, 100),
          analyticsService.getEvents(AnalyticsEventType.TOKEN_CREATION_ERROR, 100),
          analyticsService.getEvents(AnalyticsEventType.TOKEN_CREATION_STARTED, 100)
        ]);
        
        setSuccessEvents(success);
        setErrorEvents(error);
        setStartedEvents(started);
      } catch (err) {
        console.error('Error loading analytics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadAnalytics();
    
    // Refresh data every 60 seconds
    const interval = setInterval(loadAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Filter events by network
  const filterByNetwork = (events: AnalyticsEvent[], network: string) => {
    return events.filter(event => event.data?.network === network);
  };
  
  const networkSuccessEvents = filterByNetwork(successEvents, network);
  const networkErrorEvents = filterByNetwork(errorEvents, network);
  const networkStartedEvents = filterByNetwork(startedEvents, network);
  
  const networkTotalAttempts = networkSuccessEvents.length + networkErrorEvents.length;
  const networkSuccessRate = networkTotalAttempts > 0 
    ? (networkSuccessEvents.length / networkTotalAttempts * 100).toFixed(1) 
    : '0';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Token Creation Analytics</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Total Tokens Created</h3>
              <div className="text-3xl font-bold mt-2">{successEvents.length}</div>
              <div className="text-sm text-purple-600 mt-1">All time</div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Success Rate</h3>
              <div className="text-3xl font-bold mt-2">{successRate}%</div>
              <div className="text-sm text-blue-600 mt-1">
                {successEvents.length} successful / {totalAttempts} attempts
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Current Network</h3>
              <div className="text-3xl font-bold mt-2">{networkSuccessEvents.length}</div>
              <div className="text-sm text-green-600 mt-1">
                {networkSuccessRate}% success rate on {network}
              </div>
            </div>
          </div>
          
          {/* Error Analysis */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Error Analysis</h3>
            
            {Object.keys(errorsByCode).length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Error Code
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(errorsByCode).map(([code, count]) => (
                      <tr key={code} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b border-gray-200">
                          <span className="font-medium">{code}</span>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {count}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {(count / errorEvents.length * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 italic">No errors recorded</div>
            )}
          </div>
          
          {/* Recent Token Creations */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Token Creations</h3>
            
            {successEvents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Token Name
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Network
                      </th>
                      <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {successEvents.slice(0, 10).map((event, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b border-gray-200">
                          {event.data?.tokenName || 'Unknown'}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {event.data?.tokenSymbol || 'Unknown'}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            event.data?.network === 'mainnet-beta' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {event.data?.network || 'Unknown'}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {new Date(event.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-gray-500 italic">No tokens created yet</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TokenAnalytics;
