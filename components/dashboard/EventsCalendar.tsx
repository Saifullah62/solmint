'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Megaphone,
  Rocket
} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'announcement' | 'airdrop' | 'ama' | 'launch';
  description: string;
}

export const EventsCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  
  // Mock data - would be replaced with real data from API
  const events: Event[] = [
    {
      id: '1',
      title: 'Token Utility Announcement',
      date: '2025-04-05',
      time: '14:00',
      type: 'announcement',
      description: 'Announcing new utility features for token holders'
    },
    {
      id: '2',
      title: 'Community AMA Session',
      date: '2025-04-12',
      time: '18:00',
      type: 'ama',
      description: 'Live AMA with the founding team'
    },
    {
      id: '3',
      title: 'Holder Airdrop',
      date: '2025-04-20',
      time: '10:00',
      type: 'airdrop',
      description: 'Special airdrop for early supporters'
    }
  ];
  
  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'announcement':
        return <Megaphone className="h-4 w-4 text-[#2196F3]" />;
      case 'airdrop':
        return <Bell className="h-4 w-4 text-[#FFD600]" />;
      case 'ama':
        return <Calendar className="h-4 w-4 text-[#A35FEA]" />;
      case 'launch':
        return <Rocket className="h-4 w-4 text-[#00FFA3]" />;
      default:
        return <Calendar className="h-4 w-4 text-[#DADADA]" />;
    }
  };
  
  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'announcement':
        return 'bg-[#2196F3]/10 text-[#2196F3] border-[#2196F3]/20';
      case 'airdrop':
        return 'bg-[#FFD600]/10 text-[#FFD600] border-[#FFD600]/20';
      case 'ama':
        return 'bg-[#A35FEA]/10 text-[#A35FEA] border-[#A35FEA]/20';
      case 'launch':
        return 'bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/20';
      default:
        return 'bg-[#DADADA]/10 text-[#DADADA] border-[#DADADA]/20';
    }
  };
  
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const formatEventTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
  };
  
  return (
    <div className="bg-[#1A1A40] border border-[#1A1A40] rounded-xl overflow-hidden">
      <div className="p-5 border-b border-[#0E0E2C] flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white font-['Sora']">Events & Announcements</h3>
          <p className="text-[#DADADA] text-sm mt-1">
            Schedule and manage your token events
          </p>
        </div>
        <Button className="bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </div>
      
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-1">
            <div className="bg-[#0E0E2C] rounded-lg p-4 border border-[#1A1A40]">
              <div className="flex justify-between items-center mb-4">
                <button 
                  className="text-[#DADADA] hover:text-white p-1 rounded-full hover:bg-[#1A1A40]"
                  onClick={prevMonth}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h4 className="text-white font-medium">
                  {getMonthName(currentMonth)} {currentYear}
                </h4>
                <button 
                  className="text-[#DADADA] hover:text-white p-1 rounded-full hover:bg-[#1A1A40]"
                  onClick={nextMonth}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div key={index} className="text-[#DADADA] text-xs py-1">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, index) => {
                  const day = index + 1;
                  const hasEvent = events.some(event => {
                    const eventDate = new Date(event.date);
                    return eventDate.getDate() === day && 
                           eventDate.getMonth() === currentMonth && 
                           eventDate.getFullYear() === currentYear;
                  });
                  
                  return (
                    <div 
                      key={index}
                      className={`h-8 flex items-center justify-center rounded-full text-sm ${
                        day === new Date().getDate() && 
                        currentMonth === new Date().getMonth() && 
                        currentYear === new Date().getFullYear()
                          ? 'bg-[#8A2BE2] text-white'
                          : hasEvent
                            ? 'bg-[#8A2BE2]/10 text-white'
                            : 'text-[#DADADA] hover:bg-[#1A1A40] hover:text-white'
                      } cursor-pointer transition-colors`}
                    >
                      {day <= 31 ? day : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-white font-medium">Upcoming Events</h4>
              <div className="text-[#DADADA] text-sm flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Timezone: UTC-04:00</span>
              </div>
            </div>
            
            <div className="space-y-3">
              {events.map(event => (
                <div 
                  key={event.id}
                  className={`rounded-lg p-4 border ${getEventTypeColor(event.type)}`}
                >
                  <div className="flex items-start">
                    <div className="mr-4">
                      <div className="text-center">
                        <div className="text-xs uppercase font-medium">
                          {formatEventDate(event.date).split(' ')[0]}
                        </div>
                        <div className="text-2xl font-bold font-['Sora']">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-xs">
                          {formatEventDate(event.date).split(' ')[1]}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        {getEventTypeIcon(event.type)}
                        <span className="text-xs uppercase ml-2 font-medium">
                          {event.type}
                        </span>
                      </div>
                      <h5 className="text-white font-medium mb-1">{event.title}</h5>
                      <p className="text-[#DADADA] text-sm mb-2">{event.description}</p>
                      <div className="flex items-center text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatEventTime(event.time)}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs bg-[#1A1A40] text-white hover:bg-[#0E0E2C] rounded-md px-3"
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 text-xs bg-[#1A1A40] text-white hover:bg-[#0E0E2C] rounded-md px-3"
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="bg-[#0E0E2C] rounded-lg p-6 border border-[#1A1A40] text-center">
                  <div className="w-12 h-12 rounded-full bg-[#8A2BE2]/10 flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-[#8A2BE2]" />
                  </div>
                  <h5 className="text-white font-medium mb-2">No upcoming events</h5>
                  <p className="text-[#DADADA] text-sm mb-4">
                    Schedule your first token event to keep your community engaged
                  </p>
                  <Button className="bg-[#8A2BE2] hover:bg-[#6A1CB0] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Event
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
