import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Calendar, Heart, FileText, Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useData } from '@/lib/DataProvider';

export const PatientDashboard = () => {
  const { currentUser, patients, incidents } = useData();
  const [expandedAppointment, setExpandedAppointment] = useState<string | null>(null);

  // Find the patient for the current user
  const patient = patients.find(p => p.id === currentUser?.patientId);
  const patientIncidents = incidents.filter(i => i.patientId === patient?.id);

  if (!patient) {
    return <div className="text-muted-foreground">No patient profile found.</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled':
      case 'Pending':
        return 'bg-warning text-warning-foreground';
      case 'Completed':
        return 'bg-success text-success-foreground';
      case 'Cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <User className="w-6 h-6" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${patient.name}`} />
              <AvatarFallback className="text-lg">
                {patient.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="text-lg font-semibold">{patient.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{currentUser?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{patient.contact}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="text-sm">{patient.dob}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Health Information</p>
                    <p className="text-sm text-muted-foreground">{patient.healthInfo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Card */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            My Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patientIncidents.length === 0 ? (
              <div className="text-muted-foreground">No appointments found.</div>
            ) : (
              patientIncidents.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{appointment.title}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{appointment.appointmentDate?.split('T')[0]}</span>
                        <span>{appointment.appointmentDate?.split('T')[1]?.slice(0,5)}</span>
                        <span>{appointment.treatment}</span>
                        <span className="font-medium text-foreground">{appointment.cost ? `$${appointment.cost}` : '-'}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedAppointment(
                        expandedAppointment === appointment.id ? null : appointment.id
                      )}
                    >
                      {expandedAppointment === appointment.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {expandedAppointment === appointment.id && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium mb-1">Description:</p>
                          <p className="text-sm text-muted-foreground">{appointment.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Comments:</p>
                          <p className="text-sm text-muted-foreground">{appointment.comments}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Files:</p>
                          {appointment.files.length === 0 ? (
                            <span className="text-xs text-muted-foreground">No files uploaded.</span>
                          ) : (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {appointment.files.map((file, idx) => (
                                <div key={idx} className="flex items-center space-x-2 bg-background p-2 rounded border">
                                  {file.url.startsWith('data:image') ? <Eye className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                  <span className="text-sm">{file.name}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6" type="button" onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = file.url;
                                    link.download = file.name;
                                    link.click();
                                  }}>
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};