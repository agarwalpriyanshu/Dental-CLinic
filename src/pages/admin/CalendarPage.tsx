import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { useData } from '@/lib/DataProvider';

const CalendarPage = () => {
  const { incidents, patients } = useData();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Only use real incidents (those with a real patient)
  const realIncidents = incidents.filter(i => patients.some(p => p.id === i.patientId));
  // Get all appointment dates for calendar highlights
  const getDaysWithAppointments = () => {
    return realIncidents.map(i => new Date(i.appointmentDate));
  };
  // Get appointments for a selected date
  const getAppointmentsForDate = (date: Date) => {
    // Use local date string for robust comparison
    const selectedDateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD
    return realIncidents
      .filter(i => {
        const incidentDate = new Date(i.appointmentDate);
        const incidentDateStr = incidentDate.toLocaleDateString('en-CA');
        return incidentDateStr === selectedDateStr;
      })
      .map(i => {
        const patient = patients.find(p => p.id === i.patientId);
        return {
          time: i.appointmentDate.split('T')[1]?.slice(0,5) || '',
          patient: patient ? patient.name : i.patientId,
          treatment: i.title,
          status: i.status,
        };
      });
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

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  // Today's date string (YYYY-MM-DD)
  const todayStr = new Date().toISOString().split('T')[0];
  // Today's appointments
  const todaysAppointments = realIncidents.filter(i => i.appointmentDate.split('T')[0] === todayStr);
  const total = todaysAppointments.length;
  const completed = todaysAppointments.filter(i => i.status === 'Completed').length;
  const upcoming = todaysAppointments.filter(i => i.status === 'Scheduled' || i.status === 'Pending').length;
  const cancelled = todaysAppointments.filter(i => i.status === 'Cancelled').length;

  return (
    <MainLayout userRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground">View and manage your appointment schedule</p>
          </div>
          <Button className="bg-gradient-primary text-white shadow-hover">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                modifiers={{
                  hasAppointments: getDaysWithAppointments()
                }}
                modifiersClassNames={{
                  hasAppointments: "bg-primary/20 text-primary font-semibold"
                }}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Selected Date Appointments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateAppointments.map((appointment, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium">{appointment.time}</div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.patient}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {appointment.treatment}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No appointments scheduled for this date</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Appointment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Today's Schedule Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">{total}</div>
                <div className="text-sm text-muted-foreground">Total Appointments</div>
              </div>
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">{completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">{upcoming}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">{cancelled}</div>
                <div className="text-sm text-muted-foreground">Cancelled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;