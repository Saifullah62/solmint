import { NextApiRequest, NextApiResponse } from 'next';

// In a production environment, this would come from a database
// For now, we'll create some initial featured launches for testing
const initialFeaturedLaunches = [
  {
    id: '1',
    name: 'GreenEco Token',
    symbol: 'GECO',
    description: 'Sustainable blockchain solutions for environmental initiatives',
    logoUrl: '/token-logos/geco.png',
    launchDate: '2025-04-15',
    socialFollowers: 2450,
    category: 'Environment',
    websiteUrl: 'https://greeneco.io',
    twitterUrl: 'https://twitter.com/greeneco',
    discordUrl: 'https://discord.gg/greeneco'
  },
  {
    id: '2',
    name: 'DefiPulse',
    symbol: 'PULSE',
    description: 'Next-generation DeFi analytics and yield optimization',
    logoUrl: '/token-logos/pulse.png',
    launchDate: '2025-04-20',
    socialFollowers: 3800,
    category: 'DeFi',
    websiteUrl: 'https://defipulse.finance',
    twitterUrl: 'https://twitter.com/defipulse',
    discordUrl: 'https://discord.gg/defipulse'
  },
  {
    id: '3',
    name: 'MetaVerse Pioneers',
    symbol: 'MVP',
    description: 'Building the future of interactive digital experiences',
    logoUrl: '/token-logos/mvp.png',
    launchDate: '2025-04-25',
    socialFollowers: 5200,
    category: 'Metaverse',
    websiteUrl: 'https://mvpioneers.io',
    twitterUrl: 'https://twitter.com/mvpioneers',
    discordUrl: 'https://discord.gg/mvpioneers'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // In production, you would fetch from a database
      // For now, we'll return our initial data
      
      // Optional filtering by category
      const { category } = req.query;
      let launches = initialFeaturedLaunches;
      
      if (category && typeof category === 'string') {
        launches = launches.filter(
          launch => launch.category.toLowerCase() === category.toLowerCase()
        );
      }
      
      // Return the featured launches
      return res.status(200).json({
        success: true,
        launches
      });
    } catch (error) {
      console.error('Error fetching featured launches:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
