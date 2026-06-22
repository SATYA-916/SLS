import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';
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
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      <div className="px-6 py-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Website
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">SLS Admin</h1>
            <p className="text-white/40 text-sm mt-1">Contact form submissions</p>
          </div>

          {isForgotPassword ? (
            <form onSubmit={handleForgotSubmit} className="bg-white p-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
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
            <form onSubmit={handleSubmit} className="bg-white p-8">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
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
              <div className="text-center">
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
