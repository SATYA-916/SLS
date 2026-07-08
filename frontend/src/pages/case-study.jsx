import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { PageMeta } from '@/components/PageMeta';
import { getProjects } from '@/lib/api';
import { fallbackProjects } from '@/data/fallbackProjects';
import { 
  ArrowLeft, Building2, Calendar, User, MapPin, 
  Tag, ShieldCheck, ClipboardList, CheckCircle2, ChevronRight 
} from 'lucide-react';

export function getThreeModelIdForProject(project) {
  if (!project) return 'complete-heater';
  
  const id = project.id;

  // Specific project-to-model mapping
  if (id === 1) return 'canopy-millennium';
  if (id === 2) return 'ac-shelter';
  if (id === 3) return 'mt-pool-structure';
  if (id === 4) return 'concrete-shield-wall';
  if (id === 5) return 'sgp-lead-shield';
  if (id === 6) return 'cseam-lead-shield';
  if (id === 7) return 'marking-fixture';
  if (id === 8) return 'cold-box-foundation';
  if (id === 9) return 'compressor-foundation';
  if (id === 10) return 'boiler-house-frame';
  if (id === 11) return 'steel-chimney';
  if (id === 12) return 'vfd-room';
  if (id === 13) return 'retaining-wall';
  if (id === 14) return 'air-duct';
  if (id === 15) return 'monorail-hoist';
  if (id === 16) return 'vessel-skid';
  if (id === 17) return 'damper-assembly';
  if (id === 18) return 'piping-manifold';
  if (id === 19) return 'refractory-anchor';
  if (id === 20) return 'tube-sheet';
  if (id === 21) return 'crossover-piping';
  if (id === 22) return 'sag-rod';
  if (id === 23) return 'expansion-bellows';
  if (id === 24) return 'breeching-casing';
  if (id === 25) return 'skid-piping';
  if (id === 27) return 'stair-tower';
  if (id === 28) return 'cage-ladder';
  if (id === 29) return 'piling-grid';
  if (id === 30) return 'flare-tip';
  if (id === 31) return 'preheater-rotor';

  // Fallbacks for the rest of the 50 projects
  if (id === 48) return 'evaporator-structure';
  if (id === 49) return 'dhdt-heater';
  if (id === 50) return 'hds-heater';

  const cat = project.category || '';
  const title = (project.title || '').toLowerCase();
  const desc = (project.description || '').toLowerCase();

  if (title.includes('canopy')) return 'canopy-millennium';
  if (title.includes('shelter')) return 'ac-shelter';
  if (title.includes('pool')) return 'mt-pool-structure';
  if (title.includes('concrete') || title.includes('wall')) return 'concrete-shield-wall';
  if (title.includes('sgp') || title.includes('generator')) return 'sgp-lead-shield';
  if (title.includes('c-seam') || title.includes('seam')) return 'cseam-lead-shield';
  if (title.includes('fixture') || title.includes('marking')) return 'marking-fixture';
  if (title.includes('cold box') || title.includes('foundation')) return 'cold-box-foundation';
  if (title.includes('compressor')) return 'compressor-foundation';
  if (title.includes('boiler') || title.includes('power')) return 'boiler-house-frame';
  if (title.includes('chimney') || title.includes('stack')) return 'steel-chimney';
  if (title.includes('room') || title.includes('vfd')) return 'vfd-room';
  if (title.includes('retaining')) return 'retaining-wall';
  if (title.includes('duct') || title.includes('combustion')) return 'air-duct';
  if (title.includes('hoist') || title.includes('monorail')) return 'monorail-hoist';
  if (title.includes('skid') || title.includes('vessel')) return 'vessel-skid';
  if (title.includes('damper')) return 'damper-assembly';
  if (title.includes('manifold') || title.includes('header')) return 'piping-manifold';
  if (title.includes('anchor')) return 'refractory-anchor';
  if (title.includes('sheet') || title.includes('tubesheet')) return 'tube-sheet';
  if (title.includes('crossover')) return 'crossover-piping';
  if (title.includes('sag') || title.includes('purlin')) return 'sag-rod';
  if (title.includes('bellows') || title.includes('expansion')) return 'expansion-bellows';
  if (title.includes('breeching') || title.includes('casing')) return 'breeching-casing';
  if (title.includes('stair') || title.includes('tower')) return 'stair-tower';
  if (title.includes('ladder') || title.includes('cage')) return 'cage-ladder';
  if (title.includes('pile') || title.includes('grid')) return 'piling-grid';
  if (title.includes('flare') || title.includes('tip')) return 'flare-tip';
  if (title.includes('rotor') || title.includes('preheater')) return 'preheater-rotor';

  // Fired Heaters
  if (cat === 'Fired Heaters' || title.includes('heater') || desc.includes('heater')) {
    if (title.includes('convection')) return 'convection-section';
    if (title.includes('radiant')) return 'radiant-section';
    if (title.includes('stack') || title.includes('chimney')) return 'complete-stack';
    if (title.includes('header')) return 'header-box';
    if (title.includes('platform') || title.includes('stair')) return 'platform-system';
    return 'complete-heater';
  }

  // Boilers & Chimneys
  if (cat === 'Boilers & Chimneys' || title.includes('chimney') || title.includes('stack') || desc.includes('chimney') || desc.includes('stack')) {
    if (title.includes('duct') || desc.includes('duct')) return 'off-take-duct';
    return 'complete-stack';
  }

  // Cryogenic Plants
  if (cat === 'Cryogenic Plants' || title.includes('cryogenic') || desc.includes('cryogenic') || title.includes('cold box') || desc.includes('cold box')) {
    return 'support-steel';
  }

  // Special Structures
  if (cat === 'Special Structures' || title.includes('shield') || title.includes('fixture') || desc.includes('shield') || desc.includes('fixture')) {
    if (title.includes('door')) return 'breeching-door';
    return 'maintenance-access-sys';
  }

  // Default fallback categories
  if (title.includes('roof') || title.includes('truss')) return 'roof-structure';
  if (title.includes('stair') || title.includes('ladder')) return 'stair-assembly';
  if (title.includes('platform') || title.includes('grating')) return 'platform-system';
  
  return 'complete-frame';
}


const PROJECT_DRAWINGS = {
  48: [
    {
      file: "evaporator_ga.png",
      title: "General Arrangement of Structure",
      ref: "SLS-1011-16-GA-01",
      desc: "General arrangement elevations showing building column spacings, platform heights (-4m, 0m, 4m, 8m), and vertical bracing schemes.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_columns.png",
      title: "Column Detailing & Splicing",
      ref: "SLS-1011-16-COL-02",
      desc: "Structural detailing of vertical column members, heavy base plates, anchor bolt positions, and splice plate connections.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_beams.png",
      title: "Floor Beams Framing Plans",
      ref: "SLS-1011-16-BM-03",
      desc: "Floor framing layout showing primary beam sections, secondary floor beam joists, and connections.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_bracing.png",
      title: "Column Vertical Bracing Details",
      ref: "SLS-1011-16-BR-04",
      desc: "Diagonal cross bracing systems designed to resist lateral forces from cyclonic wind loads.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_platforms.png",
      title: "Operating Platforms Layout",
      ref: "SLS-1011-16-PL-05",
      desc: "Detailed operating platform framing surrounding the central evaporator vessel, complete with toe-guards.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_grating.png",
      title: "Platform Floor Gratings Schedule",
      ref: "SLS-1011-16-GR-06",
      desc: "Layout of anti-slip floor grating panels, detailing panel dimensions, circular nozzle penetrations, and fixing clips.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_staircase.png",
      title: "Access Staircase Detailing",
      ref: "SLS-1011-16-ST-07",
      desc: "Structural detailing of double-flight access stairs, including stringers, landing supports, and tread steps.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_truss_ga.png",
      title: "Roof Canopy Truss GA",
      ref: "SLS-1011-16-TR-08",
      desc: "General assembly of the roof canopy W-type trusses, specifying rafter angles and vertical post lines.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_truss_detail.png",
      title: "Roof Truss Connections",
      ref: "SLS-1011-16-TR-09",
      desc: "High-fidelity joint detailing of trusses using thick steel gusset plates, specifying weld sizes.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_truss_bracing.png",
      title: "Roof Truss Diagonal Plan Bracing",
      ref: "SLS-1011-16-TR-10",
      desc: "Plan diagram of roof cross bracing lines designed to distribute wind forces down to structural columns.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_false_rafter.png",
      title: "False Rafter Eaves Detailing",
      ref: "SLS-1011-16-FR-11",
      desc: "Details for overhang false rafters providing building eaves projection and cladding support.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_side_runners.png",
      title: "Wall Cladding Side Girts",
      ref: "SLS-1011-16-SR-12",
      desc: "Elevation showing side wall cladding runner girts (cold-formed channels) and sag rod holes.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_purlin.png",
      title: "Roof Purlins & Connections",
      ref: "SLS-1011-16-PR-13",
      desc: "Roof purlin girt spacings, cleats, eaves struts, and thermal expansion joints under cladding.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_sag_rods.png",
      title: "Purlin Sag Rod Detailing",
      ref: "SLS-1011-16-SG-14",
      desc: "Vertical tie rods spanning between purlins/girts to prevent sag deflection under gravity loads.",
      modelId: "evaporator-structure"
    },
    {
      file: "evaporator_ladder.png",
      title: "Safety Cage Ladder detail",
      ref: "SLS-1011-16-LD-15",
      desc: "Structural detailing of vertical ladder, safety cage hoops, and back vertical flat bar safety straps.",
      modelId: "evaporator-structure"
    }
  ],
  49: [
    {
      file: "eil_ga_sheet1.png",
      title: "DHDT Fired Heater - GA Elevation",
      ref: "6879-211-05-42-0102",
      desc: "General arrangement elevations detailing dimensions of burner floor, radiant chamber, convection module, stack, and catwalks.",
      modelId: "complete-heater"
    },
    {
      file: "eil_ga_sheet2.png",
      title: "Radiant Section Casing Details",
      ref: "6879-211-05-42-0103",
      desc: "Plate development and stiffener layout for the cylindrical radiant zone, showing viewport frames and burner openings.",
      modelId: "radiant-section"
    },
    {
      file: "eil_ga_sheet3.png",
      title: "Convection Section Module GA",
      ref: "6879-211-05-42-0104",
      desc: "Internal detail of tube supports, intermediate tubesheets, dynamic corbel plates, and refractory lining anchorage.",
      modelId: "convection-section"
    },
    {
      file: "eil_ga_sheet4.png",
      title: "Exhaust Stack Casing & Strakes",
      ref: "6879-211-05-42-1105",
      desc: "Detailed drawings for the exhaust stack casing plates, helical strakes profile development, and base ring details.",
      modelId: "complete-stack"
    },
    {
      file: "eil_ga_sheet5.png",
      title: "Radiant Coil Piping Layout",
      ref: "6879-000-05-42-1301",
      desc: "High-alloy process coil layouts, tube guides, dynamic hanger systems, and return bend nozzle connections.",
      modelId: "radiant-section"
    },
    {
      file: "eil_ga_sheet6.png",
      title: "Convection Header Box Assembly",
      ref: "BR-40053-02-A-101-SHT1",
      desc: "Convection header box structure detailing, return bend spaces, access door hinges, and high-temp gaskets.",
      modelId: "header-box"
    },
    {
      file: "eil_ga_sheet7.png",
      title: "Radiant Floor & Burner Plates",
      ref: "BR-40053-02-A-101-SHT2",
      desc: "Mechanical layout of bottom floor plate stiffeners, burner nozzle penetration flanges, and plenum supports.",
      modelId: "complete-heater"
    },
    {
      file: "eil_ga_sheet8.png",
      title: "Access Platforms & Handrails",
      ref: "BR-40053-02-A-101-SHT3",
      desc: "Details for circular operating platform brackets, walkways, kick-plates, and OSHA-compliant safety railings.",
      modelId: "heater-platforms"
    }
  ],
  50: [
    {
      file: "hds_parts_sheet1.png",
      title: "HDS Heater - Pressure Parts GA",
      ref: "6879-212-05-42-1202",
      desc: "Thermal coil sizing layouts, crossover pipe configurations, design parameters (pressures/temps), and hydrotest specs.",
      modelId: "complete-heater"
    },
    {
      file: "hds_radiant_sheet1.png",
      title: "Radiant Zone Casing Details",
      ref: "6879-212-05-42-1203",
      desc: "Cylindrical casing panels layout, stiffening channel rings, observation port sleeves, and explosive relief doors.",
      modelId: "radiant-section"
    },
    {
      file: "hds_radiant_sheet2.png",
      title: "Radiant Section Casing Assembly",
      ref: "6879-212-05-42-1204",
      desc: "Details showing vertical structural columns, circular ring girders, base anchor plates, and lifting lug welds.",
      modelId: "radiant-section"
    },
    {
      file: "hds_convection_sheet1.png",
      title: "Convection Tube Supports & Sheets",
      ref: "BR-40053-03-A-101-SHT1",
      desc: "Intermediate cast alloy support plates, end tubesheets, tube guides, and baffle configurations for high velocity flue gas.",
      modelId: "convection-section"
    },
    {
      file: "hds_convection_sheet2.png",
      title: "Convection Box Casing & Transitions",
      ref: "BR-40053-03-A-101-SHT2",
      desc: "Convection casing wall detailing, end plate flanges, off-take breeching transition flange, and external stiffening angles.",
      modelId: "convection-section"
    },
    {
      file: "hds_sss_sheet1.png",
      title: "Steel Support Structure Layout",
      ref: "BR-40053-03-A-101-SHT3",
      desc: "Structural detailing of primary columns, diagonal bracing frames, base plates, and beam-to-column moment connections.",
      modelId: "complete-heater"
    },
    {
      file: "hds_stack_sheet1.png",
      title: "Exhaust Stack Flange & Anchor Details",
      ref: "BR-40053-03-A-101-SHT4",
      desc: "Lower stack base ring plate, anchor chairs, stiffener plates, and dynamic foundation reaction loading tables.",
      modelId: "complete-stack"
    },
    {
      file: "hds_header_sheet1.png",
      title: "Header Box Shell Plates & Hinged Doors",
      ref: "BR-40053-03-A-101-SHT5",
      desc: "Casing details for return bend header boxes, hinged access door frames, locking bolts, and ceramic fiber gaskets.",
      modelId: "header-box"
    }
  ]
};

function getProjectTechnicalSpecs(proj) {
  const category = proj.category || '';
  const title = proj.title || '';
  const desc = proj.description || '';

  const specs = {
    codes: 'IS 800 (Structural Design), IS 456 (Concrete)',
    software: 'AutoCAD, STAAD.Pro',
    deliverables: 'Structural design calculations & construction fabrication details'
  };

  if (category === 'Fired Heaters' || title.toLowerCase().includes('heater') || desc.toLowerCase().includes('heater')) {
    specs.codes = 'API 560 (Fired Heaters), API 530 (Tube Thickness Calc), ASME Section VIII (Pressure Parts)';
    specs.software = 'AutoCAD, STAAD.Pro, ANSYS (FEA Thermal Modeling)';
    specs.deliverables = 'Thermal & Structural Calculations, General Arrangement & Shell Detail Drawings, Nozzle Load Verification Reports';
  } else if (category === 'Cryogenic Plants' || desc.toLowerCase().includes('cryogenic') || desc.toLowerCase().includes('cold box')) {
    specs.codes = 'ASME Section VIII Div 1, AD 2000, IS 1893 (Seismic Design)';
    specs.software = 'STAAD.Pro, ANSYS (Dynamic foundation FEA)';
    specs.deliverables = 'Heavy Dynamic Foundation design reports, Anchor Bolt layout drawings, RCC Pile load capacity analysis';
  } else if (category === 'Boilers & Chimneys' || title.toLowerCase().includes('stack') || title.toLowerCase().includes('chimney') || desc.toLowerCase().includes('chimney')) {
    specs.codes = 'IS 6533 (Steel Chimneys), IS 875 Part 3 (Wind Loads), ASME STS-1 (Steel Stacks)';
    specs.software = 'AutoCAD, STAAD.Pro (Finite element chimney shell model)';
    specs.deliverables = 'Vortex shedding dynamic analysis reports, Helical strake layout sheets, Foundation reaction reports';
  } else if (category === 'Special Structures' || desc.toLowerCase().includes('shield') || desc.toLowerCase().includes('fixture')) {
    specs.codes = 'ASME Section VIII, AISC 360, IS 800 (Steel structures)';
    specs.software = 'AutoCAD, ANSYS (Lifting & structural integrity FEA)';
    specs.deliverables = 'Radiographic cordoning shielding design sheets, Heavy lifting rigging plans, FEA structural stress verification reports';
  }

  return specs;
}

export default function CaseStudy() {
  const params = useParams();
  const projectId = parseInt(params.id);
  const [activeLightboxImg, setActiveLightboxImg] = useState(null);

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
    initialData: fallbackProjects,
  });

  const project = projects?.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 bg-white">
        <ShieldCheck className="w-10 h-10 text-red-500" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Case Study Not Found</h2>
        <Link href="/projects" className="text-xs text-blue-700 underline font-bold uppercase tracking-widest">&larr; Back to Portfolio</Link>
      </div>
    );
  }

  const specs = getProjectTechnicalSpecs(project);

  return (
    <div className="w-full bg-white">
      <PageMeta
        title={`${project.title} — Case Study`}
        description={`Read the full structural engineering case study for "${project.title}" by SLS Consultants. Challenge description, design solutions, applicable codes, and engineering drawings.`}
      />

      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="container mx-auto px-4">
          <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#0a1628] transition-colors mb-6 cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
          </Link>
          <div className="max-w-3xl">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-700 block mb-2">{project.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-[#0a1628] leading-tight mb-4">{project.title}</h1>
            <div className="flex flex-wrap items-center gap-y-3 gap-x-6 text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-slate-400" /> Client: <strong>{project.client}</strong></span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-400" /> Year: <strong>{project.year}</strong></span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> Location: <strong>Visakhapatnam, India</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
            {/* Main Case Study Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Image banner */}
              <div className="w-full h-80 sm:h-96 bg-gray-50 border border-gray-200 overflow-hidden rounded-sm flex items-center justify-center relative">
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-gray-200" />
                )}
              </div>

              {/* Content Blocks */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-[#0a1628] pl-3 mb-3">Project Summary</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>
                </div>

                {project.challenge && (
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-amber-600 pl-3 mb-3">The Challenge</h2>
                    <p className="text-sm text-gray-600 leading-relaxed bg-amber-50/20 border border-amber-100 p-4 rounded-sm">{project.challenge}</p>
                  </div>
                )}

                {project.solution && (
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-green-600 pl-3 mb-3">Our Solution</h2>
                    <p className="text-sm text-gray-600 leading-relaxed bg-green-50/20 border border-green-100 p-4 rounded-sm">{project.solution}</p>
                  </div>
                )}

                {project.slsAction && (
                  <div>
                    <h2 className="text-lg font-black uppercase tracking-wider text-[#0a1628] border-l-3 border-blue-600 pl-3 mb-3">Consulting Scope &amp; Deliverables</h2>
                    <p className="text-sm text-gray-600 leading-relaxed bg-blue-50/10 border border-blue-100 p-4 rounded-sm">{project.slsAction}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar - Technical Specifications Card */}
            <div className="lg:col-span-1">
              <div className="bg-slate-50 border border-slate-200 p-6 sticky top-24 rounded-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-5 pb-3 border-b border-slate-200 flex items-center gap-1.5">
                  <ClipboardList className="w-4 h-4 text-slate-400" /> Engineering Specs
                </h3>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Applicable Codes</span>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed block">{specs.codes}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Design Software</span>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed block">{specs.software}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block mb-1">Deliverables Log</span>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed block">{specs.deliverables}</span>
                  </div>
                  {getThreeModelIdForProject(project) && (
                    <div className="pt-4 border-t border-slate-200">
                      <Link href={`/gallery?tab=models&model=${getThreeModelIdForProject(project)}`}>
                        <button className="w-full bg-[#43648e] hover:bg-[#0a1628] text-white py-2.5 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                          Open Interactive 3D Model &rarr;
                        </button>
                      </Link>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-200">
                    <div className="bg-[#0a1628]/5 p-4 border border-[#0a1628]/10 rounded-sm">
                      <h4 className="text-xs font-bold text-[#0a1628] mb-1 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" /> Need similar specs?
                      </h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                        We offer full feasibility reviews and sizing calculations for similar projects.
                      </p>
                      <Link href={`/contact?service=${encodeURIComponent(project.category)}`}>
                        <button className="w-full bg-[#0a1628] hover:bg-[#1a2f4c] text-white py-2 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1 cursor-pointer">
                          Inquire Specs <ChevronRight className="w-3 h-3" />
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Drawings Register full-width block */}
          {PROJECT_DRAWINGS[projectId] && (
            <div className="mt-16 border-t border-gray-200 pt-16">
              <div className="mb-8">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-700 block mb-2">Technical Registry</span>
                <h2 className="text-2xl font-bold text-[#0a1628]">Technical Drawings & Layout References</h2>
                <p className="text-xs text-gray-500 mt-2 max-w-2xl leading-relaxed">
                  Referenced drawing sheets and general arrangement templates extracted directly from our design project folder: <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] text-[#0a1628] font-semibold">C:\DEVELOPMENT\sls\proprietary client</code>. All drawing titles, EIL document numbers, and descriptions are detailed below.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {PROJECT_DRAWINGS[projectId].map((draw, idx) => (
                  <div key={idx} className="border border-gray-200 bg-gray-50 flex flex-col justify-between hover:shadow-md transition-shadow duration-200 group rounded-sm animate-fade-in">
                    <div>
                      {/* Image preview with blur */}
                      <div className="w-full h-40 bg-white border-b border-gray-200 overflow-hidden relative flex items-center justify-center cursor-pointer" onClick={() => setActiveLightboxImg(draw)}>
                        <img 
                          src={`/gallery/${draw.file}`} 
                          alt={draw.title}
                          className="w-full h-full object-cover filter blur-[1.5px] hover:blur-none transition-all duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-[#0a1628] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-sm shadow">
                          Sheet {idx + 1}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="text-[9px] font-bold text-slate-400 uppercase mb-1 tracking-wider">{draw.ref}</div>
                        <h4 className="font-bold text-[#0a1628] text-xs leading-snug mb-2 group-hover:text-blue-700 transition-colors">{draw.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{draw.desc}</p>
                      </div>
                    </div>
                    
                    <div className="p-4 pt-0 flex flex-col gap-2">
                      <button 
                        onClick={() => setActiveLightboxImg(draw)}
                        className="w-full bg-white hover:bg-slate-100 border border-gray-300 text-slate-700 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Zoom Drawing Sheet
                      </button>
                      {draw.modelId && (
                        <Link href={`/gallery?tab=models&model=${draw.modelId}`}>
                          <button className="w-full bg-[#0a1628] hover:bg-[#1a2f4c] text-white py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-sm flex items-center justify-center gap-1 cursor-pointer">
                            View in 3D Model
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeLightboxImg && (
        <div className="fixed inset-0 bg-[#0a1628]/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white max-w-4xl w-full p-4 relative rounded-sm shadow-2xl flex flex-col">
            <button 
              onClick={() => setActiveLightboxImg(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-sm font-bold uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              ✕ Close
            </button>
            <div className="w-full bg-slate-50 border border-gray-200 overflow-hidden max-h-[70vh] flex items-center justify-center">
              <img 
                src={`/gallery/${activeLightboxImg.file}`} 
                alt={activeLightboxImg.title} 
                className="max-w-full max-h-[70vh] object-contain filter blur-[1px] hover:blur-none transition-all duration-300"
              />
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{activeLightboxImg.ref}</span>
                  <h3 className="text-sm font-bold text-[#0a1628] mt-0.5">{activeLightboxImg.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{activeLightboxImg.desc}</p>
                </div>
                {activeLightboxImg.modelId && (
                  <Link href={`/gallery?tab=models&model=${activeLightboxImg.modelId}`}>
                    <button 
                      onClick={() => {
                        setActiveLightboxImg(null);
                        // Make sure scroll starts at top of gallery
                        window.scrollTo(0, 0);
                      }}
                      className="bg-[#0a1628] hover:bg-[#1a2f4c] text-white px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors rounded-sm cursor-pointer whitespace-nowrap"
                    >
                      Open in 3D Model Viewer
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
