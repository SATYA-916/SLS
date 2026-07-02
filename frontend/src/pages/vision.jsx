import { motion } from 'framer-motion';
import { Target, Eye, Compass, Rocket, Cpu, Cloud, LineChart, Code } from 'lucide-react';

const pillars = [
  {
    icon: <Eye className="w-6 h-6" />,
    title: 'Vision',
    content: 'To be the most trusted engineering consultancy in India — recognised for technical excellence, innovation, and the delivery of cost-effective, safe, and sustainable engineering solutions across structural, industrial, and digital domains.',
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: 'Mission',
    content: 'To provide comprehensive, high-quality engineering consultancy services that consistently meet or exceed client expectations, leveraging 20+ years of expertise, industry-leading tools, and a commitment to continuous improvement.',
  },
  {
    icon: <Compass className="w-6 h-6" />,
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
    icon: <Cpu className="w-5 h-5 text-blue-700" />
  },
  {
    title: 'AI-Driven Structural Analysis',
    desc: 'Machine learning models accelerating FEM analysis and identifying failure modes before they occur.',
    icon: <LineChart className="w-5 h-5 text-blue-700" />
  },
  {
    title: 'Cloud-Based Engineering Collaboration',
    desc: 'Distributed engineering teams working seamlessly on shared models and live project data.',
    icon: <Cloud className="w-5 h-5 text-blue-700" />
  },
  {
    title: 'Automated Drawing Generation',
    desc: 'AI-assisted generation of construction and manufacturing drawings from 3D structural models.',
    icon: <Code className="w-5 h-5 text-blue-700" />
  },
];

export default function Vision() {
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Our Direction</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight">Vision & Mission</h1>
          </motion.div>
        </div>
      </section>

      {/* THREE PILLARS (Vision, Mission, Purpose) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-gray-50 border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200 rounded-sm"
              >
                <div className="w-10 h-10 bg-blue-100/50 text-[#0a1628] flex items-center justify-center rounded-sm mb-6">
                  {p.icon}
                </div>
                <h2 className="text-xl font-bold text-[#0a1628] mb-4">{p.title}</h2>
                <p className="text-xs text-gray-500 leading-relaxed">{p.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGIC ROADMAP */}
      <section className="py-20 bg-[#0a1628] text-white relative overflow-hidden border-t border-b border-white/5">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <svg width="100%" height="100%">
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 16 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="mb-12 text-center"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-3">Strategic Goals</p>
            <h2 className="text-3xl font-bold">Our Future Roadmap</h2>
          </motion.div>

          <div className="max-w-2xl mx-auto border-l border-white/20 pl-8 space-y-8 py-2">
            {goals.map((goal, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="relative"
              >
                {/* Node marker */}
                <div className="absolute -left-[37px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border border-white/30" />
                <p className="text-xs text-white/70 leading-relaxed font-semibold">{goal}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FUTURE TECHNOLOGY FOCUS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 block mb-2">Technology Stack</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">Digital-First Engineering Focus</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureTech.map((tech, i) => (
              <motion.div
                key={tech.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-blue-50 flex items-center justify-center rounded-sm shrink-0">
                  {tech.icon}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0a1628] mb-1.5">{tech.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{tech.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
