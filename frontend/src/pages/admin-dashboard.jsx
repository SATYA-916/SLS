import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LogOut, Mail, Inbox, Calendar, Clock, RefreshCw, Home,
  Search, X, Tag, Download, Trash2
} from 'lucide-react';
import {
  getAdminContacts, adminLogout, updateContactStatus,
  addContactNote, deleteContactNote, getCSVExportUrl, deleteContact
} from '@/lib/api';

const STATUS_CONFIG = {
  new:     { label: 'New',     color: 'bg-blue-100 text-blue-700 border-blue-200' },
  replied: { label: 'Replied', color: 'bg-green-100 text-green-700 border-green-200' },
  closed:  { label: 'Closed',  color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

function isRecent(dateStr) {
  return Date.now() - new Date(dateStr).getTime() < 48 * 60 * 60 * 1000;
}

export default function AdminDashboard() {
  const [contacts, setContacts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [noteText, setNoteText]   = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [, navigate] = useLocation();

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

  async function handleSetStatus(id, newStatus) {
    try {
      const updated = await updateContactStatus(id, newStatus);
      setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));
      if (selected?._id === id) {
        setSelected(updated);
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    try {
      const updated = await addContactNote(selected._id, noteText);
      setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));
      setSelected(updated);
      setNoteText('');
    } catch (err) {
      alert('Failed to add note.');
    } finally {
      setSubmittingNote(false);
    }
  }

  async function handleDeleteNote(noteId) {
    if (!confirm('Are you sure you want to delete this note?')) return;
    try {
      const updated = await deleteContactNote(selected._id, noteId);
      setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));
      setSelected(updated);
    } catch (err) {
      alert('Failed to delete note.');
    }
  }

  async function handleDeleteContact(id) {
    if (!confirm('Permanently delete this inquiry? This cannot be undone.')) return;
    try {
      await deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(contacts.find(c => c._id !== id) || null);
    } catch (err) {
      alert('Failed to delete contact.');
    }
  }

  useEffect(() => { fetchContacts(); }, []);

  // Stats
  const stats = useMemo(() => {
    const thisMonth = contacts.filter(c =>
      new Date(c.createdAt).getMonth() === new Date().getMonth() &&
      new Date(c.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const awaiting = contacts.filter(c => (c.status || 'new') === 'new').length;
    return { total: contacts.length, thisMonth, awaiting };
  }, [contacts]);

  // Filtered list
  const filtered = useMemo(() => {
    return contacts.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.service?.toLowerCase().includes(q) ||
        c.company?.toLowerCase().includes(q);
      const matchStatus = filterStatus === 'all' || (c.status || 'new') === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [contacts, search, filterStatus]);

  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col">

      {/* ── Header ── */}
      <header className="bg-[#060c18] border-b border-white/10 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-wide uppercase text-white">SLS Admin — Inquiries Vault</h1>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">Restricted Operations Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-white text-xs transition-colors">
            <Home className="w-3.5 h-3.5" /> Back to Site
          </Link>
          <span className="text-white/20">|</span>
          <button onClick={fetchContacts} className="p-1.5 text-white/40 hover:text-white transition-colors" title="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/40 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      {/* ── Stats Bar ── */}
      <div className="bg-[#07111f] border-b border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-8">
          {[
            { icon: <Inbox className="w-3.5 h-3.5" />, label: 'Total Inquiries', value: stats.total },
            { icon: <Calendar className="w-3.5 h-3.5" />, label: 'This Month',  value: stats.thisMonth },
            { icon: <Clock className="w-3.5 h-3.5" />,   label: 'Awaiting Reply', value: stats.awaiting, highlight: stats.awaiting > 0 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className={s.highlight ? 'text-amber-400' : 'text-white/30'}>{s.icon}</span>
              <span className="text-white/30 text-[10px] uppercase tracking-wider">{s.label}</span>
              <span className={`text-sm font-bold ${s.highlight ? 'text-amber-400' : 'text-white'}`}>
                {s.value}
              </span>
            </div>
          ))}
        </div>
        <a
          href={getCSVExportUrl()}
          download
          className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 border border-white/15 transition-all rounded-sm"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </a>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        {/* ── Left: Contact List ── */}
        <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden">
          {/* Search + Filter */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search name, email, service..."
                className="w-full pl-8 pr-8 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <div className="flex gap-1">
              {['all', 'new', 'replied', 'closed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-sm transition-colors ${
                    filterStatus === s
                      ? 'bg-[#0a1628] text-white border-[#0a1628]'
                      : 'text-gray-500 border-gray-200 hover:border-[#0a1628] hover:text-[#0a1628] bg-white'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1 text-left">
            {loading ? (
              <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500 text-sm mb-3">{error}</p>
                <button onClick={fetchContacts} className="text-xs text-[#0a1628] underline">Retry</button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                {search || filterStatus !== 'all' ? 'No matching submissions.' : 'No submissions yet.'}
              </div>
            ) : (
              filtered.map(c => {
                const status = c.status || 'new';
                const cfg = STATUS_CONFIG[status];
                const active = selected?._id === c._id;
                return (
                  <div
                    key={c._id}
                    onClick={() => setSelected(c)}
                    className={`p-4 border-b border-gray-150 cursor-pointer transition-colors relative text-left ${
                      active ? 'bg-slate-50' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      {isRecent(c.createdAt) && status === 'new' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping mt-1" />
                      )}
                    </div>
                    <h4 className="font-bold text-xs text-[#0a1628] truncate">{c.name}</h4>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.email}</p>
                    <p className="text-[10px] text-gray-500 font-semibold truncate mt-1.5 bg-slate-100 inline-block px-1.5 py-0.5 rounded-sm">
                      {c.service}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right: Detail view ── */}
        <div className="flex-1 overflow-y-auto bg-slate-50 text-left">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
              <Inbox className="w-10 h-10 text-gray-300 mb-3" />
              <h3 className="font-semibold text-sm mb-1">Select an Inquiry</h3>
              <p className="text-xs">Click any inquiry card in the list to view full client messages.</p>
            </div>
          ) : (
            <div className="p-6 md:p-8 space-y-6 max-w-3xl">
              {/* Meta details */}
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h2 className="text-base font-bold text-[#0a1628]">{selected.name}</h2>
                    <p className="text-xs text-gray-400 font-medium mt-1 font-mono">{selected.email}</p>
                  </div>
                  {/* Status change selector + Delete */}
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mark Status:</span>
                    <select
                      value={selected.status || 'new'}
                      onChange={e => handleSetStatus(selected._id, e.target.value)}
                      className="text-xs font-bold border border-gray-200 px-2 py-1.5 bg-white text-gray-700 focus:outline-none rounded-sm"
                    >
                      <option value="new">New</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <button
                      onClick={() => handleDeleteContact(selected._id)}
                      className="ml-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1.5 rounded-sm transition-colors"
                      title="Delete this inquiry permanently"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Service Requested</span>
                    <p className="font-bold text-slate-700 bg-slate-100 inline-block px-2 py-0.5 rounded-sm">{selected.service}</p>
                  </div>
                  {selected.company && (
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Company</span>
                      <p className="font-bold text-slate-700">{selected.company}</p>
                    </div>
                  )}
                  {selected.phone && (
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Phone Number</span>
                      <p className="font-mono text-slate-700">{selected.phone}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Received Date</span>
                    <p className="font-medium text-slate-600">
                      {new Date(selected.createdAt).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-xs space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Client Inquiry Message</h3>
                <p className="text-xs text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">
                  {selected.message}
                </p>
              </div>

              {/* Internal Notes & Timeline */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                  Internal Notes &amp; Activity Log
                </h3>

                <form onSubmit={handleAddNote} className="mb-6 flex gap-2">
                  <input
                    type="text"
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    placeholder="Add an internal log note (e.g. called client, sent quote)..."
                    disabled={submittingNote}
                    className="flex-1 px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={submittingNote || !noteText.trim()}
                    className="bg-[#0a1628] hover:bg-[#1a2f4c] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm disabled:opacity-50"
                  >
                    Add Log
                  </button>
                </form>

                {(!selected.notes || selected.notes.length === 0) ? (
                  <p className="text-xs text-gray-400 italic">No notes or activity logs added to this inquiry yet.</p>
                ) : (
                  <div className="space-y-3.5">
                    {selected.notes.map(note => (
                      <div key={note._id} className="bg-white border border-gray-150 px-4 py-3 rounded-sm flex items-start justify-between gap-4 group">
                        <div className="min-w-0">
                          <p className="text-xs text-gray-700 leading-relaxed font-medium">{note.text}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">
                            {new Date(note.createdAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-gray-300 hover:text-red-600 transition-colors self-start p-1"
                          title="Delete note"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
