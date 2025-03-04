import React from 'react';
import Layout from './layout/Layout';
import DashboardContent from './DashboardContent';
import Chat from './Chat';

const AdminDashboard = () => {
  return (
    <>
      <Layout activeMenu="dashboard">
        <DashboardContent />
      </Layout>
      <Chat />
    </>
  );
};

export default AdminDashboard;