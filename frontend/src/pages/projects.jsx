import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, X, CheckCircle2 } from 'lucide-react';
import { getProjects } from '@/lib/api';
import { fallbackProjects } from '@/data/fallbackProjects';

const categories = [
  'All',
  'Special Structures',
  'Cryogenic Plants',
  'Boilers & Chimneys',
  'Fired Heaters',
  'Structures',
  'Industrial Structures',
];

function getProjectTechnicalSpecs(proj) {
  const category = proj.category || '';
  const title = proj.title || '';
  const desc = proj.description || '';

  const specs = {
    codes: 'IS 800 (Structural Design), IS 456 (Plain & Reinforced Concrete)',
    software: 'AutoCAD, STAAD.Pro',
    deliverables: 'Structural Design Calculations & Construction-Ready Fabrication Drawings'
  };

  if (category === 'Fired Heaters' || title.toLowerCase().includes('heater') || desc.toLowerCase().includes('heater')) {
    specs.codes = 'API 560 (Fired Heaters), API 530 (Tube Thickness Calc), ASME Section VIII (Pressure Parts)';
    specs.software = 'AutoCAD, STAAD.Pro, ANSYS (FEA Thermal Modeling)';
    specs.deliverables = 'Thermal & Structural Calculations, General Arrangement & Shell Detail Drawings, Nozzle Load Verification Reports';
  } else if (category === 'Cryogenic Plants' || desc.toLowerCase().includes('cryogenic') || desc.toLowerCase().includes('cold box')) {
    specs.codes = 'ASME Section VIII Div 1, AD 2000, IS 1893 (Seismic Design)';
    specs.software = 'STAAD.Pro, ANSYS (Dynamic foundation FEA)';
    specs.deliverables = 'Heavy Dynamic Foundation design reports, Anchor Bolt layout drawings, RCC Pile load capacity analysis';
  } else if (category === 'Boilers & Chimneys' || title.toLowerCase().includes('stack') || title.toLowerCase().includes('chimney') || desc.toLowerCase().includes('chimney')) {
    specs.codes = 'IS 6533 (Steel Chimneys), IS 875 Part 3 (Wind Loads), ASME STS-1 (Steel Stacks)';
    specs.software = 'AutoCAD, STAAD.Pro (Finite element chimney shell model)';
    specs.deliverables = 'Vortex shedding dynamic analysis reports, Helical strake layout sheets, Foundation reaction reports';
  } else if (category === 'Special Structures' || desc.toLowerCase().includes('shield') || desc.toLowerCase().includes('fixture')) {
    specs.codes = 'ASME Section VIII, AISC 360, IS 800 (Steel structures)';
    specs.software = 'AutoCAD, ANSYS (Lifting & structural integrity FEA)';
    specs.deliverables = 'Radiographic cordoning shielding design sheets, Heavy lifting rigging plans, FEA structural stress verification reports';
  }

  return specs;
}

export default function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: fallbackProjects,
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = projects?.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="w-full">
      <section className="bg-slate-50 text-[#0a1628] py-20 relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Our Portfolio</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight text-[#0a1628]">Significant Projects</h1>
            <p className="mt-4 text-slate-600 max-w-xl">
              500+ projects delivered across India and internationally since 2002.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold tracking-wider uppercase border transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#0a1628] text-white border-[#0a1628]'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#0a1628] hover:text-[#0a1628]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-56" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {filtered?.map((proj, i) => (
                <motion.div
                  key={proj.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white p-8 flex flex-col cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setSelectedProject(proj)}
                >
                  <div className="w-full h-44 bg-gray-50 mb-5 overflow-hidden border border-gray-200 group-hover:border-[#0a1628]/20 transition-colors relative flex items-center justify-center">
                    {proj.image ? (
                      <img
                        src={proj.image}
                        alt={proj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.querySelector('.fallback-icon').style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className="fallback-icon absolute inset-0 items-center justify-center bg-gray-100"
                      style={{ display: proj.image ? 'none' : 'flex' }}
                    >
                      <Building2 className="w-10 h-10 text-gray-200 group-hover:text-[#43648e]/40 transition-colors" />
                    </div>
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-[#43648e] uppercase mb-2">
                    {proj.category}
                  </span>
                  <h3 className="text-base font-bold text-[#0a1628] mb-2 leading-snug">{proj.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed flex-grow mb-4">
                    {proj.description.substring(0, 140)}...
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    {proj.client && <span className="text-[#43648e] font-medium">{proj.client}</span>}
                    {proj.year && <span className="text-gray-400">{proj.year}</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GALLERY REDIRECT BANNER */}
      <section className="py-16 bg-[#0a1628] text-white border-t border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-xl">
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3 block">Engineering Drawing Office</span>
          <h3 className="text-2xl font-bold mb-4">Explore Our Fired Heater Drawings Gallery</h3>
          <p className="text-white/60 text-xs leading-relaxed mb-6">
            Review detailed drawings of convection section assemblies, radiant sections, stack vortex strakes, platform layout details, and structural support frames.
          </p>
          <Link href="/gallery">
            <span className="bg-white text-[#0a1628] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-colors shadow-md cursor-pointer inline-block">
              View Drawings & Schematics Gallery &rarr;
            </span>
          </Link>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white max-w-lg w-full overflow-hidden relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 z-10 bg-black/40 hover:bg-black/60 rounded-full p-1 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              {selectedProject.image && (
                <div className="w-full h-56 bg-gray-100 relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-8">
                <span className="text-[10px] font-bold tracking-widest text-[#43648e] uppercase mb-3 block">
                  {selectedProject.category}
                </span>
                <h2 className="text-2xl font-bold text-[#0a1628] mb-4">{selectedProject.title}</h2>
                <div className="space-y-4 text-sm text-gray-600 mb-6 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin">
                  {selectedProject.challenge ? (
                    <>
                      <div>
                        <strong className="text-[10px] font-bold uppercase tracking-wider text-[#0a1628] block mb-1">Challenge / Problem</strong>
                        <p className="text-xs leading-relaxed text-gray-500">{selectedProject.challenge}</p>
                      </div>
                      <div>
                        <strong className="text-[10px] font-bold uppercase tracking-wider text-[#0a1628] block mb-1">Engineering Solution</strong>
                        <p className="text-xs leading-relaxed text-gray-500">{selectedProject.solution}</p>
                      </div>
                      <div>
                        <strong className="text-[10px] font-bold uppercase tracking-wider text-[#0a1628] block mb-1">What SLS Did (Scope)</strong>
                        <p className="text-xs leading-relaxed text-gray-500">{selectedProject.slsAction}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs leading-relaxed text-gray-500">{selectedProject.description}</p>
                  )}
                </div>
                {(() => {
                  const specs = getProjectTechnicalSpecs(selectedProject);
                  return (
                    <div className="mb-6 bg-gray-50 p-4 border border-gray-200 rounded-sm space-y-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Design Codes Compliance</span>
                        <span className="text-xs font-semibold text-[#0a1628]">{specs.codes}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Analysis & Design Software</span>
                        <span className="text-xs font-semibold text-[#0a1628]">{specs.software}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block mb-0.5">Primary Deliverables</span>
                        <span className="text-xs font-semibold text-[#0a1628]">{specs.deliverables}</span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-200 text-[10px] font-bold uppercase tracking-wide text-green-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-700" />
                        <span>Quality Checked: EIL Compliance Audited</span>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex items-center gap-6 text-sm border-t border-gray-200 pt-4">
                  {selectedProject.client && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Client</span>
                      <span className="font-semibold text-[#0a1628]">{selectedProject.client}</span>
                    </div>
                  )}
                  {selectedProject.year && (
                    <div>
                      <span className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Year</span>
                      <span className="font-semibold text-[#0a1628]">{selectedProject.year}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
