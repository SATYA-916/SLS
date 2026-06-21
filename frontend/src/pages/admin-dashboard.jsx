import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { LogOut, Mail, Phone, Building2, RefreshCw, Home, Copy, Check } from 'lucide-react';
import { getAdminContacts, adminLogout } from '@/lib/api';

export default function AdminDashboard() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [copied, setCopied] = useState(false);
  const [, navigate] = useLocation();

  function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function fetchContacts() {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
        navigate('/admin');
        return;
      }
      setError('Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await adminLogout();
    navigate('/admin');
  }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-base font-bold">SLS Admin Dashboard</h1>
          <p className="text-white/40 text-xs">Contact form submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-white/50 hover:text-white text-sm transition-colors">
            <Home className="w-4 h-4" /> Home
          </Link>
          <span className="text-white/20">|</span>
          <span className="text-white/50 text-xs">{contacts.length} total</span>
          <button
            onClick={fetchContacts}
            className="p-2 text-white/50 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white overflow-y-auto shrink-0">
          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">Loading…</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500 text-sm">{error}</div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No submissions yet.</div>
          ) : (
            contacts.map((c) => (
              <button
                key={c._id}
                onClick={() => setSelected(c)}
                className={`w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                  selected?._id === c._id ? 'bg-blue-50 border-l-2 border-l-[#0a1628]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-sm text-[#0a1628] truncate">{c.name}</span>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-2">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{c.email}</p>
                {c.service && (
                  <span className="inline-block mt-1 text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5">
                    {c.service}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {!selected ? (
            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
              Select a submission to view details
            </div>
          ) : (
            <div className="max-w-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0a1628]">{selected.name}</h2>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(selected.createdAt).toLocaleString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyEmail(selected.email)}
                    className="flex items-center gap-2 border border-gray-300 text-gray-600 px-3 py-2 text-sm hover:bg-gray-50 transition-colors"
                    title="Copy email address"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Email'}
                  </button>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent(`Re: Your Enquiry — SLS Consultants`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-[#0a1628] text-white px-4 py-2 text-sm font-semibold hover:bg-[#0a1628]/90 transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Reply via Gmail
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {[
                  { icon: <Mail className="w-3.5 h-3.5 text-gray-400" />, label: 'Email', value: selected.email },
                  { icon: <Phone className="w-3.5 h-3.5 text-gray-400" />, label: 'Phone', value: selected.phone || '—' },
                  { icon: <Building2 className="w-3.5 h-3.5 text-gray-400" />, label: 'Company', value: selected.company || '—' },
                  { icon: null, label: 'Service Interested', value: selected.service || '—' },
                ].map((item) => (
                  <div key={item.label} className="bg-white border border-gray-200 p-4">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-1">{item.label}</p>
                    <p className="text-sm text-[#0a1628] font-medium flex items-center gap-2">
                      {item.icon} {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 p-5">
                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">Message</p>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
