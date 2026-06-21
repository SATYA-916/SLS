import { Router } from 'express';

const router = Router();

const services = [
  {
    id: 1,
    title: 'Blueprint Design',
    description: 'Comprehensive 2D drafting and blueprint creation using AutoCAD for layouts, piping, and mechanical components.',
    icon: 'layers',
  },
  {
    id: 2,
    title: 'Industrial Design and Support',
    description: 'Specialised design of industrial structures, fired heaters, pressure vessels, and remaining life assessments (RLA).',
    icon: 'factory',
  },
  {
    id: 3,
    title: 'Engineering and Architecture Design',
    description: 'Full-scale architectural planning, structural design, and multi-disciplinary engineering for residential and commercial buildings.',
    icon: 'building',
  },
  {
    id: 4,
    title: 'Construction Supervision',
    description: 'On-site technical support, quality control, progress monitoring, and safety supervision from excavation to commissioning.',
    icon: 'clipboard',
  },
  {
    id: 5,
    title: 'Municipality Relation Services',
    description: 'Liaisoning with government departments and municipal bodies for building approvals, NOCs, and regulatory compliance.',
    icon: 'activity',
  },
];

router.get('/', (_req, res) => {
  res.json(services);
});

export default router;
