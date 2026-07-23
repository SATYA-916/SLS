import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceConfirmationPanel from '@/components/ServiceConfirmationPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Briefcase, Cog, Activity, Map } from 'lucide-react';
import { getServices } from '@/lib/api';
import { fallbackServices } from '@/data/fallbackServices';
import { PageMeta } from '@/components/PageMeta';

const serviceIcons = {
  gear: <Cog className="w-10 h-10" />,
  briefcase: <Briefcase className="w-10 h-10" />,
  cogs: <Cog className="w-10 h-10" />,
  activity: <Activity className="w-10 h-10" />,
  map: <Map className="w-10 h-10" />,
};

export default function Expertise() {
  const [activeServiceToBook, setActiveServiceToBook] = useState(null);
  const [, setLocation] = useLocation();

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
    initialData: fallbackServices,
  });

  return (
    <div className="w-full">
      <PageMeta title="Our Services" description="SLS Structo-Mech Consultants — Engineering, Project Consulting, Special Products Design & Manufacturing, RLA Studies, and Laisoning services for clients in India and abroad." />
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Our Services</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight mb-4 text-[#0a1628]">
              Core Engineering Services
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
              SLS Structo-Mech Consultants provides all engineering solutions to various clients in India and abroad.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-40" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
              {services?.map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-white p-10 border border-gray-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[#43648e] mb-6">
                      {serviceIcons[svc.icon] || <Building2 className="w-10 h-10" />}
                    </div>
                    <h3 className="text-xl font-bold text-[#0a1628] mb-4">{svc.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6">{svc.description}</p>

                    {/* Design Environment for RLA */}
                    {svc.title && svc.title.toLowerCase().includes('rla') && (
                      <div className="mt-2 mb-6 border-t border-gray-100 pt-4 space-y-2 text-xs text-left">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Design Environment</span>
                          <span className="font-semibold text-gray-700">STAAD.Pro, UT Gauging</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      onClick={() => setActiveServiceToBook(svc.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#43648e] hover:text-[#0a1628] transition-colors cursor-pointer border-b border-transparent hover:border-current pb-0.5"
                    >
                      Book Service &rarr;
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BOOK CONSULTATION CTA */}
      <section className="py-20 bg-gradient-to-br from-[#0a1628] to-[#12233c] text-white border-t border-white/10 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid_cta" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid_cta)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-2xl">
          <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Start Your Project Today</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Need Professional Engineering Services?</h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mb-8">
            Whether you require industrial engineering, project consulting, special products design, or RLA studies, our experienced engineering team is ready to deliver cost effective quality solutions.
          </p>
          <Link href="/contact">
            <button className="bg-white text-[#0a1628] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition-colors shadow-lg">
              Book a Free Consultation Now &rarr;
            </button>
          </Link>
        </div>
      </section>

      <AnimatePresence>
        {activeServiceToBook && (
          <ServiceConfirmationPanel
            serviceName={activeServiceToBook}
            onClose={() => setActiveServiceToBook(null)}
            onConfirm={() => {
              setActiveServiceToBook(null);
              setLocation(`/contact?service=${encodeURIComponent(activeServiceToBook)}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
