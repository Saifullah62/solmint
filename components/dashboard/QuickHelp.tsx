'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  X, 
  ExternalLink, 
  BookOpen,
  MessageSquare,
  Video,
  Lightbulb
} from 'lucide-react';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  link: string;
}

export const QuickHelp = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const helpTopics: HelpTopic[] = [
    {
      id: '1',
      title: 'Getting Started Guide',
      description: 'Learn the basics of token management and dashboard features',
      icon: <BookOpen className="h-5 w-5 text-[#A35FEA]" />,
      link: '/docs/getting-started'
    },
    {
      id: '2',
      title: 'Community Building',
      description: 'Tips and strategies for growing your token community',
      icon: <MessageSquare className="h-5 w-5 text-[#2196F3]" />,
      link: '/docs/community-building'
    },
    {
      id: '3',
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides for using SOLMINT features',
      icon: <Video className="h-5 w-5 text-[#FF3D00]" />,
      link: '/tutorials'
    },
    {
      id: '4',
      title: 'Token Growth Tips',
      description: 'Best practices for marketing and promoting your token',
      icon: <Lightbulb className="h-5 w-5 text-[#FFD600]" />,
      link: '/docs/growth-tips'
    }
  ];
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-full bg-[#0E0E2C] border border-[#1A1A40] text-[#DADADA] hover:text-white hover:bg-[#1A1A40]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Help"
      >
        <HelpCircle className="h-5 w-5" />
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0E0E2C] border border-[#1A1A40] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-[#1A1A40] flex justify-between items-center">
            <h3 className="text-white font-medium">Quick Help</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]"
              onClick={() => setIsOpen(false)}
              aria-label="Close help"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3">
            <div className="space-y-3">
              {helpTopics.map(topic => (
                <a 
                  key={topic.id}
                  href={topic.link}
                  className="block p-3 rounded-lg border border-[#1A1A40] hover:bg-[#1A1A40] transition-colors"
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {topic.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white flex items-center">
                        {topic.title}
                        <ExternalLink className="h-3 w-3 ml-1 text-[#DADADA]" />
                      </h4>
                      <p className="text-xs text-[#DADADA] mt-1">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-[#8A2BE2]/10 border border-[#8A2BE2]/20">
              <h4 className="text-sm font-medium text-white mb-1">Need more help?</h4>
              <p className="text-xs text-[#DADADA] mb-3">
                Our support team is available 24/7 to assist you with any questions.
              </p>
              <Button 
                className="w-full bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white text-sm"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
