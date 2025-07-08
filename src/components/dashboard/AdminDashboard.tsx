import React from 'react';
import { KPICard } from './KPICard';
import { AppointmentsChart } from './AppointmentsChart';
import { NextAppointments } from './NextAppointments';
import { TodayPatients } from './TodayPatients';
import { DentistNotes } from './DentistNotes';
import { UpcomingAppointment } from './UpcomingAppointment';
import { 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Users,
} from 'lucide-react';
import { useData } from '@/lib/DataProvider';

export const AdminDashboard = () => {
  const { incidents, patients } = useData();
  // Next 10 appointments (by date ascending, not completed/cancelled)
  const nextAppointments = incidents
    .filter(i => i.status === 'Scheduled' || i.status === 'Pending')
    .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate))
    .slice(0, 10)
    .map(i => {
      const patient = patients.find(p => p.id === i.patientId);
      return {
        id: i.id,
        patient: patient ? patient.name : i.patientId,
        time: i.appointmentDate.split('T')[1]?.slice(0,5) || '',
        date: i.appointmentDate.split('T')[0],
        treatment: i.title,
        status: i.status === 'Scheduled' ? 'confirmed' : 'pending',
      };
    });

  // KPIs
  const pendingTreatments = incidents.filter(i => i.status === 'Pending' || i.status === 'Scheduled').length;
  const completedTreatments = incidents.filter(i => i.status === 'Completed').length;
  const totalRevenue = incidents.reduce((sum, i) => sum + (i.cost || 0), 0);
  // Top patients by number of completed treatments
  const patientTreatmentCounts: Record<string, number> = {};
  incidents.forEach(i => {
    if (i.status === 'Completed') {
      patientTreatmentCounts[i.patientId] = (patientTreatmentCounts[i.patientId] || 0) + 1;
    }
  });
  const topPatients = Object.entries(patientTreatmentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([pid]) => patients.find(p => p.id === pid)?.name || pid)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      {/* KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Pending Treatments"
          value={pendingTreatments}
          icon={Clock}
          trend={undefined}
          variant="warning"
        />
        <KPICard 
          title="Completed Treatments"
          value={completedTreatments}
          icon={CheckCircle}
          trend={undefined}
          variant="success"
        />
        <KPICard 
          title="Total Revenue"
          value={`$${totalRevenue}`}
          icon={DollarSign}
          trend={undefined}
          variant="accent"
        />
        <KPICard 
          title="Top Patients"
          value={topPatients || 'N/A'}
          icon={Users}
          variant="default"
        />
      </div>

      {/* Charts and Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsChart />
        <NextAppointments appointments={nextAppointments} />
      </div>

      {/* Main Content Grid: 3 columns, each card fills a column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="min-w-0">
          <TodayPatients />
        </div>
        <div className="min-w-0">
          <UpcomingAppointment />
        </div>
        <div className="min-w-0">
          <DentistNotes />
        </div>
      </div>
    </div>
  );
};