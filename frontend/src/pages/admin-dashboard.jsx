import { Link, useLocation } from 'wouter';
import { Home, LogOut } from 'lucide-react';
import { adminLogout } from '@/lib/api';

export default function AdminDashboard() {
  const [, navigate] = useLocation();

  async function handleLogout() {
    await adminLogout();
    navigate('/admin');
  }

  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col">
      {/* ── Header ── */}
      <header className="bg-[#060c18] border-b border-white/10 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-wide uppercase text-white">SLS Admin Portal</h1>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">Restricted Operations Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors">
            <Home className="w-3.5 h-3.5" /> Back to Site
          </Link>
          <span className="text-white/20">|</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* ── Empty State ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-white/30 px-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-white/10 flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-wider mb-2">Dashboard Empty</h2>
          <p className="text-xs text-white/20 max-w-xs">
            All inquiries and drawing revision tracking panels have been removed.
          </p>
        </div>
      </div>
    </div>
  );
}
