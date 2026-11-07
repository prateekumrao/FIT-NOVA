// Purpose: Centered card layout for Login, Register and Onboarding.
import { Link, Outlet } from 'react-router-dom';
import { motion } from 'motion/react';
import Logo from '../components/Logo';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center px-5 py-8">
      <Logo />
      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex w-full max-w-md flex-1 flex-col justify-center py-10">
        <Outlet />
      </motion.main>
      <p className="text-xs text-soft">Demo authentication only. <Link to="/privacy" className="underline">Privacy</Link> · <Link to="/terms" className="underline">Terms</Link></p>
    </div>
  );
}
