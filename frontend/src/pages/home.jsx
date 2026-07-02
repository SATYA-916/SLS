import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ChevronDown, ChevronRight, Building2, Factory, Grid3X3, Activity, Layers, Monitor, Briefcase, Star, Trophy, ShieldCheck, DollarSign } from 'lucide-react';
import { getProjects } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

// Helper components for animation
const AnimatedSection = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className={className}
  >
    {children}
  </motion.div>
);

const serviceIcons = {
  building: <Building2 className="w-8 h-8" />,
  factory: <Factory className="w-8 h-8" />,
  grid: <Grid3X3 className="w-8 h-8" />,
  activity: <Activity className="w-8 h-8" />,
  layers: <Layers className="w-8 h-8" />,
  monitor: <Monitor className="w-8 h-8" />,
  briefcase: <Briefcase className="w-8 h-8" />
};

const clients = [
  { name: 'L&T', logo: '/logo_lnt_1782066190911.png' },
  { name: 'BHEL', logo: '/logo_bhel_1782066215811.png' },
  { name: 'HPCL', logo: '/logo_lnt_1782066190911.png' }, // Fallbacks
  { name: 'DOOSAN', logo: '/logo_bhel_1782066215811.png' },
  { name: 'Air Liquide', logo: '/logo_lnt_1782066190911.png' },
  { name: 'PETRON', logo: '/logo_bhel_1782066215811.png' }
];

export default function Home() {
  const { data: allProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['/api/projects'],
    queryFn: getProjects,
  });

  // Limit to 3 projects for the homepage
  const featuredProjects = allProjects ? allProjects.slice(0, 3) : [];

  // Static list of 4 featured services
  const featuredServices = [
    {
      title: 'Structural Engineering',
      desc: 'High-grade civil & structural calculations, foundations, concrete frames, and seismic analysis under global codes.',
      icon: <Building2 className="w-6 h-6 text-blue-500" />,
      link: '/services'
    },
    {
      title: 'Industrial Design',
      desc: 'Mechanical detailing and casing layouts for heavy refinery equipment, pressure vessels, and steel fabrications.',
      icon: <Factory className="w-6 h-6 text-blue-500" />,
      link: '/services'
    },
    {
      title: 'Fired Heater Engineering',
      desc: 'Technical detailing, convection/radiant coils layout, and stack design complying with API 530 standards.',
      icon: <Layers className="w-6 h-6 text-blue-500" />,
      link: '/services'
    },
    {
      title: 'Remaining Life Assessment (RLA)',
      desc: 'Ultrasonic inspections, non-destructive testing (NDT), and structural integrity modeling for aging plant structures.',
      icon: <Grid3X3 className="w-6 h-6 text-blue-500" />,
      link: '/services'
    }
  ];

  return (
    <div className="w-full bg-white overflow-hidden">
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: scroll 20s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* 1. HERO SECTION (Reduced Height to ~75-80vh) */}
      <section className="grid md:grid-cols-2 min-h-[75vh] md:h-[78vh] relative items-stretch border-b border-gray-100">
        <div className="bg-[#0a1628] text-white px-8 md:px-16 py-12 md:py-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="herogrid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="white" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#herogrid)" />
            </svg>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-10">
            <span className="inline-block text-[9px] font-bold tracking-[0.25em] uppercase text-white/40 mb-4">
              Engineering Excellence Since 2002
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] mb-5 tracking-tight">
              Industrial Fired Heaters & Structural Engineering Solutions
            </h1>
            <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-8 max-w-md">
              Providing full-scale mechanical and structural engineering consultancy—from thermal design and FEA to complete shop detailing drawing packages.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact">
                <span className="flex items-center gap-2 bg-white text-[#0a1628] px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/95 transition-all cursor-pointer shadow-sm">
                  Request Consultation &rarr;
                </span>
              </Link>
              <Link href="/projects">
                <span className="flex items-center gap-2 border border-white/20 text-white px-5 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer">
                  View Portfolio
                </span>
              </Link>
            </div>
          </motion.div>

          {/* Subtle scroll indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center opacity-40 text-white animate-bounce pointer-events-none">
            <span className="text-[8px] uppercase tracking-widest mb-1.5">Scroll</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        
        <div className="relative bg-[#f8f9fa] hidden md:block overflow-hidden">
          <img
            src="/hero_industrial_plant_1782063816277.png"
            alt="Refinery Plant"
            className="w-full h-full object-cover object-center opacity-95"
          />
        </div>
      </section>

      {/* 2. STATISTICS SECTION (Reduced Spacing & Height) */}
      <section className="py-10 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '20+', label: 'Years Experience' },
              { num: '500+', label: 'Projects Delivered' },
              { num: '50+', label: 'Refinery & Power Clients' },
              { num: '5+', label: 'Engineering Software Platforms' }
            ].map((stat, idx) => (
              <div key={idx} className="p-2 border-r border-gray-200 last:border-0">
                <div className="text-3xl font-extrabold text-[#0a1628] tracking-tight">{stat.num}</div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. ABOUT PREVIEW SECTION (Short & Concise Preview) */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <AnimatedSection>
            <span className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase text-blue-700 mb-3">About SLS Consultants</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-5 tracking-tight">Two Decades of High-Precision Engineering</h2>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-8 max-w-2xl mx-auto">
              Founded in 2002 by Mr. C. Subrahmanyam (ex-BHEL), SLS Consultants has delivered over 500+ design projects across India and internationally. We combine decades of structural steel expertise with dynamic thermodynamic detailing to engineer safe, compliant, and cost-effective industrial solutions.
            </p>
            <Link href="/about">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0a1628] hover:text-blue-700 transition-colors cursor-pointer">
                Learn More About Us <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* 4. SERVICES PREVIEW (4 Featured Services) */}
      <section className="py-20 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Capabilities</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] tracking-tight">Our Core Services</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {featuredServices.map((svc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
              >
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-[#0a1628] flex items-center justify-center rounded-sm mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {svc.icon}
                  </div>
                  <h3 className="font-bold text-sm text-[#0a1628] mb-3">{svc.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed mb-5">{svc.desc}</p>
                </div>
                <Link href={svc.link}>
                  <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-blue-700 transition-colors cursor-pointer flex items-center gap-1">
                    Learn More <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/services">
              <span className="bg-[#0a1628] text-white hover:bg-[#43648e] transition-colors px-6 py-3.5 text-xs font-bold uppercase tracking-wider inline-block cursor-pointer">
                View All Services
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED PROJECTS (Only 3 Projects, Large Cards) */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Featured Portfolios</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] tracking-tight">Recent Projects</h2>
          </AnimatedSection>

          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featuredProjects.map((proj, i) => (
                <motion.div
                  key={proj.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="aspect-[16/10] bg-slate-900 overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block mb-1">{proj.category}</span>
                      <h3 className="font-bold text-sm text-[#0a1628] mb-2">{proj.title}</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">{proj.description.substring(0, 110)}...</p>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 group-hover:text-blue-700 flex items-center gap-1.5 transition-colors">
                      {proj.client && <span>{proj.client}</span>}
                      <span>•</span>
                      <span>{proj.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link href="/projects">
              <span className="bg-transparent border border-[#0a1628] text-[#0a1628] hover:bg-[#0a1628] hover:text-white transition-all px-6 py-3 text-xs font-bold uppercase tracking-wider inline-block cursor-pointer">
                View Complete Portfolio
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CLIENT LOGOS CAROUSEL (Scrolling Logo Marquee) */}
      <section className="py-12 bg-gray-50 border-b border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4 mb-4 text-center">
          <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-gray-400">Trusted By Industry Leaders</span>
        </div>
        <div className="w-full relative flex items-center">
          <div className="marquee-track flex items-center gap-16 py-4">
            {/* Double the array elements for seamless loops */}
            {[...clients, ...clients, ...clients].map((client, idx) => (
              <div key={idx} className="h-9 w-24 shrink-0 opacity-40 hover:opacity-85 transition-opacity flex items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  className="max-h-full max-w-full object-contain filter grayscale"
                  onError={(e) => {
                    // Fallback to text logo representation
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<span className="font-black text-sm text-gray-500">${client.name}</span>`;
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE SLS (4 Premium Feature Cards) */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Our Standards</span>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] tracking-tight">Why Partner With SLS?</h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Trophy className="w-6 h-6 text-blue-700" />, title: "20+ Years Experience", desc: "Accumulated engineering intelligence in fired heaters, heavy foundations, and industrial structural design since 2002." },
              { icon: <Star className="w-6 h-6 text-blue-700" />, title: "500+ Projects", desc: "Successful delivery of large-scale engineering design and fabrication packages for refinery, power, and manufacturing plants." },
              { icon: <ShieldCheck className="w-6 h-6 text-blue-700" />, title: "International Standards", desc: "Design and detailing compliance with stringent codes including API 530, ASME Sec VIII, and EIL specific specifications." },
              { icon: <DollarSign className="w-6 h-6 text-blue-700" />, title: "Cost Effective Engineering", desc: "Optimizing steel member profiles and weld layouts in Tekla to reduce raw material tonnage and shop fabrication costs." }
            ].map((card, idx) => (
              <div key={idx} className="border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-50 text-blue-700 flex items-center justify-center rounded-sm mb-4">
                  {card.icon}
                </div>
                <h4 className="font-bold text-sm text-[#0a1628] mb-2">{card.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA SECTION (Large Full-Width Card) */}
      <section className="py-20 bg-[#0a1628] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#herogrid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10 max-w-3xl text-center">
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-white/40 mb-3 block">Start Your Journey</span>
          <h3 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Let's Build Your Next Engineering Project</h3>
          <p className="text-white/60 text-xs md:text-sm leading-relaxed mb-8 max-w-xl mx-auto">
            Get in touch with our engineering team to discuss detailed drawings, RLA assessments, dynamic calculations, or specialized fired heater designs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact?service=Industrial%20Design%20%26%20Support">
              <span className="bg-white text-[#0a1628] px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all cursor-pointer">
                Request Consultation
              </span>
            </Link>
            <Link href="/contact">
              <span className="border border-white/20 text-white hover:bg-white/10 transition-all px-6 py-3 text-xs font-bold uppercase tracking-wider cursor-pointer">
                Contact Us
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
