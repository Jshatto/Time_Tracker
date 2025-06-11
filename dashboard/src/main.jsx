import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import DashboardChart from './DashboardChart';
import LogViewer from './LogViewer';

// Complete dashboard component that includes all sections
function Dashboard() {
  return (
    <>
      <App />
      <DashboardChart />
      <LogViewer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);