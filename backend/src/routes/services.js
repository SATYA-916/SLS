import { Router } from 'express';

const router = Router();

const services = [
  {
    id: 1,
    title: 'Engineering',
    description: 'Engineering services for heavy industrial projects.',
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
    description: 'Design and manufacturing of special products tailored to client needs.',
    icon: 'cogs',
  },
  {
    id: 4,
    title: 'Remaining Life Assessment (RLA) Studies',
    description: 'RLA studies to assess remaining service life of existing structures.',
    icon: 'activity',
  },
  {
    id: 5,
    title: 'Laisoning',
    description: 'Laisoning services for industrial projects.',
    icon: 'map',
  },
];

router.get('/', (_req, res) => {
  res.json(services);
});

export default router;
