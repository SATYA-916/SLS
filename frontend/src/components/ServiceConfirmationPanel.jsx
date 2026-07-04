import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Briefcase, FileText } from 'lucide-react';
import { getServices, getProjects } from '@/lib/api';
import { fallbackServices } from '@/data/fallbackServices';
import { fallbackProjects } from '@/data/fallbackProjects';

// Approved mapping logic from Step 0 Data Audit
export function getMatchingProjectsForService(serviceName, projects) {
  if (!projects || !serviceName) return [];
  
  const cleanedService = serviceName.trim();
  
  if (cleanedService === 'Blueprint Design') {
    return projects.filter(p => 
      p.category === 'Structures' || 
      p.category === 'Special Structures' || 
      p.title.toLowerCase().includes('drawing') || 
      p.description.toLowerCase().includes('drawing') ||
      p.title.toLowerCase().includes('layout') || 
      p.description.toLowerCase().includes('layout') ||
      p.title.toLowerCase().includes('isometric') || 
      p.description.toLowerCase().includes('isometric')
    ).slice(0, 2);
  }
  
  if (cleanedService === 'Industrial Design & Support') {
    return projects.filter(p => 
      p.category === 'Fired Heaters' || 
      p.category === 'Boilers & Chimneys' || 
      p.category === 'Industrial Structures'
    ).slice(0, 2);
  }
  
  if (cleanedService === 'Engineering & Architecture Design') {
    return projects.filter(p => 
      p.category === 'Buildings'
    ).slice(0, 2);
  }
  
  if (cleanedService === 'Construction Supervision') {
    return projects.filter(p => 
      p.title.toLowerCase().includes('supervision') || 
      p.description.toLowerCase().includes('supervision') ||
      p.title.toLowerCase().includes('audit') || 
      p.description.toLowerCase().includes('audit') ||
      p.title.toLowerCase().includes('erection') || 
      p.description.toLowerCase().includes('erection')
    ).slice(0, 2);
  }
  
  if (cleanedService === 'Remaining Life Assessment (RLA)') {
    return projects.filter(p => 
      p.title.toLowerCase().includes('rla') || 
      p.description.toLowerCase().includes('rla') ||
      p.title.toLowerCase().includes('remaining life') || 
      p.description.toLowerCase().includes('remaining life') ||
      p.title.toLowerCase().includes('assessment') || 
      p.description.toLowerCase().includes('assessment')
    ).slice(0, 2);
  }
  
  if (cleanedService === 'Finite Element Analysis (FEA)') {
    return projects.filter(p => 
      p.title.toLowerCase().includes('fea') || 
      p.description.toLowerCase().includes('fea') ||
      p.title.toLowerCase().includes('finite element') || 
      p.description.toLowerCase().includes('finite element') ||
      p.title.toLowerCase().includes('stress analysis') || 
      p.description.toLowerCase().includes('stress analysis') ||
      p.title.toLowerCase().includes('ansys') || 
      p.description.toLowerCase().includes('ansys')
    ).slice(0, 2);
  }
  
  if (cleanedService === 'Piping Design & Stress Analysis') {
    return projects.filter(p => 
      p.title.toLowerCase().includes('pipeline') || 
      p.description.toLowerCase().includes('pipeline') ||
      p.title.toLowerCase().includes('piping') || 
      p.description.toLowerCase().includes('piping') ||
      p.title.toLowerCase().includes('duct') || 
      p.description.toLowerCase().includes('duct')
    ).slice(0, 2);
  }
  
  // "Municipality Relation Services" and "Software & AI Solutions" map to 0 projects as approved
  return [];
}

function getServiceSpecs(title) {
  let specs = { codes: '', software: '' };
  const cleaned = title ? title.trim() : '';

  if (cleaned === 'Blueprint Design') {
    specs = { codes: 'ASME Sec VIII, API 560, BS EN', software: 'AutoCAD, SolidWorks' };
  } else if (cleaned === 'Industrial Design & Support') {
    specs = { codes: 'API 560, API 530, ASME Sec VIII', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned === 'Engineering & Architecture Design') {
    specs = { codes: 'IS 800, IS 456, IS 1893 (Seismic)', software: 'STAAD.Pro, AutoCAD' };
  } else if (cleaned === 'Construction Supervision') {
    specs = { codes: 'AWS D1.1, ASME Sec IX, WPS/PQR', software: 'Quality Inspection' };
  } else if (cleaned === 'Municipality Relation Services') {
    specs = { codes: 'National Building Code (NBC), VMRDA', software: 'Regulatory Approvals' };
  } else if (cleaned === 'Remaining Life Assessment (RLA)') {
    specs = { codes: 'API 579 (FFS), ASME FFS-1', software: 'STAAD.Pro, UT Gauging' };
  } else if (cleaned === 'Software & AI Solutions') {
    specs = { codes: 'Tekla Open API, AutoCAD LISP', software: 'Python, C#, Tekla Structures' };
  } else if (cleaned === 'Finite Element Analysis (FEA)') {
    specs = { codes: 'ASME Sec VIII Div 2, API 579, IS 1893', software: 'ANSYS, STAAD.Pro (FEA)' };
  } else if (cleaned === 'Piping Design & Stress Analysis') {
    specs = { codes: 'ASME B31.3, ASME B31.1', software: 'CAESAR II, AutoCAD' };
  }
  return specs;
}

export default function ServiceConfirmationPanel({ serviceName, onClose, onConfirm }) {
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
                    className="flex items-center gap-3 border border-slate-100 p-2 rounded-sm bg-slate-50/50"
                  >
                    {proj.image ? (
                      <div className="w-12 h-9 bg-gray-100 overflow-hidden shrink-0 border border-slate-200">
                        <img
                          src={proj.image}
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-9 bg-gray-100 flex items-center justify-center shrink-0 border border-slate-200">
                        <FileText className="w-4 h-4 text-gray-300" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-[#0a1628] truncate leading-tight">
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
