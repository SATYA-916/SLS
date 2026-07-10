import { Router } from 'express';

const router = Router();

const services = [
  {
    id: 1,
    title: 'Industrial Fired Heater Engineering',
    description: 'Specialized thermal and structural design for industrial fired heaters, refinery heaters, and steam reformer structures in compliance with API 560 and API 530. Includes structural modeling of convection sections, radiant zone shell casings, and duct systems.',
    icon: 'factory',
  },
  {
    id: 2,
    title: 'Civil & Structural Engineering',
    description: 'Advanced structural analysis and engineering of complex steel framing systems, pipe racks, warehouses, and multi-story structural complexes using STAAD.Pro and other analytical tools under IS/ASME/BS codes.',
    icon: 'building',
  },
  {
    id: 3,
    title: 'Building Structural Design',
    description: 'Comprehensive reinforced concrete (RCC) design for residential, institutional, and commercial buildings. Includes dynamic lateral load calculations, structural framing, shear wall layouts, and detailing conforming to IS 456.',
    icon: 'building',
  },
  {
    id: 4,
    title: 'Industrial Equipment Engineering',
    description: 'Mechanical detailing and design for industrial pressure vessels, heat exchangers, reformers, manifolds, and other heavy refinery equipment under ASME Section VIII and local guidelines.',
    icon: 'factory',
  },
  {
    id: 5,
    title: 'Engineering Drawings & Shop Drawings',
    description: 'High-precision drafting and general arrangement drawing sheet layouts using AutoCAD. Deliverables include nozzle orientations, parts list generation, and complete architectural floor/partition layouts.',
    icon: 'layers',
  },
  {
    id: 6,
    title: 'Structural Steel Design & Detailing',
    description: 'Full-scale structural steel modeling, Tekla detailing, moment connection designs, member sizing, and material take-offs (MTO) for heavy industrial projects.',
    icon: 'grid',
  },
  {
    id: 7,
    title: 'Shop Drawings & Fabrication Drawings',
    description: 'Creation of fabrication-ready workshop drawings including detailed dimensional layouts, member assembly templates, cutting lists, and weld profile specifications.',
    icon: 'layers',
  },
  {
    id: 8,
    title: 'Platform, Staircase, Ladder & Access Structure Design',
    description: 'Designing standard-compliant structural safety platform arrangements, staircases, walkways, cages, ladders, and support framing for industrial heaters and plants.',
    icon: 'grid',
  },
  {
    id: 9,
    title: 'Chimney & Stack Engineering',
    description: 'Structural analysis and design of industrial steel stacks, self-supporting and guyed chimneys, anchor chairs, and dynamic base ring plates under ASME STS-1.',
    icon: 'activity',
  },
  {
    id: 10,
    title: 'Foundation Engineering',
    description: 'Geotechnical and foundation design for heavy industrial systems. Includes isolated footings, pile foundations, piling grids, concrete mats, and sub-grade structures under dynamic vibration parameters.',
    icon: 'building',
  },
  {
    id: 11,
    title: 'Construction Supervision',
    description: 'On-site quality audits, alignment verification, lifting plan review, non-destructive testing (NDT) inspection, and coordination to ensure compliance with Approved-for-Construction (AFC) drawings.',
    icon: 'clipboard',
  },
  {
    id: 12,
    title: 'Municipality Relation Services',
    description: 'Complete regulatory liaisoning, building authorization layouts, fire safety NOC processing, and municipal approval compliance. We compile and verify structural safety certificates and civil drawings to accelerate legal clearance and commissioning.',
    icon: 'activity',
  },
  {
    id: 13,
    title: 'Remaining Life Assessment (RLA)',
    description: 'Fitness-for-service (FFS) inspections and life extension studies for aging steel stacks, boiler frames, and refinery columns. Involves ultrasonic thickness (UT) profiling, structural modeling of degraded frames in STAAD.Pro, and residual strength evaluations under corrosion conditions.',
    icon: 'activity',
  },
  {
    id: 14,
    title: 'Finite Element Analysis (FEA)',
    description: 'Advanced computational stress analysis, dynamic vibration assessments, and thermal fatigue modeling for heavy pressure vessels, chimneys, and storage tanks under dynamic loading and thermal expansion conditions.',
    icon: 'cpu',
  },
  {
    id: 15,
    title: 'Piping Support & Structural Support Design',
    description: 'Comprehensive 3D piping routing, isometric drawing generation, pipe rack design, and piping flexibility/stress analysis under ASME B31.3 process piping codes to verify nozzle load limits.',
    icon: 'pipeline',
  },
];

router.get('/', (_req, res) => {
  res.json(services);
});

export default router;
