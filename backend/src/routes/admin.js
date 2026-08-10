import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { connectMongo, Contact } from '../lib/mongodb.js';
import { sendBrevo } from '../lib/email.js';

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

router.get('/contacts/download/:id', requireAdmin, async (req, res) => {
  try {
    await connectMongo();
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    // 1. If file data is stored directly in MongoDB (database persistence)
    if (contact.fileData) {
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${contact.fileName}"`);
      res.send(contact.fileData);
      return;
    }

    // 2. Fallback to local file path (for backwards compatibility)
    if (contact.filePath) {
      const fullPath = path.join(process.cwd(), 'uploads', contact.filePath);
      if (fs.existsSync(fullPath)) {
        res.download(fullPath, contact.fileName);
        return;
      }
    }

    res.status(404).json({ error: 'File not found' });
  } catch (err) {
    req.log.error({ err }, 'Failed to download file');
    res.status(500).json({ error: 'Failed to download file' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const ownerEmail = process.env.OWNER_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!ownerEmail || !adminPassword) {
    res.status(500).json({ error: 'Recovery parameters not configured on server' });
    return;
  }

  if (email?.trim().toLowerCase() === ownerEmail.trim().toLowerCase()) {
    try {
      await sendBrevo({
        to: ownerEmail,
        toName: 'SLS Admin',
        subject: 'Admin Password Recovery — SLS Structomech',
        html: `
          <div style="font-family:sans-serif;max-width:500px;margin:0 auto;color:#333">
            <div style="background:#0a1628;padding:20px 24px">
              <h2 style="color:white;margin:0;font-size:18px">Admin Password Recovery</h2>
              <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:12px">SLS Structomech Website</p>
            </div>
            <div style="padding:24px;border:1px solid #ddd;border-top:none;background:white">
              <p style="font-size:14px;margin-top:0">Hello Admin,</p>
              <p style="font-size:14px;line-height:1.6">
                A password recovery request was triggered from the admin login page.
              </p>
              <div style="background:#f8f9fa;padding:16px;border-left:4px solid #0a1628;margin:20px 0">
                <p style="margin:0 0 6px;font-size:11px;font-weight:bold;text-transform:uppercase;color:#888;letter-spacing:0.05em">Your Admin Password</p>
                <code style="font-size:16px;font-weight:bold;color:#0a1628;font-family:monospace">${adminPassword}</code>
              </div>
              <p style="font-size:13px;color:#666;margin-bottom:0">
                If you did not request this, please make sure your server environment is secure.
              </p>
            </div>
          </div>
        `,
      });
    } catch (err) {
      req.log.error({ err }, 'Failed to send recovery email');
      res.status(500).json({ error: 'Failed to send recovery email' });
      return;
    }
  }

  res.json({ success: true, message: 'Recovery email sent if address matches our records' });
});

router.patch('/contacts/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  if (!['new', 'replied', 'closed'].includes(status)) {
    res.status(400).json({ error: 'Invalid status' });
    return;
  }
  try {
    await connectMongo();
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!contact) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    res.json(contact);
  } catch (err) {
    req.log.error({ err }, 'Failed to update status');
    res.status(500).json({ error: 'Failed to update status' });
  }
});

router.post('/contacts/:id/notes', requireAdmin, async (req, res) => {
  const { text } = req.body;
  if (!text || text.trim() === '') {
    res.status(400).json({ error: 'Note text is required' });
    return;
  }
  try {
    await connectMongo();
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $push: { notes: { text: text.trim() } } },
      { new: true }
    ).lean();
    if (!contact) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    res.json(contact);
  } catch (err) {
    req.log.error({ err }, 'Failed to add note');
    res.status(500).json({ error: 'Failed to add note' });
  }
});

router.delete('/contacts/:id/notes/:noteId', requireAdmin, async (req, res) => {
  try {
    await connectMongo();
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $pull: { notes: { _id: req.params.noteId } } },
      { new: true }
    ).lean();
    if (!contact) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    res.json(contact);
  } catch (err) {
    req.log.error({ err }, 'Failed to delete note');
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

router.get('/contacts/export', requireAdmin, async (req, res) => {
  try {
    await connectMongo();
    const contacts = await Contact.find().sort({ createdAt: -1 }).lean();
    
    let csv = 'Date,Name,Email,Phone,Company,Service,Status,Message\n';
    
    for (const c of contacts) {
      const date = new Date(c.createdAt).toLocaleDateString('en-IN');
      const name = (c.name || '').replace(/"/g, '""');
      const email = (c.email || '').replace(/"/g, '""');
      const phone = (c.phone || '').replace(/"/g, '""');
      const company = (c.company || '').replace(/"/g, '""');
      const service = (c.service || '').replace(/"/g, '""');
      const status = (c.status || 'new').replace(/"/g, '""');
      const message = (c.message || '').replace(/"/g, '""');
      
      csv += `"${date}","${name}","${email}","${phone}","${company}","${service}","${status}","${message}"\n`;
    }
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="sls_inquiries_export.csv"');
    res.send(csv);
  } catch (err) {
    req.log.error({ err }, 'Failed to export CSV');
    res.status(500).json({ error: 'Failed to export CSV' });
  }
});

// DELETE /contacts/:id — permanently delete a contact inquiry
router.delete('/contacts/:id', requireAdmin, async (req, res) => {
  try {
    await connectMongo();
    const { id } = req.params;
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    req.log.info({ id, email: deleted.email }, 'Contact deleted');
    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, 'Failed to delete contact');
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;
