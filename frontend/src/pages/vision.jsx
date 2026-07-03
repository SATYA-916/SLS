import { motion } from 'framer-motion';
import { Target, Eye, Compass, Rocket } from 'lucide-react';

const pillars = [
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Vision',
    content: 'To be the most trusted engineering consultancy in India — recognised for technical excellence, innovation, and the delivery of cost-effective, safe, and sustainable engineering solutions across structural, industrial, and digital domains.',
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: 'Mission',
    content: 'To provide comprehensive, high-quality engineering consultancy services that consistently meet or exceed client expectations, leveraging 20+ years of expertise, industry-leading tools, and a commitment to continuous improvement.',
  },
  {
    icon: <Compass className="w-8 h-8" />,
    title: 'Core Purpose',
    content: 'To deliver cost-effective quality engineering solutions — on time, within budget, and to the highest technical standards — for every client, every project, without compromise.',
  },
];

const goals = [
  'Expand engineering consultancy services across India and international markets',
  'Integrate AI and machine learning into structural analysis workflows',
  'Build digital-first project management capabilities for multi-disciplinary projects',
  'Develop proprietary engineering software tools for industrial applications',
  'Strengthen RLA (Remaining Life Assessment) capabilities with digital twin technology',
  'Establish partnerships with international engineering firms for global project delivery',
];

const futureTech = [
  {
    title: 'Digital Twin Technology',
    desc: 'Real-time digital replicas of physical structures enabling predictive maintenance and lifecycle optimisation.',
  },
  {
    title: 'AI-Driven Structural Analysis',
    desc: 'Machine learning models accelerating FEM analysis and identifying failure modes before they occur.',
  },
  {
    title: 'Cloud-Based Engineering Collaboration',
    desc: 'Distributed engineering teams working seamlessly on shared models and live project data.',
  },
  {
    title: 'Automated Drawing Generation',
    desc: 'AI-assisted generation of construction and manufacturing drawings from 3D structural models.',
  },
];

export default function Vision() {
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Our Direction</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight">Vision & Mission</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-gray-200">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-10"
              >
                <div className="text-[#43648e] mb-6">{p.icon}</div>
                <h2 className="text-2xl font-bold text-[#0a1628] mb-5">{p.title}</h2>
                <p className="text-sm text-gray-500 leading-relaxed">{p.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0a1628] text-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-4">Strategic Goals</p>
            <h2 className="text-3xl font-bold">Our Roadmap</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="flex items-start gap-4 p-6 border border-white/10 hover:border-white/20 transition-colors"
              >
                <span className="text-[#43648e] font-bold text-sm shrink-0 mt-0.5">0{i + 1}</span>
                <p className="text-sm text-white/70 leading-relaxed">{goal}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#43648e] mb-3">Future Technologies</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">Where Engineering is Heading</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200">
            {futureTech.map((tech, i) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-white p-10 flex gap-6"
              >
                <Rocket className="w-6 h-6 text-[#43648e] shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-[#0a1628] mb-3">{tech.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
