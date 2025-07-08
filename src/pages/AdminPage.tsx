import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';

const AdminPage = () => {
  return (
    <MainLayout userRole="admin">
      <AdminDashboard />
    </MainLayout>
  );
};

export default AdminPage;