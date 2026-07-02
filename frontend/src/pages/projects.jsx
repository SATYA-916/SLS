import { useState } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, X, Calendar, User, Tag } from 'lucide-react';
import { getProjects } from '@/lib/api';

const categories = [
  'All',
  'Special Structures',
  'Buildings',
  'Cryogenic Plants',
  'Boilers & Chimneys',
  'Fired Heaters',
  'Industrial Structures',
  'Structures'
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const { data: projects, isLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: getProjects,
  });

  const filtered = selectedCategory === 'All'
    ? projects
    : projects?.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <section className="bg-[#0a1628] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Our Portfolio</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight">Significant Projects</h1>
            <p className="mt-4 text-white/60 max-w-xl text-sm leading-relaxed">
              Explore 500+ design and detailing projects completed under international quality standards for refinery, cryogenic, and civil infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FILTER BUTTONS & PROJECTS GRID */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-gray-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[10px] font-bold tracking-wider uppercase border transition-all duration-200 rounded-sm ${
                  selectedCategory === cat
                    ? 'bg-[#0a1628] text-white border-[#0a1628] shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-[#0a1628] hover:text-[#0a1628]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          ) : (
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filtered?.map((proj) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    key={proj.id}
                    className="bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => setSelectedProject(proj)}
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="aspect-[16/10] bg-slate-900 overflow-hidden relative flex items-center justify-center border-b border-gray-200">
                        {proj.image ? (
                          <img
                            src={proj.image}
                            alt={proj.title}
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                        ) : (
                          <Building2 className="w-10 h-10 text-white/20" />
                        )}
                        {/* Year Badge */}
                        {proj.year && (
                          <span className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-sm">
                            {proj.year}
                          </span>
                        )}
                        {/* Category Badge */}
                        <span className="absolute bottom-3 left-3 bg-[#0a1628] text-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-widest rounded-sm">
                          {proj.category}
                        </span>
                      </div>

                      {/* Content details */}
                      <div className="p-6">
                        <h3 className="font-bold text-sm text-[#0a1628] mb-2 leading-snug group-hover:text-blue-700 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {proj.description.substring(0, 140)}...
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400">
                      {proj.client ? (
                        <span className="font-bold uppercase tracking-wider text-[#43648e]">{proj.client}</span>
                      ) : (
                        <span />
                      )}
                      <span className="font-bold uppercase tracking-wider group-hover:text-[#0a1628] transition-colors">
                        View Specs &rarr;
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
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

      {/* PROJECT SPECIFICATION LIGHTBOX */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white max-w-xl w-full overflow-hidden relative shadow-2xl border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-white hover:text-gray-200 z-10 bg-black/40 hover:bg-black/60 rounded-full p-1.5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
              {selectedProject.image && (
                <div className="w-full h-60 bg-gray-100 relative">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-4 left-4 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1">
                    {selectedProject.category}
                  </span>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-[10px] font-bold tracking-widest text-[#43648e] uppercase">
                    Project Specification Sheet
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#0a1628] mb-4 leading-tight">{selectedProject.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{selectedProject.description}</p>
                
                <div className="grid grid-cols-2 gap-6 border-t border-gray-200 pt-4">
                  {selectedProject.client && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Client</span>
                        <span className="text-sm font-bold text-[#0a1628]">{selectedProject.client}</span>
                      </div>
                    </div>
                  )}
                  {selectedProject.year && (
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                      <div>
                        <span className="text-[9px] text-gray-400 uppercase tracking-wider block">Project Year</span>
                        <span className="text-sm font-bold text-[#0a1628]">{selectedProject.year}</span>
                      </div>
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
