import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PatientDashboard } from '@/components/patient/PatientDashboard';

const PatientPage = () => {
  return (
    <MainLayout userRole="patient">
      <PatientDashboard />
    </MainLayout>
  );
};

export default PatientPage;