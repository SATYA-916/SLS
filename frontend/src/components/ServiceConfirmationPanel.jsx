import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Briefcase, FileText } from 'lucide-react';
import { getServices, getProjects } from '@/lib/api';
import { fallbackServices } from '@/data/fallbackServices';
import { fallbackProjects } from '@/data/fallbackProjects';

// Approved mapping logic from Step 0 Data Audit
export function getMatchingProjectsForService(serviceName, projects) {
  if (!projects || !serviceName) return [];
  
  const cleanedService = serviceName.trim().toLowerCase();
  
  if (cleanedService.includes('fired heater')) {
    return projects.filter(p => 
      p.category === 'Fired Heaters' || 
      p.title.toLowerCase().includes('heater') || 
      p.description.toLowerCase().includes('heater')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('civil') || cleanedService === 'civil & structural engineering') {
    return projects.filter(p => 
      p.category === 'Civil & Structural' || 
      p.title.toLowerCase().includes('civil') ||
      p.title.toLowerCase().includes('structural') ||
      p.title.toLowerCase().includes('structure') ||
      p.description.toLowerCase().includes('civil') ||
      p.description.toLowerCase().includes('structural') ||
      p.description.toLowerCase().includes('structure')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('building') || cleanedService === 'building structural design') {
    return projects.filter(p => 
      p.category === 'Buildings' || 
      p.title.toLowerCase().includes('building') ||
      p.title.toLowerCase().includes('apartments') ||
      p.title.toLowerCase().includes('residency') ||
      p.description.toLowerCase().includes('building') ||
      p.description.toLowerCase().includes('apartments') ||
      p.description.toLowerCase().includes('residency')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('equipment') || cleanedService === 'industrial equipment engineering') {
    return projects.filter(p => 
      p.title.toLowerCase().includes('vessel') || 
      p.description.toLowerCase().includes('vessel') ||
      p.title.toLowerCase().includes('exchanger') || 
      p.description.toLowerCase().includes('exchanger') ||
      p.title.toLowerCase().includes('reformer') ||
      p.description.toLowerCase().includes('reformer') ||
      p.title.toLowerCase().includes('manifold') ||
      p.description.toLowerCase().includes('manifold')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('engineering drawings') || cleanedService.includes('blueprint')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('drawing') || 
      p.description.toLowerCase().includes('drawing') ||
      p.title.toLowerCase().includes('layout') || 
      p.description.toLowerCase().includes('layout')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('steel design') || cleanedService.includes('detailing')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('detailing') || 
      p.description.toLowerCase().includes('detailing') ||
      p.title.toLowerCase().includes('tekla') ||
      p.description.toLowerCase().includes('tekla') ||
      p.title.toLowerCase().includes('steel') ||
      p.description.toLowerCase().includes('steel')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('fabrication') || cleanedService.includes('shop drawing')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('fabrication') || 
      p.description.toLowerCase().includes('fabrication') ||
      p.title.toLowerCase().includes('shop drawing') ||
      p.description.toLowerCase().includes('shop drawing')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('platform') || cleanedService.includes('stair') || cleanedService.includes('ladder')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('platform') || 
      p.description.toLowerCase().includes('platform') ||
      p.title.toLowerCase().includes('stair') || 
      p.description.toLowerCase().includes('stair') ||
      p.title.toLowerCase().includes('ladder') ||
      p.description.toLowerCase().includes('ladder')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('chimney') || cleanedService.includes('stack')) {
    return projects.filter(p => 
      p.category === 'Boilers & Chimneys' || 
      p.title.toLowerCase().includes('stack') || 
      p.description.toLowerCase().includes('stack') ||
      p.title.toLowerCase().includes('chimney') ||
      p.description.toLowerCase().includes('chimney')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('foundation') || cleanedService === 'foundation engineering') {
    return projects.filter(p => 
      p.title.toLowerCase().includes('foundation') || 
      p.description.toLowerCase().includes('foundation') ||
      p.title.toLowerCase().includes('footing') || 
      p.description.toLowerCase().includes('footing') ||
      p.title.toLowerCase().includes('pile') ||
      p.description.toLowerCase().includes('pile')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('construction') || cleanedService.includes('supervision')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('supervision') || 
      p.description.toLowerCase().includes('supervision') ||
      p.title.toLowerCase().includes('audit') || 
      p.description.toLowerCase().includes('audit') ||
      p.title.toLowerCase().includes('erection') || 
      p.description.toLowerCase().includes('erection') ||
      p.title.toLowerCase().includes('construction') ||
      p.description.toLowerCase().includes('construction')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('remaining life') || cleanedService.includes('rla')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('rla') || 
      p.description.toLowerCase().includes('rla') ||
      p.title.toLowerCase().includes('remaining life') || 
      p.description.toLowerCase().includes('remaining life') ||
      p.title.toLowerCase().includes('assessment') ||
      p.description.toLowerCase().includes('assessment')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('finite element') || cleanedService.includes('fea')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('fea') || 
      p.description.toLowerCase().includes('fea') ||
      p.title.toLowerCase().includes('stress analysis') || 
      p.description.toLowerCase().includes('stress analysis') ||
      p.title.toLowerCase().includes('finite element') ||
      p.description.toLowerCase().includes('finite element')
    ).slice(0, 2);
  }
  
  if (cleanedService.includes('piping support') || cleanedService.includes('piping design')) {
    return projects.filter(p => 
      p.title.toLowerCase().includes('pipeline') || 
      p.description.toLowerCase().includes('pipeline') ||
      p.title.toLowerCase().includes('piping') || 
      p.description.toLowerCase().includes('piping') ||
      p.title.toLowerCase().includes('duct') ||
      p.description.toLowerCase().includes('duct')
    ).slice(0, 2);
  }
  
  return [];
}

function getServiceSpecs(title) {
  let specs = { codes: '', software: '' };
  const cleaned = title ? title.trim().toLowerCase() : '';

  if (cleaned.includes('fired heater')) {
    specs = { codes: 'API 560, API 530, ASME Sec VIII', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned.includes('civil & structural') || cleaned.includes('civil & structural engineering')) {
    specs = { codes: 'IS 800, IS 875, IS 1893', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned.includes('building structural')) {
    specs = { codes: 'IS 456, IS 1893, IS 875', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned.includes('equipment engineering')) {
    specs = { codes: 'ASME Sec VIII Div 1 & 2, TEMA', software: 'STAAD.Pro, SolidWorks' };
  } else if (cleaned.includes('engineering drawings') || cleaned.includes('blueprint')) {
    specs = { codes: 'ASME, API, IS, OSHA', software: 'AutoCAD, MicroStation' };
  } else if (cleaned.includes('steel design') || cleaned.includes('steel detailing')) {
    specs = { codes: 'AISC 360, IS 800, BS EN', software: 'Tekla Structures, STAAD.Pro' };
  } else if (cleaned.includes('fabrication') || cleaned.includes('shop drawings & fabrication')) {
    specs = { codes: 'AISC, IS 800, ASME', software: 'Tekla Structures, AutoCAD' };
  } else if (cleaned.includes('platform') || cleaned.includes('staircase')) {
    specs = { codes: 'OSHA 1910.27, IS 800, BS EN', software: 'AutoCAD, Tekla Structures' };
  } else if (cleaned.includes('chimney') || cleaned.includes('stack')) {
    specs = { codes: 'ASME STS-1, IS 6533, IS 875', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned.includes('foundation')) {
    specs = { codes: 'IS 456, IS 2911, IS 1893', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned.includes('construction') || cleaned.includes('supervision')) {
    specs = { codes: 'AWS D1.1, ASME Sec IX, WPS/PQR', software: 'Quality Inspection' };
  } else if (cleaned.includes('municipality')) {
    specs = { codes: 'National Building Code (NBC), VMRDA', software: 'Regulatory Approvals' };
  } else if (cleaned.includes('remaining life') || cleaned.includes('rla')) {
    specs = { codes: 'API 579 (FFS), ASME FFS-1', software: 'STAAD.Pro, UT Gauging' };
  } else if (cleaned.includes('finite element') || cleaned.includes('fea')) {
    specs = { codes: 'ASME Sec VIII Div 2, API 579', software: 'ANSYS, STAAD.Pro (FEA)' };
  } else if (cleaned.includes('piping support') || cleaned.includes('piping design')) {
    specs = { codes: 'ASME B31.3, ASME B31.1', software: 'CAESAR II, AutoCAD' };
  } else if (cleaned.includes('software & ai') || cleaned.includes('software')) {
    specs = { codes: 'Tekla Open API, AutoCAD LISP', software: 'Python, C#, Tekla Structures' };
  }
  return specs;
}

export default function ServiceConfirmationPanel({ serviceName, onClose, onConfirm }) {
  const [, navigate] = useLocation();
  const { data: dbServices } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    initialData: fallbackServices,
  });

  const { data: dbProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: fallbackProjects,
  });

  // Find matching service item details
  const service = useMemo(() => {
    return (dbServices || fallbackServices).find(
      s => s.title.toLowerCase() === serviceName.toLowerCase()
    );
  }, [dbServices, serviceName]);

  // Find matching projects based on Step 0 rules
  const matchedProjects = useMemo(() => {
    return getMatchingProjectsForService(serviceName, dbProjects || fallbackProjects);
  }, [dbProjects, serviceName]);

  const specs = useMemo(() => {
    return getServiceSpecs(serviceName);
  }, [serviceName]);

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!service) return null;

  // Responsive check for mobile sliding transition
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <motion.div
        initial={isMobile ? { y: '100%' } : { scale: 0.96, y: 10, opacity: 0 }}
        animate={isMobile ? { y: 0 } : { scale: 1, y: 0, opacity: 1 }}
        exit={isMobile ? { y: '100%' } : { scale: 0.96, y: 10, opacity: 0 }}
        transition={{ type: 'spring', damping: 26, stiffness: 240 }}
        className="bg-white w-full md:max-w-lg rounded-t-xl md:rounded-sm overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] shadow-2xl relative border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50 shrink-0">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Confirm Selected Service
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6 flex-1">
          {/* Service Title & Description */}
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-[#0a1628] leading-tight">
              {service.title}
            </h3>
            <p className="text-xs leading-relaxed text-gray-500">
              {service.description}
            </p>
          </div>

          {/* Specs / Tags Block */}
          {specs.codes && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-sm">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Codes &amp; Compliance
                </span>
                <div className="flex flex-wrap gap-1">
                  {specs.codes.split(',').map((c) => (
                    <span
                      key={c}
                      className="bg-slate-100 text-slate-700 border border-slate-200 px-2 py-0.5 rounded-sm text-[9px] font-mono font-medium"
                    >
                      {c.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Design Environment
                </span>
                <div className="flex flex-wrap gap-1">
                  {specs.software.split(',').map((s) => (
                    <span
                      key={s}
                      className="bg-blue-50/80 text-[#43648e] border border-blue-100 px-2 py-0.5 rounded-sm text-[9px] font-mono font-medium"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Authority Credibility Block */}
          <div className="flex items-start gap-2.5 bg-blue-50/50 border border-blue-100/50 p-4 rounded-sm">
            <ShieldCheck className="w-5 h-5 text-[#43648e] shrink-0 mt-0.5" />
            <div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#43648e] block mb-0.5">
                Technical Review Authority
              </span>
              <p className="text-[11px] leading-relaxed text-slate-600 font-medium">
                Reviewed under the guidance of Mr. C. Subrahmanyam — Ex-BHEL, Ex-Doosan Babcock (18 yrs)
              </p>
            </div>
          </div>

          {/* Matched Projects (Show dynamic case studies or a premium confidentiality advisory) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#0a1628] border-b border-gray-100 pb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#43648e]" /> Recently Delivered Case Studies
            </h4>
            {matchedProjects.length > 0 ? (
              <div className="space-y-2">
                {matchedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      navigate(`/projects/${proj.id}`);
                      onClose();
                    }}
                    className="flex items-center gap-3 border border-slate-100 p-2 rounded-sm bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-200 transition-all cursor-pointer group"
                  >
                    {proj.image ? (
                      <div className="w-12 h-9 bg-gray-100 overflow-hidden shrink-0 border border-slate-200 group-hover:border-slate-300 transition-colors">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-9 bg-gray-100 flex items-center justify-center shrink-0 border border-slate-200 group-hover:border-slate-300 transition-colors">
                        <FileText className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-[#0a1628] group-hover:text-blue-700 transition-colors truncate leading-tight">
                        {proj.title}
                      </h5>
                      <span className="text-[9px] text-gray-400 font-medium">
                        Client: {proj.client || 'N/A'} · {proj.year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-slate-150 p-4 rounded-sm bg-slate-50/40 text-slate-500 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-[#43648e] shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Project records for this specific category are protected under active non-disclosure agreements (NDAs) or regulatory privacy covenants. Detailing logs are available upon request during technical scoping discussions.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="border-t border-gray-100 px-6 py-4 bg-slate-50 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="border border-slate-300 hover:bg-slate-100 text-slate-700 px-5 py-2.5 text-xs font-semibold rounded-sm transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 bg-[#0a1628] hover:bg-[#1a2f4c] text-white px-5 py-2.5 text-xs font-semibold rounded-sm transition-all shadow-sm"
          >
            Continue &rarr; Request Details
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
