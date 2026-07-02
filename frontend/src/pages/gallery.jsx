import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, FileText, ChevronRight, Settings, Shield, Activity, BarChart3, Wrench, Layers } from 'lucide-react';

// 1. Technical drawings (cropped screenshots)
const drawings = [
  { title: "General Arrangement Section", file: "general_arrangement.png", desc: "Cross-sectional elevation of the fired heater showing radiant and convection chambers, platform elevations, and foundation connections.", code: "API STD 530 / EIL Specs" },
  { title: "Radiant Section Layout", file: "radiant_section_layout.png", desc: "Detailed structural framing and casing plate arrangement of the bottom radiant combustion zone.", code: "ASME Sec VIII / IS 800" },
  { title: "Convection Section Modules", file: "convection_section_layout.png", desc: "Arrangement of tube bundles, structural tube sheets, and intermediate support plates within the convection bank.", code: "ASME Sec II & VIII" },
  { title: "Structural Steel Support", file: "structural_steel_support.png", desc: "Heavy portal frames, column bracing systems, and anchor bolt details designed to stabilize the 60-meter high assembly.", code: "IS 800 (Structural Steel)" },
  { title: "Stack Section Layout", file: "stack_layout.png", desc: "Exhaust stack detailing including helical strakes for wind vortex shedding, damper controls, and platform hangers.", code: "IS 6533 (Steel Chimneys)" },
  { title: "Header Box Details", file: "header_box_detail.png", desc: "Detailed structural enclosure for pipe return bends, including quick-acting access doors and heat seal plates.", code: "ASME Sec VIII / Refinery Standard" },
  { title: "Heater Platforms Arrangement", file: "heater_platforms.png", desc: "Layout and detailing of circular maintenance platforms at various elevations, incorporating anti-slip gratings.", code: "OSHA / IS 800" },
  { title: "Stair Case Detailing", file: "stair_structure.png", desc: "Isometric and elevation drawings of the structural stair tower detailing stringers, treads, and handrail mounts.", code: "IS 800 / OSHA Guidelines" },
  { title: "Pressure Parts Detail", file: "pressure_parts_detail.png", desc: "Piping layouts, nozzle schedules, and weld joint detailing for high-pressure hydrocarbon and steam tubes.", code: "ASME B31.3 / API 530" },
  { title: "Arch Plate Details", file: "arch_plate_details.png", desc: "Monolithic refractory arch plate lining and retaining anchors designed to withstand high operating temperatures.", code: "ASME Sec VIII / Refractory Spec" }
];

// 2. Exploded Illustrations (Interactive SVG-driven data)
const illustrations = [
  {
    id: "complete-heater",
    title: "Complete Fired Heater",
    description: "The complete vertically-fired cylindrical heater assembly incorporating the bottom burner floor, radiant tube chamber, convection module bank, header boxes, platforms, and a self-supporting stack.",
    disciplines: "Multi-Disciplinary (Structural, Mechanical, Thermal, Piping)",
    considerations: "Wind load vibration analysis (vortex shedding), thermal expansion joints at convection junctions, seismic load resistance.",
    deliverables: "General Arrangement drawings, structural loading sheets, anchor bolt details, transport logistics documentation.",
    svgType: "heater"
  },
  {
    id: "radiant-section",
    title: "Radiant Tube Section",
    description: "The high-temperature zone where burners fire vertically into a cylindrical refractory-lined chamber. Incorporates vertical tubes mounted on heat-resistant alloy hangers.",
    disciplines: "Mechanical & Refractory Engineering",
    considerations: "REF-55 Refractory anchor layout, skin thermocouple piping, thermal expansion calculations of tubes under 750°C.",
    deliverables: "Casing fabrication drawings, tube sheet details, burner plenum layouts, refractory hook spacing schedules.",
    svgType: "radiant"
  },
  {
    id: "convection-section",
    title: "Convection Section Module",
    description: "The waste heat recovery zone located above the radiant section. Horizontal tubes (often finned to maximize heat transfer surface) absorb heat from rising flue gases.",
    disciplines: "Thermal & Piping Engineering",
    considerations: "Finned tube pitch optimization, flue gas velocity profiling, tube sagging prevention at span midpoints.",
    deliverables: "Tube bundle shop drawings, intermediate support plate details, finned tube schedules.",
    svgType: "convection"
  },
  {
    id: "roof-structure",
    title: "Refinery Roof Structure",
    description: "A heavy structural steel roof canopy framing that seals the upper chamber and supports the stack load, designed for high thermal resistance and weathering.",
    disciplines: "Structural Engineering",
    considerations: "Stack base load transfer, thermal stress shielding, dead and live load combinations under IS 875.",
    deliverables: "Roof framing layouts, connection detatiling, fabrication weld schedules.",
    svgType: "roof"
  },
  {
    id: "platform-system",
    title: "Platform Walkway System",
    description: "Multi-tier circular access platforms mounted at key maintenance elevations (observation doors, header boxes, dampers, stack monitors).",
    disciplines: "Structural detailing",
    considerations: "OSHA safety clearances, toe-plate detailing, handrail weld strengths, galvanic corrosion mitigation.",
    deliverables: "Circular grating layouts, handrail details, staircase stringer brackets.",
    svgType: "platforms"
  },
  {
    id: "stair-assembly",
    title: "Stair Tower Assembly",
    description: "Self-supporting structural steel stair tower providing safe access to all heater operating levels, engineered for rapid erection.",
    disciplines: "Structural Detailing (Tekla)",
    considerations: "Wind loading on open steel frames, step rise/run ratios, foundation pile cap reactions.",
    deliverables: "Stringer detail drawings, shop assembly files (NC/DXF), erection marking plans.",
    svgType: "staircase"
  },
  {
    id: "header-box",
    title: "Tube Header Box",
    description: "Enclosed structural steel compartments at the ends of tube bundles housing the U-bends. Designed with quick-open doors for easy tube cleanout.",
    disciplines: "Mechanical & Structural Design",
    considerations: "Quick-access door hinge load capacities, high-temperature gasket sealing, gas leak prevention.",
    deliverables: "Box casing fabrication details, door hinge mechanics drawings, insulation lining details.",
    svgType: "headerbox"
  },
  {
    id: "support-steel",
    title: "Main Support Steelwork",
    description: "The primary structural steel columns, portal beams, and diagonal bracing that transmit gravity and lateral loads to the foundations.",
    disciplines: "Structural Analysis (STAAD.Pro)",
    considerations: "Base plate thickness, anchor bolt shear forces, dynamic load factors from wind and earthquakes.",
    deliverables: "Column detail drawings, base plate drawings, connection calculations.",
    svgType: "framing"
  },
  {
    id: "maintenance-access",
    title: "Access & Observation Doors",
    description: "High-temperature inspection ports and explosion doors providing access to the radiant chamber and convection box.",
    disciplines: "Mechanical detailing",
    considerations: "Explosion relief spring tension, thermal sealing, refractory plug thickness.",
    deliverables: "Fabricated door assemblies, latch details, casting insulation schedules.",
    svgType: "doors"
  },
  {
    id: "complete-frame",
    title: "Complete Structural Frame",
    description: "The complete load-carrying skeleton of the heater, excluding pressure parts and cladding, highlighting structural engineering modeling.",
    disciplines: "Structural & Erection Engineering",
    considerations: "Erection crane access points, transport splitting joints, field-weld vs. bolted joint optimization.",
    deliverables: "Erection sequence drawings, bolt lists, dynamic lift analyses.",
    svgType: "frame3d"
  }
];

// 3. Workflow lifecycles (Interactive SVG step data)
const workflows = [
  {
    title: "Project Lifecycle",
    steps: [
      { name: "Initiation", desc: "Client specification and reference drawing review (e.g. EIL standards)." },
      { name: "Engineering", desc: "Thermal sizing, mechanical calculations (API 530), and STAAD.Pro structural analysis." },
      { name: "Approval", desc: "Submission of General Arrangement (GA) drawings to EIL/Refinery owners for review." },
      { name: "Detailing", desc: "Building the 3D Tekla model and generating structural shop drawings." },
      { name: "Fabrication Support", desc: "Vendor coordination, material take-offs (BOM), and QC documentation." },
      { name: "Erection Support", desc: "Erection staging drawings and on-site technical inspection." }
    ]
  },
  {
    title: "Concept to Commissioning",
    steps: [
      { name: "Process Specs", desc: "Defining flow rates, inlet/outlet temps, and heat duty requirements." },
      { name: "Layout Review", desc: "Refinery plot plan coordination and piping layout studies." },
      { name: "Mechanical Design", desc: "ASME pressure calculations, coil layouts, and tube thickness selection." },
      { name: "Structural Design", desc: "Frame detailing, platform design, and chimney stack analysis." },
      { name: "Drawings Release", desc: "Approved-for-Construction (AFC) drawings package dispatch." },
      { name: "Commissioning Support", desc: "Pre-heating, refractory dry-out supervision, and burner testing." }
    ]
  },
  {
    title: "Design Review Process",
    steps: [
      { name: "Sizing Draft", desc: "First-pass tube layout and structural column sizing." },
      { name: "Internal Audit", desc: "Peer engineering check on wind, thermal, and seismic inputs." },
      { name: "Client Workshop", desc: "GA drawing walk-through with client engineering team." },
      { name: "EIL Alignment", desc: "Compliance check against Engineers India Ltd. standard designs." },
      { name: "Issue for Bid", desc: "Drawing release for vendor pricing and bidding." },
      { name: "Issue for Construction", desc: "Incorporate final vendor inputs and seal drawings." }
    ]
  },
  {
    title: "Structural Design Workflow",
    steps: [
      { name: "Loads Setup", desc: "Calculate dead, live, wind, and seismic loads per IS standards." },
      { name: "STAAD Modeling", desc: "Build 3D structural frame model and input load cases." },
      { name: "Member Select", desc: "Optimize steel section sizes for safety and weight." },
      { name: "Connection Design", desc: "Analyze bolted and welded connection node stresses." },
      { name: "Foundation Design", desc: "Generate concrete footing, pile layout, and anchor bolt details." },
      { name: "Detailing Handover", desc: "Transmit design models and calculations to the detailing team." }
    ]
  },
  {
    title: "Fabrication Drawing Process",
    steps: [
      { name: "Model Check", desc: "Review 3D Tekla model for clashes and structural interfaces." },
      { name: "Assembly Files", desc: "Extract assembly drawings with weld sizes and material grades." },
      { name: "Part Drawings", desc: "Generate single-part shop drawings for plates, beams, and rods." },
      { name: "BOM Generation", desc: "Produce structured Bill of Materials for steel procurement." },
      { name: "NC Data Export", desc: "Export DSTV and DXF data for CNC plate cutting and drilling." },
      { name: "Weld Schedules", desc: "Deliver detailed welding procedures (WPS) and schedules." }
    ]
  },
  {
    title: "Drawing Approval Workflow",
    steps: [
      { name: "Draft Check", desc: "Internal detailing checker reviews layouts and annotations." },
      { name: "Lead Engineer Review", desc: "Principal engineer audits design intent compliance." },
      { name: "Submit to Owner", desc: "Transmit drawings package to refinery project team." },
      { name: "Third Party Audit", desc: "Review by EIL or external engineering inspectors." },
      { name: "Incorporate Comments", desc: "Revise drawings per review markup sheets." },
      { name: "Final Seal", desc: "Stamping drawings as Approved for Construction (AFC)." }
    ]
  },
  {
    title: "Construction Support Workflow",
    steps: [
      { name: "Site Readiness", desc: "Inspect foundations and anchor bolt placements." },
      { name: "Erection Planning", desc: "Verify lifting weights and crane rigging configurations." },
      { name: "Steel Assembly", desc: "Supervise main column framing and platform fit-ups." },
      { name: "Coil Erection", desc: "Technical support for convection module and radiant tube lifts." },
      { name: "Alignment Check", desc: "Inspect structural plumbness and thermal expansion clearances." },
      { name: "Final Inspection", desc: "Deliver structural stability certificate and inspect welds." }
    ]
  },
  {
    title: "Engineering Deliverables",
    steps: [
      { name: "Calculations Book", desc: "ASME pressure calculations and STAAD structural design reports." },
      { name: "GA Drawings", desc: "General Arrangement layouts, section profiles, and interface details." },
      { name: "Shop Drawings", desc: "Fabrication drawings, part drawings, and assembly details." },
      { name: "Material MTOs", desc: "Procurement take-offs including grade specifications." },
      { name: "Refractory Layouts", desc: "Brick linings, castable insulation, and anchor pin details." },
      { name: "As-Built Records", desc: "Update drawing package to reflect field changes." }
    ]
  },
  {
    title: "Quality Assurance Process",
    steps: [
      { name: "Standard Audit", desc: "Confirm project scope complies with API 530, ASME, and EIL codes." },
      { name: "Material Check", desc: "Verify steel mill certs and hydro-tube specifications." },
      { name: "NDT Detailing", desc: "Specify radiography and ultrasonic weld inspection requirements." },
      { name: "Dimensional Control", desc: "Audit tolerances on critical header and nozzle layouts." },
      { name: "Hydrotest Audit", desc: "Review coil test pressures and holding times records." },
      { name: "Final Sign-off", desc: "Assemble dynamic manufacturing record book (MRB)." }
    ]
  },
  {
    title: "Remaining Life Assessment",
    steps: [
      { name: "Visual Survey", desc: "Inspect steel structure corrosion and concrete foundation cracking." },
      { name: "NDT Testing", desc: "Perform ultrasonic thickness checks on stacks and casing." },
      { name: "Hardness Checks", desc: "Conduct weld hardness and replication checks for creep." },
      { name: "FEM Modeling", desc: "Recreate degraded parts in finite element software for load checks." },
      { name: "Stress Check", desc: "Calculate remaining strength under current wind/earthquake loads." },
      { name: "Life Report", desc: "Provide recommendations for reinforcing structural steelwork." }
    ]
  }
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('drawings');
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedIll, setSelectedIll] = useState(illustrations[0]);
  const [activeWf, setActiveWf] = useState(workflows[0]);
  const [activeWfStep, setActiveWfStep] = useState(0);

  return (
    <div className="w-full bg-white">
      {/* HEADER SECTION */}
      <section className="bg-[#0a1628] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="gallery_grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gallery_grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-white/50 mb-4">Engineering Assets & Knowledge</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-3xl leading-tight">
              Design Drawings & Technical Assets
            </h1>
            <p className="mt-4 text-white/60 max-w-xl text-sm leading-relaxed">
              Explore the structural and mechanical detailing engineering database compiled from our recent hydrotreater (DHDT) and hydrodesulfurization (HDS) fired heater projects, executed under strict EIL specifications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TABS CONTROLLER */}
      <section className="border-b border-gray-200 sticky top-16 bg-white z-40 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: 'drawings', label: 'Technical Drawing Layouts' },
              { id: 'illustrations', label: 'Exploded 3D Illustrations' },
              { id: 'workflows', label: 'Engineering Workflows' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedImg(null);
                }}
                className={`py-5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all relative ${
                  activeTab === tab.id
                    ? 'border-[#0a1628] text-[#0a1628]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* TAB CONTENT PANEL */}
      <section className="py-20 bg-gray-50 min-h-[600px]">
        <div className="container mx-auto px-4">
          
          {/* TAB 1: TECHNICAL DRAWINGS */}
          {activeTab === 'drawings' && (
            <div>
              <div className="mb-10 max-w-xl">
                <h2 className="text-2xl font-bold text-[#0a1628] mb-3">Cropped Structural Drawing Database</h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  These layouts demonstrate the structural and mechanical detailing capacity of SLS. In compliance with confidentiality guidelines, all drawings are cropped to remove specific dimensions, drawing titles, sheets numbers, and approval signatures.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {drawings.map((draw, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => setSelectedImg(draw)}
                  >
                    <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                      <img
                        src={`/gallery/${draw.file}`}
                        alt={draw.title}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                      <div className="absolute top-3 right-3 w-8 h-8 bg-white/95 text-[#0a1628] flex items-center justify-center shadow-sm">
                        <Eye className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block mb-1">{draw.code}</span>
                        <h3 className="font-bold text-sm text-[#0a1628] mb-2">{draw.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{draw.desc}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-[#0a1628] transition-colors flex items-center gap-1">
                        Open Drawing Sheet <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EXPLODED ILLUSTRATIONS */}
          {activeTab === 'illustrations' && (
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: Menu */}
              <div className="lg:col-span-1 bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Select Component</h3>
                <div className="space-y-1">
                  {illustrations.map((ill) => (
                    <button
                      key={ill.id}
                      onClick={() => setSelectedIll(ill)}
                      className={`w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-l-2 transition-all flex items-center justify-between ${
                        selectedIll.id === ill.id
                          ? 'bg-[#0a1628]/5 border-[#0a1628] text-[#0a1628]'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <span>{ill.title}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedIll.id === ill.id ? 'translate-x-1' : 'opacity-30'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right/Middle Columns: Details & SVG rendering */}
              <div className="lg:col-span-2 space-y-8">
                {/* SVG Conceptual Exploded Illustration Display */}
                <div className="bg-[#0a1628] aspect-[16/10] flex items-center justify-center p-8 text-white relative overflow-hidden shadow-md">
                  <div className="absolute inset-0 opacity-[0.03]">
                    <svg width="100%" height="100%">
                      <rect width="100%" height="100%" fill="url(#gallery_grid)" />
                    </svg>
                  </div>
                  
                  {/* Inline interactive high-quality SVG Blueprint Renderings */}
                  <div className="w-full h-full flex items-center justify-center relative">
                    {/* Render matching schematic */}
                    {selectedIll.svgType === 'heater' && (
                      <svg viewBox="0 0 100 100" className="w-1/2 h-full stroke-white/40 fill-none stroke-[0.8] stroke-linecap-round">
                        {/* Stack */}
                        <line x1="50" y1="5" x2="50" y2="40" className="stroke-white/60 stroke-[1.5]" />
                        <line x1="48" y1="5" x2="48" y2="40" />
                        <line x1="52" y1="5" x2="52" y2="40" />
                        {/* Platform stack */}
                        <rect x="44" y="20" width="12" height="2" className="fill-blue-700/20 stroke-white/60" />
                        {/* Convection Section */}
                        <rect x="42" y="40" width="16" height="15" className="fill-blue-900/10 stroke-white/70" />
                        {/* Horiz tubes */}
                        {Array.from({ length: 7 }).map((_, i) => (
                          <line key={i} x1="44" y1={42 + i * 2} x2="56" y2={42 + i * 2} className="stroke-blue-400/40" />
                        ))}
                        {/* Header Box */}
                        <rect x="40" y="38" width="2" height="19" />
                        <rect x="58" y="38" width="2" height="19" />
                        {/* Transition */}
                        <polygon points="42,55 58,55 62,60 38,60" />
                        {/* Radiant Section */}
                        <rect x="36" y="60" width="28" height="25" className="fill-blue-900/20 stroke-white/80" strokeWidth="1" />
                        {/* Vert tubes inside */}
                        {Array.from({ length: 6 }).map((_, i) => (
                          <line key={i} x1={39 + i * 4} y1="62" x2={39 + i * 4} y2="83" className="stroke-blue-400/30" />
                        ))}
                        {/* Platforms */}
                        <rect x="30" y="68" width="6" height="2" />
                        <rect x="64" y="68" width="6" height="2" />
                        {/* Floor burner lines */}
                        <line x1="36" y1="85" x2="64" y2="85" className="stroke-white/80 stroke-[1.5]" />
                        {/* Base columns */}
                        <line x1="38" y1="85" x2="38" y2="95" className="stroke-white/80" />
                        <line x1="50" y1="85" x2="50" y2="95" />
                        <line x1="62" y1="85" x2="62" y2="95" />
                      </svg>
                    )}

                    {selectedIll.svgType === 'radiant' && (
                      <svg viewBox="0 0 100 100" className="w-1/2 h-full stroke-white/40 fill-none stroke-[0.8]">
                        <rect x="25" y="15" width="50" height="60" className="stroke-white/70 fill-blue-900/10" />
                        {/* Interior lining loops */}
                        {Array.from({ length: 12 }).map((_, i) => (
                          <rect key={i} x="28" y={18 + i * 4} width="44" height="2" className="stroke-white/20" />
                        ))}
                        {/* Radiant tubes */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <g key={i}>
                            <line x1={31 + i * 5} y1="18" x2={31 + i * 5} y2="72" className="stroke-blue-400/80 stroke-[1.2]" />
                            <circle cx={31 + i * 5} cy="18" r="0.8" className="fill-blue-400" />
                            <circle cx={31 + i * 5} cy="72" r="0.8" className="fill-blue-400" />
                          </g>
                        ))}
                        {/* Refractory anchor layout grid detail */}
                        <path d="M 25 45 L 75 45 M 25 30 L 75 30 M 25 60 L 75 60" className="stroke-white/10 stroke-dasharray-[2,2]" />
                        {/* Burner ports at floor */}
                        <circle cx="38" cy="75" r="2.5" className="stroke-white/60 fill-blue-500/20" />
                        <circle cx="50" cy="75" r="2.5" className="stroke-white/60 fill-blue-500/20" />
                        <circle cx="62" cy="75" r="2.5" className="stroke-white/60 fill-blue-500/20" />
                      </svg>
                    )}

                    {selectedIll.svgType === 'convection' && (
                      <svg viewBox="0 0 100 100" className="w-1/2 h-full stroke-white/40 fill-none stroke-[0.8]">
                        <rect x="20" y="25" width="60" height="50" className="stroke-white/70 fill-blue-900/10" />
                        {/* Finned Tube rows */}
                        {Array.from({ length: 6 }).map((_, r) => (
                          <g key={r}>
                            <line x1="22" y1={30 + r * 8} x2="78" y2={30 + r * 8} className="stroke-blue-400/80 stroke-[1.5]" />
                            {/* Fins details */}
                            {Array.from({ length: 12 }).map((_, f) => (
                              <line key={f} x1={25 + f * 4.2} y1={28 + r * 8} x2={25 + f * 4.2} y2={32 + r * 8} className="stroke-white/30" />
                            ))}
                          </g>
                        ))}
                        {/* Support tube sheets */}
                        <line x1="35" y1="23" x2="35" y2="77" className="stroke-white/80 stroke-[1.2]" />
                        <line x1="65" y1="23" x2="65" y2="77" className="stroke-white/80 stroke-[1.2]" />
                        {/* Flue Gas Direction arrows */}
                        <path d="M 50 85 L 50 15 M 50 15 L 47 20 M 50 15 L 53 20" className="stroke-blue-400/60" />
                      </svg>
                    )}

                    {/* Fallback layout schematic for other detailed components */}
                    {!['heater', 'radiant', 'convection'].includes(selectedIll.svgType) && (
                      <svg viewBox="0 0 100 100" className="w-1/2 h-full stroke-white/40 fill-none stroke-[0.8]">
                        <circle cx="50" cy="50" r="35" className="stroke-white/60 fill-blue-900/5" />
                        <rect x="25" y="25" width="50" height="50" className="stroke-white/40 stroke-dasharray-[1,1]" />
                        <line x1="15" y1="50" x2="85" y2="50" />
                        <line x1="50" y1="15" x2="50" y2="85" />
                        {/* Blueprint grid nodes */}
                        <circle cx="50" cy="50" r="1.5" className="fill-white" />
                        <circle cx="50" cy="15" r="1" className="fill-white" />
                        <circle cx="50" cy="85" r="1" className="fill-white" />
                        <circle cx="15" cy="50" r="1" className="fill-white" />
                        <circle cx="85" cy="50" r="1" className="fill-white" />
                      </svg>
                    )}
                  </div>
                  
                  {/* Watermark/Metadata details */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/30">
                    <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>Interactive Schematic Model</span>
                  </div>
                </div>

                {/* Conceptual metadata descriptions card */}
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block mb-1">Conceptual Component Illustration</span>
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-4">{selectedIll.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-6">{selectedIll.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-[#43648e]" /> Engineering Disciplines
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.disciplines}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-[#43648e]" /> Mechanical & Structural Considerations
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.considerations}</p>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 border-l-2 border-[#43648e] text-xs">
                    <span className="font-bold text-gray-700 block mb-1">Key Engineering Deliverables:</span>
                    <p className="text-gray-500 leading-relaxed">{selectedIll.deliverables}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WORKFLOW LIFECYCLES */}
          {activeTab === 'workflows' && (
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: List of workflows */}
              <div className="lg:col-span-1 bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Select Lifecycle</h3>
                <div className="space-y-1">
                  {workflows.map((wf, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveWf(wf);
                        setActiveWfStep(0);
                      }}
                      className={`w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-l-2 transition-all flex items-center justify-between ${
                        activeWf.title === wf.title
                          ? 'bg-[#0a1628]/5 border-[#0a1628] text-[#0a1628]'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <span>{wf.title}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeWf.title === wf.title ? 'translate-x-1' : 'opacity-30'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Step-by-Step interactive process chart */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block mb-1">Process Lifecycle Flowchart</span>
                  <h3 className="text-2xl font-bold text-[#0a1628] mb-6">{activeWf.title}</h3>
                  
                  {/* Interactive Horizontal/Vertical SVG Flow Nodes */}
                  <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 mb-8">
                    {activeWf.steps.map((step, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveWfStep(idx)}
                        className={`flex-1 border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                          activeWfStep === idx
                            ? 'bg-[#0a1628] text-white border-[#0a1628] shadow-md scale-102'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#0a1628]'
                        }`}
                      >
                        <div>
                          <div className={`text-[10px] font-bold mb-2 ${activeWfStep === idx ? 'text-white/50' : 'text-gray-400 group-hover:text-blue-700'}`}>
                            STEP 0{idx + 1}
                          </div>
                          <h4 className="font-bold text-xs leading-tight mb-2">{step.name}</h4>
                        </div>
                        <span className={`text-[10px] font-semibold mt-4 block ${activeWfStep === idx ? 'text-white/80' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>
                          View Details &rarr;
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Active Step Details Panel */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeWfStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 border border-gray-200 p-6 border-l-2 border-[#0a1628]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shadow-sm">
                          0{activeWfStep + 1}
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Active Step Detail</span>
                          <h4 className="font-bold text-sm text-[#0a1628]">{activeWf.steps[activeWfStep].name}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-11">
                        {activeWf.steps[activeWfStep].desc}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Workflow credentials card */}
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    { icon: <Activity className="w-5 h-5 text-blue-700" />, title: "Quality Assurance", desc: "Rigorous check gates aligned with API & ASME standards at every transition step." },
                    { icon: <BarChart3 className="w-5 h-5 text-blue-700" />, title: "Risk Mitigation", desc: "Peer audit reviews and digital simulations run at the design phase to avoid field errors." },
                    { icon: <Wrench className="w-5 h-5 text-blue-700" />, title: "Erection Readiness", desc: "Shop drawings configured with alignment pins to minimize field weld times." }
                  ].map((feat, idx) => (
                    <div key={idx} className="bg-white border border-gray-200 p-5 shadow-sm">
                      <div className="mb-3">{feat.icon}</div>
                      <h4 className="font-bold text-xs text-[#0a1628] mb-1">{feat.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-relaxed">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* DRAWING LIGHTBOX */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedImg(null)}
          >
            <div className="max-w-5xl w-full flex flex-col items-stretch relative" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute -top-12 right-0 text-white text-xs font-bold uppercase tracking-wider hover:text-gray-300 transition-colors"
                onClick={() => setSelectedImg(null)}
              >
                Close View ✕
              </button>
              <div className="bg-slate-900 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center aspect-[16/10] shadow-2xl">
                <img
                  src={`/gallery/${selectedImg.file}`}
                  alt={selectedImg.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="text-white mt-4 flex items-start justify-between gap-6">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400 block mb-1">{selectedImg.code}</span>
                  <h3 className="text-lg font-bold">{selectedImg.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mt-1">{selectedImg.desc}</p>
                </div>
                <div className="bg-white/5 border border-white/15 px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/50 whitespace-nowrap shrink-0">
                  Confidentiality-Safe View
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
