import { Router } from 'express';
import { connectMongo, Contact } from '../lib/mongodb.js';

const router = Router();

function requireAdmin(req, res, next) {
  if (req.session?.isAdmin) return next();
  res.status(401).json({ error: 'Unauthorized' });
}

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.status(500).json({ error: 'Admin not configured' });
    return;
  }
  if (password !== adminPassword) {
    res.status(401).json({ error: 'Invalid password' });
    return;
  }

  req.session.isAdmin = true;
  req.log.info('Admin logged in');
  res.json({ success: true });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get('/me', (req, res) => {
  res.json({ isAdmin: !!req.session?.isAdmin });
});

router.get('/contacts', requireAdmin, async (req, res) => {
  try {
    await connectMongo();
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    res.json(contacts);
  } catch (err) {
    req.log.error({ err }, 'Failed to fetch contacts');
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

export default router;
