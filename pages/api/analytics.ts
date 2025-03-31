import { NextApiRequest, NextApiResponse } from 'next';
import analyticsService, { AnalyticsEventType } from '@/services/analyticsService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { type, network } = req.query;
    
    // Validate required parameters
    if (!type) {
      return res.status(400).json({ error: 'Missing required parameter: type' });
    }
    
    // Convert type string to AnalyticsEventType
    const eventType = type as string;
    const validEventTypes = Object.values(AnalyticsEventType) as string[];
    
    if (!validEventTypes.includes(eventType)) {
      return res.status(400).json({ 
        error: 'Invalid event type',
        validTypes: validEventTypes
      });
    }
    
    // Get events from analytics service
    const events = await analyticsService.getEvents(eventType as AnalyticsEventType);
    
    // Filter by network if provided
    const filteredEvents = network 
      ? events.filter(event => event.data?.network === network)
      : events;
    
    // Return the events
    return res.status(200).json(filteredEvents);
  } catch (error) {
    console.error('Error in analytics API:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
