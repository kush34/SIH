import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/ui/layouts/DashboardLayout';
import { useUser } from "@clerk/clerk-react"
import type { JSX } from 'react';
import Camerafeed from './pages/camerafeed';
import Report from './pages/report';
import Roads from './pages/roads';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user,isLoaded } = useUser();
  if(!isLoaded) return <div>loading...</div>
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
        <Route path='/dashboard/cameraFeed' element={<Camerafeed/>}/>
        <Route path='/dashboard/reports' element={<Report/>}/>
        <Route path='/dashboard/roads' element={<Roads/>}/>
      </Route>
    </Routes>
  );
}

export default App;