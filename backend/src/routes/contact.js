import { Router } from 'express';
import { z } from 'zod';
import { connectMongo, Contact } from '../lib/mongodb.js';

const router = Router();

const SubmitContactBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  service: z.string().nullable().optional(),
  message: z.string().min(10),
});

async function sendBrevo({ to, toName, subject, html }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error('BREVO_API_KEY is not set');

  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!senderEmail) throw new Error('BREVO_SENDER_EMAIL is not set');

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'SLS Consultants', email: senderEmail },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Brevo error: ${err}`);
  }
}

function ownerEmailHtml({ name, email, phone, company, service, message }) {
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0a1628;padding:20px 24px;margin-bottom:24px">
        <h2 style="color:white;margin:0;font-size:18px">New Contact Form Submission</h2>
        <p style="color:rgba(255,255,255,0.6);margin:4px 0 0;font-size:13px">SLS Consultants Website</p>
      </div>
      <table style="border-collapse:collapse;width:100%;font-size:14px">
        <tr><td style="padding:10px 12px;border:1px solid #ddd;font-weight:bold;background:#f8f9fa;width:120px">Name</td><td style="padding:10px 12px;border:1px solid #ddd">${name}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #ddd;font-weight:bold;background:#f8f9fa">Email</td><td style="padding:10px 12px;border:1px solid #ddd"><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #ddd;font-weight:bold;background:#f8f9fa">Phone</td><td style="padding:10px 12px;border:1px solid #ddd">${phone ?? '—'}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #ddd;font-weight:bold;background:#f8f9fa">Company</td><td style="padding:10px 12px;border:1px solid #ddd">${company ?? '—'}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #ddd;font-weight:bold;background:#f8f9fa">Service</td><td style="padding:10px 12px;border:1px solid #ddd">${service ?? '—'}</td></tr>
        <tr><td style="padding:10px 12px;border:1px solid #ddd;font-weight:bold;background:#f8f9fa">Message</td><td style="padding:10px 12px;border:1px solid #ddd">${message}</td></tr>
      </table>
    </div>
  `;
}

function customerEmailHtml({ name, service }) {
  const serviceText = service ? `regarding <strong>${service}</strong>` : 'to us';
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#333">
      <div style="background:#0a1628;padding:24px 28px">
        <h2 style="color:white;margin:0;font-size:20px">SLS Structo-Mech Consultants</h2>
        <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase">Engineering. Structures. Industrial Solutions.</p>
      </div>
      <div style="padding:32px 28px;background:#ffffff;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:15px;margin:0 0 16px">Dear <strong>${name}</strong>,</p>
        <p style="font-size:14px;line-height:1.7;margin:0 0 16px;color:#555">
          Thank you for reaching out ${serviceText}. We have received your enquiry and our engineering team will review it carefully.
        </p>
        <p style="font-size:14px;line-height:1.7;margin:0 0 24px;color:#555">
          You can expect a personalised response from us within <strong>24 hours</strong> on business days. If your requirement is urgent, please feel free to call us directly.
        </p>
        <div style="background:#f8f9fa;border-left:3px solid #43648e;padding:16px 20px;margin-bottom:24px">
          <p style="margin:0 0 8px;font-size:12px;font-weight:bold;text-transform:uppercase;letter-spacing:0.08em;color:#888">Contact Us Directly</p>
          <p style="margin:0 0 4px;font-size:13px;color:#333">📞 +91 98495 98424</p>
          <p style="margin:0 0 4px;font-size:13px;color:#333">✉️ slsind@gmail.com</p>
          <p style="margin:0;font-size:13px;color:#333">🌐 www.slsvizag.com</p>
        </div>
        <p style="font-size:13px;color:#888;margin:0">
          Warm regards,<br />
          <strong style="color:#0a1628">SLS Structo-Mech Consultants</strong><br />
          Visakhapatnam, Andhra Pradesh, India
        </p>
      </div>
      <div style="background:#f8f9fa;padding:12px 28px;text-align:center;border:1px solid #e5e7eb;border-top:none">
        <p style="font-size:11px;color:#aaa;margin:0">This is an automated confirmation. Please do not reply to this email.</p>
      </div>
    </div>
  `;
}

router.post('/', async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  const { name, email, phone, company, service, message } = parsed.data;

  try {
    await connectMongo();
    await Contact.create({ name, email, phone, company, service, message });

    req.log.info({ email }, 'Contact form saved to MongoDB');
    res.status(201).json({
      success: true,
      message: 'Your inquiry has been received. We will get back to you shortly.',
    });

    const OWNER_EMAIL = process.env.OWNER_EMAIL;

    // Owner notification via Brevo
    if (OWNER_EMAIL) {
      sendBrevo({
        to: OWNER_EMAIL,
        toName: 'SLS Admin',
        subject: `New Enquiry from ${name} (${email})`,
        html: ownerEmailHtml({ name, email, phone, company, service, message }),
      })
        .then(() => req.log.info({ email }, 'Owner notification sent via Brevo'))
        .catch((err) => req.log.error({ err }, 'Owner notification failed'));
    }

    // Customer auto-reply via Brevo
    sendBrevo({
      to: email,
      toName: name,
      subject: 'We have received your enquiry — SLS Consultants',
      html: customerEmailHtml({ name, service }),
    })
      .then(() => req.log.info({ email }, 'Customer auto-reply sent via Brevo'))
      .catch((err) => req.log.error({ err }, 'Customer auto-reply failed'));

  } catch (err) {
    req.log.error({ err }, 'Failed to save contact to MongoDB');
    res.status(500).json({ error: 'Failed to submit inquiry' });
  }
});

export default router;
