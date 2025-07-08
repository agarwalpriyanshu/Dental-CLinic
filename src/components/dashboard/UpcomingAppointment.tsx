import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Calendar } from 'lucide-react';
import { useData } from '@/lib/DataProvider';

export const UpcomingAppointment = () => {
  const { patients, incidents } = useData();
  const upcoming = incidents
    .filter(i => i.status === 'Scheduled' || i.status === 'Pending')
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))[0];

  if (!upcoming) {
    return (
      <Card className="shadow-card border-primary/20 bg-primary/5 h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">No upcoming appointments.</div>
        </CardContent>
      </Card>
    );
  }

  const patient = patients.find(p => p.id === upcoming.patientId);
  const patientName = patient ? patient.name : upcoming.patientId;

  return (
    <Card className="shadow-card border-primary/20 bg-primary/5 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Upcoming
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patientName}`} />
            <AvatarFallback>
              {patientName.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{patientName}</p>
            <p className="text-xs text-muted-foreground">{upcoming.title}</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{upcoming.appointmentDate.replace('T', ', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{upcoming.treatment || upcoming.title}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="default">
            {upcoming.status}
          </Badge>
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};