import { motion } from 'framer-motion';
import { Code2, Brain, Cloud, BarChart3, Bot, Layers } from 'lucide-react';

const solutions = [
  {
    icon: <Code2 className="w-10 h-10" />,
    title: 'Software Development',
    desc: 'Custom engineering software, workflow automation tools, and digital solutions tailored to industrial operations. From data capture systems to reporting dashboards.',
  },
  {
    icon: <Brain className="w-10 h-10" />,
    title: 'AI & Machine Learning',
    desc: 'Intelligent analytics and predictive modelling for industrial applications. Anomaly detection, predictive maintenance, and operational insights powered by machine learning.',
  },
  {
    icon: <Cloud className="w-10 h-10" />,
    title: 'Cloud Solutions',
    desc: 'Scalable cloud infrastructure for collaborative engineering projects. Secure document management, multi-site access, and real-time project tracking.',
  },
  {
    icon: <BarChart3 className="w-10 h-10" />,
    title: 'Data Analytics',
    desc: 'Transform raw engineering and operational data into actionable insights. Visualisation dashboards, performance benchmarking, and trend analysis.',
  },
  {
    icon: <Bot className="w-10 h-10" />,
    title: 'Automation',
    desc: 'Process automation solutions reducing manual effort, eliminating human errors, and accelerating engineering workflows from design to delivery.',
  },
  {
    icon: <Layers className="w-10 h-10" />,
    title: 'BIM & Digital Engineering',
    desc: 'Building Information Modelling (BIM) for precise digital project delivery. 3D coordination, clash detection, quantity take-off, and lifecycle management.',
  },
];

const softwareTools = [
  { name: 'STAAD.Pro', desc: 'Primary structural analysis and design software for steel and RCC structures.' },
  { name: 'ANSYS', desc: 'Advanced FEM analysis for complex structural and thermal simulations.' },
  { name: 'Tekla Structures', desc: '3D structural modelling and steel detailing, shop and erection drawings.' },
  { name: 'AutoCAD', desc: '2D drafting, civil and layout drawings for all project types.' },
  { name: 'CATIA', desc: 'High-precision 3D modelling for complex industrial components.' },
];

export default function Software() {
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Digital Solutions</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-2xl leading-tight">
              Software & AI Solutions
            </h1>
            <p className="mt-6 text-white/60 max-w-xl leading-relaxed">
              SLS has expanded beyond traditional structural engineering to offer modern software and AI-driven solutions — bringing digital intelligence to industrial operations.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#43648e] mb-3">What We Offer</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">Digital Engineering Capabilities</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {solutions.map((sol, i) => (
              <motion.div
                key={sol.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white p-10 hover:bg-[#0a1628] hover:text-white group transition-colors duration-300"
              >
                <div className="text-[#43648e] group-hover:text-white/60 mb-6 transition-colors">
                  {sol.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0a1628] group-hover:text-white mb-4 transition-colors">{sol.title}</h3>
                <p className="text-sm text-gray-500 group-hover:text-white/70 leading-relaxed transition-colors">{sol.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#43648e] mb-3">Engineering Tools</p>
            <h2 className="text-3xl font-bold text-[#0a1628]">Software We Master</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
            {softwareTools.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-white p-8"
              >
                <h3 className="text-xl font-bold text-[#0a1628] mb-3">{tool.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
