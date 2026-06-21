import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Factory, Grid3X3, Activity, ClipboardList, Layers } from 'lucide-react';
import { getServices } from '@/lib/api';

const serviceIcons = {
  building: <Building2 className="w-10 h-10" />,
  factory: <Factory className="w-10 h-10" />,
  grid: <Grid3X3 className="w-10 h-10" />,
  activity: <Activity className="w-10 h-10" />,
  clipboard: <ClipboardList className="w-10 h-10" />,
  layers: <Layers className="w-10 h-10" />,
};

const activities = [
  'Conceptualisation & Feasibility Studies',
  'Analysis & Structural Design',
  'Preparation of Bill of Quantities',
  'Schedule of Items',
  'Tender Specifications with Technical Specifications',
  'Construction & Manufacturing Drawings',
  'Site Inspection & Supervision',
  'Evaluation of Sub-Vendor Offers & Recommendations',
];

const specialisms = [
  'Buildings (Steel & RCC)',
  'Warehouses & Industrial Sheds',
  'Boilers & Pressure Vessels',
  'Fired Heaters',
  'Storage Vessels & Heat Exchangers',
  'FEM Analysis',
  'Foundations & Civil Works',
  'Compressor Houses',
  'Steel & RCC Chimneys',
];

export default function Expertise() {
  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices,
  });

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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Our Expertise</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight">
              End-to-End Engineering Solutions
            </h1>
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
                  className="bg-white p-10 hover:bg-[#0a1628] hover:text-white group transition-colors duration-300"
                >
                  <div className="text-[#43648e] group-hover:text-white/60 mb-6 transition-colors">
                    {serviceIcons[svc.icon] || <Building2 className="w-10 h-10" />}
                  </div>
                  <h3 className="text-xl font-bold text-[#0a1628] group-hover:text-white mb-4 transition-colors">{svc.title}</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed transition-colors">{svc.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-[#0a1628] text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6">Engineering Activities</p>
            <h2 className="text-3xl font-bold mb-8">What We Do</h2>
            <div className="space-y-3">
              {activities.map((act) => (
                <div key={act} className="flex items-start gap-3 text-sm text-white/70">
                  <div className="w-1 h-1 rounded-full bg-[#43648e] mt-2 shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-6">Engineering Specialisms</p>
            <h2 className="text-3xl font-bold mb-8">What We Design</h2>
            <div className="space-y-3">
              {specialisms.map((spec) => (
                <div key={spec} className="flex items-start gap-3 text-sm text-white/70">
                  <div className="w-1 h-1 rounded-full bg-[#43648e] mt-2 shrink-0" />
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
                className="text-2xl font-bold text-[#0a1628]/30 hover:text-[#0a1628] transition-colors cursor-default"
              >
                {tool}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
