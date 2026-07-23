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

  // Exact Project-to-Model ID Mappings (Aligned with fallbackProjects.js)
  switch (id) {
    case 1:  return 'canopy-millennium';       // Millennium Retail Canopy
    case 2:  return 'ac-shelter';              // Environmental Control - AC Shelter
    case 3:  return 'mt-pool-structure';       // MT Pool Support Frame
    case 4:  return 'concrete-shield-wall';    // Concrete Shield Wall
    case 5:  return 'sgp-lead-shield';         // SGP Shield Radiography
    case 6:  return 'cseam-lead-shield';       // C-Seam RT Shield
    case 7:  return 'marking-fixture';         // CAMBER & Cutting Fixtures
    case 8:  return 'cseam-lead-shield';       // Container Coaming RT Shield (Mobile Shield)
    case 9:  return 'complete-frame';          // Surya Residency apartments (residential RCC column structure)
    case 11: return 'complete-frame';          // TAF Handling Structures
    case 12: return 'marking-fixture';         // Main Shaft Handling Fixtures
    case 13: return 'complete-frame';          // Visakha Govt College for Women (academic buildings)
    case 14: return 'complete-frame';          // Residential School Complex for ITDA
    case 15: return 'complete-frame';          // Bhaskar Residency Apartments
    case 16: return 'complete-frame';          // Commercial Complex
    case 17: return 'complete-frame';          // Apartment Complex at Yendada
    case 18: return 'roof-structure';          // Bungalow at Yendada (residential roof trusses)
    case 19: return 'stair-tower';             // College Buildings for PG Courses (structural staircase layout)
    case 20: return 'piling-grid';             // Residential Complex at Visakhapatnam (pile cap foundations grid)
    case 21: return 'piling-grid';             // Cryogenic Plant Foundations (Iran)
    case 22: return 'compressor-foundation';   // Machine Foundations (Hyderabad)
    case 23: return 'piling-grid';             // Cryogenic Plant Foundation (India)
    case 24: return 'boiler-house-frame';      // Compressor House & Pipe Rack structural frame
    case 25: return 'cold-box-foundation';     // Cold Box Foundation (Roorkee)
    case 27: return 'cold-box-foundation';     // Foundations for Cryogenic Equipment (Bina)
    case 28: return 'cold-box-foundation';     // Foundations for Cryogenic Equipment (Bhatinda)
    case 29: return 'cold-box-foundation';     // Foundations for Cryogenic Equipment (Kochi)
    case 30: return 'boiler-house-frame';      // 1X80 T/Hr Boiler Structures
    case 31: return 'vfd-room';                // VFD Control Room & Retaining Wall
    case 32: return 'steel-chimney';           // RLA of Steel Chimneys - Bhadrachalam
    case 33: return 'air-duct';                // SOFA Ducting & Air Heater Design
    case 34: return 'boiler-house-frame';      // 2X100 TPH Boiler House Structures
    case 51: return 'air-duct';                // TANDA Power - Back End Duct
    case 35: return 'hds-heater';              // Box Heaters - HPCL Mumbai
    case 36: return 'dhdt-heater';             // Cylindrical Fired Heater - BORL Bina
    case 37: return 'dhdt-heater';             // Cylindrical Heaters - CPCL Chennai
    case 38: return 'complete-heater';         // Ketene Furnace - Jubilant Organics
    case 39: return 'complete-heater';         // Ketene Furnace - IOL Chemicals
    case 40: return 'complete-heater';         // Refinery Heater Packages - Nagarjuna
    case 41: return 'complete-heater';         // CDU Heater Package - BPCL Kochi
    case 42: return 'complete-heater';         // DCU Heater Package - BPCL Cochin
    case 43: return 'mt-pool-structure';       // Maintenance Sheds - Kalpakkam
    case 44: return 'vessel-skid';             // Steam Generator Receiving Structures (Skid)
    case 45: return 'breeching-door';          // Vessel Cover Structures (Hinged Doors)
    case 46: return 'complete-frame';          // TERN Distilleries Expansion Project
    case 47: return 'piping-manifold';         // ASU Pipelines
    case 48: return 'evaporator-structure';    // Evaporator Building Structure
    case 49: return 'dhdt-heater';             // DHDT Fired Heater
    case 50: return 'hds-heater';              // HDS Fired Heater
    case 53: return 'santhipuram';             // Santhipuram Residential Complex
    case 54: return 'tarachand';               // Tara Chand Logistics Hub
    default: break;
  }
  
  // Fallbacks based on category/keywords
  const cat = project.category || '';
  const title = (project.title || '').toLowerCase();

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
  if (cat === 'Fired Heaters') return 'complete-heater';

  // General fallbacks
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
      desc: "Roof purlin girt spacings, cleats, eaves struts, and expansion joints under cladding.",
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
      desc: "Process coil sizing layouts, crossover pipe configurations, design parameters (pressures/temps), and hydrotest specs.",
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
  ],
  53: [
    {
      file: "santhipuram_layout.png",
      title: "Ground Floor Architectural Plan",
      ref: "SLS-2122-19-DW-1901",
      desc: "Architectural floor arrangement, partitioning walls, column coordinate offsets, and entrance detailing.",
      modelId: "santhipuram"
    },
    {
      file: "santhipuram_beams.png",
      title: "RCC Floor Beams Layout & Framing",
      ref: "SLS-2122-19-DW-1902",
      desc: "First floor framing layout specifying primary girders, concrete beam sections, and reinforcement profiles.",
      modelId: "santhipuram"
    },
    {
      file: "santhipuram_columns.png",
      title: "Columns Coordinates & Reinforcement",
      ref: "SLS-2122-19-DW-1903",
      desc: "Column spacing coordinates, cross section rebars sizing, and stirrups pitch intervals conforming to IS 456.",
      modelId: "santhipuram"
    },
    {
      file: "santhipuram_foundation.png",
      title: "Isolated Concrete Footings Details",
      ref: "SLS-2122-19-DW-1904",
      desc: "Sub-grade concrete footing mats geometry, thickness steps, excavations details, and steel mesh spacing.",
      modelId: "santhipuram"
    },
    {
      file: "santhipuram_details.png",
      title: "RCC Floor Slabs Reinforcement Schedules",
      ref: "SLS-2122-19-DW-1905",
      desc: "Structural detailing of concrete slabs including bottom/top reinforcement meshes and cranked bars.",
      modelId: "santhipuram"
    },
    {
      file: "santhipuram_drainage.png",
      title: "Roof Slope & Drainage Scheme",
      ref: "SLS-2122-19-DW-1926",
      desc: "Roof slopes, rainwater collection gutter coordinates, and downtake pipe location drawings.",
      modelId: "santhipuram"
    },
    {
      file: "santhipuram_liftwell.png",
      title: "Shear Wall lift-well Reinforcement",
      ref: "SLS-2122-19-SK-1901",
      desc: "Sketch detailing the concrete lift shaft shear wall thickness, vertical rebars, and lintel beams.",
      modelId: "santhipuram"
    }
  ],
  54: [
    {
      file: "tarachand_ga.png",
      title: "General Arrangement of Steel Structure",
      ref: "SLS-2324-01-DW-101",
      desc: "General elevations and plan drawings specifying bays spacing, column heights, and gantry crane paths.",
      modelId: "tarachand"
    },
    {
      file: "tarachand_columns.png",
      title: "Main Columns Steel Framing",
      ref: "SLS-2324-01-DW-102",
      desc: "Built-up H-beams column schedules, base anchor plate designs, gusset stiffeners, and splices.",
      modelId: "tarachand"
    },
    {
      file: "tarachand_trusses.png",
      title: "Roof Truss Structural Assembly",
      ref: "SLS-2324-01-DW-103",
      desc: "General configuration of roof trusses with detail drawings for welded joint gusset connections.",
      modelId: "tarachand"
    },
    {
      file: "tarachand_purlins.png",
      title: "Purlins & Side Girts Layout",
      ref: "SLS-2324-01-DW-104",
      desc: "Cold-formed Z-purlin spacings, eave strut dimensions, and sag rods hole alignments.",
      modelId: "tarachand"
    },
    {
      file: "tarachand_gantry.png",
      title: "Gantry Runway Girder Details",
      ref: "SLS-2324-01-DW-105",
      desc: "Structural detailing of crane runways, splice joints, and runway beam bracket moment connections.",
      modelId: "tarachand"
    },
    {
      file: "tarachand_foundations.png",
      title: "Heavy Piling Foundations Template",
      ref: "SLS-2324-01-DW-120",
      desc: "Foundation concrete layout showing locations of concrete piles, piling caps, and heavy anchor bolts.",
      modelId: "tarachand"
    }
  ]
};

function PipelineProfiler() {
  const [hoverIndex, setHoverIndex] = useState(null);

  const data = [
    { dist: 0, ground: 24.2, pipe: 22.7, soil: "Clayey Silt" },
    { dist: 250, ground: 23.8, pipe: 22.3, soil: "Clayey Silt" },
    { dist: 500, ground: 25.1, pipe: 23.6, soil: "Soft Rock" },
    { dist: 750, ground: 27.5, pipe: 25.5, soil: "Hard Granite" },
    { dist: 1000, ground: 28.2, pipe: 26.2, soil: "Hard Granite" },
    { dist: 1250, ground: 26.0, pipe: 24.2, soil: "Fissured Rock" },
    { dist: 1500, ground: 23.5, pipe: 22.0, soil: "Sandy Clay" },
    { dist: 1750, ground: 22.8, pipe: 21.3, soil: "Sandy Clay" },
    { dist: 2000, ground: 24.0, pipe: 22.5, soil: "Alluvial soil" }
  ];

  const width = 600;
  const height = 220;
  const padding = 40;

  const minX = 0;
  const maxX = 2000;
  const minY = 18;
  const maxY = 32;

  const getX = (dist) => padding + ((dist - minX) / (maxX - minX)) * (width - 2 * padding);
  const getY = (elev) => height - padding - ((elev - minY) / (maxY - minY)) * (height - 2 * padding);

  const groundPoints = data.map(d => `${getX(d.dist)},${getY(d.ground)}`).join(' ');
  const pipePoints = data.map(d => `${getX(d.dist)},${getY(d.pipe)}`).join(' ');

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 my-8 rounded-sm shadow-md text-white print:hidden">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div>
          <span className="text-[9px] font-black uppercase tracking-widest text-blue-400">Engineering Tool</span>
          <h3 className="text-xs font-bold text-white mt-1">Cross-Country Pipeline Elevation Profile</h3>
        </div>
        <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-800 px-2.5 py-0.5 rounded-full font-mono">Chainage: 0.0 - 2.0 km</span>
      </div>

      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] select-none">
          {[20, 24, 28, 32].map((yVal) => (
            <g key={yVal}>
              <line 
                x1={padding} 
                y1={getY(yVal)} 
                x2={width - padding} 
                y2={getY(yVal)} 
                stroke="#1e293b" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              <text x={padding - 10} y={getY(yVal) + 4} textAnchor="end" fontSize="9" fill="#64748b" className="font-mono">{yVal}m</text>
            </g>
          ))}

          {[0, 500, 1000, 1500, 2000].map((xVal) => (
            <text key={xVal} x={getX(xVal)} y={height - padding + 15} textAnchor="middle" fontSize="9" fill="#64748b" className="font-mono">{xVal}m</text>
          ))}

          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            points={groundPoints}
          />

          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3.5"
            strokeDasharray="1"
            points={pipePoints}
          />

          {data.map((d, idx) => (
            <g key={idx}>
              {hoverIndex === idx && (
                <line 
                  x1={getX(d.dist)} 
                  y1={padding} 
                  x2={getX(d.dist)} 
                  y2={height - padding} 
                  stroke="#ef4444" 
                  strokeWidth="1.5" 
                  strokeDasharray="2 2"
                />
              )}
              <rect
                x={getX(d.dist) - 15}
                y={padding}
                width="30"
                height={height - 2 * padding}
                fill="transparent"
                className="cursor-crosshair pointer-events-auto"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              <circle cx={getX(d.dist)} cy={getY(d.ground)} r={hoverIndex === idx ? 5 : 3.5} fill="#10b981" />
              <circle cx={getX(d.dist)} cy={getY(d.pipe)} r={hoverIndex === idx ? 5 : 3.5} fill="#3b82f6" />
            </g>
          ))}
        </svg>
      </div>

      <div className="bg-slate-950/80 border border-slate-800 p-4 mt-4 rounded-sm flex items-center justify-between min-h-[70px]">
        {hoverIndex !== null ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full text-left">
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Chainage</span>
              <p className="text-xs font-mono font-bold text-white">{data[hoverIndex].dist} meters</p>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Ground Elev.</span>
              <p className="text-xs font-mono font-bold text-emerald-400">{(data[hoverIndex].ground).toFixed(1)} m</p>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Pipe Invert Elev.</span>
              <p className="text-xs font-mono font-bold text-blue-400">{(data[hoverIndex].pipe).toFixed(1)} m</p>
            </div>
            <div>
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest block">Soil Strata</span>
              <p className="text-xs font-bold text-amber-400">{data[hoverIndex].soil}</p>
            </div>
          </div>
        ) : (
          <p className="text-[10px] text-slate-400 italic text-center w-full">
            Hover cursor over profile nodes to inspect elevation offsets and soil layers.
          </p>
        )}
      </div>
    </div>
  );
}

function getProjectTechnicalSpecs(proj) {
  const category = proj.category || '';
  const title = proj.title || '';
  const desc = proj.description || '';

  const specs = {
    software: 'AutoCAD, STAAD.Pro',
    deliverables: 'Structural design calculations & construction fabrication details'
  };

  if (category === 'Fired Heaters' || title.toLowerCase().includes('heater') || desc.toLowerCase().includes('heater')) {
    specs.software = 'AutoCAD, STAAD.Pro, ANSYS (FEA Structural Modeling)';
    specs.deliverables = 'Structural Calculations, General Arrangement & Shell Detail Drawings, Nozzle Load Verification Reports';
  } else if (category === 'Cryogenic Plants' || desc.toLowerCase().includes('cryogenic') || desc.toLowerCase().includes('cold box')) {
    specs.software = 'STAAD.Pro, ANSYS (Dynamic foundation FEA)';
    specs.deliverables = 'Heavy Dynamic Foundation design reports, Anchor Bolt layout drawings, RCC Pile load capacity analysis';
  } else if (category === 'Boilers & Chimneys' || title.toLowerCase().includes('stack') || title.toLowerCase().includes('chimney') || desc.toLowerCase().includes('chimney')) {
    specs.software = 'AutoCAD, STAAD.Pro (Finite element chimney shell model)';
    specs.deliverables = 'Vortex shedding dynamic analysis reports, Helical strake layout sheets, Foundation reaction reports';
  } else if (category === 'Special Structures' || desc.toLowerCase().includes('shield') || desc.toLowerCase().includes('fixture')) {
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
        description={`Read the full structural engineering case study for "${project.title}" by SLS Structo-Mech Consultants. Challenge description, design solutions, and engineering drawings.`}
      />

      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
            <Link href="/projects" className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#0a1628] transition-colors cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Projects
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 hover:text-blue-900 transition-colors cursor-pointer border border-blue-200 bg-blue-50/50 hover:bg-blue-50 px-3 py-1.5 rounded-sm shadow-xs"
            >
              <span>📄</span> Export PDF Report
            </button>
          </div>
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
                {projectId === 47 && <PipelineProfiler />}
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
            <div className="mt-16 border-t border-gray-200 pt-16 drawings-register-section">
              <div className="mb-8">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-700 block mb-2">Technical Registry</span>
                <h2 className="text-2xl font-bold text-[#0a1628]">Technical Drawings & Layout References</h2>
                <p className="text-xs text-gray-500 mt-2 max-w-2xl leading-relaxed">
                  Referenced drawing sheets and general arrangement templates compiled directly from our engineering design archives. In compliance with safety specifications and confidentiality guidelines, all layouts are cropped and blurred to protect proprietary project data. All drawing titles, technical reference codes, and descriptions are detailed below.
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
