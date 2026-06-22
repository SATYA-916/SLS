import { motion } from 'framer-motion';
import { CheckCircle2, Award, Users, Clock } from 'lucide-react';

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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">About SLS</p>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-2xl">
              Engineering Excellence. Driven by Innovation.
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-bold text-[#0a1628] mb-6">Our Story</h2>
            <p className="text-gray-500 mb-4 leading-relaxed">
              SLS Consultants was established in 2002 by Mr. C. Subrahmanyam in Visakhapatnam, Andhra Pradesh, following 18 distinguished years of engineering experience with BHARAT HEAVY PLATE VESSELS LIMITED (BHEL) and MITSUI BABCOCK ENERGY (I) PVT LIMITED (now Doosan Babcock).
            </p>
            <p className="text-gray-500 mb-4 leading-relaxed">
              From its inception, SLS has been driven by a singular vision: to deliver cost-effective, quality engineering solutions that meet or exceed client expectations. The firm specialises in structural engineering, industrial project consultancy, FEM analysis, remaining life assessments (RLA), and comprehensive steel detailing.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Over two decades, SLS has successfully delivered 500+ projects across India and internationally — for clients including L&T, BHEL, HPCL, Doosan Babcock, Air Liquide, and Petron Engineering.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className="bg-[#0a1628] text-white p-10">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-20 h-20 bg-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src="/founder_portrait.png"
                    alt="Mr. C. Subrahmanyam"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Mr. C. Subrahmanyam</h3>
                  <p className="text-white/60 text-sm">Founder & Principal Engineer</p>
                </div>
              </div>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2 text-white/70">
                  <Award className="w-4 h-4 text-[#43648e] shrink-0" />
                  <span>Ex-BHEL (Bharat Heavy Plate Vessels Limited) — 18 Years</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Award className="w-4 h-4 text-[#43648e] shrink-0" />
                  <span>Ex-Mitsui Babcock Energy (I) Pvt Ltd (Now Doosan Babcock)</span>
                </div>
                <div className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4 text-[#43648e] shrink-0" />
                  <span>20+ Years heading SLS Consultants</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-6">
                <p className="text-white/70 text-sm leading-relaxed">
                  Recognised by Larsen & Toubro with a Letter of Appreciation for services rendered on handling structures for a vessel of 10,000mm dia × 164,000mm length.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#43648e] mb-3">Our Journey</p>
            <h2 className="text-4xl font-bold text-[#0a1628]">Two Decades of Excellence</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="shrink-0 w-20 text-right">
                  <span className="text-sm font-bold text-[#43648e]">{m.year}</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#43648e] mt-1.5 shrink-0" />
                  <div className="w-px flex-1 bg-gray-200 mt-2" />
                </div>
                <div className="pb-8">
                  <p className="text-sm text-gray-500 leading-relaxed">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#43648e] mb-3">Our Values</p>
            <h2 className="text-4xl font-bold text-[#0a1628]">What Drives Us</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            {values.map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white p-8 flex gap-5"
              >
                <CheckCircle2 className="w-6 h-6 text-[#43648e] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-[#0a1628] mb-2">{val.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
