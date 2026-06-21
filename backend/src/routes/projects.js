import { Router } from 'express';

const router = Router();

const projects = [
  {
    id: 1,
    title: 'HPCL Millennium Retail Outlet',
    description:
      'Steel canopy structure with a plan area of 1250 Sq.M, supported on 7 columns. A landmark retail outlet for HPCL in Visakhapatnam.',
    category: 'Special Structures',
    client: 'HPCL',
    year: 2003,
  },
  {
    id: 2,
    title: 'Shielding & Cordoning – Concrete Shield Wall',
    description:
      '500 mm RCC removable wall, 16.5M long and 14.3M height, designed in 12 modules for Larsen & Toubro. Reusable design for different site locations.',
    category: 'Special Structures',
    client: 'Larsen & Toubro',
    year: 2003,
  },
  {
    id: 3,
    title: 'Cryogenic Plant Foundations (Air Liquide)',
    description:
      'Machine foundations on piles for cryogenic plant equipment supplied to Iran. Designs vetted by Air Liquide France. Three foundation units delivered.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2003,
  },
  {
    id: 4,
    title: 'Fire Escape Stair Structure – Yemen LNG',
    description:
      'Structural design and foundations for fire escape stair structure for Yemen LNG project, executed through Symbiosys, Visakhapatnam.',
    category: 'Structures',
    client: 'Yemen LNG',
    year: 2013,
  },
  {
    id: 5,
    title: 'Boiler House Structures – HPCL Mumbai',
    description:
      'Design of boiler house structures, de-aerator structures, equipment foundations, pipe racks, and RCC chimneys for 2x100 TPH boilers supplied to HPCL Mumbai.',
    category: 'Boilers & Chimneys',
    client: 'BHPV / HPCL',
    year: 2010,
  },
  {
    id: 6,
    title: 'CDU Heater Package – BPCL Kochi',
    description:
      'CDU Heater package including APH structures and ducting supplied to BPCL Kochi by Technip-KTI Delhi.',
    category: 'Fired Heaters',
    client: 'Technip-KTI / BPCL',
    year: 2013,
  },
  {
    id: 7,
    title: 'Compressor House – Air Liquide Hyderabad',
    description:
      'Design of compressor house 18M x 54M x 15M height with 15T EOT crane, pump house and civil drawings for oxygen plant supplied to Bhushan Steels.',
    category: 'Cryogenic Plants',
    client: 'Air Liquide India',
    year: 2005,
  },
  {
    id: 8,
    title: 'Steam Generator Structures – BHAVINI Kalpakkam',
    description:
      'Design and detailing of steam generator receiving structures, handling structures and foundations to BHAVINI (Nuclear Power Corporation) at Kalpakkam.',
    category: 'Industrial Structures',
    client: 'BHAVINI / Nuclear Power Corporation',
    year: 2007,
  },
  {
    id: 9,
    title: 'Ketene Furnace – Jubilant Organics',
    description:
      'Engineering of Ketene furnace supplied to Jubilant Organics Ltd, UP through Esteem Projects Pvt Ltd, New Delhi.',
    category: 'Fired Heaters',
    client: 'Jubilant Organics / Esteem Projects',
    year: 2009,
  },
  {
    id: 10,
    title: 'TANDA Thermal Power Project – Back End Duct',
    description:
      'Detailing of back end duct support structure for Tanda Thermal Power Project Stage-II (2x660 MW) for L&T MHPS Boilers. Shop and erection drawings using Tekla Structures.',
    category: 'Power Boilers',
    client: 'L&T MHPS Boilers',
    year: 2015,
  },
];

router.get('/', (_req, res) => {
  res.json(projects);
});

export default router;
