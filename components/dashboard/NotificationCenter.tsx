'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  Clock,
  ChevronRight
} from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'success' | 'warning' | 'info' | 'alert';
  read: boolean;
}

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock data - would be replaced with real data from API
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Token Launch Successful',
      message: 'Your SDEMO token has been successfully launched on Solana mainnet.',
      timestamp: '2025-03-30T15:30:00Z',
      type: 'success',
      read: false
    },
    {
      id: '2',
      title: 'New Holders Milestone',
      message: 'Congratulations! Your token now has over 1,000 holders.',
      timestamp: '2025-03-29T10:15:00Z',
      type: 'info',
      read: false
    },
    {
      id: '3',
      title: 'Upcoming AMA Reminder',
      message: 'Your scheduled AMA session is starting in 24 hours. Make sure you\'re prepared!',
      timestamp: '2025-03-28T09:00:00Z',
      type: 'alert',
      read: true
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const deleteNotification = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-[#00FFA3]" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-[#FFD600]" />;
      case 'info':
        return <Info className="h-5 w-5 text-[#2196F3]" />;
      case 'alert':
        return <Clock className="h-5 w-5 text-[#A35FEA]" />;
      default:
        return <Info className="h-5 w-5 text-[#DADADA]" />;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    }
  };
  
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative h-10 w-10 rounded-full bg-[#0E0E2C] border border-[#1A1A40] text-[#DADADA] hover:text-white hover:bg-[#1A1A40]"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-[#8A2BE2] text-[10px] flex items-center justify-center text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>
      
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0E0E2C] border border-[#1A1A40] rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-[#1A1A40] flex justify-between items-center">
            <h3 className="text-white font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#A35FEA] hover:text-[#8A2BE2] hover:bg-transparent"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-[#1A1A40]">
                {notifications.map((notification, index) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 hover:bg-[#1A1A40] transition-colors ${!notification.read ? 'bg-[#1A1A40]/50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-[#DADADA] hover:text-white hover:bg-[#0E0E2C]"
                              onClick={() => deleteNotification(notification.id)}
                              aria-label="Delete notification"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-[#DADADA] mt-1 mb-2">{notification.message}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-[#DADADA]">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs text-[#A35FEA] hover:text-[#8A2BE2] hover:bg-transparent p-0 h-auto"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-[#1A1A40] flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-[#DADADA]" />
                </div>
                <h4 className="text-white font-medium mb-1">No notifications</h4>
                <p className="text-[#DADADA] text-sm">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-[#1A1A40]">
            <Button 
              variant="ghost"
              className="w-full justify-between text-[#DADADA] hover:text-white hover:bg-[#1A1A40] text-sm"
            >
              View all notifications
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
