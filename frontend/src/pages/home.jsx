import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getStats, getProjects, getServices } from '@/lib/api';
import { fallbackProjects } from '@/data/fallbackProjects';
import { fallbackServices } from '@/data/fallbackServices';
import {
  Building2, Factory, Grid3X3, Activity, ClipboardList, Layers,
  Phone, Mail, Globe, MapPin, ArrowRight, CheckCircle2,
  Clock, Briefcase, Users, Monitor, ShieldCheck, Zap, Fuel, FlaskConical, Wrench
} from 'lucide-react';

const serviceIcons = {
  building: <Building2 className="w-8 h-8" />,
  factory: <Factory className="w-8 h-8" />,
  grid: <Grid3X3 className="w-8 h-8" />,
  activity: <Activity className="w-8 h-8" />,
  clipboard: <ClipboardList className="w-8 h-8" />,
  layers: <Layers className="w-8 h-8" />,
  monitor: <Monitor className="w-8 h-8" />,
};

const clients = [
  { name: 'L&T', full: 'Larsen & Toubro' },
  { name: 'BHEL', full: 'BHEL' },
  { name: 'HPCL', full: 'HPCL' },
  { name: 'DOOSAN', full: 'Doosan Babcock' },
  { name: 'Air Liquide', full: 'Air Liquide' },
];

const clientLogos = {
  'L&T': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <circle cx="16" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="16" y="24" textAnchor="middle" fontSize="9" fontWeight="900" fill="currentColor">L&T</text>
      <text x="35" y="23" fontSize="8" fontWeight="900" fill="currentColor" letterSpacing="0.3">LARSEN & TOUBRO</text>
    </svg>
  ),
  'BHEL': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <rect x="2" y="6" width="30" height="28" rx="2" fill="currentColor" />
      <text x="17" y="23" textAnchor="middle" fontSize="9" fontWeight="900" fill="white">BHEL</text>
      <text x="38" y="23" fontSize="9" fontWeight="900" fill="currentColor" letterSpacing="0.8">बीएचईएल</text>
    </svg>
  ),
  'HPCL': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <ellipse cx="20" cy="20" rx="18" ry="12" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="20" y="23" textAnchor="middle" fontSize="8" fontWeight="900" fill="currentColor">HPCL</text>
      <text x="45" y="23" fontSize="8" fontWeight="900" fill="currentColor" letterSpacing="0.3">HIN. PETROLEUM</text>
    </svg>
  ),
  'DOOSAN': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <text x="10" y="24" fontSize="14" fontWeight="900" fill="currentColor" letterSpacing="0.5">DOOSAN</text>
      <text x="80" y="23" fontSize="6" fontWeight="700" fill="currentColor">Babcock</text>
    </svg>
  ),
  'Air Liquide': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto fill-current">
      <path d="M 5 28 L 22 8 L 38 28 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <text x="45" y="23" fontSize="10" fontWeight="900" fill="currentColor" letterSpacing="0.3">AIR LIQUIDE</text>
    </svg>
  ),
};

const industries = [
  { name: 'Oil & Gas', icon: <Fuel className="w-5 h-5" /> },
  { name: 'Petrochemicals', icon: <FlaskConical className="w-5 h-5" /> },
  { name: 'Power Generation', icon: <Zap className="w-5 h-5" /> },
  { name: 'Chemical Plants', icon: <Factory className="w-5 h-5" /> },
  { name: 'Infrastructure', icon: <Building2 className="w-5 h-5" /> },
  { name: 'Steel Industry', icon: <Grid3X3 className="w-5 h-5" /> },
  { name: 'Energy Systems', icon: <Wrench className="w-5 h-5" /> },
];

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useQuery({ queryKey: ['stats'], queryFn: getStats });
  const { data: projects, isLoading: projectsLoading } = useQuery({ 
    queryKey: ['projects'], 
    queryFn: getProjects,
    initialData: fallbackProjects
  });
  const { data: services, isLoading: servicesLoading } = useQuery({ 
    queryKey: ['services'], 
    queryFn: getServices,
    initialData: fallbackServices
  });

  const featuredProjects = projects?.slice(0, 3);

  return (
    <div className="w-full bg-white">

      {/* 1. HERO & STATS COMBINED */}
      <section className="grid md:grid-cols-2 min-h-[480px]">
        <div className="bg-slate-50 text-[#0a1628] px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center relative overflow-hidden border-b border-slate-200">
          <div className="absolute inset-0 opacity-[0.05] text-[#0a1628] pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="herogrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#herogrid)" />
            </svg>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative z-10">
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-5">
              Engineering Excellence Since 2002
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
              Industrial Fired Heaters & Structural Engineering
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm">
              Providing full-scale mechanical and structural engineering consultancy designed in accordance with project-specific international and regional standards.
            </p>

            {/* Inline Stats Counter inside Hero */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 mb-8 border-t border-slate-200 pt-6 max-w-lg">
              {[
                { value: `${stats?.yearsExperience || 20}+`, label: 'Years Exp', sub: 'Since 2002' },
                { value: `${stats?.projectsCompleted || 500}+`, label: 'Projects', sub: 'Delivered' },
                { value: `${stats?.clientsServed || 25}+`, label: 'Clients', sub: 'Satisfied' },
                { value: `${stats?.softwarePlatforms || 5}+`, label: 'Software', sub: 'Platforms' }
              ].map((stat, idx) => (
                <div key={idx} className="min-w-0 flex flex-col justify-end">
                  <div className="text-xl font-bold text-[#0a1628] leading-none mb-1.5">{stat.value}</div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-0.5">{stat.label}</div>
                  <div className="text-[8px] text-slate-400 truncate leading-none">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-[#0a1628] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1a2f4c] transition-colors rounded-sm shadow-sm">
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/projects">
                <button className="flex items-center gap-2 border border-slate-300 text-[#0a1628] px-6 py-3 text-sm font-semibold hover:bg-slate-100 transition-colors rounded-sm">
                  View Our Projects <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[350px] md:min-h-[480px] overflow-hidden bg-slate-100 border-l border-slate-200"
        >
          <img
            src="/hero_industrial_plant.png"
            alt="SLS Engineering Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-700 hover:scale-105"
          />
        </motion.div>
      </section>

      {/* 2. COMPACT ABOUT & FOUNDER (SINGLE COMPACT MODULE) */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-gray-50 border border-gray-100 p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 max-w-5xl mx-auto">
            <div className="max-w-xl">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#43648e] block mb-2">Our Profile</span>
              <p className="text-[#0a1628] text-sm md:text-base leading-relaxed mb-4">
                Established in 2002, SLS Consultants provides premium structural design, stress analysis, and steel detailing solutions for heavy industrial refineries, boilers, and petrochemical facilities across India and global markets.
              </p>
              <Link href="/about">
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#43648e] cursor-pointer hover:text-[#0a1628] transition-colors">
                  Learn More About SLS &rarr;
                </span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8 shrink-0 w-full md:w-auto">
              <div className="w-14 h-14 bg-gray-200 overflow-hidden shrink-0 rounded-sm">
                <img
                  src="/founder_portrait.png"
                  alt="Mr. C. Subrahmanyam"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0a1628] leading-tight">Mr. C. Subrahmanyam</h4>
                <p className="text-[11px] text-gray-500 font-medium mt-0.5">Founder &amp; Principal Engineer</p>
                {/* Descriptive metadata — not a link */}
                <p className="text-[10px] text-gray-400 font-medium mt-1">Ex-BHEL (18 Yrs)&nbsp;&nbsp;|&nbsp;&nbsp;Ex-Doosan Babcock</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES (CAPPED AT 6 SERVICES WITH DETAIL LINK) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Core Capabilities</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Our Featured Services</h2>
            </div>
          </AnimatedSection>
          {servicesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                {services?.slice(0, 6).map((svc, i) => (
                  <motion.div
                    key={svc.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[#43648e] mb-4">
                        {serviceIcons[svc.icon] || <Building2 className="w-8 h-8" />}
                      </div>
                      <h3 className="font-bold text-[#0a1628] text-sm mb-2">{svc.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{svc.description}</p>
                    </div>
                    <div>
                      <Link href={`/contact?service=${encodeURIComponent(svc.title)}`}>
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-blue-700 cursor-pointer border-b border-transparent hover:border-blue-700 pb-0.5">
                          Book Service &rarr;
                        </span>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <Link href="/services">
                  <button className="inline-flex items-center gap-2 border border-gray-300 text-[#0a1628] px-8 py-3 text-sm font-semibold hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-colors">
                    View All Services &rarr;
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. FEATURED PROJECTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Featured Projects</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Significant Projects Delivered</h2>
            </div>
          </AnimatedSection>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-56" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10">
              {featuredProjects?.map((proj, i) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="border border-gray-200 hover:shadow-md transition-shadow duration-200 group"
                >
                  <div className="w-full h-36 bg-gray-50 overflow-hidden flex items-center justify-center border-b border-gray-200 group-hover:bg-gray-100 transition-colors relative">
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
                      <Building2 className="w-8 h-8 text-gray-200" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0a1628] text-xs leading-snug mb-2">{proj.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{proj.description.substring(0, 90)}...</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/projects">
              <button className="inline-flex items-center gap-2 border border-gray-300 text-[#0a1628] px-8 py-3 text-sm font-semibold hover:bg-[#0a1628] hover:text-white hover:border-[#0a1628] transition-colors">
                View All Projects <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CLIENT TESTIMONIALS (EXACTLY 2 CARDS SIDE-BY-SIDE) */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Client Feedback</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">What Our Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: "SLS Consultants has been a key detailing partner for our critical refinery packages. Their adherence to EIL standards and prompt engineering revisions under Mr. Subrahmanyam's guidance kept our projects on schedule.",
                author: "Senior Engineering Manager",
                company: "Larsen & Toubro"
              },
              {
                quote: "Their remaining life assessment and FEA reporting for our heater casing was thorough, well-documented, and crucial for our statutory approvals. Exceptional technical detailing capability.",
                author: "Mechanical Detailing Lead",
                company: "HPCL Vizag Refinery"
              }
            ].map((t, idx) => (
              <div key={idx} className="bg-white border border-gray-200 p-6 md:p-8 flex flex-col justify-between shadow-sm">
                <p className="text-gray-600 text-xs md:text-sm italic leading-relaxed mb-6">
                  “{t.quote}”
                </p>
                <div>
                  <h4 className="text-xs font-bold text-[#0a1628]">{t.author}</h4>
                  <p className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider mt-0.5">{t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CLIENT LOGOS & TARGET SECTORS */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-8">
              Trusted by Leading Organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-12">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="border border-gray-300 px-6 py-3 min-w-[160px] h-14 flex items-center justify-center bg-white"
                >
                  <div className="text-[#0a1628] flex items-center justify-center w-full">
                    {clientLogos[client.name] || (
                      <span className="text-sm font-bold tracking-wide">{client.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-10">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-6">
                Engineering Solutions Across Industrial Sectors
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {industries.map((ind) => (
                  <div key={ind.name} className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2">
                    <div className="text-blue-700">{ind.icon}</div>
                    <span className="text-[10px] font-bold text-[#0a1628] uppercase tracking-wider">{ind.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 7. SOFTWARE EXPERTISE LOGO STRIP */}
      <section className="py-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-[9px] font-bold uppercase tracking-widest text-center text-gray-400 mb-6">
            Powered by industry-standard tools
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 opacity-65">
            {['AutoCAD', 'STAAD.Pro', 'Tekla Structures', 'ANSYS', 'CATIA'].map((sw) => (
              <span key={sw} className="text-xs md:text-sm font-bold tracking-widest text-[#0a1628] uppercase">
                {sw}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-20 bg-slate-50 text-[#0a1628] relative overflow-hidden border-t border-slate-200">
        <div className="absolute inset-0 opacity-[0.05] text-[#0a1628] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="ctagrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ctagrid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Project Consultation</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Have a Project in Mind?<br />
              <span className="text-[#43648e]">Let's Engineer It Together.</span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Share your project scope, connection codes, or drawing layouts with us. Our engineers will review your requirements and coordinate a technical proposal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-[#0a1628] text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#1a2f4c] transition-colors rounded-sm shadow-md">
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="tel:+919849598424" rel="external" className="flex items-center gap-2 border border-slate-300 bg-white text-[#0a1628] px-8 py-4 text-sm font-semibold hover:bg-slate-100 transition-colors rounded-sm shadow-sm">
                <Phone className="w-4 h-4" /> Call Us Now
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-6">
              Confidential project information handled securely · Response within timezone working hours
            </p>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
