import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, DollarSign, FileText, Image, Download, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useData } from '@/lib/DataProvider';

const PatientAppointmentsPage = () => {
  const { incidents, currentUser } = useData();
  const [openRows, setOpenRows] = useState<string[]>([]);

  if (!currentUser || !currentUser.patientId) {
    return (
      <MainLayout userRole="patient">
        <div className="text-muted-foreground p-8 text-center text-lg">No patient profile found. Please log in again.</div>
      </MainLayout>
    );
  }

  // Filter incidents for this patient
  const patientIncidents = incidents.filter(i => i.patientId === currentUser.patientId);

  // Sort by date descending
  const sortedIncidents = [...patientIncidents].sort((a, b) => (b.appointmentDate.localeCompare(a.appointmentDate)));

  const upcomingAppointments = sortedIncidents.filter(apt => apt.status === 'Scheduled' || apt.status === 'Pending');
  const pastAppointments = sortedIncidents.filter(apt => apt.status === 'Completed' || apt.status === 'Cancelled');

  const toggleRow = (id: string) => {
    setOpenRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-success text-success-foreground';
      case 'Scheduled': return 'bg-primary text-primary-foreground';
      case 'Pending': return 'bg-warning text-warning-foreground';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  // File download handler
  const handleDownload = (file: { name: string; url: string }) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    link.click();
  };

  return (
    <MainLayout userRole="patient">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
            <p className="text-muted-foreground">View your upcoming and past dental appointments</p>
          </div>
          {/* Optionally: <Button className="bg-gradient-primary text-white shadow-hover"><Plus className="w-4 h-4 mr-2" />Request Appointment</Button> */}
        </div>

        {/* Upcoming Appointments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>Upcoming Appointments</span>
              <Badge variant="secondary">{upcomingAppointments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <Collapsible>
                      <CollapsibleTrigger 
                        className="w-full"
                        onClick={() => toggleRow(appointment.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-4">
                            {openRows.includes(appointment.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                            <div className="text-left">
                              <h3 className="font-semibold">{appointment.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <CalendarDays className="h-4 w-4" />
                                  <span>{appointment.appointmentDate?.split('T')[0]}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{appointment.appointmentDate?.split('T')[1]?.slice(0,5)}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <span className="font-semibold">{appointment.cost ? `$${appointment.cost}` : '-'}</span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Treatment Details</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Treatment:</strong> {appointment.treatment}</div>
                              <div><strong>Description:</strong> {appointment.description}</div>
                              {appointment.comments && (
                                <div><strong>Notes:</strong> {appointment.comments}</div>
                              )}
                            </div>
                          </div>
                          {appointment.files.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Attached Files</h4>
                              <div className="space-y-2">
                                {appointment.files.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded border">
                                    <div className="flex items-center space-x-2">
                                      {file.url.startsWith('data:image') ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDownload(file)}>
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No upcoming appointments.</div>
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Past Appointments</span>
              <Badge variant="secondary">{pastAppointments.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pastAppointments.length > 0 ? (
              <div className="space-y-4">
                {pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4">
                    <Collapsible>
                      <CollapsibleTrigger 
                        className="w-full"
                        onClick={() => toggleRow(appointment.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-4">
                            {openRows.includes(appointment.id) ? 
                              <ChevronDown className="h-4 w-4" /> : 
                              <ChevronRight className="h-4 w-4" />
                            }
                            <div className="text-left">
                              <h3 className="font-semibold">{appointment.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <span className="flex items-center space-x-1">
                                  <CalendarDays className="h-4 w-4" />
                                  <span>{appointment.appointmentDate?.split('T')[0]}</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{appointment.appointmentDate?.split('T')[1]?.slice(0,5)}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Badge className={getStatusColor(appointment.status)}>
                              {appointment.status}
                            </Badge>
                            <span className="font-semibold">{appointment.cost ? `$${appointment.cost}` : '-'}</span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Treatment Details</h4>
                            <div className="space-y-2 text-sm">
                              <div><strong>Treatment:</strong> {appointment.treatment}</div>
                              <div><strong>Description:</strong> {appointment.description}</div>
                              {appointment.comments && (
                                <div><strong>Notes:</strong> {appointment.comments}</div>
                              )}
                            </div>
                          </div>
                          {appointment.files.length > 0 && (
                            <div>
                              <h4 className="font-semibold mb-2">Attached Files</h4>
                              <div className="space-y-2">
                                {appointment.files.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded border">
                                    <div className="flex items-center space-x-2">
                                      {file.url.startsWith('data:image') ? <Image className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                                      <span className="text-sm">{file.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleDownload(file)}>
                                      <Download className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No past appointments.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PatientAppointmentsPage;