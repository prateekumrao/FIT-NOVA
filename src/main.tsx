// ========================================
// main.tsx
// Purpose: App entry point. Wraps <App /> with the router and the shared providers.
// MotionConfig reducedMotion="user" turns animations off for people who asked for that in their OS.
// ========================================
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { TrackerProvider } from './context/TrackerContext';
import { NotificationsProvider } from './context/NotificationsContext';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <AuthProvider>
            <TrackerProvider>
              <NotificationsProvider>
                <App />
              </NotificationsProvider>
            </TrackerProvider>
          </AuthProvider>
        </ToastProvider>
      </MotionConfig>
    </BrowserRouter>
  </StrictMode>,
);
