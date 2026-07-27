import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LogOut, Mail, Inbox, Calendar, Clock, RefreshCw, Home,
  Search, X, Tag, Download, Trash2, Plus, Save, Edit3,
  Settings, Image, FileText, ChevronDown
} from 'lucide-react';
import {
  getAdminContacts, adminLogout, updateContactStatus,
  addContactNote, deleteContactNote, getCSVExportUrl, deleteContact,
  getAdminServices, createService, updateService, deleteAdminService,
  getAdminProjects, createProject, updateProject, deleteAdminProject,
  uploadImage
} from '@/lib/api';

const STATUS_CONFIG = {
  new:     { label: 'New',     color: 'bg-blue-100 text-blue-700 border-blue-200' },
  replied: { label: 'Replied', color: 'bg-green-100 text-green-700 border-green-200' },
  closed:  { label: 'Closed',  color: 'bg-gray-100 text-gray-500 border-gray-200' },
};

const ICONS = ['gear', 'briefcase', 'cogs', 'activity', 'map', 'building', 'factory', 'layers', 'clipboard', 'monitor'];

function isRecent(dateStr) {
  return Date.now() - new Date(dateStr).getTime() < 48 * 60 * 60 * 1000;
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const [tab, setTab] = useState('inquiries');

  // Inquiries state
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Services state
  const [services, setServices] = useState([]);
  const [svcLoading, setSvcLoading] = useState(false);
  const [svcEditId, setSvcEditId] = useState(null);
  const [svcForm, setSvcForm] = useState({ title: '', description: '', icon: 'gear' });
  const [svcAddMode, setSvcAddMode] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([]);
  const [projLoading, setProjLoading] = useState(false);
  const [projEditId, setProjEditId] = useState(null);
  const [projForm, setProjForm] = useState({
    title: '', description: '', category: 'Structures', client: '',
    year: new Date().getFullYear(), image: '', challenge: '', solution: '',
    slsAction: '', equipment: '', consultation: ''
  });
  const [projAddMode, setProjAddMode] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);

  // ── Fetch contacts ──
  async function fetchContacts() {
    setLoading(true); setError('');
    try {
      const data = await getAdminContacts();
      setContacts(data);
    } catch (err) {
      if (err.message?.includes('401') || err.message?.includes('Unauthorized')) { navigate('/admin'); return; }
      setError('Failed to load contacts.');
    } finally { setLoading(false); }
  }

  async function handleLogout() { await adminLogout(); navigate('/admin'); }
  async function handleSetStatus(id, newStatus) {
    try {
      const updated = await updateContactStatus(id, newStatus);
      setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));
      if (selected?._id === id) setSelected(updated);
    } catch (err) { alert('Failed to update status.'); }
  }
  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSubmittingNote(true);
    try {
      const updated = await addContactNote(selected._id, noteText);
      setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));
      setSelected(updated); setNoteText('');
    } catch (err) { alert('Failed to add note.'); }
    finally { setSubmittingNote(false); }
  }
  async function handleDeleteNote(noteId) {
    if (!confirm('Delete this note?')) return;
    try {
      const updated = await deleteContactNote(selected._id, noteId);
      setContacts(prev => prev.map(c => c._id === updated._id ? updated : c));
      setSelected(updated);
    } catch (err) { alert('Failed to delete note.'); }
  }
  async function handleDeleteContact(id) {
    if (!confirm('Permanently delete this inquiry?')) return;
    try {
      await deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      if (selected?._id === id) setSelected(contacts.find(c => c._id !== id) || null);
    } catch (err) { alert('Failed to delete contact.'); }
  }

  useEffect(() => { if (tab === 'inquiries') fetchContacts(); }, [tab]);

  const stats = useMemo(() => {
    const thisMonth = contacts.filter(c =>
      new Date(c.createdAt).getMonth() === new Date().getMonth() &&
      new Date(c.createdAt).getFullYear() === new Date().getFullYear()
    ).length;
    const awaiting = contacts.filter(c => (c.status || 'new') === 'new').length;
    return { total: contacts.length, thisMonth, awaiting };
  }, [contacts]);

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

  // ── Services CRUD ──
  async function fetchServices() {
    setSvcLoading(true);
    try {
      const data = await getAdminServices();
      setServices(data);
    } catch (err) { alert('Failed to fetch services.'); }
    finally { setSvcLoading(false); }
  }
  useEffect(() => { if (tab === 'services') fetchServices(); }, [tab]);

  async function handleSaveService(id) {
    try {
      if (id) {
        const updated = await updateService(id, svcForm);
        setServices(prev => prev.map(s => s._id === updated._id ? updated : s));
      } else {
        const created = await createService(svcForm);
        setServices(prev => [...prev, created]);
      }
      setSvcEditId(null); setSvcAddMode(false);
      setSvcForm({ title: '', description: '', icon: 'gear' });
    } catch (err) { alert('Failed to save service.'); }
  }

  async function handleDeleteService(id) {
    if (!confirm('Delete this service?')) return;
    try {
      await deleteAdminService(id);
      setServices(prev => prev.filter(s => s._id !== id));
    } catch (err) { alert('Failed to delete service.'); }
  }

  // ── Projects CRUD ──
  async function fetchProjects() {
    setProjLoading(true);
    try {
      const data = await getAdminProjects();
      setProjects(data);
    } catch (err) { alert('Failed to fetch projects.'); }
    finally { setProjLoading(false); }
  }
  useEffect(() => { if (tab === 'projects') fetchProjects(); }, [tab]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const result = await uploadImage(file);
      setProjForm(prev => ({ ...prev, image: result.url }));
    } catch (err) { alert('Upload failed.'); }
    finally { setUploadingImg(false); }
  }

  async function handleSaveProject(id) {
    try {
      if (id) {
        const updated = await updateProject(id, projForm);
        setProjects(prev => prev.map(p => p._id === updated._id ? updated : p));
      } else {
        const created = await createProject(projForm);
        setProjects(prev => [...prev, created]);
      }
      setProjEditId(null); setProjAddMode(false);
      setProjForm({
        title: '', description: '', category: 'Structures', client: '',
        year: new Date().getFullYear(), image: '', challenge: '', solution: '',
        slsAction: '', equipment: '', consultation: ''
      });
    } catch (err) { alert('Failed to save project.'); }
  }

  async function handleDeleteProject(id) {
    if (!confirm('Delete this project?')) return;
    try {
      await deleteAdminProject(id);
      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) { alert('Failed to delete project.'); }
  }

  function editProject(p) {
    setProjForm({
      title: p.title || '', description: p.description || '', category: p.category || 'Structures',
      client: p.client || '', year: p.year || new Date().getFullYear(), image: p.image || '',
      challenge: p.challenge || '', solution: p.solution || '', slsAction: p.slsAction || '',
      equipment: p.equipment || '', consultation: p.consultation || ''
    });
    setProjEditId(p._id); setProjAddMode(false);
  }

  // ── Render ──
  const tabs = [
    { id: 'inquiries', label: 'Inquiries', icon: <Inbox className="w-3.5 h-3.5" /> },
    { id: 'services', label: 'Services', icon: <Settings className="w-3.5 h-3.5" /> },
    { id: 'projects', label: 'Projects', icon: <FileText className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#060c18] flex flex-col">
      {/* ── Header ── */}
      <header className="bg-[#060c18] border-b border-white/10 text-white px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-bold tracking-wide uppercase text-white">SLS Admin Panel</h1>
            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">Content Management System</p>
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

      {/* ── Tabs ── */}
      <div className="bg-[#07111f] border-b border-white/10 px-6 flex">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSelected(null); }}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
              tab === t.id
                ? 'text-white border-white bg-white/5'
                : 'text-white/40 border-transparent hover:text-white/70'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      {tab === 'inquiries' && (
        <>
          {/* Stats Bar */}
          <div className="bg-[#07111f] border-b border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-8">
              {[
                { icon: <Inbox className="w-3.5 h-3.5" />, label: 'Total Inquiries', value: stats.total },
                { icon: <Calendar className="w-3.5 h-3.5" />, label: 'This Month',  value: stats.thisMonth },
                { icon: <Clock className="w-3.5 h-3.5" />, label: 'Awaiting Reply', value: stats.awaiting, highlight: stats.awaiting > 0 },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={s.highlight ? 'text-amber-400' : 'text-white/30'}>{s.icon}</span>
                  <span className="text-white/30 text-[10px] uppercase tracking-wider">{s.label}</span>
                  <span className={`text-sm font-bold ${s.highlight ? 'text-amber-400' : 'text-white'}`}>{s.value}</span>
                </div>
              ))}
            </div>
            <a href={getCSVExportUrl()} download
              className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1 border border-white/15 transition-all rounded-sm">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </a>
          </div>

          <div className="flex flex-1 overflow-hidden bg-gray-50">
            {/* Left: Contact List */}
            <div className="w-full md:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden">
              <div className="p-3 border-b border-gray-100 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, service..."
                    className="w-full pl-8 pr-8 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>}
                </div>
                <div className="flex gap-1">
                  {['all', 'new', 'replied', 'closed'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border rounded-sm transition-colors ${
                        filterStatus === s ? 'bg-[#0a1628] text-white border-[#0a1628]' : 'text-gray-500 border-gray-200 hover:border-[#0a1628] hover:text-[#0a1628] bg-white'
                      }`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-y-auto flex-1 text-left">
                {loading ? (
                  <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : error ? (
                  <div className="p-8 text-center"><p className="text-red-500 text-sm mb-3">{error}</p>
                    <button onClick={fetchContacts} className="text-xs text-[#0a1628] underline">Retry</button></div>
                ) : filtered.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">{search || filterStatus !== 'all' ? 'No matching submissions.' : 'No submissions yet.'}</div>
                ) : (
                  filtered.map(c => {
                    const status = c.status || 'new';
                    const cfg = STATUS_CONFIG[status];
                    const active = selected?._id === c._id;
                    return (
                      <div key={c._id} onClick={() => setSelected(c)}
                        className={`p-4 border-b border-gray-150 cursor-pointer transition-colors relative text-left ${
                          active ? 'bg-slate-50' : 'hover:bg-gray-50/50'
                        }`}>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded-full ${cfg.color}`}>{cfg.label}</span>
                          {isRecent(c.createdAt) && status === 'new' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping mt-1" />}
                        </div>
                        <h4 className="font-bold text-xs text-[#0a1628] truncate">{c.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate mt-0.5">{c.email}</p>
                        <p className="text-[10px] text-gray-500 font-semibold truncate mt-1.5 bg-slate-100 inline-block px-1.5 py-0.5 rounded-sm">{c.service}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
            {/* Right: Detail */}
            <div className="flex-1 overflow-y-auto bg-slate-50 text-left">
              {!selected ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                  <Inbox className="w-10 h-10 text-gray-300 mb-3" />
                  <h3 className="font-semibold text-sm mb-1">Select an Inquiry</h3>
                  <p className="text-xs">Click any inquiry card to view full client messages.</p>
                </div>
              ) : (
                <div className="p-6 md:p-8 space-y-6 max-w-3xl">
                  <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-xs space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div>
                        <h2 className="text-base font-bold text-[#0a1628]">{selected.name}</h2>
                        <p className="text-xs text-gray-400 font-medium mt-1 font-mono">{selected.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Mark:</span>
                        <select value={selected.status || 'new'} onChange={e => handleSetStatus(selected._id, e.target.value)}
                          className="text-xs font-bold border border-gray-200 px-2 py-1.5 bg-white text-gray-700 focus:outline-none rounded-sm">
                          <option value="new">New</option>
                          <option value="replied">Replied</option>
                          <option value="closed">Closed</option>
                        </select>
                        <button onClick={() => handleDeleteContact(selected._id)}
                          className="ml-2 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1.5 rounded-sm transition-colors">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Service Requested</span>
                        <p className="font-bold text-slate-700 bg-slate-100 inline-block px-2 py-0.5 rounded-sm">{selected.service}</p></div>
                      {selected.company && <div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Company</span>
                        <p className="font-bold text-slate-700">{selected.company}</p></div>}
                      {selected.phone && <div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Phone</span>
                        <p className="font-mono text-slate-700">{selected.phone}</p></div>}
                      <div><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Date</span>
                        <p className="font-medium text-slate-600">{new Date(selected.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p></div>
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-xs space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-2">Message</h3>
                    <p className="text-xs text-gray-700 leading-relaxed font-medium whitespace-pre-wrap">{selected.message}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Internal Notes</h3>
                    <form onSubmit={handleAddNote} className="mb-6 flex gap-2">
                      <input type="text" value={noteText} onChange={e => setNoteText(e.target.value)}
                        placeholder="Add internal note..." disabled={submittingNote}
                        className="flex-1 px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm disabled:opacity-50" />
                      <button type="submit" disabled={submittingNote || !noteText.trim()}
                        className="bg-[#0a1628] hover:bg-[#1a2f4c] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm disabled:opacity-50">Add</button>
                    </form>
                    {(!selected.notes || selected.notes.length === 0) ? (
                      <p className="text-xs text-gray-400 italic">No notes yet.</p>
                    ) : (
                      <div className="space-y-3.5">
                        {selected.notes.map(note => (
                          <div key={note._id} className="bg-white border border-gray-150 px-4 py-3 rounded-sm flex items-start justify-between gap-4 group">
                            <div className="min-w-0">
                              <p className="text-xs text-gray-700 leading-relaxed font-medium">{note.text}</p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {new Date(note.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <button onClick={() => handleDeleteNote(note._id)} className="text-gray-300 hover:text-red-600 transition-colors self-start p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ── SERVICES TAB ── */}
      {tab === 'services' && (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#0a1628]">Manage Services</h2>
              <button onClick={() => { setSvcAddMode(true); setSvcEditId(null); setSvcForm({ title: '', description: '', icon: 'gear' }); }}
                className="flex items-center gap-1.5 bg-[#0a1628] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f4c] transition-colors rounded-sm">
                <Plus className="w-3.5 h-3.5" /> Add Service
              </button>
            </div>

            {/* Add/Edit Form */}
            {(svcAddMode || svcEditId) && (
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm mb-6 space-y-4">
                <h3 className="text-sm font-bold text-[#0a1628]">{svcEditId ? 'Edit Service' : 'New Service'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Title</label>
                    <input value={svcForm.title} onChange={e => setSvcForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Icon</label>
                    <select value={svcForm.icon} onChange={e => setSvcForm(p => ({ ...p, icon: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm">
                      {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Description</label>
                  <textarea value={svcForm.description} onChange={e => setSvcForm(p => ({ ...p, description: e.target.value }))} rows={3}
                    className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveService(svcEditId)}
                    className="flex items-center gap-1 bg-[#0a1628] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f4c] rounded-sm">
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => { setSvcAddMode(false); setSvcEditId(null); }}
                    className="px-4 py-2 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Services List */}
            {svcLoading ? (
              <div className="text-center text-gray-400 text-sm py-12">Loading services...</div>
            ) : services.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-12">
                <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No services yet. Click "Add Service" to create one.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="text-left px-4 py-3 font-bold text-gray-500 uppercase tracking-wider">Icon</th>
                      <th className="text-right px-4 py-3 font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map(s => (
                      <tr key={s._id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3 font-semibold text-[#0a1628]">{s.title}</td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{s.description}</td>
                        <td className="px-4 py-3 text-gray-500">{s.icon}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => { setSvcEditId(s._id); setSvcAddMode(false); setSvcForm({ title: s.title, description: s.description, icon: s.icon }); }}
                            className="inline-flex items-center gap-1 text-[#43648e] hover:text-[#0a1628] mr-3 font-bold uppercase tracking-wider text-[9px]"><Edit3 className="w-3 h-3" /> Edit</button>
                          <button onClick={() => handleDeleteService(s._id)}
                            className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-bold uppercase tracking-wider text-[9px]"><Trash2 className="w-3 h-3" /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── PROJECTS TAB ── */}
      {tab === 'projects' && (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#0a1628]">Manage Projects ({projects.length})</h2>
              <button onClick={() => { setProjAddMode(true); setProjEditId(null); setProjForm({
                title: '', description: '', category: 'Structures', client: '',
                year: new Date().getFullYear(), image: '', challenge: '', solution: '',
                slsAction: '', equipment: '', consultation: ''
              }); }}
                className="flex items-center gap-1.5 bg-[#0a1628] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f4c] transition-colors rounded-sm">
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            {/* Add/Edit Form */}
            {(projAddMode || projEditId) && (
              <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm mb-6 space-y-4">
                <h3 className="text-sm font-bold text-[#0a1628]">{projEditId ? 'Edit Project' : 'New Project'}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Title</label>
                    <input value={projForm.title} onChange={e => setProjForm(p => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Client</label>
                    <input value={projForm.client} onChange={e => setProjForm(p => ({ ...p, client: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Category</label>
                    <select value={projForm.category} onChange={e => setProjForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm">
                      {['Special Structures', 'Cryogenic Plants', 'Boilers & Chimneys', 'Fired Heaters', 'Structures', 'Industrial Structures', 'Buildings', 'Industrial'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Year</label>
                    <input type="number" value={projForm.year} onChange={e => setProjForm(p => ({ ...p, year: parseInt(e.target.value) || new Date().getFullYear() }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Equipment</label>
                    <input value={projForm.equipment} onChange={e => setProjForm(p => ({ ...p, equipment: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Consultation</label>
                    <input value={projForm.consultation} onChange={e => setProjForm(p => ({ ...p, consultation: e.target.value }))}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Description</label>
                  <textarea value={projForm.description} onChange={e => setProjForm(p => ({ ...p, description: e.target.value }))} rows={2}
                    className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Challenge</label>
                    <textarea value={projForm.challenge} onChange={e => setProjForm(p => ({ ...p, challenge: e.target.value }))} rows={2}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Solution</label>
                    <textarea value={projForm.solution} onChange={e => setProjForm(p => ({ ...p, solution: e.target.value }))} rows={2}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">SLS Action</label>
                    <textarea value={projForm.slsAction} onChange={e => setProjForm(p => ({ ...p, slsAction: e.target.value }))} rows={2}
                      className="w-full px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Image</label>
                  <div className="flex items-center gap-4">
                    <input value={projForm.image} onChange={e => setProjForm(p => ({ ...p, image: e.target.value }))} placeholder="Image URL path"
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 focus:outline-none focus:border-[#0a1628] rounded-sm" />
                    <label className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer rounded-sm">
                      <Image className="w-3.5 h-3.5" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImg} />
                      {uploadingImg ? 'Uploading...' : 'Upload'}
                    </label>
                  </div>
                  {projForm.image && (
                    <div className="mt-2">
                      <img src={projForm.image} alt="Preview" className="h-20 w-auto object-cover border border-gray-200" onError={e => e.target.style.display = 'none'} />
                      <p className="text-[9px] text-gray-400 mt-1">{projForm.image}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveProject(projEditId)}
                    className="flex items-center gap-1 bg-[#0a1628] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-[#1a2f4c] rounded-sm">
                    <Save className="w-3 h-3" /> Save
                  </button>
                  <button onClick={() => { setProjAddMode(false); setProjEditId(null); }}
                    className="px-4 py-2 text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-sm">Cancel</button>
                </div>
              </div>
            )}

            {/* Projects List */}
            {projLoading ? (
              <div className="text-center text-gray-400 text-sm py-12">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center text-gray-400 text-sm py-12">
                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No projects yet. Click "Add Project" to create one.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-3 py-3 font-bold text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="text-left px-3 py-3 font-bold text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="text-left px-3 py-3 font-bold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="text-right px-3 py-3 font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {projects.map(p => (
                      <tr key={p._id} className="hover:bg-gray-50/50">
                        <td className="px-3 py-3 font-semibold text-[#0a1628] max-w-xs truncate">{p.title}</td>
                        <td className="px-3 py-3 text-gray-500">{p.client || '-'}</td>
                        <td className="px-3 py-3 text-gray-500">{p.category}</td>
                        <td className="px-3 py-3 text-right whitespace-nowrap">
                          <button onClick={() => editProject(p)}
                            className="inline-flex items-center gap-1 text-[#43648e] hover:text-[#0a1628] mr-3 font-bold uppercase tracking-wider text-[9px]"><Edit3 className="w-3 h-3" /> Edit</button>
                          <button onClick={() => handleDeleteProject(p._id)}
                            className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-bold uppercase tracking-wider text-[9px]"><Trash2 className="w-3 h-3" /> Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
