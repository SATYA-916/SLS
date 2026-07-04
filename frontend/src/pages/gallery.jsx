import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import { 
  Eye, FileText, ChevronRight, Settings, Shield, Activity, BarChart3, Wrench, Layers, Calendar,
  ChevronDown, ChevronUp, Factory, HelpCircle, Hammer, Columns, Grid, Disc, Cpu, RotateCw, DoorClosed, TrendingUp, Compass, Box,
  Search, Maximize2, Minimize2, RotateCcw, MousePointer2, ZoomIn, ChevronLeft, X, SplitSquareHorizontal,
  Info, Lightbulb, PanelLeftClose, PanelLeft
} from 'lucide-react';
import ThreeViewer from '@/components/ThreeViewer';

// 1. Technical drawings (cropped screenshots)
const drawings = [
  { 
    title: "General Arrangement Section - Elevation", 
    file: "eil_ga_sheet1.png", 
    desc: "Cross-sectional elevation of the fired heater showing radiant and convection chambers, platform elevations, and foundation connections.", 
    code: "API STD 530 / EIL Specs",
    service: "Industrial Design & Support"
  },
  { 
    title: "General Arrangement Section - Plan View", 
    file: "eil_ga_sheet2.png", 
    desc: "Detailed plan view layout of the refinery fired heater system highlighting spacing, clearances, and equipment alignments.", 
    code: "API STD 530 / EIL Specs",
    service: "Industrial Design & Support"
  },
  { 
    title: "Radiant Casing Plate Arrangement", 
    file: "radiant_sheet1.png", 
    desc: "Detailed structural framing and casing plate arrangement of the bottom radiant combustion zone.", 
    code: "ASME Sec VIII / IS 800",
    service: "Industrial Design & Support"
  },
  { 
    title: "Radiant Tube Hangers Detailing", 
    file: "radiant_sheet2.png", 
    desc: "Mechanical detail drawings of high-alloy heat resistant radiant tube sheets and hanger assemblies.", 
    code: "ASME Sec VIII / API 530",
    service: "Industrial Design & Support"
  },
  { 
    title: "Radiant Chamber Coil Assembly", 
    file: "radiant_sheet3.png", 
    desc: "General arrangement and engineering sections of the vertical radiant piping coils.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Design & Support"
  },
  { 
    title: "Convection Module Section - Sheet 1", 
    file: "convection_sheet1.png", 
    desc: "Arrangement of tube bundles, structural tube sheets, and intermediate support plates within the convection bank.", 
    code: "ASME Sec II & VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "Convection Module Section - Sheet 2", 
    file: "convection_sheet2.png", 
    desc: "End cover plate and structural details of the convection module casing box.", 
    code: "IS 800 / ASME Sec VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "Convection Intermediate Tube Support", 
    file: "convection_sheet3.png", 
    desc: "Thermal analysis support plates and intermediate baffles to prevent tube sagging at high flue temperatures.", 
    code: "ASME Sec VIII / EIL Spec",
    service: "Industrial Design & Support"
  },
  { 
    title: "Convection Finned Tube Pitch Layout", 
    file: "convection_sheet4.png", 
    desc: "Arrangement details and spacing of high-efficiency finned tubes inside the convection section bank.", 
    code: "ASME Sec VIII / Refinery Specs",
    service: "Industrial Design & Support"
  },
  { 
    title: "Convection Casing & Insulation", 
    file: "convection_sheet5.png", 
    desc: "Internal refractory lining anchor layouts and plate welding schedules for the convection module casing.", 
    code: "ASME Sec VIII / Refractory Specs",
    service: "Industrial Design & Support"
  },
  { 
    title: "Structural Steel Support Tower - GA", 
    file: "sss_sheet1.png", 
    desc: "Heavy portal frames, column bracing systems, and anchor bolt details designed to stabilize the 60-meter high assembly.", 
    code: "IS 800 (Structural Steel)",
    service: "Engineering & Architecture Design"
  },
  { 
    title: "Structural Steel Bracing Details", 
    file: "sss_sheet2.png", 
    desc: "Tekla steel detailing connection configurations, gusset plates, and high-strength bolted connection details.", 
    code: "IS 800 / AISC Standards",
    service: "Engineering & Architecture Design"
  },
  { 
    title: "Self-Supporting Stack Layout - Sheet 1", 
    file: "stack_sheet1.png", 
    desc: "Exhaust stack detailing including helical strakes for wind vortex shedding, damper controls, and platform hangers.", 
    code: "IS 6533 (Steel Chimneys)",
    service: "Industrial Design & Support"
  },
  { 
    title: "Self-Supporting Stack Layout - Sheet 2", 
    file: "stack_sheet2.png", 
    desc: "Damper mechanism, counterweights, and stack base plate anchoring details.", 
    code: "IS 6533 / ASME Steel Chimneys",
    service: "Industrial Design & Support"
  },
  { 
    title: "Tube Header Box Enclosure - Sheet 1", 
    file: "header_box_sheet1.png", 
    desc: "Detailed structural enclosure for pipe return bends, including quick-acting access doors and heat seal plates.", 
    code: "ASME Sec VIII / Refinery Standard",
    service: "Industrial Design & Support"
  },
  { 
    title: "Tube Header Box Enclosure - Sheet 2", 
    file: "header_box_sheet2.png", 
    desc: "Structural door hinge calculations and layout details for header box inspection access.", 
    code: "ASME Sec VIII / Refinery Standard",
    service: "Industrial Design & Support"
  },
  { 
    title: "Heater Platforms Arrangement - GA", 
    file: "platforms_sheet1.png", 
    desc: "Layout and detailing of circular maintenance platforms at various elevations, incorporating anti-slip gratings.", 
    code: "OSHA / IS 800",
    service: "Blueprint Design"
  },
  { 
    title: "Heater Platform Details - Sheet 2", 
    file: "platforms_sheet2.png", 
    desc: "Handrail configurations, toe plates, and circular grating layout sheets.", 
    code: "OSHA / IS 800",
    service: "Blueprint Design"
  },
  { 
    title: "Heater Platform Hangers - Sheet 3", 
    file: "platforms_sheet3.png", 
    desc: "Structural platform supports, brackets, and structural welding connection details.", 
    code: "IS 800 / AISC Standards",
    service: "Blueprint Design"
  },
  { 
    title: "Stair Case Detailing - GA", 
    file: "stair_sheet1.png", 
    desc: "Isometric and elevation drawings of the structural stair tower detailing stringers, treads, and handrail mounts.", 
    code: "IS 800 / OSHA Guidelines",
    service: "Blueprint Design"
  },
  { 
    title: "Stair Case Structural Joint Details", 
    file: "stair_sheet2.png", 
    desc: "Tekla joint details for the stair tower column base, landing supports, and connection plates.", 
    code: "IS 800 / OSHA Guidelines",
    service: "Blueprint Design"
  },
  { 
    title: "Arch Plate Details", 
    file: "arch_plate_sheet1.png", 
    desc: "Monolithic refractory arch plate lining and retaining anchors designed to withstand high operating temperatures.", 
    code: "ASME Sec VIII / Refractory Spec",
    service: "Industrial Design & Support"
  },
  { 
    title: "Breeching Access Door Detailing", 
    file: "breeching_door_sheet1.png", 
    desc: "Fabricated double-hinge hot gas inspection door showing refractory plug casting anchors.", 
    code: "ASME Sec VIII / Refinery Standards",
    service: "Industrial Design & Support"
  },
  { 
    title: "Observation Port & Sight Glass Details", 
    file: "observation_door_sheet1.png", 
    desc: "High temperature flame inspection doors and sight glass assemblies for heater radiant chamber monitoring.", 
    code: "API 560 / ASME Sec VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "Off-take Duct Arrangement", 
    file: "offtake_duct_sheet1.png", 
    desc: "Transition duct detailing connecting the convection section module to the self-supporting stack.", 
    code: "IS 800 / ASME Steel Chimneys",
    service: "Industrial Design & Support"
  },
  { 
    title: "Burner Floor Plate Arrangement", 
    file: "floor_plate_sheet1.png", 
    desc: "Floor segment plates, burner openings, air register cutouts, and bottom structural floor beam systems.", 
    code: "IS 800 / API 560",
    service: "Industrial Design & Support"
  },
  { 
    title: "Heater Vertical Climbing Ladders", 
    file: "heater_ladders_sheet1.png", 
    desc: "Vertical climbing steel ladders with safety cages, hoops, and shell mounting clips.", 
    code: "OSHA / IS 800 Standards",
    service: "Blueprint Design"
  },
  { 
    title: "Soot Blower Structure Steel detailing", 
    file: "soot_blower_sheet1.png", 
    desc: "Structural framework and catwalk layout designed to support soot blower mechanical lances.", 
    code: "IS 800 / AISC Standards",
    service: "Industrial Design & Support"
  },
  { 
    title: "Pressure Piping Layout - Sheet 1", 
    file: "pressure_parts_sheet1.png", 
    desc: "High pressure fluid tubing loop arrangement, weld joint detailing, and expansion elbow layouts.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Design & Support"
  },
  { 
    title: "Pressure Piping Layout - Sheet 2", 
    file: "pressure_parts_sheet2.png", 
    desc: "High-pressure hydrocarbon nozzle schedules, flange ratings, and testing specifications.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Design & Support"
  },
  // 6 additional EIL drawings
  { 
    title: "Refinery Heater Structural Layout - GA", 
    file: "eil_ga_sheet3.png", 
    desc: "Detailed structural arrangement drawing of the heater frame, columns, and bracing system.", 
    code: "EIL Specs / IS 800",
    service: "Engineering & Architecture Design"
  },
  { 
    title: "Convection Section Detail - Section View", 
    file: "eil_ga_sheet4.png", 
    desc: "Cross-sectional engineering view of convection tube sheets, tube supports, and baffle plate settings.", 
    code: "EIL Specs / ASME Sec VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "Self-Supporting Stack Flange Details", 
    file: "eil_ga_sheet5.png", 
    desc: "Base plate and structural anchor details for the 45-meter self-supporting chimney.", 
    code: "EIL Specs / IS 6533",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Heater Structural Frame Layout", 
    file: "eil_ga_sheet6.png", 
    desc: "Structural portal frames, columns, and wind-girder detaling for the HDS unit heater tower.", 
    code: "EIL Specs / AISC Standards",
    service: "Engineering & Architecture Design"
  },
  { 
    title: "HDS Heater Convection Module GA", 
    file: "eil_ga_sheet7.png", 
    desc: "General arrangement section layout of the HDS heater convection tube bank module.", 
    code: "EIL Specs / ASME Sec VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Heater Piping Assembly Details", 
    file: "eil_ga_sheet8.png", 
    desc: "Piping layouts, header connections, and high-pressure manifold joints detailing.", 
    code: "EIL Specs / ASME B31.3",
    service: "Industrial Design & Support"
  },
  // 8 additional HDS drawings
  { 
    title: "HDS Pressure Parts Arrangement - Sheet 3", 
    file: "hds_parts_sheet1.png", 
    desc: "Details of critical pressure tubing weld joints, support clips, and temperature nozzle installations.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Radiant Section Plate Detailing - Sheet 1", 
    file: "hds_radiant_sheet1.png", 
    desc: "Casing plate segments, structural stiffeners, and burner register sleeve weld details.", 
    code: "ASME Sec VIII / IS 800",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Radiant Coil Hanger Assemblies", 
    file: "hds_radiant_sheet2.png", 
    desc: "High-alloy casting support hooks and coil guides designed to accommodate vertical thermal growth.", 
    code: "ASME Sec VIII / API 560",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Convection Casing Layout", 
    file: "hds_convection_sheet1.png", 
    desc: "Casing modules framing details, refractory anchor layouts, and lifting lug locations.", 
    code: "IS 800 / ASME Sec VIII",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Convection Tube Sheet Details", 
    file: "hds_convection_sheet2.png", 
    desc: "Tube sheet hole pitches, tube guide plates, and baffle plate spacing layout.", 
    code: "ASME Sec VIII / EIL Specs",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Structural Steel Support Frames", 
    file: "hds_sss_sheet1.png", 
    desc: "Connection joints detailing, gusset plates, and heavy portal bracing systems for the HDS unit.", 
    code: "IS 800 / AISC Standards",
    service: "Engineering & Architecture Design"
  },
  { 
    title: "HDS Exhaust Stack Layout & GA", 
    file: "hds_stack_sheet1.png", 
    desc: "Exhaust stack section drawing including rain hood, sampling ports, and structural platform mounts.", 
    code: "IS 6533 / ASME Steel Chimneys",
    service: "Industrial Design & Support"
  },
  { 
    title: "HDS Tube Header Box Details", 
    file: "hds_header_sheet1.png", 
    desc: "Casing plates, return bend spaces, inspection doors, and seal weld schedules for HDS header boxes.", 
    code: "ASME Sec VIII / Refinery Specs",
    service: "Industrial Design & Support"
  }
];

// 2. Exploded Illustrations (Interactive Three.js geometries)
const illustrations = [
  {
    id: "complete-heater",
    title: "Complete Fired Heater",
    subtitle: "Overall Industrial Assembly",
    description: "The complete vertically-fired cylindrical heater assembly incorporating the bottom burner floor, radiant tube chamber, convection module bank, header boxes, platforms, and a self-supporting stack.",
    purpose: "Provides primary process fluid heating for high-capacity crude distillation and hydrotreating refinery units.",
    function: "Combustion energy from bottom-mounted burners is transferred to process fluids circulating through radiant and convection tube coils.",
    materials: "A36 Structural Steel, Refractory Lining, High-Alloy Piping (HP40/Grade 9), Carbon Steel Casing",
    discipline: "Multi-disciplinary (Structural, Mechanical, Thermal, Piping)",
    application: "Refineries, Chemical Plants, Petrochemical Facilities",
    scope: "Full-scale mechanical calculations, structural design, Tekla detailing, and connection design.",
    deliverables: "General Arrangement drawings, structural loading sheets, anchor bolt details, fabrication packages.",
    threeType: "heater",
    service: "Industrial Design & Support",
    icon: "heater"
  },
  {
    id: "complete-stack",
    title: "Complete Stack / Chimney",
    subtitle: "Flue Gas Exhaust System",
    description: "A 45-meter self-supporting structural stack utilizing helical wind strakes to mitigate vortex shedding and dynamic wind vibration.",
    purpose: "Discharges combustion flue gases safely into the atmosphere while maintaining positive draft control.",
    function: "Helical strakes break wind patterns to prevent resonant oscillation (vortex shedding) at high wind speeds.",
    materials: "A36/A572 Steel plates, Helical strakes (CS), Internal Acid-Resistant coating",
    discipline: "Structural & Wind Dynamics Engineering",
    application: "Hydrotreater units, reforming heaters, utility boilers",
    scope: "Dynamic wind analysis, strake pitch calculations, anchor flange detailing.",
    deliverables: "Stack shell details, helical strake templates, flange connection designs.",
    threeType: "stack",
    service: "Industrial Design & Support",
    icon: "stack"
  },
  {
    id: "off-take-duct",
    title: "Off-Take Duct",
    subtitle: "Breeching & Flue Gas Transition",
    description: "The transition duct system connecting the heater convection module top section with the stack chimney inlet.",
    purpose: "Channels hot flue gas from the convection chamber to the exhaust chimney without thermal expansion stress.",
    function: "Transition guide plates smooth flue gas flows and direct gas through expansion bellows.",
    materials: "Carbon Steel Casing plate, internal insulating castable, stainless steel anchors",
    discipline: "Mechanical & Flow Engineering",
    application: "DHDT and HDS fired heaters",
    scope: "Thermal casing stress analysis, expansion joint sizing, internal support detailing.",
    deliverables: "Duct plate layouts, expansion joint details, guide brackets, load tables.",
    threeType: "offtake",
    service: "Industrial Design & Support",
    icon: "offtake"
  },
  {
    id: "radiant-section",
    title: "Radiant Tube Section",
    subtitle: "High-Temp Combustion Zone",
    description: "The high-temperature zone where burners fire vertically into a cylindrical refractory-lined chamber. Incorporates vertical tubes mounted on heat-resistant alloy hangers.",
    purpose: "Transfers maximum radiant heat from combustion flue gases directly into process fluids.",
    function: "Burners generate high radiant heat fluxes absorbed by vertical tubes lining the refractory chamber walls.",
    materials: "ASTM A312 TP347H / HP40 Mod tubes, Refractory lining (grade 26/28), SS310 anchors",
    discipline: "Thermal & Metallurgy Engineering",
    application: "Crude heating, hydrotreating process heaters",
    scope: "Tube wall thickness calculations, hanger alloy design, refractory anchor layout.",
    deliverables: "Radiant casing details, coil hanger layouts, skin thermocouple piping details.",
    threeType: "radiant",
    service: "Industrial Design & Support",
    icon: "radiant"
  },
  {
    id: "burner-floor",
    title: "Burner Floor Assembly",
    subtitle: "Burner Mounting & Floor Structure",
    description: "The bottom floor plate structural system of the cylindrical heater, designed to hold the vertically-fired burners and secondary air registers.",
    purpose: "Supports combustion burners and controls air plenum distribution underneath the radiant zone.",
    function: "Directs combustion air registers and secures the burner plenum box assembly to the lower portal beams.",
    materials: "A36 Steel plate, High-temp floor castable insulation, SS304 seal components",
    discipline: "Thermal & Structural Detailing",
    application: "Refineries, bottom-fired cylindrical heaters",
    scope: "Air register cutout detailing, floor beam structural joints, burner bolt circle layouts.",
    deliverables: "Plenum fabrication drawings, burner floor layouts, support steel details.",
    threeType: "burnerfloor",
    service: "Industrial Design & Support",
    icon: "burnerfloor"
  },
  {
    id: "header-box",
    title: "Tube Header Box",
    subtitle: "Tube Return Enclosure",
    description: "Enclosed structural steel compartments at the ends of tube bundles housing the U-bends. Designed with quick-open doors for easy tube cleanout.",
    purpose: "Encloses process return bends (U-bends) to prevent hot gas leaks and provide quick maintenance access.",
    function: "Seals the tube bundle sheet while providing quick-acting doors for tube inspection and mechanical cleaning.",
    materials: "ASTM A36 Casing, High-temp ceramic fiber insulation, SS304 hinge pins",
    discipline: "Mechanical & Structural Design",
    application: "Convection sections, header boxes",
    scope: "Hinge load calculations, seal gasket specs, door latch detailing.",
    deliverables: "Header box assembly drawings, hinge details, seal plate configurations.",
    threeType: "headerbox",
    service: "Industrial Design & Support",
    icon: "headerbox"
  },
  {
    id: "arch-plate-assembly",
    title: "Arch Plate Assembly",
    subtitle: "Chamber Separation Deck",
    description: "A structural dividing ring backed with refractory lining separating the high-temperature radiant box from the convection module zone.",
    purpose: "Directs flue gases from the radiant combustion chamber into the narrow convection tube bank.",
    function: "Forms a tight thermal seal around the radiant-to-convection throat, protecting structural steel columns from local hot spots.",
    materials: "A36 Heavy steel plates, Ceramic fiber module packing, Stainless steel studs",
    discipline: "Mechanical & Refractory Design",
    application: "Cylindrical fired heaters",
    scope: "Thermal expansion gap calculations, structural joint details, lift lug detailing.",
    deliverables: "Arch plate segments, thermal seal drawings.",
    threeType: "archplate",
    service: "Industrial Design & Support",
    icon: "archplate"
  },
  {
    id: "convection-section",
    title: "Convection Section Module",
    subtitle: "Waste Heat Recovery Bank",
    description: "The waste heat recovery zone located above the radiant section. Horizontal tubes (often finned to maximize heat transfer surface) absorb heat from rising flue gases.",
    purpose: "Recovers residual convective heat from flue gases to preheat crude feed or generate steam.",
    function: "Horizontal tubes absorb heat from convective hot gases flowing upward from the radiant chamber throat.",
    materials: "ASTM A106 Gr B / A335 P9 tubes, Carbon Steel / Solid helical fins, A36 module box",
    discipline: "Thermal & Piping Engineering",
    application: "Heater convection sections, steam superheaters",
    scope: "Finned tube pitch design, intermediate support plate spacing, flue gas velocity analysis.",
    deliverables: "Convection bundle detail plans, finned tube schedules, support plate drawings.",
    threeType: "convection",
    service: "Industrial Design & Support",
    icon: "convection"
  },
  {
    id: "soot-blower",
    title: "Soot Blower Structure",
    subtitle: "Auxiliary Catwalk & Lance Support",
    description: "The auxiliary cantilevered structural steel frame that projects from the convection section to support the soot blower lance rails and mechanical drive system.",
    purpose: "Supports mechanical soot-blowing equipment used to clean ash/debris from convection tubes.",
    function: "Carries steam lance rails and driving motors, allowing cleaning lances to slide between tube rows.",
    materials: "A36 steel channels, grating walkways, high-strength bolts",
    discipline: "Structural & Mechanical Detailing",
    application: "Heavy oil-fired heater convection modules",
    scope: "Cantilever bending analysis, structural bracing details, mechanical rail load supports.",
    deliverables: "Catwalk frame details, structural bracing layouts, steel bill of materials.",
    threeType: "sootblower",
    service: "Industrial Design & Support",
    icon: "sootblower"
  },
  {
    id: "support-steel",
    title: "Main Support Steelwork",
    subtitle: "Primary Columns & Portal Bracing",
    description: "The primary structural steel columns, portal beams, and diagonal bracing that transmit gravity and lateral loads to the foundations.",
    purpose: "Transmits all vertical loads (dead/live) and horizontal forces (wind/seismic) to the foundation anchors.",
    function: "Heavy structural portal frame stabilizes the 60-meter assembly against thermal, seismic, and wind loads.",
    materials: "IS 2062 Gr B / ASTM A572 Gr 50 beams, ASTM A325 high-strength bolts",
    discipline: "Structural Analysis (STAAD.Pro)",
    application: "Industrial plant towers, refinery heater support steel",
    scope: "Finite element frame analysis, connection moment design, base plate sizing.",
    deliverables: "Erection diagrams, column detail sheets, base plate moment connection designs.",
    threeType: "framing",
    service: "Engineering & Architecture Design",
    icon: "supportsteel"
  },
  {
    id: "complete-frame",
    title: "Complete Structural Frame",
    subtitle: "Full Load-Carrying Skeleton",
    description: "The complete load-carrying skeleton of the heater, excluding pressure parts and cladding, highlighting structural engineering modeling.",
    purpose: "Integrates columns, platform brackets, stair stringers, and stack bases into a cohesive load path.",
    function: "Distributes structural stresses evenly across portal frames and columns to prevent stress concentrations.",
    materials: "IS 2062 Grade B Steel, High-tensile fasteners, hot-dip galvanized bracing",
    discipline: "Structural & Erection Engineering",
    application: "Fired heater steel structures, Tekla assemblies",
    scope: "Tekla structural detailing, lifting weight checks, bolted joint layout optimization.",
    deliverables: "Erection sequence plans, field bolt listings, shipping package drawings.",
    threeType: "frame3d",
    service: "Engineering & Architecture Design",
    icon: "completeframe"
  },
  {
    id: "roof-structure",
    title: "Refinery Roof Structure",
    subtitle: "Conical Shell & Rafters",
    description: "A heavy structural steel roof canopy framing that seals the upper chamber and supports the stack load, designed for high thermal resistance and weathering.",
    purpose: "Seals the top of the radiant section and supports the chimney stack column load.",
    function: "Conical rafter system transfers the stack load down to the main columns while enclosing hot flue gases.",
    materials: "IS 2062 Structural steel rafters, A36 roof cover plate, insulating refractory",
    discipline: "Structural Engineering",
    application: "Bottom-supported chimney stacks, refinery roofs",
    scope: "Stack base moment transfer calculations, thermal expansion joint designs.",
    deliverables: "Roof rafter layouts, rafter connection details, center ring weld details.",
    threeType: "roof",
    service: "Engineering & Architecture Design",
    icon: "roof"
  },
  {
    id: "ets-structure",
    title: "ETS Structure",
    subtitle: "External Truss Support Frame",
    description: "External Structural Steel framing system designed to support convection modules and soot blower walkways.",
    purpose: "Supports heavy convection section module boxes and lateral wind loads on auxiliary catwalks.",
    function: "Truss framework carries the vertical load of convection banks, preventing load transfers onto the radiant box shell.",
    materials: "IS 2062 Structural profiles, A325 structural bolts, galvanized gratings",
    discipline: "Structural Analysis (STAAD.Pro)",
    application: "Refineries, large modular fired heaters",
    scope: "Truss load distribution calculations, modular splice detailing, node stress checks.",
    deliverables: "ETS framing plans, module support joints, bracing details.",
    threeType: "ets",
    service: "Engineering & Architecture Design",
    icon: "ets"
  },
  {
    id: "platform-system",
    title: "Platform Walkway System",
    subtitle: "Maintenance Catwalks",
    description: "Multi-tier circular access platforms mounted at key maintenance elevations (observation doors, header boxes, dampers, stack monitors).",
    purpose: "Provides safe walking paths for refinery operators to perform routine maintenance and inspections.",
    function: "Secures anti-slip steel gratings, handrails, and safety toe plates to structural support brackets.",
    materials: "IS 2062 Steel brackets, galvanized gratings, safety handrails",
    discipline: "Structural detailing",
    application: "Refineries, chimneys, columns",
    scope: "OSHA clearance checks, platform bracket weld sizes, handrail layout plans.",
    deliverables: "Circular platform details, bracket fabrication sheets, handrail designs.",
    threeType: "platforms",
    service: "Blueprint Design",
    icon: "platforms"
  },
  {
    id: "stair-assembly",
    title: "Stair Tower Assembly",
    subtitle: "Multi-Level Access Staircase",
    description: "Self-supporting structural steel stair tower providing safe access to all heater operating levels, engineered for rapid erection.",
    purpose: "Allows safe vertical movement of personnel and tools across all heater platform tiers.",
    function: "Stringer beams, tread assemblies, and handrail cages transfer local dynamic live loads to columns and pile caps.",
    materials: "IS 2062 Channel profiles, checker-plate treads, galvanized handrails",
    discipline: "Structural Detailing (Tekla)",
    application: "Process towers, refinery fired heaters",
    scope: "Tekla structural detailing, foundation loads check, safety rise/run checks.",
    deliverables: "Stair stringer designs, tread fabrication plans, foundation load specifications.",
    threeType: "staircase",
    service: "Blueprint Design",
    icon: "staircase"
  },
  {
    id: "stack-platform",
    title: "Stack Platform System",
    subtitle: "High-Elevation Maintenance Deck",
    description: "Circular maintenance walkways mounted at upper elevations of the exhaust stack for emission monitoring instrumentation.",
    purpose: "Supports flue gas analysis sensors, stack dampers, and aviation warning lights.",
    function: "Provides a safe platform for maintenance engineers checking flue gas monitoring systems (CEMS).",
    materials: "A36 steel channels, hot-dip galvanized gratings, safety loops",
    discipline: "Structural Detailing (Tekla)",
    application: "Exhaust stack chimneys, flue gas monitors",
    scope: "High wind gust load analysis, bracket shear checks, OSHA safety hoops.",
    deliverables: "Stack platform drawings, support bracket details, handrail layouts.",
    threeType: "stackplatform",
    service: "Blueprint Design",
    icon: "stackplatform"
  },
  {
    id: "heater-grating",
    title: "Heater Grating System",
    subtitle: "Walkway Floor Gratings",
    description: "Anti-slip steel walkway gratings configured for the main heater platforms, engineered for safety and maximum ventilation.",
    purpose: "Forms the walking surface of maintenance catwalks, preventing slip hazards.",
    function: "Grating bars distribute personnel live loads while allowing wind and water drainage.",
    materials: "Mild Steel, hot-dip galvanized coating, saddle clip anchors",
    discipline: "Structural Safety Detailing",
    application: "Refineries, industrial plants, stair towers",
    scope: "Span load calculations, circular grating segment detailing, clip installation layouts.",
    deliverables: "Grating layout sheets, grating bills of materials, fixing clip locations.",
    threeType: "heatergrating",
    service: "Blueprint Design",
    icon: "heatergrating"
  },
  {
    id: "stack-ladders",
    title: "Stack Ladder & Cage",
    subtitle: "Vertical Safety Ladder",
    description: "The vertical steel climbing ladders with circular safety hoops and intermediate landing platforms configured along the outer shell of the stack.",
    purpose: "Provides emergency escape and maintenance access routes to the upper stack platforms.",
    function: "Vertical rungs are supported by a safety cage to prevent operator falls.",
    materials: "IS 2062 Round bars and flat bars, hot-dip galvanized profiles",
    discipline: "Structural Safety Detailing",
    application: "Industrial chimneys, stacks, tall columns",
    scope: "OSHA cage clearance layout, shell clip design, mounting weld specs.",
    deliverables: "Ladder details, safety cage assembly sheets, clip welding designs.",
    threeType: "ladders",
    service: "Blueprint Design",
    icon: "ladders"
  },
  {
    id: "breeching-door",
    title: "Breeching Access Door",
    subtitle: "Convection Duct Entry Door",
    description: "A heavy-duty rectangular inspection access door located on the convection off-take breeching duct, featuring thick internal refractory backing.",
    purpose: "Enables refinery operators to enter the convection transition duct during shut-down cycles.",
    function: "Double-hinge swing mechanism provides gas-tight sealing under normal operating draft vacuum.",
    materials: "ASTM A36 Casing, Ceramic refractory block lining, SS310 studs",
    discipline: "Mechanical & Refractory Design",
    application: "Convection ducts, flue gas plenums",
    scope: "Refractory anchor layouts, door hinge stress calculations, thermal seal designs.",
    deliverables: "Fabricated door assemblies, door lock details, insulation layer schedules.",
    threeType: "breechingdoor",
    service: "Industrial Design & Support",
    icon: "breechingdoor"
  },
  {
    id: "maintenance-access-sys",
    title: "Maintenance Access System",
    subtitle: "Coordinated Egress System",
    description: "Coordinated systems of circular access platforms, safety ladders, and stairways providing secure transit channels.",
    purpose: "Integrates stairways and ladders to form a continuous safety route across all levels.",
    function: "Coordinates structural brackets and ladder cage hoops to ensure safe transit between platform levels.",
    materials: "IS 2062 Grade B Steel, galvanized safety railings, high-tensile bolts",
    discipline: "Multi-Disciplinary Detailing",
    application: "Industrial process furnaces, fired heaters",
    scope: "OSHA conformance reviews, ladder-to-stairway transition designs, structural safety checking.",
    deliverables: "Access general arrangement drawings, ladder-to-platform detailing sheets.",
    threeType: "maintenanceaccess",
    service: "Blueprint Design",
    icon: "maintenanceaccess"
  }
];

const MODEL_GROUPS = [
  { name: "Overall Assembly",  items: ["complete-heater", "complete-stack", "off-take-duct"] },
  { name: "Radiant System",    items: ["radiant-section", "burner-floor", "header-box", "arch-plate-assembly"] },
  { name: "Convection System", items: ["convection-section", "soot-blower"] },
  { name: "Structural System", items: ["support-steel", "complete-frame", "roof-structure", "ets-structure"] },
  { name: "Access System",     items: ["platform-system", "stair-assembly", "stack-platform", "heater-grating", "stack-ladders", "breeching-door", "maintenance-access-sys"] },
];

const GROUP_FULL_ASSEMBLY = {
  "Overall Assembly":   "complete-heater",
  "Radiant System":     "radiant-section",
  "Convection System":  "convection-section",
  "Structural System":  "complete-frame",
  "Access System":      "platform-system",
};

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
  const [drawingSubTab, setDrawingSubTab] = useState('All');
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedIll, setSelectedIll] = useState(illustrations[0]);
  const [activeWf, setActiveWf] = useState(workflows[0]);
  const [activeWfStep, setActiveWfStep] = useState(0);
  const [_, setLocation] = useLocation();

  // Collapsible groups for 3D model list
  const [openGroups, setOpenGroups] = useState({
    "Overall Assembly":   true,   // open by default
    "Radiant System":     false,
    "Convection System":  false,
    "Structural System":  false,
    "Access System":      false
  });

  const toggleGroup = (name) => {
    setOpenGroups(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // WebGL camera, wireframe and exploded controls
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [modelSearch, setModelSearch] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailTab, setDetailTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTips, setShowTips] = useState(() => {
    try { return !localStorage.getItem('sls-3d-tips-dismissed'); } catch { return true; }
  });

  const dismissTips = () => {
    setShowTips(false);
    try { localStorage.setItem('sls-3d-tips-dismissed', '1'); } catch { /* ignore */ }
  };

  const getActiveGroup = (illId) => {
    const found = MODEL_GROUPS.find(g => g.items.includes(illId));
    return found ? found.name : "Overall Assembly";
  };

  const matchesModelSearch = (ill) => {
    if (!modelSearch.trim()) return true;
    const q = modelSearch.toLowerCase();
    return (
      ill.title.toLowerCase().includes(q) ||
      ill.subtitle.toLowerCase().includes(q) ||
      ill.discipline.toLowerCase().includes(q)
    );
  };

  const getGroupIllustrations = (groupName) =>
    MODEL_GROUPS.find(g => g.name === groupName)?.items
      .map(id => illustrations.find(i => i.id === id))
      .filter(Boolean) ?? [];

  const getModelPosition = () => {
    const groupName = getActiveGroup(selectedIll.id);
    const items = getGroupIllustrations(groupName);
    const idx = items.findIndex(i => i.id === selectedIll.id);
    return { current: idx + 1, total: items.length, groupName };
  };

  const filteredModelCount = MODEL_GROUPS.reduce((acc, group) => {
    return acc + group.items
      .map(id => illustrations.find(i => i.id === id))
      .filter(Boolean)
      .filter(matchesModelSearch).length;
  }, 0);

  const jumpToGroup = (groupName) => {
    const first = getGroupIllustrations(groupName)[0];
    if (first) selectIllustration(first, groupName);
  };

  const navigateModel = (direction) => {
    const groupName = getActiveGroup(selectedIll.id);
    const items = getGroupIllustrations(groupName);
    const idx = items.findIndex(i => i.id === selectedIll.id);
    const next = items[(idx + direction + items.length) % items.length];
    if (next) setSelectedIll(next);
  };

  const selectIllustration = (ill, groupName) => {
    setSelectedIll(ill);
    setDetailTab('overview');
    setOpenGroups({
      "Overall Assembly": false,
      "Radiant System": false,
      "Convection System": false,
      "Structural System": false,
      "Access System": false,
      [groupName]: true,
    });
    setSidebarOpen(false);
    scrollToViewer();
  };

  const handleSelectFullAssembly = () => {
    const groupName = getActiveGroup(selectedIll.id);
    const targetId = GROUP_FULL_ASSEMBLY[groupName] || "complete-heater";
    const targetIll = illustrations.find(ill => ill.id === targetId);
    if (targetIll) setSelectedIll(targetIll);
  };

  const canExplode = selectedIll.id === 'complete-heater';

  useEffect(() => {
    if (!canExplode && exploded) setExploded(false);
  }, [canExplode, exploded]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        setIsFullscreen(false);
        setSidebarOpen(false);
        return;
      }
      if (activeTab !== 'illustrations') return;

      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        navigateModel(e.key === 'ArrowLeft' ? -1 : 1);
      }
      if (e.key === 'r' || e.key === 'R') setResetKey(prev => prev + 1);
      if (e.key === 'f' || e.key === 'F') setIsFullscreen(f => !f);
      if (e.key === ' ') {
        e.preventDefault();
        setAutoRotate(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTab, selectedIll.id]);

  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  const getDrawingCategory = (draw) => {
    if (draw.file.startsWith('eil_ga')) return 'EIL';
    if (draw.file.startsWith('pressure_parts') || draw.file.startsWith('hds_')) return 'HDS';
    return 'DHDT';
  };

  const filteredDrawings = drawings.filter(draw => {
    if (drawingSubTab === 'All') return true;
    return getDrawingCategory(draw) === drawingSubTab;
  });

  const getComponentIcon = (iconName) => {
    switch (iconName) {
      case 'heater': return <Factory className="w-4 h-4" />;
      case 'stack': return <Compass className="w-4 h-4" />;
      case 'offtake': return <Layers className="w-4 h-4" />;
      case 'radiant': return <Cpu className="w-4 h-4" />;
      case 'burnerfloor': return <Grid className="w-4 h-4" />;
      case 'headerbox': return <Box className="w-4 h-4" />;
      case 'archplate': return <Disc className="w-4 h-4" />;
      case 'convection': return <Layers className="w-4 h-4" />;
      case 'sootblower': return <RotateCw className="w-4 h-4" />;
      case 'supportsteel': return <Columns className="w-4 h-4" />;
      case 'completeframe': return <Shield className="w-4 h-4" />;
      case 'roof': return <ChevronUp className="w-4 h-4" />;
      case 'ets': return <Columns className="w-4 h-4" />;
      case 'platforms': return <Eye className="w-4 h-4" />;
      case 'staircase': return <TrendingUp className="w-4 h-4" />;
      case 'stackplatform': return <Compass className="w-4 h-4" />;
      case 'heatergrating': return <Grid className="w-4 h-4" />;
      case 'ladders': return <TrendingUp className="w-4 h-4" />;
      case 'breechingdoor': return <DoorClosed className="w-4 h-4" />;
      case 'maintenanceaccess': return <Settings className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const handleBookRedirect = (serviceName) => {
    setLocation('/contact?service=' + encodeURIComponent(serviceName));
  };

  const tabsRef = useRef(null);
  const viewerRef = useRef(null);

  // Scroll to the tab bar / viewer area (not the full page top)
  const scrollToViewer = () => {
    if (tabsRef.current) {
      const headerOffset = 80; // sticky header + tab bar height
      const rect = tabsRef.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      window.scrollTo({ top: elementTop - headerOffset, behavior: 'smooth' });
    }
  };

  const isFirstMount = useRef(true);

  useEffect(() => {
    // Reset to very top of page on initial entry
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (tabsRef.current) {
      const headerOffset = 80; // height of sticky header + buffer
      const rect = tabsRef.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      
      window.scrollTo({
        top: elementTop - headerOffset,
        behavior: 'smooth'
      });
    }
  }, [activeTab]);

  return (
    <div className="w-full bg-white">
      {/* HEADER SECTION */}
      <section className="bg-slate-50 text-[#0a1628] py-20 relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="gallery_grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gallery_grid)" />
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Engineering Assets &amp; Knowledge</p>
            <h1 className="text-5xl md:text-6xl font-bold max-w-3xl leading-tight text-[#0a1628]">
              Design Drawings &amp; Technical Assets
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl text-sm leading-relaxed">
              Explore the structural and mechanical detailing engineering database compiled from our recent hydrotreater (DHDT) and hydrodesulfurization (HDS) fired heater projects, executed under strict EIL specifications.
            </p>
          </motion.div>
        </div>
      </section>

      {/* TABS CONTROLLER */}
      <div ref={tabsRef} />
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
              <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-6">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-bold text-[#0a1628] mb-3">Cropped Structural Drawing Database</h2>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    These layouts demonstrate the structural and mechanical detailing capacity of SLS. In compliance with confidentiality guidelines, all drawings are cropped to remove specific dimensions, drawing titles, sheets numbers, and approval signatures.
                  </p>
                </div>
                
                {/* Sub-tabs for DHDT, HDS, EIL categorization */}
                <div className="flex flex-wrap gap-2 shrink-0">
                  {['All', 'DHDT', 'HDS', 'EIL'].map((subcat) => (
                    <button
                      key={subcat}
                      onClick={() => setDrawingSubTab(subcat)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        drawingSubTab === subcat
                          ? 'bg-[#0a1628] text-white shadow-sm'
                          : 'bg-white border border-gray-200 text-[#0a1628] hover:bg-gray-50'
                      }`}
                    >
                      {subcat}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrawings.map((draw, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(idx * 0.025, 0.25) }}
                    className="bg-white border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => setSelectedImg(draw)}
                  >
                    <div className="aspect-[4/3] bg-slate-900 overflow-hidden relative flex items-center justify-center border-b border-gray-100">
                      <img
                        src={`/gallery/${draw.file}`}
                        alt={draw.title}
                        loading={idx < 6 ? "eager" : "lazy"}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-300 select-none pointer-events-none"
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
          {/* TAB 2: EXPLODED ILLUSTRATIONS (THREE.JS 3D VIEW) */}
          {activeTab === 'illustrations' && (
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-10 items-start">
              {/* Mobile: viewer first; Desktop: sidebar left */}
              <div className={`lg:col-span-1 order-2 lg:order-1 space-y-4 lg:space-y-6 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
                <div className="bg-white border border-gray-200 p-5 lg:p-6 shadow-sm rounded-xl">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Select 3D Component</h3>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                      {illustrations.length} Models
                    </span>
                  </div>

                  {/* Quick group jump pills */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {MODEL_GROUPS.map(group => {
                      const isActive = getActiveGroup(selectedIll.id) === group.name;
                      return (
                        <button
                          key={group.name}
                          onClick={() => jumpToGroup(group.name)}
                          className={`px-2 py-1 text-[8px] font-bold uppercase tracking-wider rounded-full border transition-colors ${
                            isActive
                              ? 'bg-[#0a1628] text-white border-[#0a1628]'
                              : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-700'
                          }`}
                        >
                          {group.name.replace(' System', '').replace(' Assembly', '')}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={modelSearch}
                      onChange={(e) => setModelSearch(e.target.value)}
                      placeholder="Search assemblies..."
                      className="w-full pl-9 pr-8 py-2.5 text-xs border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400/30 transition-colors"
                    />
                    {modelSearch && (
                      <button
                        onClick={() => setModelSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {filteredModelCount === 0 && (
                    <div className="py-8 text-center">
                      <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-500">No assemblies found</p>
                      <p className="text-[10px] text-gray-400 mt-1">Try a different search term</p>
                      <button
                        onClick={() => setModelSearch('')}
                        className="mt-3 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-800"
                      >
                        Clear search
                      </button>
                    </div>
                  )}
                  <div className="space-y-3 max-h-[380px] lg:max-h-[420px] overflow-y-auto pr-1 scrollbar-thin">
                    {MODEL_GROUPS.map((group) => {
                      const groupItems = group.items
                        .map(itemId => illustrations.find(x => x.id === itemId))
                        .filter(Boolean)
                        .filter(matchesModelSearch);
                      if (groupItems.length === 0) return null;
                      const isOpen = openGroups[group.name] || !!modelSearch.trim();
                      return (
                        <div key={group.name} className="border-b border-gray-100 pb-3 last:border-0">
                          <button
                            onClick={() => toggleGroup(group.name)}
                            className="w-full flex items-center justify-between py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#0a1628] transition-colors"
                          >
                            <span className="flex items-center gap-2">
                              {group.name}
                              <span className="text-[8px] font-semibold text-gray-400 normal-case tracking-normal">
                                ({groupItems.length})
                              </span>
                            </span>
                            {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                          </button>
                          
                          {isOpen && (
                            <div className="space-y-1 mt-2">
                              {groupItems.map((ill) => {
                                const isSelected = selectedIll.id === ill.id;
                                return (
                                  <button
                                    key={ill.id}
                                    onClick={() => selectIllustration(ill, group.name)}
                                    className={`w-full text-left px-3 py-2.5 rounded-sm border-l-2 transition-all flex items-center gap-3 justify-between ${
                                      isSelected
                                        ? 'bg-[#0a1628] border-l-blue-500 text-white shadow-md font-bold'
                                        : 'border-l-transparent text-gray-600 hover:bg-blue-50/60 hover:border-l-blue-300 bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <span className={`shrink-0 p-1 rounded-sm ${isSelected ? 'bg-blue-600/30 text-blue-300' : 'bg-gray-100 text-gray-400'}`}>
                                        {getComponentIcon(ill.icon)}
                                      </span>
                                      <div className="min-w-0 text-left">
                                        <div className="font-bold truncate text-[10px] uppercase tracking-wide leading-none mb-1">{ill.title}</div>
                                        <div className={`text-[9px] truncate leading-none ${isSelected ? 'text-white/55' : 'text-gray-400 font-medium'}`}>{ill.subtitle}</div>
                                      </div>
                                    </div>
                                    {isSelected && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Left Column Bottom: Engineering Statistics */}
                <div className="bg-gradient-to-br from-[#0a1628] to-[#132238] border border-[#1e3a5f]/30 p-5 shadow-sm text-white rounded-xl">
                  <h4 className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-4">Refinery Detailing Track Record</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { value: "91+", label: "Engineering Drawings" },
                      { value: "20+", label: "Major Assemblies" },
                      { value: "3", label: "Engineering Packages" },
                      { value: "20+", label: "Years Exp" },
                      { value: "500+", label: "Projects Delivered" }
                    ].map((stat, idx) => (
                      <div key={idx} className={idx === 4 ? 'col-span-2 pt-2 border-t border-white/10' : ''}>
                        <div className="text-lg font-bold text-white leading-none mb-0.5">{stat.value}</div>
                        <div className="text-[8px] uppercase tracking-wider text-white/45 leading-tight">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right/Middle Columns: Details & 3D Interactive WebGL Rendering */}
              <div className="lg:col-span-2 order-1 lg:order-2 space-y-4 lg:space-y-6">
                {/* First-time interaction tips */}
                <AnimatePresence>
                  {showTips && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl"
                    >
                      <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#0a1628] mb-1">Interactive 3D Viewer Tips</p>
                        <p className="text-[11px] text-gray-600 leading-relaxed">
                          Drag to orbit · Scroll to zoom · Use ← → to switch models within a group ·
                          Press <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono">R</kbd> reset ·
                          <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono ml-1">F</kbd> fullscreen ·
                          <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px] font-mono ml-1">Space</kbd> toggle spin
                        </p>
                      </div>
                      <button
                        onClick={dismissTips}
                        className="p-1 text-gray-400 hover:text-gray-600 shrink-0"
                        aria-label="Dismiss tips"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mobile sidebar toggle */}
                <button
                  onClick={() => setSidebarOpen(o => !o)}
                  className="lg:hidden flex items-center gap-2 w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-wider text-[#0a1628] shadow-sm"
                >
                  {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeft className="w-4 h-4" />}
                  {sidebarOpen ? 'Hide Component List' : 'Browse All 20 Components'}
                </button>

                {/* Three.js Interactive 3D Canvas */}
                <div
                  ref={viewerRef}
                  className={`relative overflow-hidden bg-[#050c18] shadow-2xl ring-1 ring-[#1e3a5f]/50 ${
                    isFullscreen
                      ? 'fixed inset-0 z-50 h-screen w-screen rounded-none'
                      : 'aspect-[16/10] rounded-xl'
                  }`}
                >
                  {/* Blueprint corner markers */}
                  <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-blue-500/50 pointer-events-none z-20" />
                  <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-blue-500/50 pointer-events-none z-20" />
                  <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-blue-500/50 pointer-events-none z-20" />
                  <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-blue-500/50 pointer-events-none z-20" />

                  <ThreeViewer
                    type={selectedIll.threeType}
                    exploded={exploded}
                    wireframe={wireframe}
                    resetKey={resetKey}
                    autoRotate={autoRotate}
                    modelName={selectedIll.title}
                  />

                  {/* Top overlay — model identity */}
                  <div className="absolute top-0 inset-x-0 z-10 flex items-start justify-between gap-3 p-4 bg-gradient-to-b from-black/75 via-black/30 to-transparent pointer-events-none">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-[8px] font-bold uppercase tracking-widest text-blue-300">
                          {getActiveGroup(selectedIll.id)}
                        </span>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[8px] font-bold uppercase tracking-widest text-white/50">
                          {getModelPosition().current} / {getModelPosition().total}
                        </span>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={selectedIll.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm font-bold text-white leading-tight truncate"
                        >
                          {selectedIll.title}
                        </motion.p>
                      </AnimatePresence>
                      <p className="text-[10px] text-white/45 uppercase tracking-wide truncate">{selectedIll.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">WebGL</span>
                    </div>
                  </div>

                  {/* Side navigation — hidden on small screens to avoid overlap */}
                  <button
                    onClick={() => navigateModel(-1)}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white/70 hover:text-white transition-all backdrop-blur-sm hidden sm:flex"
                    title="Previous model (←)"
                    aria-label="Previous model"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigateModel(1)}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-2.5 rounded-full bg-black/50 hover:bg-black/70 border border-white/10 text-white/70 hover:text-white transition-all backdrop-blur-sm hidden xs:flex sm:flex"
                    title="Next model (→)"
                    aria-label="Next model"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Bottom control panel */}
                  <div className="absolute bottom-0 inset-x-0 z-10 p-4 bg-gradient-to-t from-black/85 via-black/50 to-transparent">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[8px] uppercase tracking-widest text-white/40 pointer-events-none">
                        <span className="flex items-center gap-1.5"><MousePointer2 className="w-3 h-3" /> Drag to orbit</span>
                        <span className="flex items-center gap-1.5"><ZoomIn className="w-3 h-3" /> Scroll to zoom</span>
                        <span className="hidden md:flex items-center gap-1.5">← → Switch models</span>
                        <span className="flex md:hidden items-center gap-1.5"><ChevronLeft className="w-3 h-3" /><ChevronRight className="w-3 h-3" /> Swipe group</span>
                        <span className="hidden lg:flex items-center gap-1.5">R reset · F full · Space spin</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setResetKey(prev => prev + 1)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
                          title="Reset camera"
                        >
                          <RotateCcw className="w-3 h-3" /> Reset
                        </button>
                        <button
                          onClick={handleSelectFullAssembly}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
                          title="Jump to group assembly"
                        >
                          <Layers className="w-3 h-3" /> Assembly
                        </button>
                        <button
                          onClick={() => setWireframe(!wireframe)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-sm transition-colors ${
                            wireframe
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                          title="Toggle wireframe"
                        >
                          <Grid className="w-3 h-3" /> {wireframe ? 'Solid' : 'Wire'}
                        </button>
                        <button
                          onClick={() => canExplode && setExploded(!exploded)}
                          disabled={!canExplode}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-sm transition-colors ${
                            !canExplode
                              ? 'opacity-30 cursor-not-allowed text-white/40 border-white/5 bg-transparent'
                              : exploded
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                          title={canExplode ? 'Toggle exploded view' : 'Exploded view available on Complete Fired Heater only'}
                        >
                          <SplitSquareHorizontal className="w-3 h-3" /> {exploded ? 'Assembled' : 'Explode'}
                        </button>
                        <button
                          onClick={() => setAutoRotate(!autoRotate)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-sm transition-colors ${
                            autoRotate
                              ? 'bg-blue-600 text-white border-blue-500'
                              : 'text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                          }`}
                          title="Toggle auto rotation"
                        >
                          <RotateCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                          {autoRotate ? 'Pause' : 'Spin'}
                        </button>
                        <button
                          onClick={() => setIsFullscreen(f => !f)}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-white/80 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm transition-colors"
                          title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                        >
                          {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                          {isFullscreen ? 'Exit' : 'Full'}
                        </button>
                      </div>
                    </div>

                    {/* Material legend */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 pt-3 border-t border-white/10 pointer-events-none">
                      {[
                        { color: 'bg-[#6e7d8c]', label: 'Shell / Casing' },
                        { color: 'bg-[#8b95a1]', label: 'Structural Steel' },
                        { color: 'bg-[#d4840a]', label: 'Process Tubing' },
                        { color: 'bg-[#a8b4c0]', label: 'Flanges & Hardware' },
                      ].map(item => (
                        <span key={item.label} className="flex items-center gap-1.5 text-[8px] uppercase tracking-wider text-white/35">
                          <span className={`w-2.5 h-2.5 rounded-sm ${item.color} ring-1 ring-white/20`} />
                          {item.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Conceptual metadata descriptions card */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
                  <div className="p-6 lg:p-8 pb-0">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                          3D Technical Visualization
                        </span>
                        <AnimatePresence mode="wait">
                          <motion.h3
                            key={selectedIll.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 8 }}
                            transition={{ duration: 0.2 }}
                            className="text-xl lg:text-2xl font-bold text-[#0a1628]"
                          >
                            {selectedIll.title}
                          </motion.h3>
                        </AnimatePresence>
                        <p className="text-xs text-gray-400 mt-1 uppercase font-semibold tracking-wide">
                          {selectedIll.subtitle}
                        </p>
                      </div>
                      <button
                        onClick={() => handleBookRedirect(selectedIll.service)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] lg:text-xs font-bold uppercase tracking-widest px-4 lg:px-5 py-2.5 lg:py-3 rounded-sm shadow-md transition-colors shrink-0"
                      >
                        Book Service &rarr;
                      </button>
                    </div>

                    {/* Detail tabs */}
                    <div className="flex gap-1 border-b border-gray-100 -mx-1">
                      {[
                        { id: 'overview', label: 'Overview', icon: Info },
                        { id: 'engineering', label: 'Engineering', icon: Activity },
                        { id: 'deliverables', label: 'Deliverables', icon: FileText },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setDetailTab(tab.id)}
                          className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider border-b-2 transition-colors -mb-px ${
                            detailTab === tab.id
                              ? 'border-blue-600 text-blue-700'
                              : 'border-transparent text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          <tab.icon className="w-3.5 h-3.5" />
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 lg:p-8 pt-5">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedIll.id}-${detailTab}`}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                      >
                        {detailTab === 'overview' && (
                          <>
                            <div className="mb-6">
                              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Description</h4>
                              <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.description}</p>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                  <HelpCircle className="w-3.5 h-3.5 text-blue-700" /> Purpose
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.purpose}</p>
                              </div>
                              <div>
                                <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                  <Factory className="w-3.5 h-3.5 text-blue-700" /> Application
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.application}</p>
                              </div>
                            </div>
                          </>
                        )}

                        {detailTab === 'engineering' && (
                          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                            <div>
                              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Activity className="w-3.5 h-3.5 text-blue-700" /> Engineering Function
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.function}</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Hammer className="w-3.5 h-3.5 text-blue-700" /> Typical Materials
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.materials}</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-blue-700" /> Discipline
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.discipline}</p>
                            </div>
                            <div>
                              <h4 className="text-[10px] font-bold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-blue-700" /> Scope of Work
                              </h4>
                              <p className="text-xs text-gray-500 leading-relaxed">{selectedIll.scope}</p>
                            </div>
                          </div>
                        )}

                        {detailTab === 'deliverables' && (
                          <div className="p-4 bg-gray-50 border-l-2 border-blue-700 rounded-r-sm">
                            <span className="font-bold text-[#0a1628] block mb-2 uppercase text-[9px] tracking-wider">
                              Engineering Deliverables
                            </span>
                            <p className="text-xs text-gray-600 leading-relaxed">{selectedIll.deliverables}</p>
                            <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-gray-400 bg-white px-2 py-1 rounded border border-gray-100">
                                {selectedIll.service}
                              </span>
                              <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                                {getActiveGroup(selectedIll.id)}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
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
                  className="max-w-full max-h-full object-contain select-none pointer-events-none"
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
