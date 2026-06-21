import { Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getStats, getProjects, getServices } from '@/lib/api';
import {
  Building2, Factory, Grid3X3, Activity, ClipboardList, Layers,
  Phone, Mail, Globe, MapPin, ArrowRight, CheckCircle2,
  Fuel, Zap, FlaskConical, Landmark, Wrench,
  Clock, Briefcase, Users, Monitor,
} from 'lucide-react';

const serviceIcons = {
  building: <Building2 className="w-8 h-8" />,
  factory: <Factory className="w-8 h-8" />,
  grid: <Grid3X3 className="w-8 h-8" />,
  activity: <Activity className="w-8 h-8" />,
  clipboard: <ClipboardList className="w-8 h-8" />,
  layers: <Layers className="w-8 h-8" />,
};

const clients = [
  { name: 'L&T', full: 'Larsen & Toubro' },
  { name: 'BHEL', full: 'BHEL' },
  { name: 'HPCL', full: 'HPCL' },
  { name: 'DOOSAN', full: 'Doosan Babcock' },
  { name: 'Air Liquide', full: 'Air Liquide' },
  { name: 'PETRON', full: 'Petron Engineering' },
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
    <svg viewBox="0 0 120 40" className="h-7 w-auto">
      <circle cx="16" cy="20" r="13" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="16" cy="20" r="9" fill="currentColor" className="text-blue-600 opacity-60 group-hover:opacity-100" />
      <text x="16" y="23" textAnchor="middle" fontSize="8" fontWeight="900" fill="white">HP</text>
      <text x="35" y="24" fontSize="10" fontWeight="900" fill="currentColor" letterSpacing="0.8">HPCL</text>
    </svg>
  ),
  'DOOSAN': (
    <svg viewBox="0 0 120 40" className="h-6 w-auto fill-current">
      <text x="0" y="25" fontSize="16" fontWeight="900" fontStyle="italic" fill="currentColor" letterSpacing="-0.5">DOOSAN</text>
    </svg>
  ),
  'Air Liquide': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto">
      <path d="M 5 30 L 18 8 L 31 30 Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="19" r="2" fill="currentColor" />
      <text x="37" y="19" fontSize="8" fontWeight="900" fill="currentColor" letterSpacing="0.3">AIR LIQUIDE</text>
      <text x="37" y="27" fontSize="5" fontWeight="500" fill="currentColor" className="opacity-60">Creative Oxygen</text>
    </svg>
  ),
  'PETRON': (
    <svg viewBox="0 0 120 40" className="h-7 w-auto">
      <path d="M 4 10 L 16 30 L 28 10" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <text x="35" y="23" fontSize="10" fontWeight="900" fill="currentColor" letterSpacing="1">PETRON</text>
    </svg>
  ),
};

const softwareTools = ['STAAD.Pro', 'ANSYS', 'Tekla Structures', 'AutoCAD', 'CATIA'];

const industries = [
  { name: 'Oil & Gas', icon: <Fuel className="w-6 h-6" /> },
  { name: 'Power', icon: <Zap className="w-6 h-6" /> },
  { name: 'Petrochemical', icon: <FlaskConical className="w-6 h-6" /> },
  { name: 'Infrastructure', icon: <Landmark className="w-6 h-6" /> },
  { name: 'Industrial', icon: <Wrench className="w-6 h-6" /> },
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
  const { data: projects, isLoading: projectsLoading } = useQuery({ queryKey: ['projects'], queryFn: getProjects });
  const { data: services, isLoading: servicesLoading } = useQuery({ queryKey: ['services'], queryFn: getServices });

  const featuredProjects = projects?.slice(0, 4);

  return (
    <div className="w-full bg-white">

      {/* HERO */}
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
              Engineering the Future with Strength and Innovation.
            </h1>
            <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
              Structural, Industrial & Project Engineering Solutions that deliver Safety, Quality and Value.
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

      {/* STATS BAR */}
      <section className="bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          {statsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 py-10 gap-6">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
              {[
                { icon: <Clock className="w-7 h-7" />, value: `${stats?.yearsExperience}+`, label: 'Years of Experience', sub: 'Since 2002' },
                { icon: <Briefcase className="w-7 h-7" />, value: `${stats?.projectsCompleted}+`, label: 'Projects Completed', sub: 'Across India & Abroad' },
                { icon: <Users className="w-7 h-7" />, value: `${stats?.clientsServed}+`, label: 'Satisfied Clients', sub: 'In Diverse Industries' },
                { icon: <Monitor className="w-7 h-7" />, value: `${stats?.softwarePlatforms}+`, label: 'Engineering Software', sub: 'Platforms' },
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

      {/* ABOUT SLS */}
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
                  SLS Structo-Mech Consultants was established in 2002 by Mr. C. Subrahmanyam after 18 years of rich experience with BHARAT HEAVY PLATE VESSELS LIMITED (BHEL) and MITSUI BABCOCK ENERGY (I) PVT LIMITED (Doosan Babcock).
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  We provide comprehensive engineering, design and project consultancy services for industrial and infrastructure projects with commitment to quality, safety and client satisfaction.
                </p>
                <div className="space-y-2.5">
                  {['Cost effective quality solutions', 'Products and services shall meet or exceed client expectations'].map((item) => (
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
                    With deep industry knowledge and engineering excellence, he laid the foundation of SLS in 2002.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* EXPERTISE */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Our Expertise</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">End-to-End Engineering Solutions</h2>
            </div>
          </AnimatedSection>
          {servicesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {services?.map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="bg-white border border-gray-200 p-6 hover:border-blue-700 hover:shadow-md transition-all duration-200 group"
                >
                  <div className="text-gray-300 group-hover:text-blue-700 mb-4 transition-colors">
                    {serviceIcons[svc.icon] || <Building2 className="w-8 h-8" />}
                  </div>
                  <h3 className="font-bold text-[#0a1628] text-sm mb-2">{svc.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{svc.description}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CLIENTS */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-10">Our Clients</p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-5">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="border border-gray-200 px-6 py-3 min-w-[160px] h-14 flex items-center justify-center hover:border-blue-700 hover:shadow-sm transition-all duration-200 group bg-gray-50/50 hover:bg-white"
                >
                  <div className="text-gray-400 group-hover:text-[#0a1628] transition-colors flex items-center justify-center w-full">
                    {clientLogos[client.name] || (
                      <span className="text-sm font-bold tracking-wide">{client.name}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-xs text-gray-400 italic">and many more...</p>
          </AnimatedSection>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Featured Projects</p>
              <h2 className="text-3xl font-bold text-[#0a1628]">Some of Our Significant Projects</h2>
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

      {/* SOFTWARE EXPERTISE */}
      <section className="py-14 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 text-center mb-8">Software Expertise</p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {softwareTools.map((tool, i) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center gap-3 border border-gray-200 bg-white px-5 py-3 hover:border-blue-700 hover:shadow-sm transition-all"
                >
                  <Monitor className="w-4 h-4 text-gray-300" />
                  <span className="text-sm font-semibold text-gray-600">{tool}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Client Appreciation</p>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628]">What Our Clients Say</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <p className="text-sm text-gray-500 italic leading-relaxed mb-6">
                "The work SLS had provided for the project 'Radiography Solutions For Vizag Vessel Project - L&T' is commendable. They supported us in each and every step from conceptual stage till the project was executed."
              </p>
              <div>
                <h4 className="font-bold text-sm text-[#0a1628]">HN Somani</h4>
                <p className="text-xs text-blue-700 font-semibold">Sr DGM — Larsen & Toubro (L&T)</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col justify-between"
            >
              <p className="text-sm text-gray-500 italic leading-relaxed mb-6">
                "We used SLS services for one of our Multistoried Residential Building Project at Visakhapatnam. The scope of their services included Architectural Planning, Structural Design, Rain Water Harvesting and Solar Water Heating Installation. We recommend their services."
              </p>
              <div>
                <h4 className="font-bold text-sm text-[#0a1628]">P Vishnu Kumar Raju</h4>
                <p className="text-xs text-blue-700 font-semibold">MD — SVC Projects Pvt. Ltd.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20 bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">Free Initial Consultation</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0a1628] leading-tight mb-4">
              Have a Project in Mind?<br />
              <span className="text-[#43648e]">Let's Engineer It Together.</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base max-w-xl mx-auto mb-10 leading-relaxed">
              Whether it's a structural challenge, an industrial project, or a feasibility study — our experts are ready to help. Share your requirements and get a personalised response within 24 hours.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact">
                <button className="flex items-center gap-2 bg-[#0a1628] text-white px-8 py-4 text-sm font-bold uppercase tracking-wider hover:bg-[#0a1628]/90 transition-colors shadow-lg">
                  Request a Free Consultation <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <a href="tel:+919849598424" className="flex items-center gap-2 border border-gray-300 text-[#0a1628] px-8 py-4 text-sm font-semibold hover:bg-gray-50 transition-colors">
                <Phone className="w-4 h-4" /> Call Us Now
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-6">No commitment required · Response within 24 hours · 20+ years of engineering expertise</p>
          </AnimatedSection>
        </div>
      </section>

      {/* WHY CHOOSE US + INDUSTRIES + CONTACT */}
      <section className="py-16 bg-[#0a1628] text-white">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12">
          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-5">Why Choose Us</p>
            <div className="space-y-4">
              {[
                'SLS is committed to deliver COST EFFECTIVE QUALITY SOLUTIONS.',
                'Our products and services shall meet or exceed client expectations.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/60 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-5">Industries We Serve</p>
            <div className="grid grid-cols-2 gap-3">
              {industries.map((ind) => (
                <div key={ind.name} className="flex items-center gap-2.5">
                  <div className="text-blue-400 shrink-0">{ind.icon}</div>
                  <span className="text-sm text-white/60">{ind.name}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 mb-5">Get In Touch</p>
            <div className="space-y-3">
              {[
                { icon: <Phone className="w-4 h-4 text-blue-400 shrink-0" />, text: '+91 98495 98424' },
                { icon: <Mail className="w-4 h-4 text-blue-400 shrink-0" />, text: 'slsind@gmail.com, slsvizag@gmail.com' },
                { icon: <Globe className="w-4 h-4 text-blue-400 shrink-0" />, text: 'www.slsvizag.com' },
                { icon: <MapPin className="w-4 h-4 text-blue-400 shrink-0" />, text: 'Visakhapatnam, Andhra Pradesh, India' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-white/60">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
