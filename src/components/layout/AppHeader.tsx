import React from 'react';
import { Search, Bell } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';

interface AppHeaderProps {
  userName: string;
  userRole: 'admin' | 'patient';
  searchPlaceholder: string;
}

export const AppHeader = ({ userName, userRole, searchPlaceholder }: AppHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side - Sidebar trigger and search */}
        <div className="flex items-center space-x-4 flex-1">
          <SidebarTrigger />
          
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Right side - Greeting and user avatar */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">
              {getGreeting()}, {userName.split(' ')[0]}!
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole === 'admin' ? 'Dentist' : 'Patient'}
            </p>
          </div>

          <ModeToggle />

          <Avatar className="h-9 w-9">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
            <AvatarFallback>
              {userName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};