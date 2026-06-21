import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, X } from 'lucide-react';
import { getProjects } from '@/lib/api';

const categories = [
  'All',
  'Special Structures',
  'Cryogenic Plants',
  'Boilers & Chimneys',
  'Fired Heaters',
  'Structures',
  'Industrial Structures',
  'Power Boilers',
];

export default function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const filtered = projects?.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="w-full">
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
            <p className="mt-4 text-white/60 max-w-xl">
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
                    {proj.description.substring(0, 100)}...
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
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{selectedProject.description}</p>
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
