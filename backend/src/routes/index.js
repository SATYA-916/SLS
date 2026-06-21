import { Router } from 'express';
import healthRouter from './health.js';
import contactRouter from './contact.js';
import projectsRouter from './projects.js';
import servicesRouter from './services.js';
import statsRouter from './stats.js';
import adminRouter from './admin.js';

const router = Router();

router.use(healthRouter);
router.use('/contact', contactRouter);
router.use('/projects', projectsRouter);
router.use('/services', servicesRouter);
router.use('/stats', statsRouter);
router.use('/admin', adminRouter);

export default router;
