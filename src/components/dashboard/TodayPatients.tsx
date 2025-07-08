import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Clock } from 'lucide-react';
import { useData } from '@/lib/DataProvider';

function isToday(dateStr: string) {
  const today = new Date();
  const date = new Date(dateStr);
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

export const TodayPatients = () => {
  const { incidents, patients } = useData();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Find today's appointments (Scheduled or Pending) for real patients only
  const todaysAppointments = incidents
    .filter(i => (i.status === 'Scheduled' || i.status === 'Pending') && isToday(i.appointmentDate))
    .filter(i => patients.some(p => p.id === i.patientId))
    .map(i => {
      const patient = patients.find(p => p.id === i.patientId);
      return {
        id: i.id,
        name: patient ? patient.name : i.patientId,
        time: i.appointmentDate.split('T')[1]?.slice(0,5) || '',
        treatment: i.title,
        status: i.status.toLowerCase(),
      };
    });

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Today's Patients
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {todaysAppointments.length === 0 ? (
            <div className="text-muted-foreground">No patients scheduled for today.</div>
          ) : (
            todaysAppointments.map((patient) => (
              <div 
                key={patient.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedPatient === patient.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'
                }`}
                onClick={() => setSelectedPatient(patient.id)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
                    <AvatarFallback>
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{patient.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {patient.time}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{patient.treatment}</p>
                    <Badge 
                      variant={
                        patient.status === 'completed' ? 'default' : 
                        patient.status === 'in-progress' ? 'secondary' : 
                        'outline'
                      }
                      className="text-xs"
                    >
                      {patient.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};