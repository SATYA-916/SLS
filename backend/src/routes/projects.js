import { Router } from 'express';

const router = Router();

const projects = [
  // SPECIAL STRUCTURES
  {
    id: 1,
    title: 'Millennium Retail Outlet to HPCL',
    description: 'Steel canopy structure with a plan area of 1250 Sq.M, supported on 7 columns. A landmark retail outlet for HPCL in Visakhapatnam.',
    category: 'Special Structures',
    client: 'HPCL',
    year: 2002,
    image: '/projects/proj1.jpeg'
  },
  {
    id: 2,
    title: 'Environmental Control Facilities – SBC',
    description: 'AC shelter of size 16.5MX12MX19 M height, made with fabric, designed for adhesive fixing of surface tiles on a pressure vessel under controlled conditions. Supported from 4 nos of movable modular structures with wheels.',
    category: 'Special Structures',
    client: 'ShipBuilding Center',
    year: 2003,
    image: '/projects/proj2.png'
  },
  {
    id: 3,
    title: 'MT Pool Structure for Support Facilities',
    description: 'MT Pool Structure design and detailing for support facilities at Site B.',
    category: 'Special Structures',
    client: 'SVC Projects Pvt. Ltd.',
    year: 2003,
    image: '/projects/proj3.png'
  },
  {
    id: 4,
    title: 'Shielding & Cordoning Concrete Shield Wall',
    description: '500 mm RCC removable wall, 16.5M long and 14.3M height, designed in 12 modules for Larsen & Toubro. Reusable design for different site locations.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2003,
    image: '/projects/proj4.jpeg'
  },
  {
    id: 5,
    title: 'SGP Shield Radiography',
    description: '50 mm thk. "L" shaped Lead shield, movable and removable type, to be placed on Steam Generator support to carry out in-situ radiography.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2003,
    image: '/projects/proj5.jpeg'
  },
  {
    id: 6,
    title: 'C-Seam RT Shield Structure',
    description: 'Segment of arc shaped lead shield of size 3.0MX2MX120MM thick - 2 numbers, 45 degrees on either side of the vertical axis of the longitudinal vessel.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2003,
    image: '/projects/proj6.jpeg'
  },
  {
    id: 7,
    title: 'Design of Fixtures',
    description: 'A fixture to make pre-camber to weld heavy nozzles to the vessel, and a fixture to mark the cutting lines.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2003,
    image: '/projects/proj7.png'
  },
  {
    id: 8,
    title: 'Design of RT Shield for Container Coaming',
    description: 'Box shield of size 3MX3MX1.5M height to carry an annular lead of thickness of 25mm for radiography of nozzle welds.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2003,
    image: '/projects/proj8.jpeg'
  },
  {
    id: 9,
    title: 'Design & Supervision of Surya Residency',
    description: 'Design and supervision of Surya Residency apartments at Beach Road, Visakhapatnam.',
    category: 'Special Structures',
    client: 'AB Constructions',
    year: 2004,
    image: '/projects/proj9.png'
  },
  {
    id: 10,
    title: 'Design of Auxiliary Facilities to Terminal A',
    description: 'Design of auxiliary facilities for Terminal A in Visakhapatnam.',
    category: 'Special Structures',
    client: 'HPCL',
    year: 2004,
    image: '/projects/proj10.png'
  },
  {
    id: 11,
    title: 'Design of TAF Handling Structures',
    description: 'Structural design of TAF handling structures.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2004,
    image: '/projects/proj11.jpeg'
  },
  {
    id: 12,
    title: 'Main Shaft Handling Fixtures',
    description: 'Design, procurement and supply of main shaft handling fixtures.',
    category: 'Special Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2004,
    image: '/projects/proj12.png'
  },

  // BUILDINGS
  {
    id: 13,
    title: 'Visakha Govt. College for Women',
    description: 'A three-storied RCC structure housing classrooms and other college facilities.',
    category: 'Buildings',
    client: 'APHMHIDC',
    year: 2004,
    image: '/projects/proj13.png'
  },
  {
    id: 14,
    title: 'Residential School Complex for ITDA',
    description: 'Comprehensive design and planning of a school residential complex in Parvathipuram.',
    category: 'Buildings',
    client: 'ITDA',
    year: 2005,
    image: '/projects/proj14.png'
  },
  {
    id: 15,
    title: 'Design of Bhaskar Residency Apartments',
    description: 'Architectural planning and structural design of Bhaskar Residency apartments in Srikakulam.',
    category: 'Buildings',
    client: 'Bhaskar Residency',
    year: 2005,
    image: '/projects/proj15.png'
  },
  {
    id: 16,
    title: 'Commercial Complex at Hyderabad',
    description: 'Design of a multi-storied commercial complex adjacent to Satyam in Hyderabad.',
    category: 'Buildings',
    client: 'Sri Ramshankar Constructions (P) Ltd.',
    year: 2005,
    image: '/projects/proj16.png'
  },
  {
    id: 17,
    title: 'Apartment Complex at Yendada',
    description: 'Design and construction support for a residential apartment complex (Project cost 75 Lakhs).',
    category: 'Buildings',
    client: 'SVC Projects Pvt. Ltd.',
    year: 2006,
    image: '/projects/proj17.png'
  },
  {
    id: 18,
    title: 'Bungalow at Yendada',
    description: 'Luxurious residential bungalow construction and architectural styling (Project cost 55 Lakhs).',
    category: 'Buildings',
    client: 'Private Owner',
    year: 2006,
    image: '/projects/proj18.png'
  },
  {
    id: 19,
    title: 'College Buildings for PG Courses',
    description: '30,000 SFT educational campus building for PG courses at MR College, Vizianagaram.',
    category: 'Buildings',
    client: 'MR College',
    year: 2007,
    image: '/projects/proj19.png'
  },
  {
    id: 20,
    title: 'Residential Complex at Visakhapatnam',
    description: 'Architectural planning, structural design, rain water harvesting, and solar water installations.',
    category: 'Buildings',
    client: 'SVC Projects Pvt. Ltd.',
    year: 2009,
    image: '/projects/proj20.png'
  },

  // CRYOGENIC PLANTS
  {
    id: 21,
    title: 'Cryogenic Plant Foundations (Iran)',
    description: 'Three numbers of machine foundations on piles for cryogenic equipment. Vetted by Air Liquide France.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India / France',
    year: 2003,
    image: '/projects/proj21.png'
  },
  {
    id: 22,
    title: 'Machine Foundations - JSPL Project',
    description: 'Two numbers of machine foundations (Booster Air compressor and Main air compressor) supplied to JSPL project.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2004,
    image: '/projects/proj22.png'
  },
  {
    id: 23,
    title: 'Machine Foundations - Delhi ASU',
    description: 'Two numbers of machine foundations (Air compressor and Recycling compressor) for ASU.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide North India Ltd.',
    year: 2004,
    image: '/projects/proj23.png'
  },
  {
    id: 24,
    title: 'Compressor House - Bhushan Steels',
    description: 'Compressor House of size 18M x 54M x 15M height with 15T EOT crane, pump house and civil drawings for Oxygen plant.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2005,
    image: '/projects/proj24.png'
  },
  {
    id: 25,
    title: 'ASU foundations - Ashahi India Glass',
    description: 'Design of foundations, RCC structures and construction drawings for oxygen plant in Roorkee.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2006,
    image: '/projects/proj25.png'
  },
  {
    id: 26,
    title: 'Civil & Structural ASU - IOCL Panipat',
    description: 'Consultancy services for civil, structural works for IOCL Panipat Air Separation Unit (Compressor house with 40T crane, turbine foundations, storage tanks).',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2007,
    image: '/projects/proj26.png'
  },
  {
    id: 27,
    title: 'Cold Box Handling Structures (Russia)',
    description: 'Design and preparation of fabrication drawings for cold box handling structures supplied to Russia.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2008,
    image: '/projects/proj27.png'
  },
  {
    id: 28,
    title: 'Framed Compressor Foundations - SAIL Bhilai',
    description: 'Design and preparation of construction drawings for framed type compressor foundations.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2010,
    image: '/projects/proj28.png'
  },
  {
    id: 29,
    title: 'Framed Compressor Foundations - Sterlite Tuticorin',
    description: 'Design and preparation of construction drawings for framed compressor foundations.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2010,
    image: '/projects/proj29.png'
  },

  // BOILERS, FLUES & DUCTS and CHIMNEYS
  {
    id: 30,
    title: '1X80 T/Hr Boiler Structures',
    description: 'Design and detailing of structures for 1X80 T/Hr Boiler, steel chimney and handling structures in Kochi.',
    category: 'Boilers & Chimneys',
    client: 'Kochi Refineries Ltd.',
    year: 2003,
    image: '/projects/proj30.jpeg'
  },
  {
    id: 31,
    title: 'VFD Control Room & Retaining Wall',
    description: 'Design and detailing of VFD control room and RCC retaining wall for Hindalco Industries-Renusagar Power Division.',
    category: 'Boilers & Chimneys',
    client: 'ALSTOM POWER',
    year: 2005,
    image: '/projects/proj31.png'
  },
  {
    id: 32,
    title: 'RLA study of Steel Chimneys',
    description: 'Remaining Life Assessment (RLA) study of steel chimneys for ITC Bhadrachalam.',
    category: 'Boilers & Chimneys',
    client: 'ITC Bhadrachalam',
    year: 2006,
    image: '/projects/proj32.png'
  },
  {
    id: 33,
    title: 'Air Heaters & Ducts - Sutherland USA',
    description: 'Design and detailing of air heaters, connecting flues and ducts of RLA Boiler.',
    category: 'Boilers & Chimneys',
    client: 'Doosan Babcock / Sutherland USA',
    year: 2008,
    image: '/projects/proj33.png'
  },
  {
    id: 34,
    title: '2X100 TPH Boiler House Structures',
    description: 'Design of boiler house structures, de-aerator structures, equipment foundations, pipe racks, and RCC chimneys for HPCL Mumbai.',
    category: 'Boilers & Chimneys',
    client: 'BHPV / HPCL Mumbai',
    year: 2010,
    image: '/projects/proj34.jpeg'
  },
  {
    id: 10,
    title: 'TANDA Thermal Power Project – Back End Duct',
    description: 'Detailing of back end duct support structure for Tanda Thermal Power Project Stage-II (2x660 MW) for L&T MHPS Boilers. Shop and erection drawings using Tekla Structures.',
    category: 'Boilers & Chimneys', // Merged from "Power Boilers"
    client: 'L&T MHPS Boilers',
    year: 2015,
    image: '/projects/proj10.png'
  },

  // FIRED HEATERS
  {
    id: 35,
    title: 'Box Heaters - HPCL Mumbai & Vizag',
    description: 'Residual engineering and preparation of fabrication drawings for box heaters.',
    category: 'Fired Heaters',
    client: 'BHPV / HPCL',
    year: 2006,
    image: '/projects/proj35.jpeg'
  },
  {
    id: 36,
    title: 'Cylindrical Fired Heater - BORL Bina',
    description: 'Design and preparation of fabrication drawings for cylindrical fired heaters.',
    category: 'Fired Heaters',
    client: 'BHPV / BORL-Bina',
    year: 2008,
    image: '/projects/proj36.jpeg'
  },
  {
    id: 37,
    title: 'Cylindrical Heaters - CPCL Chennai',
    description: 'Residual engineering and preparation of fabrication drawings for 2 nos of cylindrical heaters with APH structure.',
    category: 'Fired Heaters',
    client: 'Bridge & Roof / CPCL',
    year: 2009,
    image: '/projects/proj37.jpeg'
  },
  {
    id: 38,
    title: 'Ketene Furnace - Jubilant Organics',
    description: 'Engineering of Ketene furnace supplied to Jubilant Organics Ltd, UP.',
    category: 'Fired Heaters',
    client: 'Jubilant Organics / Esteem Projects',
    year: 2010,
    image: '/projects/proj38.jpeg'
  },
  {
    id: 39,
    title: 'Ketene Furnace - IOL Chemicals',
    description: 'Engineering of Ketene furnace supplied to IOL Chemicals & Pharmaceuticals at Barnala.',
    category: 'Fired Heaters',
    client: 'IOL Chemicals / Esteem Projects',
    year: 2011,
    image: '/projects/proj39.jpeg'
  },
  {
    id: 40,
    title: 'Refinery Heater Packages - Nagarjuna',
    description: 'Atmospheric Service Heater & Vacuum heater, interconnecting ducting, ID & FD Fans for Cuddalore Refinery Project.',
    category: 'Fired Heaters',
    client: 'Nagarjuna / Esteem Projects',
    year: 2012,
    image: '/projects/proj40.png'
  },
  {
    id: 41,
    title: 'CDU Heater Package - BPCL Kochi',
    description: 'CDU Heater package including APH structures and ducting.',
    category: 'Fired Heaters',
    client: 'Technip-KTI / BPCL',
    year: 2013,
    image: '/projects/proj41.jpeg'
  },
  {
    id: 42,
    title: 'DCU Heater Package - BPCL Cochin',
    description: 'DCU heater package of BPCL Cochin.',
    category: 'Fired Heaters',
    client: 'Heurtey Petrochem / BPCL',
    year: 2014,
    image: '/projects/proj42.jpeg'
  },

  // INDUSTRIAL STRUCTURES
  {
    id: 43,
    title: 'Maintenance Sheds - Kalpakkam',
    description: 'Design and construction drawings for maintenance sheds for L&T at Kalpakkam.',
    category: 'Industrial Structures',
    client: 'Larsen & Toubro Ltd.',
    year: 2006,
    image: '/projects/proj43.png'
  },
  {
    id: 44,
    title: 'Steam Generator Receiving Structures',
    description: 'Design and detailing of steam generator receiving structures, related handling structures and foundations.',
    category: 'Industrial Structures',
    client: 'BHAVINI / NPCIL Kalpakkam',
    year: 2007,
    image: '/projects/proj44.jpeg'
  },
  {
    id: 45,
    title: 'Safety Vessel Cover - BHAVINI',
    description: 'Design and detailing of Safety vessel cover for BHAVINI at Kalpakkam.',
    category: 'Industrial Structures',
    client: 'BHAVINI / NPCIL Kalpakkam',
    year: 2007,
    image: '/projects/proj45.jpeg'
  },

  // PROJECT CONSULTANTS & SHIPPING
  {
    id: 46,
    title: 'TERN Distilleries Expansion Project',
    description: 'Project consultants for civil, structural, and mechanical works for TERN Distilleries expansion (Project cost 10 Crores).',
    category: 'Structures',
    client: 'TERN Distilleries (UB Group)',
    year: 2006,
    image: '/projects/proj46.png'
  },
  {
    id: 47,
    title: 'ASU Pipelines - Cross Country Survey',
    description: 'Survey works for the cross country pipeline from Kakinada to Jamnagar supplied by Baoji steel company.',
    category: 'Structures',
    client: 'Brij Associates / Reliance',
    year: 2006,
    image: '/projects/proj47.png'
  }
];

router.get('/', (_req, res) => {
  res.json(projects);
});

export default router;
