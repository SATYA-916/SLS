import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import ServiceConfirmationPanel from '@/components/ServiceConfirmationPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Factory, Grid3X3, Activity, ClipboardList, Layers, Monitor, Cpu, Workflow } from 'lucide-react';
import { getServices } from '@/lib/api';
import { fallbackServices } from '@/data/fallbackServices';

const serviceIcons = {
  building: <Building2 className="w-10 h-10" />,
  factory: <Factory className="w-10 h-10" />,
  grid: <Grid3X3 className="w-10 h-10" />,
  activity: <Activity className="w-10 h-10" />,
  clipboard: <ClipboardList className="w-10 h-10" />,
  layers: <Layers className="w-10 h-10" />,
  monitor: <Monitor className="w-10 h-10" />,
  cpu: <Cpu className="w-10 h-10" />,
  pipeline: <Workflow className="w-10 h-10" />,
};

const activities = [
  'Process and Thermal Design Review (API 530)',
  'Finite Element Method (FEM) & Fatigue Analysis',
  'STAAD.Pro 3D Structural Frame Analysis',
  'Refractory Insulation Anchor & Hook Layout Design',
  'Tekla 3D Detailing & NC DSTV File Export',
  'Piping stress analysis and nozzle loading checking',
  'Preparation of Approved for Construction (AFC) Shop Drawings',
  'Erection Staging & Rigging Crane Support Engineering',
];

const specialisms = [
  'Hydrotreater (DHDT) & Hydrodesulfurization (HDS) Fired Heaters',
  'Vertical Cylindrical & Box Fired Heater Casing structures',
  'Finned Convection Sections & Intermediate Tube Support Plates',
  'Refinery Piping Isometric & Nozzle orientaton layouts',
  'Self-Supporting Stack Chimneys with Helical Wind Strakes',
  'High-Temperature Header Boxes & Quick-Access swing doors',
  'Refining Cold Box and Compressor Dynamic Concrete Foundations',
  'Heavy Industrial Warehouse Sheds & Crane Runway Girders',
  'Multi-tier Circular Platforms & Staircase Access support towers',
];

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
              Engineering &amp; Design Services
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-xl leading-relaxed">
              Engineering solutions designed in accordance with project-specific international and regional standards, including ASME, API, IS, and client specifications.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#0a1628]">Core Engineering Services</h2>
          </motion.div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-40" />)}
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
                    
                    {/* Dynamic Technical Specifications block for service cards */}
                    {(() => {
                      let specs = null;
                      if (svc.title === 'Blueprint Design') {
                        specs = { codes: 'ASME Sec VIII, API 560, BS EN', software: 'AutoCAD, SolidWorks' };
                      } else if (svc.title === 'Industrial Design & Support') {
                        specs = { codes: 'API 560, API 530, ASME Sec VIII', software: 'STAAD.Pro, AutoCAD' };
                      } else if (svc.title === 'Engineering & Architecture Design') {
                        specs = { codes: 'IS 800, IS 456, IS 1893 (Seismic)', software: 'STAAD.Pro, AutoCAD' };
                      } else if (svc.title === 'Construction Supervision') {
                        specs = { codes: 'AWS D1.1, ASME Sec IX, WPS/PQR', software: 'Quality Inspection' };
                      } else if (svc.title === 'Municipality Relation Services') {
                        specs = { codes: 'National Building Code (NBC), VMRDA', software: 'Regulatory Approvals' };
                      } else if (svc.title === 'Remaining Life Assessment (RLA)') {
                        specs = { codes: 'API 579 (FFS), ASME FFS-1', software: 'STAAD.Pro, UT Gauging' };
                      } else if (svc.title === 'Software & AI Solutions') {
                        specs = { codes: 'Tekla Open API, AutoCAD LISP', software: 'Python, C#, Tekla Structures' };
                      } else if (svc.title === 'Finite Element Analysis (FEA)') {
                        specs = { codes: 'ASME Sec VIII Div 2, API 579, IS 1893', software: 'ANSYS, STAAD.Pro (FEA)' };
                      } else if (svc.title === 'Piping Design & Stress Analysis') {
                        specs = { codes: 'ASME B31.3, ASME B31.1', software: 'CAESAR II, AutoCAD' };
                      }
                      
                      if (!specs) return null;
                      return (
                        <div className="mt-2 mb-6 border-t border-gray-100 pt-4 space-y-2 text-xs text-left">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Codes & Compliance</span>
                            <span className="font-semibold text-gray-700">{specs.codes}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Design Environment</span>
                            <span className="font-semibold text-gray-700">{specs.software}</span>
                          </div>
                        </div>
                      );
                    })()}
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

      <section className="py-20 bg-slate-50 text-[#0a1628] border-t border-b border-slate-200">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-6">Engineering Activities</p>
            <h2 className="text-3xl font-bold mb-8 text-[#0a1628]">What We Do</h2>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#43648e] mt-2 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-6">Engineering Specialisms</p>
            <h2 className="text-3xl font-bold mb-8 text-[#0a1628]">What We Design</h2>
            <div className="space-y-3">
              {specialisms.map((spec) => (
                <div key={spec} className="flex items-start gap-3 text-sm text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#43648e] mt-2 shrink-0" />
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#43648e] mb-3">Software Expertise</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">Industry-Leading Tools</h2>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {['STAAD.Pro', 'ANSYS', 'Tekla Structures', 'AutoCAD', 'CATIA'].map((tool, i) => (
              <motion.div
                key={tool}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="text-2xl font-bold text-[#0a1628]/70 cursor-default"
              >
                {tool}
              </motion.div>
            ))}
          </div>
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
            Whether you need a structural analysis, blueprint design, or construction supervision, our engineering team is ready to deliver cost-effective and quality solutions.
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
