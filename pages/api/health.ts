import { NextApiRequest, NextApiResponse } from 'next';
import { Connection } from '@solana/web3.js';
import { useAppStore } from '@/store/useAppStore';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the current network from the query or default to devnet
    const { network = 'devnet' } = req.query;
    const networkStr = Array.isArray(network) ? network[0] : network;
    
    // Check Solana RPC connection
    const endpoint = networkStr === 'mainnet-beta' 
      ? process.env.MAINNET_RPC_URL || 'https://api.mainnet-beta.solana.com' 
      : process.env.DEVNET_RPC_URL || 'https://api.devnet.solana.com';
    
    const connection = new Connection(endpoint);
    let solanaRpcStatus = 'connected';
    
    try {
      // Try to get the latest blockhash to verify connection
      await connection.getLatestBlockhash();
    } catch (error) {
      console.error('Solana RPC connection error:', error);
      solanaRpcStatus = 'disconnected';
    }
    
    // Check database health (in a real implementation, this would check your actual database)
    let databaseStatus = 'healthy';
    
    // For now, we'll assume the database is healthy
    // In a production environment, you would implement an actual check:
    // try {
    //   await db.ping();
    // } catch (error) {
    //   console.error('Database connection error:', error);
    //   databaseStatus = 'unhealthy';
    // }
    
    // Return the health status
    return res.status(200).json({
      timestamp: new Date().toISOString(),
      api: 'operational',
      solanaRpc: solanaRpcStatus,
      database: databaseStatus,
      network: networkStr
    });
  } catch (error) {
    console.error('Error in health API:', error);
    
    // Even in case of error, return a structured response
    return res.status(500).json({
      timestamp: new Date().toISOString(),
      api: 'degraded',
      solanaRpc: 'unknown',
      database: 'unknown',
      error: 'Internal server error'
    });
  }
}
