import { Router } from 'express';

const router = Router();

const services = [
  {
    id: 1,
    title: 'Blueprint Design',
    description: 'Comprehensive 2D and 3D industrial plant drafting, piping isometric generation, and mechanical schematic layouts using AutoCAD and custom BIM tools. Deliverables include detailed nozzle orientation drawings, shell cutting lists, and piping & instrumentation diagrams (P&IDs) checked against API and ASME codes.',
    icon: 'layers',
  },
  {
    id: 2,
    title: 'Industrial Design & Support',
    description: 'Specialised mechanical detailing and residual engineering for industrial fired heaters, pressure vessels, and chimneys. Includes casing steel plate shop drawings, convection section support designs, tube header box hinges detailing, and refractory anchor layouts in compliance with API 530 and ASME Section VIII.',
    icon: 'factory',
  },
  {
    id: 3,
    title: 'Engineering & Architecture Design',
    description: 'Multi-disciplinary civil, structural, and architectural design for commercial, institutional, and residential buildings. Incorporates pile foundation engineering, RCC/steel framing modeling, shear wall layouts, and dynamic lateral wind/seismic load calculations under IS 1893 and IS 875 codes.',
    icon: 'building',
  },
  {
    id: 4,
    title: 'Construction Supervision',
    description: 'On-site technical supervision, anchor bolt alignment checking, structural plumb audits, and lifting plan evaluations. We coordinate welding procedure specifications (WPS) and non-destructive testing (NDT) audits to guarantee compliance with Approved-for-Construction (AFC) drawings.',
    icon: 'clipboard',
  },
  {
    id: 5,
    title: 'Municipality Relation Services',
    description: 'Complete regulatory liaisoning, building authorization layouts, fire safety NOC processing, and municipal approval compliance. We compile and verify structural safety certificates and civil drawings to accelerate legal clearance and commissioning.',
    icon: 'activity',
  },
  {
    id: 6,
    title: 'Remaining Life Assessment (RLA)',
    description: 'Fitness-for-service (FFS) inspections and life extension studies for aging steel stacks, boiler frames, and refinery columns. Involves ultrasonic thickness (UT) profiling, structural modeling of degraded frames in STAAD.Pro, and residual strength evaluations under corrosion conditions.',
    icon: 'grid',
  },
  {
    id: 7,
    title: 'Software & AI Solutions',
    description: 'Developing custom automation scripts for structural analysis, drafting plugins, Tekla macros, and BIM model coordination using Autodesk Navisworks to automate steel detailing, detect spatial clashes, and optimize part lists.',
    icon: 'monitor',
  },
  {
    id: 8,
    title: "Project Management & Owner's Engineering",
    description: "Providing comprehensive owner's engineering support, procurement package vetting, project schedules (MSP/Primavera), vendor QA/QC coordination, and third-party inspection alignment for refinery and industrial power projects.",
    icon: 'briefcase',
  }
];

router.get('/', (_req, res) => {
  res.json(services);
});

export default router;
