import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/ui/layouts/DashboardLayout';
import { useUser } from "@clerk/clerk-react"
import type { JSX } from 'react';
import Camerafeed from './pages/camerafeed';
import Report from './pages/report';
import Roads from './pages/roads';
import Analytics from './pages/analytics';
import Signals from './pages/signals';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className='w-full h-screen flex justify-center items-center'>
        <span className='loader'></span>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path='/dashboard/cameraFeed' element={<Camerafeed />} />
        <Route path='/dashboard/reports' element={<Report />} />
        <Route path='/dashboard/roads' element={<Roads />} />
        <Route path='/dashboard/analytics' element={<Analytics />} />
      <Route path='/dashboard/signals' element={<Signals />} />
      </Route>
    </Routes>
  );
}

export default App;