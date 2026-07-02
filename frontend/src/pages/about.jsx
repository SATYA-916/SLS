import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Clock, ShieldCheck, Cpu } from 'lucide-react';

const values = [
  { title: 'Quality First', desc: 'Every deliverable meets or exceeds the client\'s technical and safety expectations.' },
  { title: 'Cost Effectiveness', desc: 'Innovative engineering approaches that deliver value without compromising integrity.' },
  { title: 'Client Commitment', desc: 'Dedicated partnership from concept through commissioning on every project.' },
  { title: 'Technical Excellence', desc: '20+ years of accumulated expertise in multi-disciplinary engineering.' },
];

const milestones = [
  { year: '2002', event: 'SLS Consultants founded by Mr. C. Subrahmanyam in Visakhapatnam.' },
  { year: '2003', event: 'Completed first major projects for Larsen & Toubro and HPCL. Entered cryogenic plant engineering through Air Liquide.' },
  { year: '2005-2007', event: 'Expanded into boiler structures, chimneys, and nuclear power plant work (BHAVINI Kalpakkam).' },
  { year: '2008-2012', event: 'Delivered major fired heater packages for HPCL, BPCL, Nagarjuna, and global clients through Doosan Babcock and Technip-KTI.' },
  { year: '2013-2015', event: 'International project delivery (Yemen LNG) and power boiler detailing using Tekla Structures for L&T MHPS.' },
  { year: '2015+', event: 'Expanded services to include Software & AI Solutions, BIM, and digital engineering for industry.' },
];

export default function About() {
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">About SLS</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl">
              Engineering Excellence. Driven by Innovation.
            </h1>
          </motion.div>
        </div>
      </section>

      {/* STORY & FOUNDER BLOCK */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-blue-700 block mb-1">Our History</span>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Our Story</h2>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              SLS Consultants was established in 2002 by Mr. C. Subrahmanyam in Visakhapatnam, Andhra Pradesh, following 18 distinguished years of engineering experience with BHARAT HEAVY PLATE VESSELS LIMITED (BHEL) and MITSUI BABCOCK ENERGY (I) PVT LIMITED (now Doosan Babcock).
            </p>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              From its inception, SLS has been driven by a singular vision: to deliver cost-effective, quality engineering solutions that meet or exceed client expectations. The firm specialises in structural engineering, industrial project consultancy, FEM analysis, remaining life assessments (RLA), and comprehensive steel detailing.
            </p>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Over two decades, SLS has successfully delivered 500+ projects across India and internationally — for clients including L&T, BHEL, HPCL, Doosan Babcock, Air Liquide, and Petron Engineering.
            </p>
          </motion.div>

          {/* Founder profile card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#0a1628] text-white p-8 md:p-10 shadow-lg relative border border-white/5"
          >
            <div className="flex items-center gap-6 mb-8 border-b border-white/10 pb-6">
              <div className="w-16 h-16 rounded-full bg-white/10 overflow-hidden shrink-0 border-2 border-[#43648e] flex items-center justify-center">
                <img
                  src="/founder_portrait.png"
                  alt="Mr. C. Subrahmanyam"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<span className="font-bold text-lg text-blue-400">CS</span>`;
                  }}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold">Mr. C. Subrahmanyam</h3>
                <p className="text-[#43648e] text-xs font-bold uppercase tracking-wider mt-0.5">Founder & Principal Engineer</p>
              </div>
            </div>

            <div className="space-y-4 mb-6 text-xs text-white/70">
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Ex-BHEL (Bharat Heavy Plate Vessels Limited) — 18 Years Sizing Experience</span>
              </div>
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Ex-Mitsui Babcock Energy (I) Pvt Ltd (Now Doosan Babcock)</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>20+ Years Heading SLS Consultants Design Teams</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 text-xs text-white/60 leading-relaxed italic">
              "Recognised by Larsen & Toubro with a Letter of Appreciation for engineering services rendered on handling structures for a heavy refinery vessel of 10,000mm diameter."
            </div>
          </motion.div>
        </div>
      </section>

      {/* ANIMATED VERTICAL TIMELINE */}
      <section className="py-20 bg-gray-50 border-t border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-blue-700 block mb-2">Our Journey</span>
            <h2 className="text-3xl font-bold text-[#0a1628]">Two Decades of Engineering Milestones</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto relative border-l border-gray-300 pl-8 space-y-12 py-4">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative"
              >
                {/* Timeline Dot marker */}
                <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-[#0a1628] border-4 border-gray-50 flex items-center justify-center z-10" />
                
                <div>
                  <span className="text-xs font-black text-blue-700 tracking-wider block mb-1.5">{m.year}</span>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE VALUES (Modern grid cards with spacing) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Our Values</span>
            <h2 className="text-3xl font-bold text-[#0a1628]">What Guides Us</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="bg-gray-50 border border-gray-150 p-6 flex flex-col justify-between hover:shadow-md transition-shadow rounded-sm"
              >
                <div>
                  <div className="w-10 h-10 bg-blue-100/50 text-[#0a1628] flex items-center justify-center rounded-sm mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-[#0a1628] mb-2">{val.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
