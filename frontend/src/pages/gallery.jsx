import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { Eye, FileText, ChevronRight, Settings, Shield, Activity, BarChart3, Wrench, Layers, Calendar } from 'lucide-react';
import ThreeViewer from '@/components/ThreeViewer';

// 1. Technical drawings (cropped screenshots)
const drawings = [
  { 
    title: "General Arrangement Section", 
    file: "general_arrangement.png", 
    desc: "Cross-sectional elevation of the fired heater showing radiant and convection chambers, platform elevations, and foundation connections.", 
    code: "API STD 530 / EIL Specs",
    service: "Industrial Design & Support"
  },
  { 
    title: "Radiant Section Layout", 
    file: "radiant_section_layout.png", 
    desc: "Detailed structural framing and casing plate arrangement of the bottom radiant combustion zone.", 
    code: "ASME Sec VIII / IS 800",
    service: "Industrial Design & Support"
  },
  { 
    title: "Convection Section Modules", 
    file: "convection_section_layout.png", 
    desc: "Arrangement of tube bundles, structural tube sheets, and intermediate support plates within the convection bank.", 
    code: "ASME Sec II & VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "Structural Steel Support", 
    file: "structural_steel_support.png", 
    desc: "Heavy portal frames, column bracing systems, and anchor bolt details designed to stabilize the 60-meter high assembly.", 
    code: "IS 800 (Structural Steel)",
    service: "Engineering & Architecture Design"
  },
  { 
    title: "Stack Section Layout", 
    file: "stack_layout.png", 
    desc: "Exhaust stack detailing including helical strakes for wind vortex shedding, damper controls, and platform hangers.", 
    code: "IS 6533 (Steel Chimneys)",
    service: "Industrial Design & Support"
  },
  { 
    title: "Header Box Details", 
    file: "header_box_detail.png", 
    desc: "Detailed structural enclosure for pipe return bends, including quick-acting access doors and heat seal plates.", 
    code: "ASME Sec VIII / Refinery Standard",
    service: "Industrial Design & Support"
  },
  { 
    title: "Heater Platforms Arrangement", 
    file: "heater_platforms.png", 
    desc: "Layout and detailing of circular maintenance platforms at various elevations, incorporating anti-slip gratings.", 
    code: "OSHA / IS 800",
    service: "Blueprint Design"
  },
  { 
    title: "Stair Case Detailing", 
    file: "stair_structure.png", 
    desc: "Isometric and elevation drawings of the structural stair tower detailing stringers, treads, and handrail mounts.", 
    code: "IS 800 / OSHA Guidelines",
    service: "Blueprint Design"
  },
  { 
    title: "Pressure Parts Detail", 
    file: "pressure_parts_detail.png", 
    desc: "Piping layouts, nozzle schedules, and weld joint detailing for high-pressure hydrocarbon and steam tubes.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Design & Support"
  },
  { 
    title: "Arch Plate Details", 
    file: "arch_plate_details.png", 
    desc: "Monolithic refractory arch plate lining and retaining anchors designed to withstand high operating temperatures.", 
    code: "ASME Sec VIII / Refractory Spec",
    service: "Industrial Design & Support"
  }
];

// 2. Exploded Illustrations (Interactive Three.js geometries)
const illustrations = [
  {
    id: "complete-heater",
    title: "Complete Fired Heater",
    description: "The complete vertically-fired cylindrical heater assembly incorporating the bottom burner floor, radiant tube chamber, convection module bank, header boxes, platforms, and a self-supporting stack.",
    disciplines: "Multi-Disciplinary (Structural, Mechanical, Thermal, Piping)",
    considerations: "Wind load vibration analysis (vortex shedding), thermal expansion joints at convection junctions, seismic load resistance.",
    deliverables: "General Arrangement drawings, structural loading sheets, anchor bolt details, transport logistics documentation.",
    threeType: "heater",
    service: "Industrial Design & Support"
  },
  {
    id: "radiant-section",
    title: "Radiant Tube Section",
    description: "The high-temperature zone where burners fire vertically into a cylindrical refractory-lined chamber. Incorporates vertical tubes mounted on heat-resistant alloy hangers.",
    disciplines: "Mechanical & Refractory Engineering",
    considerations: "REF-55 Refractory anchor layout, skin thermocouple piping, thermal expansion calculations of tubes under 750°C.",
    deliverables: "Casing fabrication drawings, tube sheet details, burner plenum layouts, refractory hook spacing schedules.",
    threeType: "radiant",
    service: "Industrial Design & Support"
  },
  {
    id: "convection-section",
    title: "Convection Section Module",
    description: "The waste heat recovery zone located above the radiant section. Horizontal tubes (often finned to maximize heat transfer surface) absorb heat from rising flue gases.",
    disciplines: "Thermal & Piping Engineering",
    considerations: "Finned tube pitch optimization, flue gas velocity profiling, tube sagging prevention at span midpoints.",
    deliverables: "Tube bundle shop drawings, intermediate support plate details, finned tube schedules.",
    threeType: "convection",
    service: "Industrial Design & Support"
  },
  {
    id: "roof-structure",
    title: "Refinery Roof Structure",
    description: "A heavy structural steel roof canopy framing that seals the upper chamber and supports the stack load, designed for high thermal resistance and weathering.",
    disciplines: "Structural Engineering",
    considerations: "Stack base load transfer, thermal stress shielding, dead and live load combinations under IS 875.",
    deliverables: "Roof framing layouts, connection detailing, fabrication weld schedules.",
    threeType: "roof",
    service: "Engineering & Architecture Design"
  },
  {
    id: "platform-system",
    title: "Platform Walkway System",
    description: "Multi-tier circular access platforms mounted at key maintenance elevations (observation doors, header boxes, dampers, stack monitors).",
    disciplines: "Structural detailing",
    considerations: "OSHA safety clearances, toe-plate detailing, handrail weld strengths, galvanic corrosion mitigation.",
    deliverables: "Circular grating layouts, handrail details, staircase stringer brackets.",
    threeType: "platforms",
    service: "Blueprint Design"
  },
  {
    id: "stair-assembly",
    title: "Stair Tower Assembly",
    description: "Self-supporting structural steel stair tower providing safe access to all heater operating levels, engineered for rapid erection.",
    disciplines: "Structural Detailing (Tekla)",
    considerations: "Wind loading on open steel frames, step rise/run ratios, foundation pile cap reactions.",
    deliverables: "Stringer detail drawings, shop assembly files (NC/DXF), erection marking plans.",
    threeType: "staircase",
    service: "Blueprint Design"
  },
  {
    id: "header-box",
    title: "Tube Header Box",
    description: "Enclosed structural steel compartments at the ends of tube bundles housing the U-bends. Designed with quick-open doors for easy tube cleanout.",
    disciplines: "Mechanical & Structural Design",
    considerations: "Quick-access door hinge load capacities, high-temperature gasket sealing, gas leak prevention.",
    deliverables: "Box casing fabrication details, door hinge mechanics drawings, insulation lining details.",
    threeType: "headerbox",
    service: "Industrial Design & Support"
  },
  {
    id: "support-steel",
    title: "Main Support Steelwork",
    description: "The primary structural steel columns, portal beams, and diagonal bracing that transmit gravity and lateral loads to the foundations.",
    disciplines: "Structural Analysis (STAAD.Pro)",
    considerations: "Base plate thickness, anchor bolt shear forces, dynamic load factors from wind and earthquakes.",
    deliverables: "Column detail drawings, base plate drawings, connection calculations.",
    threeType: "framing",
    service: "Engineering & Architecture Design"
  },
  {
    id: "maintenance-access",
    title: "Access & Observation Doors",
    description: "High-temperature inspection ports and explosion doors providing access to the radiant chamber and convection box.",
    disciplines: "Mechanical detailing",
    considerations: "Explosion relief spring tension, thermal sealing, refractory plug thickness.",
    deliverables: "Fabricated door assemblies, latch details, casting insulation schedules.",
    threeType: "doors",
    service: "Industrial Design & Support"
  },
  {
    id: "complete-frame",
    title: "Complete Structural Frame",
    description: "The complete load-carrying skeleton of the heater, excluding pressure parts and cladding, highlighting structural engineering modeling.",
    disciplines: "Structural & Erection Engineering",
    considerations: "Erection crane access points, transport splitting joints, field-weld vs. bolted joint optimization.",
    deliverables: "Erection sequence drawings, bolt lists, dynamic lift analyses.",
    threeType: "frame3d",
    service: "Engineering & Architecture Design"
  }
];

// 3. Workflow lifecycles (Interactive step data - EXPANDED & HIGHLY DETAILED)
const workflows = [
  {
    title: "Project Lifecycle",
    steps: [
      { 
        name: "Initiation", 
        desc: "Perform a thorough review of client design premises, datasheets, and standard reference drawings (such as Engineers India Limited standards). We align on the project execution plan, engineering schedules, communication protocols, and scope limits." 
      },
      { 
        name: "Engineering", 
        desc: "Execute thermal design calculations using API 530 guidelines to determine tube skin temperatures and wall thicknesses. Concurrently, build a full 3D frame model in STAAD.Pro to evaluate structural members under dead, live, wind, and seismic loads." 
      },
      { 
        name: "Approval", 
        desc: "Generate and submit the preliminary General Arrangement (GA) drawings, foundation load schedules, and calculation reports to EIL or client engineering leads. We address review comments, update the design, and secure formal Approved-for-Construction (AFC) signatures." 
      },
      { 
        name: "Detailing", 
        desc: "Transmit the approved design data to the detailing office to build a high-fidelity 3D structural model in Tekla Structures. We model every column, beam, platform, staircase, and connection down to individual welds and bolts, ensuring zero interference." 
      },
      { 
        name: "Fabrication Support", 
        desc: "Extract fabrication shop drawings, member assembly sheets, shipping lists, and a detailed Bill of Materials (BOM). We export digital NC/DXF files directly from the Tekla model for CNC plate cutting and coordinate with fabrication yards to resolve shop queries." 
      },
      { 
        name: "Erection Support", 
        desc: "Deliver structural erection marking plans, column assembly details, and lifting crane rigging studies. Our team provides field support, inspecting foundation anchor bolt coordinates, verifying steel member fit-up alignment, and issuing stability clearances." 
      }
    ]
  },
  {
    title: "Concept to Commissioning",
    steps: [
      { 
        name: "Process Specs", 
        desc: "Define the fired heater process requirements, including feed fluid chemistry, inlet/outlet pressures, operating temperatures, thermal duty, and flue gas draft conditions. This formulates the baseline mechanical sizing." 
      },
      { 
        name: "Layout Review", 
        desc: "Conduct refinery plot plan integration reviews to establish structural clearances, access ways for burner maintenance, tube extraction spacing, crane positioning paths, and interface connections with adjacent process piping." 
      },
      { 
        name: "Mechanical Design", 
        desc: "Perform ASME Section VIII pressure boundary sizing for the radiant and convection coils. We specify header schedules, tube hangers, return bends, plug designs, nozzle flange ratings, and refractory insulation thicknesses." 
      },
      { 
        name: "Structural Design", 
        desc: "Calculate wind vortex shedding frequencies, seismic dynamic response spectra, and structural frame stiffness. We design columns, beams, baseplates, and circular platforms, delivering code-compliant calculations." 
      },
      { 
        name: "Drawings Release", 
        desc: "Package and dispatch the complete set of Approved-for-Construction (AFC) documents. This contains mechanical coil assemblies, structural frames, foundation loading schemes, piping support structures, and refractory anchor hook drawings." 
      },
      { 
        name: "Commissioning Support", 
        desc: "Provide on-site support for burner firing tests, draft fan damper calibration, and refractory dry-out heating cycles. We review thermal expansion benchmarks and deliver as-built drawing documentation." 
      }
    ]
  },
  {
    title: "Design Review Process",
    steps: [
      { 
        name: "Sizing Draft", 
        desc: "Incorporate process thermal duties to draft the initial tube layout, radiant coil pitch, convective tube spacing, and initial structural column footprint, creating a raw mechanical arrangement envelope." 
      },
      { 
        name: "Internal Audit", 
        desc: "Conduct a multi-disciplinary peer check where lead structural and mechanical engineers audit load assumptions, thermal parameters, wind loading profiles, material grades, and calculation codes." 
      },
      { 
        name: "Client Workshop", 
        desc: "Present the detailed General Arrangement drawings to the client engineering team. We review process tube access paths, circular platform walkway heights, burner floor headroom, and utility routing lines." 
      },
      { 
        name: "EIL Alignment", 
        desc: "Verify that the entire drawing and mechanical design package complies exactly with Engineers India Limited (EIL) standard designs, specifications, inspection clauses, and material testing criteria." 
      },
      { 
        name: "Issue for Bid", 
        desc: "Release approved drawings to qualified fabrication vendors for cost estimations. We assist the client in analyzing technical bids, reviewing sub-vendor deviations, and providing purchase recommendations." 
      },
      { 
        name: "Issue for Construction", 
        desc: "Incorporate fabrication vendor details, concrete coordinate reviews, and final piping interface specs. We stamp and distribute the final Approved-for-Construction (AFC) drawings package." 
      }
    ]
  },
  {
    title: "Structural Design Workflow",
    steps: [
      { 
        name: "Loads Setup", 
        desc: "Compile dead, live, wind, and seismic design load cases. We evaluate coastal wind pressure distributions and refinery seismic coefficients per IS 875, IS 1893, and international codes." 
      },
      { 
        name: "STAAD Modeling", 
        desc: "Build a comprehensive 3D finite element frame model in STAAD.Pro. We apply all combined load cases, joint constraints, and beam offsets to simulate realistic load distribution through columns and braces." 
      },
      { 
        name: "Member Select", 
        desc: "Analyze member stress ratios, checking axial, bending, and shear stress compliance. We optimize structural steel beam and column sections to ensure safety margins while minimizing overall tonnage." 
      },
      { 
        name: "Connection Design", 
        desc: "Design critical bolted and welded connections at structural joints, platform hangers, and bracing gussets. We verify weld throat sizes, bolt shear strengths, and plate thicknesses." 
      },
      { 
        name: "Foundation Design", 
        desc: "Perform foundation analysis, calculating vertical, horizontal, and overturning moment reactions. We design dynamic pile caps, concrete pedestal sizes, and anchor bolt embedded configurations." 
      },
      { 
        name: "Detailing Handover", 
        desc: "Deliver structural design calculations, model files, framing coordinates, and connection parameters to the Tekla detailing office, initiating the fabrication drawings phase." 
      }
    ]
  },
  {
    title: "Fabrication Drawing Process",
    steps: [
      { 
        name: "Model Check", 
        desc: "Review the compiled 3D Tekla model for spatial interferences, weld clearance, bolt access paths, platform interfaces, and nozzle piping coordinates to eliminate shop errors." 
      },
      { 
        name: "Assembly Files", 
        desc: "Generate detailed structural assembly drawings showing shop fit-up dimensions, weld profiles, pre-assemblies, lifting points, and precise material lists for structural columns and girders." 
      },
      { 
        name: "Part Drawings", 
        desc: "Extract single-part drawings for plate fittings, bracing gussets, base plates, stair treads, and handrails. Each part drawing specifies cutting shapes, hole pitches, and bevel details." 
      },
      { 
        name: "BOM Generation", 
        desc: "Produce structured, structured Bill of Materials (BOM) categorizing structural steel grades, bolt quantities, platform gratings area, and electrode requirements to streamline raw material procurement." 
      },
      { 
        name: "NC Data Export", 
        desc: "Generate and export digital NC (DSTV) files and DXF profiles directly from the Tekla model database, allowing CNC machinery at fabrication yards to cut, drill, and notch steel automatically." 
      },
      { 
        name: "Weld Schedules", 
        desc: "Prepare welding procedure specifications (WPS) and procedure qualification records (PQR), outlining weld types, electrode grades, preheat temperatures, and non-destructive testing requirements." 
      }
    ]
  },
  {
    title: "Drawing Approval Workflow",
    steps: [
      { 
        name: "Draft Check", 
        desc: "Perform a detailed in-house check of all layout drawings, checking dimensions, elevation tags, clearances, and annotations against initial design reports." 
      },
      { 
        name: "Lead Engineer Review", 
        desc: "Lead structural and mechanical engineers audit the drawing packages, ensuring full alignment with the client's project specification sheets and design guidelines." 
      },
      { 
        name: "Submit to Owner", 
        desc: "Transmit drawings package to the refinery owner's technical group. We track review cycles and participate in technical alignment meetings." 
      },
      { 
        name: "Third Party Audit", 
        desc: "Submit packages to auditing agencies (such as EIL or Lloyds). We address technical audits, providing clarification and recalculations as required." 
      },
      { 
        name: "Incorporate Comments", 
        desc: "Revise drawing model database to address comments. Revised parts are flagged, cloud-marked, and logged in the revision history database." 
      },
      { 
        name: "Final Seal", 
        desc: "Stamping the drawings package as 'Approved for Construction' (AFC), distributing final PDF, CAD, and model files to all procurement and construction teams." 
      }
    ]
  },
  {
    title: "Construction Support Workflow",
    steps: [
      { 
        name: "Site Readiness", 
        desc: "Conduct site surveys to inspect concrete foundations. We verify anchor bolt elevations, coordinate centerlines, and pile head conditions before steel arrives." 
      },
      { 
        name: "Erection Staging", 
        desc: "Coordinate erection sequence drawings, detailing steel column assembly splits, dynamic crane lifting configurations, and temporary guy-wire bracing coordinates." 
      },
      { 
        name: "Steel Assembly", 
        desc: "Provide technical supervision for main steelwork column erection, checking beam levels, platform fit-ups, stair alignments, and field bolt tightening torques." 
      },
      { 
        name: "Coil Erection", 
        desc: "Supervise the lift and positioning of convection section modules, radiant tube coils, and vertical stacks. We inspect coil support alignments and hanger loading." 
      },
      { 
        name: "Alignment Check", 
        desc: "Inspect structural vertical alignment (plumb check) and thermal expansion gaps for headers and ducts, confirming all parts can expand freely under operation." 
      },
      { 
        name: "Final Inspection", 
        desc: "Execute a final walk-down inspection of all structural bolts, weld profiles, platforms, and stack dampers, compiling punch lists and issuing stability certificates." 
      }
    ]
  },
  {
    title: "Engineering Deliverables",
    steps: [
      { 
        name: "Calculations Book", 
        desc: "Compile mechanical calculations (ASME, API 530) and structural design reports detailing wind, seismic, and steel stress analysis, serving as the official record." 
      },
      { 
        name: "GA Drawings", 
        desc: "Provide comprehensive General Arrangement (GA) layouts showing overall dimensions, sectional views, nozzle schedules, foundation inputs, and design parameters." 
      },
      { 
        name: "Shop Drawings", 
        desc: "Deliver fabrication drawings, single-part drawings, and assembly details, enabling fabrication yards to manufacture steel members and casings." 
      },
      { 
        name: "Material MTOs", 
        desc: "Provide material take-offs detailing steel profiles, tube weights, refractory quantities, bolting hardware, and pipe fittings for efficient procurement." 
      },
      { 
        name: "Refractory Layouts", 
        desc: "Deliver complete refractory details specifying brick linings, insulating castable layers, thermal ceramic boards, and anchor pin arrangements." 
      },
      { 
        name: "As-Built Records", 
        desc: "Update all drawing packages to reflect field modifications made during erection, ensuring the client receives accurate as-built drawings." 
      }
    ]
  },
  {
    title: "Quality Assurance Process",
    steps: [
      { 
        name: "Standard Audit", 
        desc: "Verify project scope compliance with engineering standards including API 530, ASME Section I/VIII, and specific refinery design specifications." 
      },
      { 
        name: "Material Check", 
        desc: "Verify mill test certificates for steel casing plates, dynamic structural beams, refractory anchors, and pressure coils, ensuring absolute material compliance." 
      },
      { 
        name: "NDT Detailing", 
        desc: "Draft NDT layouts detailing radiographic testing (RT), dye penetrant testing (DP), ultrasonic testing (UT), and magnetic particle testing (MPT) for structural and coil welds." 
      },
      { 
        name: "Dimensional Control", 
        desc: "Perform checks on critical parts, verifying nozzle orientation, bolt hole pitches, casing dimensions, and coil alignments are within tolerances." 
      },
      { 
        name: "Hydrotest Audit", 
        desc: "Supervise hydrostatic tests of coil assemblies, verifying test pressures, checking hold times, and inspecting fittings for leaks." 
      },
      { 
        name: "Final Sign-off", 
        desc: "Compile the final quality record book (Manufacturing Record Book), documenting weld logs, NDT reports, heat treatment charts, and mill certificates." 
      }
    ]
  },
  {
    title: "Remaining Life Assessment",
    steps: [
      { 
        name: "Visual Survey", 
        desc: "Inspect steel structure corrosion, casing warping, paint condition, concrete foundation cracking, and anchor bolt corrosion, compiling a visual damage index." 
      },
      { 
        name: "NDT Testing", 
        desc: "Perform ultrasonic thickness checks (UT) on stacks, ducts, and columns, comparing actual thickness with design specs to calculate corrosion rates." 
      },
      { 
        name: "Hardness Checks", 
        desc: "Conduct structural steel hardness tests and field metallographic replication (FMR) on high-stress welds, assessing carbon migration and creep damage." 
      },
      { 
        name: "FEM Modeling", 
        desc: "Build a 3D structural model in software using UT thickness scans, evaluating actual stress distribution under current load capacities." 
      },
      { 
        name: "Stress Check", 
        desc: "Perform calculations to verify compliance under wind and seismic forces, checking stack overturning safety and column load ratios." 
      },
      { 
        name: "Life Report", 
        desc: "Deliver the final RLA report detailing estimated remaining safe operating life, recommended inspection schedules, and structural reinforcement details." 
      }
    ]
  }
];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState('drawings');
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedIll, setSelectedIll] = useState(illustrations[0]);
  const [activeWf, setActiveWf] = useState(workflows[0]);
  const [activeWfStep, setActiveWfStep] = useState(0);
  const [_, setLocation] = useLocation();

  const handleBookRedirect = (serviceName) => {
    setLocation('/contact?service=' + encodeURIComponent(serviceName));
  };

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
              { id: 'illustrations', label: 'Interactive 3D CAD Models' },
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
                    ? 'border-b-[#0a1628] text-[#0a1628]'
                    : 'border-b-transparent text-gray-400 hover:text-gray-600'
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
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">{draw.code}</span>
                          <span className="text-[9px] font-semibold text-gray-400">{draw.service}</span>
                        </div>
                        <h3 className="font-bold text-sm text-[#0a1628] mb-2">{draw.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mb-4">{draw.desc}</p>
                      </div>
                      <div className="flex items-center justify-between gap-4 mt-2">
                        <span className="text-[10px] font-bold uppercase text-[#0a1628] hover:text-[#43648e] transition-colors flex items-center gap-1">
                          Open Sheet &rarr;
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookRedirect(draw.service);
                          }}
                          className="bg-[#0a1628] text-white hover:bg-[#43648e] transition-colors px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-sm"
                        >
                          Book Service
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EXPLODED ILLUSTRATIONS (THREE.JS 3D VIEW) */}
          {activeTab === 'illustrations' && (
            <div className="grid lg:grid-cols-3 gap-12 items-start">
              {/* Left Column: Menu */}
              <div className="lg:col-span-1 bg-white border border-gray-200 p-6 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-5">Select 3D Component</h3>
                <div className="space-y-1">
                  {illustrations.map((ill) => (
                    <button
                      key={ill.id}
                      onClick={() => setSelectedIll(ill)}
                      className={`w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-l-2 transition-all flex items-center justify-between ${
                        selectedIll.id === ill.id
                          ? 'bg-[#0a1628]/5 border-l-[#0a1628] text-[#0a1628]'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                      }`}
                    >
                      <span>{ill.title}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${selectedIll.id === ill.id ? 'translate-x-1' : 'opacity-30'}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right/Middle Columns: Details & 3D Interactive WebGL Rendering */}
              <div className="lg:col-span-2 space-y-8">
                {/* Three.js Interactive 3D Canvas */}
                <div className="bg-[#050b14] aspect-[16/10] flex items-center justify-center text-white relative overflow-hidden shadow-md border border-gray-200">
                  <ThreeViewer type={selectedIll.threeType} />
                  
                  {/* Interaction Instructions */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-white/50 bg-black/40 px-2.5 py-1.5 rounded-sm pointer-events-none">
                    <Activity className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    <span>Left Click + Drag: Rotate 360&deg; | Wheel: Zoom</span>
                  </div>

                  {/* Watermark/Metadata details */}
                  <div className="absolute bottom-4 left-6 flex items-center gap-2 text-[9px] uppercase tracking-widest text-white/30 pointer-events-none">
                    <Settings className="w-3.5 h-3.5 animate-spin-slow" />
                    <span>WebGL 3D Engine Active</span>
                  </div>
                </div>

                {/* Conceptual metadata descriptions card */}
                <div className="bg-white border border-gray-200 p-8 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block mb-1">WebGL Interactive 3D Model</span>
                      <h3 className="text-2xl font-bold text-[#0a1628]">{selectedIll.title}</h3>
                    </div>
                    <button
                      onClick={() => handleBookRedirect(selectedIll.service)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-sm shadow-md transition-colors"
                    >
                      Book Service: {selectedIll.service} &rarr;
                    </button>
                  </div>
                  
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
                          ? 'bg-[#0a1628]/5 border-l-[#0a1628] text-[#0a1628]'
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
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-8">
                    {activeWf.steps.map((step, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveWfStep(idx)}
                        className={`border p-3 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                          activeWfStep === idx
                            ? 'bg-[#0a1628] text-white border-[#0a1628] shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-[#0a1628]'
                        }`}
                      >
                        <div>
                          <div className={`text-[9px] font-bold mb-1 ${activeWfStep === idx ? 'text-white/50' : 'text-gray-400 group-hover:text-blue-700'}`}>
                            STEP 0{idx + 1}
                          </div>
                          <h4 className="font-bold text-[10px] leading-tight mb-1">{step.name}</h4>
                        </div>
                        <span className={`text-[8px] font-bold mt-3 block ${activeWfStep === idx ? 'text-white/80' : 'text-gray-400 group-hover:text-[#0a1628]'}`}>
                          View Detail &rarr;
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
                        <div className="w-8 h-8 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center shadow-sm shrink-0">
                          0{activeWfStep + 1}
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 block">Active Step Detail</span>
                          <h4 className="font-bold text-sm text-[#0a1628]">{activeWf.steps[activeWfStep].name}</h4>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed pl-11">
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">{selectedImg.code}</span>
                    <span className="text-white/40 text-[9px] font-semibold">{selectedImg.service}</span>
                  </div>
                  <h3 className="text-lg font-bold">{selectedImg.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mt-1">{selectedImg.desc}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedImg(null);
                      handleBookRedirect(selectedImg.service);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-sm transition-colors"
                  >
                    Book Service Inquire &rarr;
                  </button>
                  <span className="text-[9px] uppercase tracking-wider text-white/30">
                    Confidentiality-Safe View
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
