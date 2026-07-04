import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft, ShieldAlert, Lock, ShieldCheck } from 'lucide-react';
import { adminLogin, adminForgotPassword } from '@/lib/api';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid password');
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);
    try {
      const res = await adminForgotPassword(email);
      setSuccessMessage(res.message || 'Recovery email sent if the address matches our records.');
      setEmail('');
    } catch (err) {
      setError(err.message || 'Failed to request password recovery.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col relative overflow-hidden">
      {/* Blueprint background grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="admin_grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#admin_grid)" />
        </svg>
      </div>

      <div className="px-6 py-4 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-950/40 border border-red-500/30 flex items-center justify-center rounded-full">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">RESTRICTED CAD DATABASE</h1>
            <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider mt-2 inline-flex items-center gap-1.5 bg-red-950/20 py-1 px-2.5 border border-red-500/10 rounded-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Security Audit Protocol Active
            </p>
          </div>

          {isForgotPassword ? (
            <form onSubmit={handleForgotSubmit} className="bg-white p-8 shadow-2xl border border-gray-100 rounded-sm">
              <div className="bg-red-50 border-l-2 border-red-600 p-3 mb-5 text-[11px] text-red-800 leading-relaxed text-left">
                <span className="font-bold uppercase tracking-wider block mb-0.5 text-[10px]">Restricted Recovery Portal</span>
                Credentials reset requires security audit authentication. Link will be sent only to verified administrators.
              </div>

              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 text-left">
                Recovery Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] mb-4"
                placeholder="Enter admin recovery email"
                required
                autoComplete="email"
              />
              {error && (
                <p className="text-red-600 text-xs mb-4 bg-red-50 border border-red-200 px-3 py-2">
                  {error}
                </p>
              )}
              {successMessage && (
                <p className="text-green-700 text-xs mb-4 bg-green-50 border border-green-200 px-3 py-2">
                  {successMessage}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a1628] text-white py-3 text-sm font-semibold hover:bg-[#0a1628]/90 transition-colors disabled:opacity-50 mb-4"
              >
                {loading ? 'Sending…' : 'Send Recovery Email'}
              </button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-blue-700 hover:underline font-semibold"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white p-8 shadow-2xl border border-gray-100 rounded-sm">
              <div className="bg-red-50 border-l-2 border-red-600 p-3 mb-5 text-[11px] text-red-800 leading-relaxed text-left">
                <span className="font-bold uppercase tracking-wider block mb-0.5 text-[10px]">Authorized Administrators Only</span>
                This server hosts proprietary engineering drawings & customer records. All access requests are tracked.
              </div>

              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 text-left">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-[#0a1628] mb-4"
                placeholder="Enter admin password"
                required
                autoComplete="current-password"
              />
              {error && (
                <p className="text-red-600 text-xs mb-4 bg-red-50 border border-red-200 px-3 py-2">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a1628] text-white py-3 text-sm font-semibold hover:bg-[#0a1628]/90 transition-colors disabled:opacity-50 mb-4"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-blue-700 hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[9px] font-bold uppercase text-gray-400 tracking-wider">
                <span className="flex items-center gap-1 text-gray-500"><Lock className="w-3.5 h-3.5 text-green-600 shrink-0" /> AES-256 Vault</span>
                <span className="flex items-center gap-1 text-gray-500"><ShieldCheck className="w-3.5 h-3.5 text-green-600 shrink-0" /> SSL Certified</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
