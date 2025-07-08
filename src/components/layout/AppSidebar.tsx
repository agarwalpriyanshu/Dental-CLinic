import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  useSidebar 
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CalendarClock,
  User,
  LogOut,
  Stethoscope
} from 'lucide-react';

interface AppSidebarProps {
  userRole: 'admin' | 'patient';
  userName: string;
  onLogout: () => void;
}

const adminItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Patients', url: '/admin/patients', icon: Users },
  { title: 'Appointments', url: '/admin/appointments', icon: CalendarClock },
  { title: 'Calendar', url: '/admin/calendar', icon: Calendar },
];

const patientItems = [
  { title: 'My Profile', url: '/patient', icon: User },
  { title: 'Appointments', url: '/patient/appointments', icon: CalendarClock },
];

export const AppSidebar = ({ userRole, userName, onLogout }: AppSidebarProps) => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const items = userRole === 'admin' ? adminItems : patientItems;
  const isCollapsed = state === 'collapsed';
  
  const isActive = (path: string) => {
    if (path === '/admin' || path === '/patient') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h3 className="font-semibold text-sidebar-foreground truncate">Agarwal Dental Clinic</h3>
              <p className="text-xs text-muted-foreground truncate">Management System</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive: linkActive }) => 
                        `flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sidebar-foreground
                          ${isActive(item.url) 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'hover:bg-accent hover:text-accent-foreground'}
                        `
                      }
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 text-inherit" />
                      {!isCollapsed && <span className="font-medium text-inherit">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile & Logout */}
      <div className="p-4 border-t mt-auto">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3 mb-3'}`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} />
            <AvatarFallback>{userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="font-medium text-sm text-sidebar-foreground truncate">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size={isCollapsed ? "icon" : "sm"} 
          onClick={onLogout}
          className={`w-full ${isCollapsed ? 'px-0' : 'justify-start'} text-sidebar-foreground`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </Sidebar>
  );
};