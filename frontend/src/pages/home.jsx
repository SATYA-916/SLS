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

  const featuredProjects = projects?.slice(0, 4);

  return (
    <div className="w-full bg-white">

      {/* 1. HERO */}
      <section className="grid md:grid-cols-2 min-h-[480px]">
        <div className="bg-[#0a1628] text-white px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="herogrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#herogrid)" />
            </svg>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="relative z-10">
            <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-5">
              Engineering Excellence Since 2002
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.1] mb-6">
              Industrial Fired Heaters & Structural Engineering Solutions
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
              Providing full-scale mechanical and structural engineering consultancy designed in accordance with project-specific international and regional standards.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-white text-[#0a1628] px-6 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link href="/projects">
                <button className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 text-sm font-semibold hover:bg-white/10 transition-colors">
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
          className="relative min-h-[350px] md:min-h-[480px] overflow-hidden bg-gray-900 border-l border-gray-800"
        >
          <img
            src="/hero_industrial_plant.png"
            alt="SLS Engineering Hero"
            className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10 pointer-events-none" />
        </motion.div>
      </section>

      {/* 2. STATS */}
      <section className="bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 py-10 gap-6">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
              {[
                { icon: <Clock className="w-7 h-7" />, value: `${stats?.yearsExperience || 20}+`, label: 'Years of Experience', sub: 'Since 2002' },
                { icon: <Briefcase className="w-7 h-7" />, value: `${stats?.projectsCompleted || 500}+`, label: 'Projects Completed', sub: 'Across India & Abroad' },
                { icon: <Users className="w-7 h-7" />, value: `${stats?.clientsServed || 25}+`, label: 'Satisfied Clients', sub: 'In Diverse Industries' },
                { icon: <Monitor className="w-7 h-7" />, value: `${stats?.softwarePlatforms || 5}+`, label: 'Engineering Software', sub: 'Platforms' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="flex flex-col items-center text-center py-10 px-4"
                >
                  <div className="text-gray-400 mb-3">{stat.icon}</div>
                  <div className="text-3xl font-bold text-[#0a1628] mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold text-gray-700">{stat.label}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.sub}</div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. ABOUT PREVIEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-14 items-start">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">About SLS Consultants</p>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] leading-tight mb-6">
                  Engineering Excellence.<br />Driven by Innovation.
                </h2>
                <div className="w-10 h-0.5 bg-blue-700 mb-6" />
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  SLS Consultants was established in 2002 by Mr. C. Subrahmanyam after 18 years of rich experience with BHPV (BHEL) and Mitsui Babcock / Doosan Babcock.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  We specialize in delivering high-fidelity design layouts, stress analysis, and structural detailing packages tailored to complex heavy industrial scopes.
                </p>
                <div className="space-y-3">
                  {[
                    'Improve fabrication accuracy through detailed engineering.',
                    'Reduce project delays with coordinated engineering deliverables.',
                    'Deliver engineering packages that support efficient fabrication and construction.'
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center aspect-square">
                  <img
                    src="/founder_portrait.png"
                    alt="Mr. C. Subrahmanyam"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Founder</p>
                  <h3 className="text-xl font-bold text-[#0a1628] mb-1">Mr. C. Subrahmanyam</h3>
                  <p className="text-xs text-blue-700 font-semibold mb-3">Ex-BHEL (18 Years)<br />Ex-Doosan Babcock</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Bringing decades of rigorous industrial design standards to global partners.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. FEATURED SERVICES */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Core Capabilities</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Our Featured Services</h2>
            </div>
          </AnimatedSection>
          {servicesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services?.slice(0, 6).map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="bg-white border border-gray-200 p-6 hover:border-blue-700 hover:shadow-md transition-all duration-200 group flex flex-col"
                >
                  <div className="text-gray-300 group-hover:text-blue-700 mb-4 transition-colors">
                    {serviceIcons[svc.icon] || <Building2 className="w-8 h-8" />}
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2">{svc.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-grow">{svc.description}</p>
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
          )}
        </div>
      </section>

      {/* 5. FEATURED PROJECTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Featured Projects</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Significant Projects Delivered</h2>
            </div>
          </AnimatedSection>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-56" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-10">
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

      {/* 6. CLIENT LOGOS */}
      <section className="py-16 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-10">
              Trusted by Leading Organizations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-5">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="border border-gray-200 px-6 py-3 min-w-[160px] h-14 flex items-center justify-center hover:border-blue-700 hover:shadow-sm transition-all duration-200 group bg-white"
                >
                  <div className="text-gray-400 group-hover:text-[#0a1628] transition-colors flex items-center justify-center w-full">
                    {clientLogos[client.name] || (
                      <span className="text-sm font-bold tracking-wide">{client.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-400 italic">
              Detailed fired heaters and structural solutions for multi-billion dollar state-owned and private refineries.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* 7. WHY CHOOSE SLS & WHO WE WORK WITH (TRUST BANNER) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            
            {/* Trust factors */}
            <AnimatedSection>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Credibility</p>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Trusted Since 2002</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                With over 20 years of experience as industrial engineering specialists, we have delivered 500+ successful projects across India and international markets.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: '20+ Years', desc: 'Industrial Engineering Specialists' },
                  { value: '500+ Projects', desc: 'Delivered to Strict Specifications' },
                  { value: 'ASME & API', desc: 'International Code Compliance' },
                  { value: 'Since 2002', desc: 'Established Reputation' }
                ].map((item, idx) => (
                  <div key={idx} className="border-l-2 border-blue-700 pl-4">
                    <div className="font-bold text-[#0a1628] text-lg mb-1">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Who we work with / Industries */}
            <AnimatedSection>
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Target Sectors</p>
              <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Who We Work With</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                We serve engineering managers, procurement leads, and EPC contractors across diverse industrial markets:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {industries.map((ind) => (
                  <div key={ind.name} className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 hover:border-gray-200 transition-colors">
                    <div className="text-blue-700">{ind.icon}</div>
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{ind.name}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#herogrid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Project Consultation</p>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Have a Project in Mind?<br />
              <span className="text-blue-400">Let's Engineer It Together.</span>
            </h2>
            <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Share your project scope, connection codes, or drawing layouts with us. Our engineers will review your requirements and coordinate a technical proposal.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-white text-[#0a1628] px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-white/90 transition-colors shadow-lg">
                  Request a Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="tel:+919849598424" className="flex items-center gap-2 border border-white/20 text-white px-8 py-4 text-sm font-semibold hover:bg-white/5 transition-colors">
                <Phone className="w-4 h-4" /> Call Us Now
              </a>
            </div>
            <p className="text-xs text-white/40 mt-6">
              Confidential project information handled securely · Response within timezone working hours
            </p>
          </AnimatedSection>
        </div>
      </section>

    </div>
  );
}
