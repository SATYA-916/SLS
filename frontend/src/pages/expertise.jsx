import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Factory, Grid3X3, Activity, ClipboardList, Layers, Monitor, Briefcase, ChevronRight, Cpu, Compass, Landmark } from 'lucide-react';
import { getServices } from '@/lib/api';

const serviceIcons = {
  layers: <Layers className="w-8 h-8 text-blue-700" />,
  factory: <Factory className="w-8 h-8 text-blue-700" />,
  building: <Building2 className="w-8 h-8 text-blue-700" />,
  clipboard: <ClipboardList className="w-8 h-8 text-blue-700" />,
  activity: <Activity className="w-8 h-8 text-blue-700" />,
  grid: <Grid3X3 className="w-8 h-8 text-blue-700" />,
  monitor: <Monitor className="w-8 h-8 text-blue-700" />,
  briefcase: <Briefcase className="w-8 h-8 text-blue-700" />
};

// Fallback services if database call fails
const fallbackServices = [
  { id: 1, title: 'Blueprint Design', description: 'Comprehensive 2D/3D plant layouts, piping isometrics, and mechanical drawings.', icon: 'layers' },
  { id: 2, title: 'Industrial Design & Support', description: 'Casing detailing, coil layout, and fabrication drawings for fired heaters and vessels.', icon: 'factory' },
  { id: 3, title: 'Engineering & Architecture Design', description: 'Civil and structural design, pile foundations, and load calculations under IS codes.', icon: 'building' },
  { id: 4, title: 'Construction Supervision', description: 'On-site technical inspection, bolt alignments, structural plumb audits, and safety checks.', icon: 'clipboard' },
  { id: 5, title: 'Municipality Relation Services', description: 'Liaisoning, municipal drawings, structural stability certificates, and regulatory approvals.', icon: 'activity' },
  { id: 6, title: 'Remaining Life Assessment (RLA)', description: 'Ultrasonic inspections, non-destructive testing (NDT), and structural integrity assessments.', icon: 'grid' },
  { id: 7, title: 'Software & AI Solutions', description: 'Tekla detailing macros, custom structural analysis plugins, and automated drawing tools.', icon: 'monitor' },
  { id: 8, title: "Project Management & Owner's Engineering", description: "Project scheduling, vendor coordination, procurement vetting, and quality control audits.", icon: 'briefcase' }
];

export default function Expertise() {
  const { data: apiServices, isLoading } = useQuery({
    queryKey: ['/api/services'],
    queryFn: getServices,
  });

  const services = apiServices || fallbackServices;

  // Group services into categories
  const categories = [
    {
      name: "Engineering Design",
      desc: "Detailed drafting, layout planning, and civil-structural modeling.",
      services: services.filter(s => [1, 3].includes(s.id))
    },
    {
      name: "Industrial Engineering",
      desc: "Specialized thermodynamic design and high-temperature mechanical detailing.",
      services: services.filter(s => [2, 7].includes(s.id))
    },
    {
      name: "Consultancy",
      desc: "Technical site supervision, regulatory approvals, and owner's engineering.",
      services: services.filter(s => [4, 5, 8].includes(s.id))
    },
    {
      name: "Digital Engineering",
      desc: "Non-destructive health assessment and structural integrity analysis.",
      services: services.filter(s => [6].includes(s.id))
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* HEADER */}
      <section className="bg-[#0a1628] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="services_grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#services_grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Our Services</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl">
              Engineering & Detailing Services
            </h1>
          </motion.div>
        </div>
      </section>

      {/* CATEGORIZED SERVICES GRID */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((cat, idx) => (
                <div key={idx} className="border-b border-gray-200 pb-12 last:border-0 last:pb-0">
                  <div className="mb-8">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#43648e] block mb-1">Category 0{idx+1}</span>
                    <h2 className="text-2xl font-bold text-[#0a1628] mb-2">{cat.name}</h2>
                    <p className="text-xs text-gray-400">{cat.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cat.services.map((svc) => (
                      <motion.div
                        key={svc.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.35 }}
                        className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-200 group"
                      >
                        <div>
                          <div className="w-12 h-12 bg-blue-50 text-blue-700 flex items-center justify-center rounded-sm mb-6 group-hover:bg-[#0a1628] group-hover:text-white transition-colors duration-300">
                            {serviceIcons[svc.icon] || <Cpu className="w-6 h-6" />}
                          </div>
                          <h3 className="text-base font-bold text-[#0a1628] mb-3 leading-snug">{svc.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed mb-6">{svc.description}</p>
                        </div>
                        <Link href={`/contact?service=${encodeURIComponent(svc.title)}`}>
                          <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1">
                            Book Service &rarr;
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CORE SPECIALISMS (What we design) */}
      <section className="py-20 bg-[#0a1628] text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <div>
            <div className="mb-4 text-blue-400"><Compass className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-3">Mechanical Detailing</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              High-temperature radiant casing sizing, horizontal finned convection section modules, quick-access header boxes, and stack draft dampers engineered under ASME/API standards.
            </p>
          </div>
          <div>
            <div className="mb-4 text-blue-400"><Landmark className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-3">Structural Detailing</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Complete Tekla modeling for refinery portal frames, stair tower stringers, platforms, handrails, and dynamic dynamic concrete pile foundations for compressors.
            </p>
          </div>
          <div>
            <div className="mb-4 text-blue-400"><Layers className="w-8 h-8" /></div>
            <h3 className="text-lg font-bold mb-3">Engineering Drawings</h3>
            <p className="text-xs text-white/50 leading-relaxed">
              Delivering Approved-for-Construction (AFC) packages containing piping isometrics, base load schedules, member part files, and structural erection guides.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
