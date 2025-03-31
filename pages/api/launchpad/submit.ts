import { NextApiRequest, NextApiResponse } from 'next';
import { LaunchFormData } from '@/components/launchpad/LaunchForm';

// In a production environment, you would connect to a database here
// This is a simplified example for demonstration purposes

type LaunchSubmission = LaunchFormData & {
  packageType: string;
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  logoUrl?: string;
};

// In-memory storage for development/testing
// In production, this would be replaced with a database
let submissions: LaunchSubmission[] = [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const formData = req.body as LaunchFormData & { packageType: string };
      
      // Validate required fields
      if (!formData.tokenName || !formData.tokenSymbol || !formData.tokenSupply) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Process file upload in production
      // For now, we'll just simulate it
      let logoUrl: string | undefined = undefined;
      
      if (formData.logoFile) {
        // In production, you would upload the file to a storage service
        // and get back a URL
        logoUrl = `/token-logos/${formData.tokenSymbol.toLowerCase()}.png`;
      }
      
      // Create a new submission
      const newSubmission: LaunchSubmission = {
        ...formData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        logoUrl
      };
      
      // Save to database (simulated here)
      submissions.push(newSubmission);
      
      // Return success
      return res.status(200).json({
        success: true,
        message: 'Launch submitted successfully',
        submission: newSubmission
      });
    } catch (error) {
      console.error('Error processing launch submission:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    // This would be used to get a list of submissions or a specific submission
    // For example, to populate the featured launches section
    
    // Get a specific submission by ID
    const { id } = req.query;
    if (id) {
      const submission = submissions.find(s => s.id === id);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      return res.status(200).json(submission);
    }
    
    // Return all submissions (in production, you'd add pagination, filtering, etc.)
    return res.status(200).json(submissions);
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
