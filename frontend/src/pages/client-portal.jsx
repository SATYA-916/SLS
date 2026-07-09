import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageMeta } from '@/components/PageMeta';
import { 
  Lock, Key, Building2, MapPin, Briefcase, FileText, CheckCircle2, 
  Circle, PlayCircle, Download, LogOut, ArrowRight, UserCheck 
} from 'lucide-react';

const FALLBACK_CLIENT_DATA = {
  "HPCL-MUMBAI-2026": {
    clientName: "Hindustan Petroleum Corporation Ltd.",
    projectTitle: "2x100 TPH Boiler House Structures",
    location: "Mumbai Refinery, Maharashtra, India",
    discipline: "Civil & Structural Design",
    codes: "IS 800, IS 875, EIL Specifications",
    progress: 75,
    milestones: [
      { id: 1, title: "Geotechnical & Pile Grid Design Verification", status: "completed", date: "Feb 10, 2026" },
      { id: 2, title: "STAAD.Pro Structural Steel Frame Analysis", status: "completed", date: "Mar 05, 2026" },
      { id: 3, title: "3D Tekla Detailing & Coordination Model", status: "completed", date: "Apr 22, 2026" },
      { id: 4, title: "General Arrangement & Fabrication Transmittals (Rev 0)", status: "in-progress", date: "Est. Jul 28, 2026" },
      { id: 5, title: "Approved For Construction (AFC) Final Package", status: "pending", date: "Est. Aug 15, 2026" }
    ],
    drawings: [
      { code: "SLS-HPCL-GA-01", title: "General Arrangement Elevation Layout", rev: "Rev 0", date: "Apr 24, 2026", size: "3.2 MB" },
      { code: "SLS-HPCL-ST-02", title: "Rafter & Column Joint Connection Details", rev: "Rev 0", date: "May 02, 2026", size: "4.8 MB" },
      { code: "SLS-HPCL-FD-03", title: "Foundation Anchor Bolt Bolt-Setting Plan", rev: "Rev 1", date: "May 18, 2026", size: "2.1 MB" }
    ]
  },
  "BPCL-COCHIN-2026": {
    clientName: "Bharat Petroleum Corporation Ltd.",
    projectTitle: "Utility Boiler Support Structure",
    location: "Kochi Refinery, Kerala, India",
    discipline: "Mechanical & Piping Detailing",
    codes: "ASME Sec VIII, API 560",
    progress: 40,
    milestones: [
      { id: 1, title: "ASME Calculations & Casing Plate Verification", status: "completed", date: "Apr 18, 2026" },
      { id: 2, title: "Piping Manifolds & Support Stress Calculations", status: "in-progress", date: "Jun 12, 2026" },
      { id: 3, title: "Tekla Steel Detailing Drawings Draft", status: "pending", date: "Est. Aug 02, 2026" },
      { id: 4, title: "Fabrication Drawings Transmittal (Rev 0)", status: "pending", date: "Est. Aug 20, 2026" }
    ],
    drawings: [
      { code: "SLS-BPCL-ME-01", title: "Casing Plate Expansion Details", rev: "Rev 0", date: "Apr 30, 2026", size: "1.8 MB" }
    ]
  }
};

export default function ClientPortal() {
  const [clientId, setClientId] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [error, setError] = useState('');
  const [clientData, setClientData] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const trimmedId = clientId.trim().toUpperCase();
    const data = FALLBACK_CLIENT_DATA[trimmedId];

    if (data && accessKey === 'password') {
      setClientData(data);
    } else {
      setError('Invalid Client ID or Access Key. Please use HPCL-MUMBAI-2026 or BPCL-COCHIN-2026 with access key: password');
    }
  };

  const handleLogout = () => {
    setClientData(null);
    setClientId('');
    setAccessKey('');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 py-20 flex flex-col items-center">
      <PageMeta 
        title="Client Milestone Portal" 
        description="Secure client dashboard to track engineering design milestones, STAAD review states, and download drawing packages." 
      />

      <div className="container mx-auto px-4 max-w-4xl">
        <AnimatePresence mode="wait">
          {!clientData ? (
            /* LOGIN CARD */
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-gray-200 p-8 md:p-12 shadow-md max-w-md mx-auto rounded-sm animate-fade-in"
            >
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-150">
                  <Lock className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black text-[#0a1628]">Client Portal</h1>
                <p className="text-xs text-gray-500 mt-2">
                  Enter your credentials to access drawing registers and project roadmap updates.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Client ID</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text"
                      required
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="e.g., HPCL-MUMBAI-2026"
                      className="w-full pl-10 pr-4 py-3 text-xs border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0a1628] focus:outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Access Key</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="password"
                      required
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                      placeholder="Enter access key..."
                      className="w-full pl-10 pr-4 py-3 text-xs border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0a1628] focus:outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-150 p-3 rounded-sm font-medium leading-relaxed">
                    {error}
                  </p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#0a1628] hover:bg-[#1a2f4c] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          ) : (
            /* DASHBOARD CARD */
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header card */}
              <div className="bg-[#0a1628] text-white p-6 md:p-8 rounded-sm shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-blue-900/30">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <UserCheck className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Client Session</span>
                  </div>
                  <h1 className="text-xl md:text-2xl font-black">{clientData.clientName}</h1>
                  <p className="text-xs text-gray-300 mt-2 font-medium flex flex-wrap items-center gap-y-2 gap-x-4">
                    <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Project: <strong>{clientData.projectTitle}</strong></span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location: <strong>{clientData.location}</strong></span>
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-white/20 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1.5 rounded-sm self-start md:self-center cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>

              {/* Progress and milestones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Milestones timeline (Col-span 2) */}
                <div className="md:col-span-2 bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider">Design Milestone Roadmap</h2>
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-150 px-2.5 py-0.5 rounded-full">{clientData.progress}% Complete</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-gray-100 rounded-full mb-8 overflow-hidden border border-gray-150">
                    <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${clientData.progress}%` }} />
                  </div>

                  {/* Milestones list */}
                  <div className="space-y-6">
                    {clientData.milestones.map((mil, idx) => (
                      <div key={mil.id} className="flex gap-4 relative">
                        {idx < clientData.milestones.length - 1 && (
                          <div className="absolute left-[9px] top-6 bottom-[-24px] w-0.5 bg-gray-150" />
                        )}
                        <div className="mt-1 shrink-0">
                          {mil.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
                          ) : mil.status === 'in-progress' ? (
                            <PlayCircle className="w-5 h-5 text-blue-600 fill-blue-50 animate-pulse" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-xs font-bold ${mil.status === 'completed' ? 'text-gray-500 line-through' : mil.status === 'in-progress' ? 'text-[#0a1628]' : 'text-gray-400'}`}>
                            {mil.title}
                          </h3>
                          <span className="text-[10px] text-gray-400 font-medium block mt-1">{mil.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info and stats (Col-span 1) */}
                <div className="space-y-6">
                  {/* Scope Details */}
                  <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm space-y-4">
                    <h2 className="text-xs font-bold text-[#0a1628] uppercase tracking-wider border-b border-gray-150 pb-2">Scope Summary</h2>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Discipline</span>
                      <p className="text-xs text-gray-700 font-bold">{clientData.discipline}</p>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Applicable Standards</span>
                      <p className="text-xs text-gray-700 font-bold">{clientData.codes}</p>
                    </div>
                  </div>

                  {/* Contact Support */}
                  <div className="bg-blue-50/50 border border-blue-150 p-6 rounded-sm space-y-3">
                    <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Engineering Liaison</h3>
                    <p className="text-[11px] text-blue-750 leading-relaxed">
                      Need design clarifications or revision changes? Contact our engineering manager immediately.
                    </p>
                    <a 
                      href="mailto:slsind@gmail.com" 
                      className="text-xs font-bold text-blue-700 hover:text-blue-900 block pt-1 hover:underline"
                    >
                      slsind@gmail.com &rarr;
                    </a>
                  </div>
                </div>
              </div>

              {/* Drawings register */}
              <div className="bg-white border border-gray-200 p-6 md:p-8 rounded-sm shadow-sm">
                <h2 className="text-sm font-bold text-[#0a1628] uppercase tracking-wider mb-6 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" /> Transmitted Drawings Register
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        <th className="pb-3 pr-4">Drawing Code</th>
                        <th className="pb-3 pr-4">Drawing Title</th>
                        <th className="pb-3 pr-4">Revision</th>
                        <th className="pb-3 pr-4">Release Date</th>
                        <th className="pb-3 text-right">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150">
                      {clientData.drawings.map((draw) => (
                        <tr key={draw.code} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 pr-4 font-mono font-bold text-blue-700">{draw.code}</td>
                          <td className="py-4 pr-4 font-bold text-slate-800">{draw.title}</td>
                          <td className="py-4 pr-4">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 px-2 py-0.5 rounded-full text-[10px] font-black">{draw.rev}</span>
                          </td>
                          <td className="py-4 pr-4 text-gray-500 font-medium">{draw.date}</td>
                          <td className="py-4 text-right">
                            <button
                              type="button"
                              onClick={() => alert(`Downloading drawing transmittal package ${draw.code}...`)}
                              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-sm font-bold uppercase text-[9px] tracking-wider transition-colors cursor-pointer"
                            >
                              <Download className="w-3 h-3" /> PDF ({draw.size})
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
