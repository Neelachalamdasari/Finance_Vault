import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import AdminDashboard from '../components/dashboards/AdminDashboard';
import AnalystDashboard from '../components/dashboards/AnalystDashboard';
import ViewerDashboard from '../components/dashboards/ViewerDashboard';

const DashboardPage = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="p-8 text-[#FDFFD4] bg-[#073737] min-h-[70vh]">
        Loading user data...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-[#FDFFD4] bg-[#073737] min-h-[70vh]">
        Could not load user data.
      </div>
    );
  }

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Analyst':
      return <AnalystDashboard />;
    case 'Viewer':
      return <ViewerDashboard />;
    default:
      return (
        <div className="p-8 text-[#FDFFD4] bg-[#073737] min-h-[70vh]">
          Unknown role: {user.role}. Expected Viewer, Analyst, or Admin.
        </div>
      );
  }
};

export default DashboardPage;
