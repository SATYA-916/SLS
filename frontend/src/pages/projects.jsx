import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, X, CheckCircle2, ArrowRight, ArrowLeft, 
  User, Calendar, MapPin, Briefcase, FileText, Search 
} from 'lucide-react';
import { getProjects } from '@/lib/api';
import { fallbackProjects } from '@/data/fallbackProjects';
import { PageMeta } from '@/components/PageMeta';

const categories = [
  'All',
  'Special Structures',
  'Cryogenic Plants',
  'Boilers & Chimneys',
  'Fired Heaters',
  'Structures',
  'Industrial Structures',
];


function formatProjectTitle(proj) {
  if (!proj) return '';
  const client = proj.client || '';
  const equipment = proj.equipment || '';
  const title = proj.title || '';
  if (client && equipment) {
    return `${client} - ${equipment} (${title})`;
  }
  return title;
}

function getProjectTechnicalSpecs(proj) {
  if (!proj) return { software: '', deliverables: '' };
  
  const category = proj.category || '';
  const title = proj.title || '';
  const desc = proj.description || '';

  const specs = {
    software: 'AutoCAD, STAAD.Pro',
    deliverables: 'Structural Design Calculations & Construction-Ready Fabrication Drawings'
  };

  if (category === 'Fired Heaters' || title.toLowerCase().includes('heater') || desc.toLowerCase().includes('heater')) {
    specs.software = 'AutoCAD, STAAD.Pro, ANSYS (FEA Structural Modeling)';
    specs.deliverables = 'Structural Calculations, General Arrangement & Shell Detail Drawings, Nozzle Load Verification Reports';
  } else if (category === 'Cryogenic Plants' || desc.toLowerCase().includes('cryogenic') || desc.toLowerCase().includes('cold box')) {
    specs.software = 'STAAD.Pro, ANSYS (Dynamic foundation FEA)';
    specs.deliverables = 'Heavy Dynamic Foundation design reports, Anchor Bolt layout drawings, RCC Pile load capacity analysis';
  } else if (category === 'Boilers & Chimneys' || title.toLowerCase().includes('stack') || title.toLowerCase().includes('chimney') || desc.toLowerCase().includes('chimney')) {
    specs.software = 'AutoCAD, STAAD.Pro (Finite element chimney shell model)';
    specs.deliverables = 'Vortex shedding dynamic analysis reports, Helical strake layout sheets, Foundation reaction reports';
  } else if (category === 'Special Structures' || desc.toLowerCase().includes('shield') || desc.toLowerCase().includes('fixture')) {
    specs.software = 'AutoCAD, ANSYS (Lifting & structural integrity FEA)';
    specs.deliverables = 'Radiographic cordoning shielding design sheets, Heavy lifting rigging plans, FEA structural stress verification reports';
  } else if (category === 'Buildings' || title.toLowerCase().includes('building') || desc.toLowerCase().includes('apartment') || desc.toLowerCase().includes('school')) {
    specs.software = 'AutoCAD, STAAD.Pro, ETABS';
    specs.deliverables = 'RCC structural framing plans, Foundation reinforcement drawings, Slab rebar schedules';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [selectedClient, setSelectedClient] = useState('All');
  const [, setLocation] = useLocation();

  const filtered = projects?.filter((p) => {
    // 1. Category tab filter
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;

    // 2. Search query filter
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      (p.title || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.client || '').toLowerCase().includes(q);

    // 3. Discipline filter
    let matchDiscipline = true;
    if (selectedDiscipline !== 'All') {
      const pText = ((p.title || '') + ' ' + (p.description || '') + ' ' + (p.category || '')).toLowerCase();
      if (selectedDiscipline === 'Civil & Structural') {
        matchDiscipline = p.category === 'Civil & Structural' || pText.includes('civil') || pText.includes('structural') || pText.includes('foundation') || pText.includes('concrete') || pText.includes('pile') || pText.includes('building') || pText.includes('apartments') || pText.includes('residency');
      } else if (selectedDiscipline === 'Mechanical & Piping') {
        matchDiscipline = p.category === 'Mechanical & Piping' || pText.includes('mechanical') || pText.includes('piping') || pText.includes('process') || pText.includes('manifold') || pText.includes('pipeline') || pText.includes('duct') || pText.includes('heater') || pText.includes('furnace') || pText.includes('bellows') || pText.includes('cover');
      } else if (selectedDiscipline === 'Detailing') {
        matchDiscipline = pText.includes('detailing') || pText.includes('drawing') || pText.includes('drafting') || pText.includes('tekla') || pText.includes('fabrication');
      } else if (selectedDiscipline === 'RLA Studies') {
        matchDiscipline = p.category === 'RLA Studies' || pText.includes('rla') || pText.includes('remaining life') || pText.includes('chimneys') || pText.includes('stack') || pText.includes('integrity') || pText.includes('assessment');
      }
    }

    // 4. Client filter
    let matchClient = true;
    if (selectedClient !== 'All') {
      const pText = ((p.title || '') + ' ' + (p.description || '') + ' ' + (p.client || '')).toLowerCase();
      if (selectedClient === 'HPCL') {
        matchClient = pText.includes('hpcl');
      } else if (selectedClient === 'BPCL') {
        matchClient = pText.includes('bpcl') || pText.includes('cochin') || pText.includes('kochi');
      } else if (selectedClient === 'BHEL') {
        matchClient = pText.includes('bhel');
      } else if (selectedClient === 'L&T') {
        matchClient = pText.includes('l&t') || pText.includes('larsen');
      } else if (selectedClient === 'BORL') {
        matchClient = pText.includes('borl') || pText.includes('bina');
      }
    }

    return matchCat && matchSearch && matchDiscipline && matchClient;
  });

  const filteredList = useMemo(() => filtered || [], [filtered]);

  const currentIndex = selectedProject
    ? filteredList.findIndex((p) => p.id === selectedProject.id)
    : -1;
  const projectNumber = currentIndex + 1;
  const totalProjects = filteredList.length;

  const handlePrevProject = (e) => {
    e.stopPropagation();
    if (totalProjects === 0) return;
    const prevIndex = (currentIndex - 1 + totalProjects) % totalProjects;
    setSelectedProject(filteredList[prevIndex]);
  };

  const handleNextProject = (e) => {
    e.stopPropagation();
    if (totalProjects === 0) return;
    const nextIndex = (currentIndex + 1) % totalProjects;
    setSelectedProject(filteredList[nextIndex]);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedProject]);

  const getProjectLocation = (proj) => {
    if (!proj) return 'Visakhapatnam, India';
    const text = ((proj.title || '') + ' ' + (proj.description || '') + ' ' + (proj.challenge || '')).toLowerCase();
    if (text.includes('kochi')) return 'Kochi, Kerala';
    if (text.includes('iran')) return 'Iran (International)';
    if (text.includes('bina')) return 'Bina, Madhya Pradesh';
    if (text.includes('mumbai')) return 'Mumbai, Maharashtra';
    if (text.includes('bhadrachalam')) return 'Bhadrachalam, Andhra Pradesh';
    if (text.includes('roorkee')) return 'Roorkee, Uttarakhand';
    if (text.includes('hyderabad')) return 'Hyderabad, Telangana';
    if (text.includes('bhatinda')) return 'Bhatinda, Punjab';
    if (text.includes('vizag') || text.includes('yendada') || text.includes('visakhapatnam')) return 'Visakhapatnam, Andhra Pradesh';
    if (text.includes('kalpakkam')) return 'Kalpakkam, Tamil Nadu';
    if (text.includes('chennai')) return 'Chennai, Tamil Nadu';
    return 'Visakhapatnam, India';
  };

  const getProjectIndustry = (proj) => {
    if (!proj) return 'Heavy Industry';
    const cat = proj.category || '';
    if (cat === 'Fired Heaters') return 'Oil & Gas / Petroleum';
    if (cat === 'Cryogenic Plants') return 'Industrial Gases & Cryogenics';
    if (cat === 'Boilers & Chimneys') return 'Process Power Plants';
    if (cat === 'Special Structures') return 'Nuclear & Heavy Engineering';
    if (cat === 'Buildings') return 'Infrastructure & Commercial';
    return 'Heavy Process Industry';
  };

  const getRelatedProjects = (proj) => {
    if (!projects || !proj) return [];
    return projects
      .filter((p) => p.category === proj.category && p.id !== proj.id)
      .slice(0, 3);
  };

  return (
    <div className="w-full">
      <PageMeta title="Projects" description="Explore 500+ structural and industrial engineering projects delivered by SLS Structomech Consultants since 2002 — fired heaters, cryogenic foundations, chimneys, and more." />
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
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                  setSelectedDiscipline('All');
                  setSelectedClient('All');
                }}
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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 max-w-5xl">
            {/* Search Input */}
            <div className="relative md:col-span-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0a1628] focus:outline-none focus:ring-1 focus:ring-[#0a1628]/20 transition-colors rounded-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Discipline Dropdown */}
            <div>
              <select
                value={selectedDiscipline}
                onChange={(e) => setSelectedDiscipline(e.target.value)}
                className="w-full px-3 py-3 text-xs border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0a1628] focus:outline-none transition-colors rounded-sm font-bold text-gray-600 dark:text-gray-200"
              >
                <option value="All">All Disciplines</option>
                <option value="Civil & Structural">Civil & Structural</option>
                <option value="Mechanical & Piping">Mechanical & Piping</option>
                <option value="Detailing">Steel Detailing</option>
                <option value="RLA Studies">RLA Assessment</option>
              </select>
            </div>

            {/* Client Dropdown */}
            <div>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                className="w-full px-3 py-3 text-xs border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#0a1628] focus:outline-none transition-colors rounded-sm font-bold text-gray-600 dark:text-gray-200"
              >
                <option value="All">All Clients</option>
                <option value="HPCL">HPCL</option>
                <option value="BPCL">BPCL / Cochin</option>
                <option value="BHEL">BHEL</option>
                <option value="L&T">Larsen & Toubro</option>
                <option value="BORL">BORL / Bina</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-6">{filteredList.length} project{filteredList.length !== 1 ? 's' : ''} found</p>

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
                  onClick={() => setLocation(`/projects/${proj.id}`)}
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
                  <h3 className="text-base font-bold text-[#0a1628] mb-2 leading-snug">{formatProjectTitle(proj)}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed flex-grow mb-4">
                    {(proj.description || '').substring(0, 140)}...
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
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <style dangerouslySetInnerHTML={{__html: `
              .custom-modal-scroll::-webkit-scrollbar {
                width: 6px;
              }
              .custom-modal-scroll::-webkit-scrollbar-track {
                background: transparent;
              }
              .custom-modal-scroll::-webkit-scrollbar-thumb {
                background-color: #cbd5e1;
                border-radius: 3px;
              }
              .custom-modal-scroll::-webkit-scrollbar-thumb:hover {
                background-color: #94a3b8;
              }
            `}} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden relative shadow-2xl flex flex-col border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header & Navigation Bar */}
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50 shrink-0 select-none">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Project {projectNumber} of {totalProjects}
                </div>
                <div className="flex items-center gap-6 text-xs font-semibold">
                  <button
                    onClick={handlePrevProject}
                    disabled={totalProjects <= 1}
                    className="text-slate-500 hover:text-[#0a1628] disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  <span className="text-slate-400 font-mono text-xs">
                    {projectNumber} / {totalProjects}
                  </span>
                  <button
                    onClick={handleNextProject}
                    disabled={totalProjects <= 1}
                    className="text-slate-500 hover:text-[#0a1628] disabled:opacity-30 disabled:hover:text-slate-500 transition-colors flex items-center gap-1.5"
                  >
                    Next <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="custom-modal-scroll overflow-y-auto flex-1 p-6 md:p-10 space-y-8">
                
                {/* Hero Image Block */}
                {selectedProject.image && (
                  <div className="w-full h-64 md:h-80 bg-gray-100 overflow-hidden relative border border-slate-200 group">
                    <img
                      src={selectedProject.image}
                      alt={formatProjectTitle(selectedProject)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm">
                      {selectedProject.category}
                    </div>
                  </div>
                )}

                {/* Title & Status Badges */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-gray-100 pb-6">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#43648e] uppercase mb-1.5 block">
                      Case Study Reference
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a1628] leading-tight">
                      {selectedProject.title}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 shrink-0 pt-2">
                    <span className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-green-700" /> Completed
                    </span>
                    <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm font-mono">
                      EIL Compliant
                    </span>
                  </div>
                </div>

                {/* Grid Split Content */}
                <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
                  {/* Left Column (65%) */}
                  <div className="md:col-span-2 space-y-6 order-2 md:order-1">
                    {selectedProject.challenge ? (
                      <>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a1628] border-b border-gray-100 pb-2 mb-3">
                            1. Overview &amp; Client Requirements
                          </h3>
                          <p className="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
                            {selectedProject.description}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a1628] border-b border-gray-100 pb-2 mb-3">
                            2. Engineering Challenges
                          </h3>
                          <p className="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
                            {selectedProject.challenge}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a1628] border-b border-gray-100 pb-2 mb-3">
                            3. Our Solution &amp; Design Highlights
                          </h3>
                          <p className="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
                            {selectedProject.solution}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a1628] border-b border-gray-100 pb-2 mb-3">
                            4. Scope of Detailing Work
                          </h3>
                          <p className="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
                            {selectedProject.slsAction}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a1628] border-b border-gray-100 pb-2 mb-3">
                          Project Case Overview
                        </h3>
                        <p className="text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
                          {selectedProject.description}
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Right Column (35%) */}
                  <div className="space-y-6 order-1 md:order-2">
                    {/* Metadata Panel */}
                    <div className="bg-slate-50 border border-slate-200 p-5 rounded-sm space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 border-b border-slate-200 pb-2">
                        Project Facts
                      </h4>
                      <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <User className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Client</span>
                            <span className="font-semibold text-[#0a1628]">{selectedProject.client || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Year</span>
                            <span className="font-semibold text-[#0a1628]">{selectedProject.year || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Location</span>
                            <span className="font-semibold text-[#0a1628]">{getProjectLocation(selectedProject)}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Briefcase className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Industry Segment</span>
                            <span className="font-semibold text-[#0a1628]">{getProjectIndustry(selectedProject)}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <Building2 className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase block leading-none mb-0.5">Discipline</span>
                            <span className="font-semibold text-[#0a1628]">{selectedProject.category}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {(() => {
                      const specs = getProjectTechnicalSpecs(selectedProject);
                      const softwareList = (specs.software || '').split(',').map((s) => s.trim());
                      const deliverablesList = (specs.deliverables || '').split(',').map((s) => s.trim());

                      return (
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 pb-1.5 block">
                              Software Used
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {softwareList.map((sw) => (
                                <span key={sw} className="bg-blue-50 text-[#43648e] border border-blue-100 px-2 py-0.5 rounded-sm text-[9px] font-medium font-mono">
                                  {sw}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-gray-100 pb-1.5 block">
                              Primary Deliverables
                            </h4>
                            <ul className="space-y-2 text-xs text-gray-500 font-medium">
                              {deliverablesList.map((del, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#43648e] mt-0.5 shrink-0" />
                                  <span>{del}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Related Projects — full width below two columns */}
                <div className="pt-8 border-t border-gray-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#0a1628] mb-4">
                    Related Case Studies
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {getRelatedProjects(selectedProject).map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => setSelectedProject(rel)}
                        className="group cursor-pointer space-y-2 border border-slate-100 hover:border-slate-300 p-2 rounded-sm transition-all"
                      >
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                          <img
                            src={rel.image}
                            alt={rel.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                        </div>
                        <h4 className="text-[10px] font-bold text-[#0a1628] leading-tight truncate group-hover:text-[#43648e] transition-colors">
                          {rel.title}
                        </h4>
                        <span className="text-[8px] font-semibold text-slate-400 block uppercase">
                          {rel.category}
                        </span>
                      </div>
                    ))}
                    {getRelatedProjects(selectedProject).length === 0 && (
                      <p className="text-[10px] text-gray-400 italic col-span-3">No other projects in this category.</p>
                    )}
                  </div>
                </div>

                {/* CTA — full width */}
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-sm text-center">
                  <h4 className="text-sm font-bold text-[#0a1628] mb-2">Interested in a similar engineering solution?</h4>
                  <p className="text-xs text-slate-500 mb-5 max-w-md mx-auto leading-relaxed">
                    SLS Consultants specializes in structural and mechanical design for fired heaters, chimneys, boiler structures, and cryogenic plant foundations.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link href="/contact?service=Other Services &amp; Scoping Inquiry">
                      <button
                        onClick={() => setSelectedProject(null)}
                        className="bg-[#0a1628] hover:bg-[#1a2f4c] text-white px-5 py-2.5 text-xs font-semibold rounded-sm transition-all shadow-sm"
                      >
                        Book a Consultation
                      </button>
                    </Link>
                    <a
                      href="tel:+919849598424"
                      rel="external"
                      className="border border-slate-300 bg-white hover:bg-slate-100 text-[#0a1628] px-5 py-2.5 text-xs font-semibold rounded-sm transition-all shadow-xs"
                    >
                      Request Technical Discussion
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
