import { Router } from 'express';

const router = Router();

const services = [
  {
    id: 1,
    title: 'Structural Engineering',
    description:
      'Design, analysis and consulting for safe and economical steel and RCC structures including buildings, warehouses, and industrial facilities.',
    icon: 'building',
  },
  {
    id: 2,
    title: 'Industrial Projects',
    description:
      'Industrial structures, piping supports, platforms and equipment structures for boilers, fired heaters, storage vessels and heat exchangers.',
    icon: 'factory',
  },
  {
    id: 3,
    title: 'FEM Analysis',
    description:
      'Advanced finite element analysis using industry-standard FEM tools for accurate and reliable structural assessment results.',
    icon: 'grid',
  },
  {
    id: 4,
    title: 'RLA Studies',
    description:
      'Remaining Life Assessment (RLA) studies for fitness-for-service evaluation of ageing plant and equipment including chimneys and pressure vessels.',
    icon: 'activity',
  },
  {
    id: 5,
    title: 'Project Consultancy',
    description:
      'Concept to commissioning project consultancy support for industrial and infrastructure projects, including tendering, inspection and vendor evaluation.',
    icon: 'clipboard',
  },
  {
    id: 6,
    title: 'Steel Detailing (Tekla)',
    description:
      '3D modeling and comprehensive steel detailing using Tekla Structures for shop and erection drawings.',
    icon: 'layers',
  },
];

router.get('/', (_req, res) => {
  res.json(services);
});

export default router;
