// ========================================
// App.tsx
// Purpose: Route table. Public pages use MarketingLayout, auth pages use AuthLayout,
// and private pages sit under /app with the sidebar layout behind ProtectedRoute.
// ========================================
import { Navigate, Route, Routes } from 'react-router-dom';
import MarketingLayout from './layouts/MarketingLayout';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './layouts/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Coach from './pages/Coach';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import ActivityTracker from './pages/ActivityTracker';
import Habits from './pages/Habits';
import Reports from './pages/Reports';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Legal kind="privacy" />} />
        <Route path="/terms" element={<Legal kind="terms" />} />
      </Route>

      {/* Login / register */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Onboarding needs a user but not a finished setup */}
        <Route element={<ProtectedRoute requireOnboarded={false} />}>
          <Route path="/onboarding" element={<Onboarding />} />
        </Route>
      </Route>

      {/* Private app */}
      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="coach" element={<Coach />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="activity" element={<ActivityTracker />} />
          <Route path="habits" element={<Habits />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
