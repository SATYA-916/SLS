import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    yearsExperience: 20,
    projectsCompleted: 500,
    clientsServed: 50,
    softwarePlatforms: 5,
  });
});

export default router;
