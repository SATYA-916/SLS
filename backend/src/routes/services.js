import { Router } from 'express';

const router = Router();

const services = [
  {
    id: 1,
    title: 'Engineering',
    description: 'Engineering services for heavy industrial projects. Buildings (Steel & RCC), Ware Houses, Boilers, Fired Heaters, Storage Vessels, Heat Exchangers, FEM Analysis, Foundations, Compressor Houses, Steel & RCC Chimneys.',
    icon: 'gear',
  },
  {
    id: 2,
    title: 'Project Consulting',
    description: 'Project consulting services including feasibility studies and execution planning.',
    icon: 'briefcase',
  },
  {
    id: 3,
    title: 'Special Products Design & Manufacturing',
    description: 'Design and manufacturing of special products tailored to client needs like handling structure, transportation of client items by road and sea, testing procedure, etc.',
    icon: 'cogs',
  },
  {
    id: 4,
    title: 'Remaining Life Assessment (RLA) Studies',
    description: 'RLA studies to assess remaining service life of existing structures and buildings existing industrial equipment.',
    icon: 'activity',
  },
  {
    id: 5,
    title: 'Building Plan Approval & General Client Needs',
    description: 'GVMC registered consultant for building plan approval consultation, structural stability certificates, and general client needs related to residential and industrial buildings. Architectural structural design, plan approvals, and suggestions for buying old and new buildings.',
    icon: 'map',
  },
];

router.get('/', (_req, res) => {
  res.json(services);
});

export default router;
