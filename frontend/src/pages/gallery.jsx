import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  Eye, Search, X
} from 'lucide-react';
import ServiceConfirmationPanel from '@/components/ServiceConfirmationPanel';
import { PageMeta } from '@/components/PageMeta';

// 1. Technical drawings (cropped screenshots)
const drawings = [
  { 
    title: "General Arrangement Section - Elevation", 
    file: "eil_ga_sheet1.png", 
    desc: "Cross-sectional elevation of the fired heater showing radiant and convection chambers, platform elevations, and foundation connections.", 
    code: "API STD 530 / EIL Specs",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "General Arrangement Section - Plan View", 
    file: "eil_ga_sheet2.png", 
    desc: "Detailed plan view layout of the refinery fired heater system highlighting spacing, clearances, and equipment alignments.", 
    code: "API STD 530 / EIL Specs",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Radiant Casing Plate Arrangement", 
    file: "radiant_sheet1.png", 
    desc: "Detailed structural framing and casing plate arrangement of the bottom radiant combustion zone.", 
    code: "ASME Sec VIII / IS 800",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Typical Welding Details of Fabricated Sections", 
    file: "radiant_sheet2.png", 
    desc: "Typical welding details of fabricated structural sections with item-wise fabrication references.", 
    code: "ASME Sec VIII / API 530", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Radiant Chamber Coil Assembly", 
    file: "radiant_sheet3.png", 
    desc: "General arrangement and engineering sections of the vertical radiant piping coils.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Elevation of Convection Side Wall - Arch Plate Connection", 
    file: "convection_sheet1.png", 
    desc: "Elevation of the convection side wall showing the arch plate connection, splice joint details, and section 1-1 view.", 
    code: "ASME Sec II & VIII", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Module Section - Sheet 2", 
    file: "convection_sheet2.png", 
    desc: "End cover plate and structural details of the convection module casing box.", 
    code: "IS 800 / ASME Sec VIII",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Component Fabrication Details", 
    file: "convection_sheet3.png", 
    desc: "Fabrication details of convection section components identified by item numbers 45, 46 and 49.", 
    code: "ASME Sec VIII / EIL Spec", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Finned Tube Pitch Layout", 
    file: "convection_sheet4.png", 
    desc: "Arrangement details and spacing of high-efficiency finned tubes inside the convection section bank.", 
    code: "ASME Sec VIII / Refinery Specs",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Casing & Insulation", 
    file: "convection_sheet5.png", 
    desc: "Internal refractory lining anchor layouts and plate welding schedules for the convection module casing.", 
    code: "ASME Sec VIII / Refractory Specs",
    service: "Refractory & Insulation Engineering"
  },
  { 
    title: "Structural Steel Support Tower - GA", 
    file: "sss_sheet1.png", 
    desc: "Heavy portal frames, column bracing systems, and anchor bolt details designed to stabilize the 60-meter high assembly.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Structural Steel Bracing Details", 
    file: "sss_sheet2.png", 
    desc: "Tekla steel detailing connection configurations, gusset plates, and high-strength bolted connection details.", 
    code: "IS 800 / AISC Standards",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Stack Base & Anchor Bolt Details", 
    file: "stack_sheet1.png", 
    desc: "Detail of stack shell plate item no. 56 with M46 anchor bolts and base plate development.", 
    code: "IS 6533 (Steel Chimneys)", 
    service: "Chimney & Stack Engineering"
  },
  { 
    title: "Self-Supporting Stack Layout - Sheet 2", 
    file: "stack_sheet2.png", 
    desc: "Damper mechanism, counterweights, and stack base plate anchoring details.", 
    code: "IS 6533 / ASME Steel Chimneys",
    service: "Chimney & Stack Engineering"
  },
  { 
    title: "Header Box Tube Sealing & Clamp Details", 
    file: "header_box_sheet1.png", 
    desc: "Sections 2-2 and 3-3 of the header box showing typical tube sealing details, clamp details, and bottom panel detail D6.", 
    code: "ASME Sec VIII / Refinery Standard", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Tube Header Box Enclosure - Sheet 2", 
    file: "header_box_sheet2.png", 
    desc: "Structural door hinge calculations and layout details for header box inspection access.", 
    code: "ASME Sec VIII / Refinery Standard",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Heater Platforms Arrangement - GA", 
    file: "platforms_sheet1.png", 
    desc: "Layout and detailing of circular maintenance platforms at various elevations, incorporating anti-slip gratings.", 
    code: "OSHA / IS 800",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Heater Platform Details - Sheet 2", 
    file: "platforms_sheet2.png", 
    desc: "Handrail configurations, toe plates, and circular grating layout sheets.", 
    code: "OSHA / IS 800",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Heater Platform Hangers - Sheet 3", 
    file: "platforms_sheet3.png", 
    desc: "Structural platform supports, brackets, and structural welding connection details.", 
    code: "IS 800 / AISC Standards",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Stair Case Detailing - GA", 
    file: "stair_sheet1.png", 
    desc: "Isometric and elevation drawings of the structural stair tower detailing stringers, treads, and handrail mounts.", 
    code: "IS 800 / OSHA Guidelines",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Stair Case Structural Joint Details", 
    file: "stair_sheet2.png", 
    desc: "Tekla joint details for the stair tower column base, landing supports, and connection plates.", 
    code: "IS 800 / OSHA Guidelines",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Arch Plate Details", 
    file: "arch_plate_sheet1.png", 
    desc: "Monolithic refractory arch plate lining and retaining anchors designed to withstand high operating temperatures.", 
    code: "ASME Sec VIII / Refractory Spec",
    service: "Industrial Equipment Engineering"
  },
  { 
    title: "Breeching Access Door Detailing", 
    file: "breeching_door_sheet1.png", 
    desc: "Fabricated double-hinge hot gas inspection door showing refractory plug casting anchors.", 
    code: "ASME Sec VIII / Refinery Standards",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Observation Port & Sight Glass Details", 
    file: "observation_door_sheet1.png", 
    desc: "High temperature flame inspection doors and sight glass assemblies for heater radiant chamber monitoring.", 
    code: "API 560 / ASME Sec VIII",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Off-take Duct Arrangement", 
    file: "offtake_duct_sheet1.png", 
    desc: "Transition duct detailing connecting the convection section module to the self-supporting stack.", 
    code: "IS 800 / ASME Steel Chimneys",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Self-Closing Floor Peep Hole & Spigot Sleeve Details", 
    file: "floor_plate_sheet1.png", 
    desc: "Details of the 4 NB self-closing floor peep hole with views E-E and F-F and detail of spigot sleeve.", 
    code: "IS 800 / API 560", 
    service: "Industrial Equipment Engineering"
  },
  { 
    title: "Heater Vertical Climbing Ladders", 
    file: "heater_ladders_sheet1.png", 
    desc: "Vertical climbing steel ladders with safety cages, hoops, and shell mounting clips.", 
    code: "OSHA / IS 800 Standards",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Soot Blower Structure Steel detailing", 
    file: "soot_blower_sheet1.png", 
    desc: "Structural framework and catwalk layout designed to support soot blower mechanical lances.", 
    code: "IS 800 / AISC Standards",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Pressure Piping Layout - Sheet 1", 
    file: "pressure_parts_sheet1.png", 
    desc: "High pressure fluid tubing loop arrangement, weld joint detailing, and expansion elbow layouts.", 
    code: "ASME B31.3 / API 530",
    service: "ASME Boiler & Pressure Vessel Design"
  },
  { 
    title: "Pressure Piping Layout - Sheet 2", 
    file: "pressure_parts_sheet2.png", 
    desc: "High-pressure hydrocarbon nozzle schedules, flange ratings, and testing specifications.", 
    code: "ASME B31.3 / API 530",
    service: "ASME Boiler & Pressure Vessel Design"
  },
  // 6 additional EIL drawings
  { 
    title: "Breeching Boundary Lining Details (211-F1 Heater)", 
    file: "eil_ga_sheet3.png", 
    desc: "Breeching boundary lining details of the 211-F1 heater showing castable (Type-V) insulation, ceramic fibre board and arch plate lining.", 
    code: "EIL Specs / IS 800", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Stack Plan & Platform / Ladder Locations", 
    file: "eil_ga_sheet4.png", 
    desc: "Stack plan view showing U/S platform arrangement and ladder locations at the heater stack.", 
    code: "EIL Specs / ASME Sec VIII", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Wall Tube Hanger Details (I.T.S.)", 
    file: "eil_ga_sheet5.png", 
    desc: "Wall tube hanger (pattern 6879/1625/110) details for the convection I.T.S. with sections B-B and H-H and bill of materials.", 
    code: "EIL Specs / IS 6533", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Header Box, Breeching & Burner Stool Details (212-F-1 Heater)", 
    file: "eil_ga_sheet6.png", 
    desc: "6 THK header box plate, 14 THK end tube sheet, U/S breeching plate, observation door and burner stool details of the 212-F-1 heater.", 
    code: "EIL Specs / AISC Standards", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Heater & Convection Tube Pulling Platform Details", 
    file: "eil_ga_sheet7.png", 
    desc: "Pulling door (typ.) with grating for tube, steam lancing access, and piping loads on platform edge of the heater & convection sections.", 
    code: "EIL Specs / ASME Sec VIII", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Access Platform, Ladder & Door Details", 
    file: "eil_ga_sheet8.png", 
    desc: "U/S platform at EL.+15550 with access door and ladder down to EL.+23400 details.", 
    code: "EIL Specs / ASME B31.3", 
    service: "Industrial Fired Heater Engineering"
  },
  // 8 additional HDS drawings
  { 
    title: "HDS Pressure Parts Arrangement - Sheet 3", 
    file: "hds_parts_sheet1.png", 
    desc: "Details of critical pressure tubing weld joints, support clips, and temperature nozzle installations.", 
    code: "ASME B31.3 / API 530",
    service: "Industrial Equipment Engineering"
  },
  { 
    title: "Radiant Section Plans at EL+6200 & EL+8021", 
    file: "hds_radiant_sheet1.png", 
    desc: "Radiant section platform plans at elevations EL+6200 and EL+8021.", 
    code: "ASME Sec VIII / IS 800", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "HDS Radiant Coil Hanger Assemblies", 
    file: "hds_radiant_sheet2.png", 
    desc: "High-alloy casting support hooks and coil guides designed to accommodate vertical growth.", 
    code: "ASME Sec VIII / API 560",
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Platform Plan at EL+12850", 
    file: "hds_convection_sheet1.png", 
    desc: "Plan at EL+12850 of the convection section platform showing secondary members and section 16.", 
    code: "IS 800 / ASME Sec VIII", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "Convection Column & Box Girder Details", 
    file: "hds_convection_sheet2.png", 
    desc: "Typical detail of box girder and details of connection to convection column (2 nos. required).", 
    code: "ASME Sec VIII / EIL Specs", 
    service: "Industrial Fired Heater Engineering"
  },
  { 
    title: "HDS Structural Steel Support Frames", 
    file: "hds_sss_sheet1.png", 
    desc: "Connection joints detailing, gusset plates, and heavy portal bracing systems for the HDS unit.", 
    code: "IS 800 / AISC Standards",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Stack Shell Plate Welding Details", 
    file: "hds_stack_sheet1.png", 
    desc: "Typical welding detail of stack shell plate with details D3, D4 and section 5-5.", 
    code: "IS 6533 / ASME Steel Chimneys", 
    service: "Chimney & Stack Engineering"
  },
  { 
    title: "HDS Tube Header Box Details", 
    file: "hds_header_sheet1.png", 
    desc: "Casing plates, return bend spaces, inspection doors, and seal weld schedules for HDS header boxes.", 
    code: "ASME Sec VIII / Refinery Specs",
    service: "Industrial Equipment Engineering"
  },
  { 
    title: "Evaporator - G.A. of Structure", 
    file: "evaporator_ga.png", 
    desc: "General arrangement elevations showing building column spacings, platform heights, and vertical bracing schemes.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Column Detailing", 
    file: "evaporator_columns.png", 
    desc: "Structural detailing of vertical column members, splice connections, and gusset configurations.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Beam Fabrication Drawing", 
    file: "evaporator_beams.png", 
    desc: "Fabrication drawing of the seven-effect evaporator structure showing beam details D2 to D7 (client: M/s Turn Distilleries).", 
    code: "IS 800 (Structural Steel)", 
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Column Vertical Bracing", 
    file: "evaporator_bracing.png", 
    desc: "Diagonal cross bracing system details designed to resist cyclonic and seismic lateral wind loads.", 
    code: "IS 800 / IS 1893",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Operating Platforms Layout", 
    file: "evaporator_platforms.png", 
    desc: "Detailed circular platform layouts around the vessel and handrail upright connections.", 
    code: "IS 800 / OSHA Standards",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Evaporator - Floor Gratings Layout", 
    file: "evaporator_grating.png", 
    desc: "Serrated safety steel floor grating layouts and panel fixing schedules.", 
    code: "IS 800 / OSHA Standards",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Evaporator - Staircase Detailing", 
    file: "evaporator_staircase.png", 
    desc: "Stair tower details including stringer sizes, checker-plate treads, and landing platform connections.", 
    code: "IS 800 / OSHA Standards",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Evaporator - Purlin Plan", 
    file: "evaporator_truss_ga.png", 
    desc: "Purlin plan layout of the seven-effect evaporator building roof showing purlin runs.", 
    code: "IS 800 (Structural Steel)", 
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Roof Truss Details", 
    file: "evaporator_truss_detail.png", 
    desc: "Detailed structural fabrication sheet for welded gusset connections of the roof truss.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Truss Vertical Bracing", 
    file: "evaporator_truss_bracing.png", 
    desc: "Horizontal and vertical truss wind bracings detailed to stabilize roof arches.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Louver Details (MKD L1 & L2)", 
    file: "evaporator_false_rafter.png", 
    desc: "Detail of louver marked L1 and L2 with sections 6-6 and 7-7 of the evaporator building.", 
    code: "IS 800 (Structural Steel)", 
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Side Wall Cladding Runners", 
    file: "evaporator_side_runners.png", 
    desc: "Wall girts and sag rods framing layouts designed to carry building sheet cladding.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Purlin Typical Connections", 
    file: "evaporator_purlin.png", 
    desc: "Detailed typical connections and spacing for cold-formed steel roof purlins.", 
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  { 
    title: "Evaporator - Sag Rods Details", 
    file: "evaporator_sag_rods.png", 
    desc: "Sag rod sizes, tensioners, and girt connection brackets detailing.", 
    code: "IS 800 (Structural Steel)",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  { 
    title: "Evaporator - Safety Ladder & Cage", 
    file: "evaporator_ladder.png", 
    desc: "Vertical climbing safety ladder details showing cages and anchor clips.", 
    code: "OSHA / IS 800",
    service: "Platform, Staircase, Ladder & Access Structure Design"
  },
  // Santhipuram drawings
  {
    title: "Santhipuram - Stilt Floor Plan",
    file: "santhipuram_layout.png",
    desc: "Stilt floor plan layout showing the parking area, road extension, and column grid arrangement for the residential complex.",
    code: "IS 456 / IS 1893 (Concrete)",
    service: "Building Structural Design"
  },
  {
    title: "Santhipuram - First Floor Plan",
    file: "santhipuram_columns.png",
    desc: "First floor plan layout showing balcony, slab area, and room partition wall arrangement with column coordinates.",
    code: "IS 456 / IS 1893 (Concrete)",
    service: "Building Structural Design"
  },
  {
    title: "Santhipuram - Column Center Line Layout",
    file: "santhipuram_details.png",
    desc: "Column center line layout drawing specifying grid coordinates and center-to-center distances between column lines.",
    code: "IS 456 (Concrete Design)",
    service: "Building Structural Design"
  },
  // Tarachand drawings
  {
    title: "Tarachand - Floor Plan",
    file: "tarachand_ga.png",
    desc: "Floor plan layout of the logistics warehouse showing the wide corridor, road access, and slab area.",
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  {
    title: "Tarachand - Foundation Center Line Layout",
    file: "tarachand_trusses.png",
    desc: "Foundation center line layout specifying column grid positions and footing locations along the 30 ft wide road frontage.",
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  },
  {
    title: "Tarachand - Column Details & Section (Plan Typ C/S)",
    file: "tarachand_gantry.png",
    desc: "Typical column cross-section details for plinth level to first, second and third level slabs with reinforcement schedules.",
    code: "IS 800 (Structural Steel)",
    service: "Civil & Structural Engineering"
  }
];


export default function Gallery() {
  const [drawingSubTab, setDrawingSubTab] = useState('All');
  const [drawingSearchQuery, setDrawingSearchQuery] = useState('');
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeServiceToBook, setActiveServiceToBook] = useState(null);
  const [location, setLocation] = useLocation();

  const getDrawingCategory = (draw) => {
    if (draw.file.startsWith('eil_ga')) return 'EIL';
    if (draw.file.startsWith('pressure_parts') || draw.file.startsWith('hds_')) return 'HDS';
    if (draw.file.startsWith('evaporator_')) return 'Evaporator';
    if (draw.file.startsWith('santhipuram_') || draw.file.startsWith('tarachand_')) return 'Residential Building';
    return 'DHDT';
  };

  const filteredDrawings = drawings.filter(draw => {
    const matchSubTab = drawingSubTab === 'All' || getDrawingCategory(draw) === drawingSubTab;
    const q = drawingSearchQuery.toLowerCase().trim();
    const matchSearch = !q ||
      draw.title.toLowerCase().includes(q) ||
      draw.desc.toLowerCase().includes(q) ||
      draw.code.toLowerCase().includes(q) ||
      (draw.service || '').toLowerCase().includes(q);
    return matchSubTab && matchSearch;
  });

  const handleBookRedirect = (serviceName) => {
    setLocation(`/contact?service=${encodeURIComponent(serviceName)}`);
  };

  useEffect(() => {
    // Reset to very top of page on initial entry
    window.scrollTo(0, 0);

    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    const sub = params.get('sub');
    if (sub) {
      setDrawingSubTab(sub);
    }
    if (tabParam === 'drawings') {
      // default tab is drawings; nothing else to do
    }
  }, [location]);

  return (
    <div className="w-full bg-white">
      <PageMeta title="Gallery & Technical Assets" description="Explore SLS Consultants' engineering gallery: technical drawing layouts, structural drawings and design details from major projects in industrial infrastructure, real estate and residential construction." />
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
              Technical Drawing Layouts
            </h1>
            <p className="mt-4 text-slate-600 max-w-xl text-sm leading-relaxed">
              Explore the engineering drawing database compiled from major projects executed by SLS Consultants.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DRAWINGS CONTENT */}
      <section className="py-20 bg-gray-50 min-h-[600px]">
        <div className="container mx-auto px-4">

          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
            {/* Search - left side */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={drawingSearchQuery}
                onChange={(e) => setDrawingSearchQuery(e.target.value)}
                placeholder="Search drawings..."
                className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 bg-white focus:bg-white focus:border-[#0a1628] focus:outline-none focus:ring-1 focus:ring-[#0a1628]/20 transition-colors rounded-sm"
              />
              {drawingSearchQuery && (
                <button
                  onClick={() => setDrawingSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category filter pills - right side */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {['All', 'DHDT', 'HDS', 'EIL', 'Evaporator', 'Residential Building'].map((subcat) => (
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
              <div className="bg-slate-900 border border-white/10 rounded-sm overflow-hidden flex items-center justify-center h-[50vh] md:h-auto md:aspect-[16/10] shadow-2xl relative">
                {/* Visual Confidentiality Watermark Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center select-none overflow-hidden opacity-20">
                  <div className="text-[12px] sm:text-[16px] md:text-[22px] font-bold text-slate-350 uppercase tracking-[0.2em] -rotate-12 border-2 border-slate-300/40 px-4 py-2 rounded-sm whitespace-nowrap mb-4 sm:mb-6">
                    CONFIDENTIALITY-SAFE VIEW
                  </div>
                  <div className="text-[7px] sm:text-[9px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    FOR EVALUATION ONLY • COPYRIGHT © SLS CONSULTANTS
                  </div>
                </div>

                <img
                  src={`/gallery/${selectedImg.file}`}
                  alt={selectedImg.title}
                  className="max-w-full max-h-full object-contain select-none pointer-events-none z-0"
                />
              </div>
              <div className="text-white mt-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-blue-400">{selectedImg.code}</span>
                    <span className="text-white/40 text-[9px] font-semibold">{selectedImg.service}</span>
                  </div>
                  <h3 className="text-lg font-bold">{selectedImg.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed mt-1">{selectedImg.desc}</p>
                </div>
                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
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

      <AnimatePresence>
        {activeServiceToBook && (
          <ServiceConfirmationPanel
            serviceName={activeServiceToBook}
            onClose={() => setActiveServiceToBook(null)}
            onConfirm={() => {
              setActiveServiceToBook(null);
              setLocation(`/contact?service=${encodeURIComponent(activeServiceToBook)}`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
