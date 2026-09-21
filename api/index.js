// api/index.js
// Express app that powers the contact/reservation form.
// Exported (not listened on) so it works both:
//   - locally, via server.js (app.listen)
//   - on Vercel, as a serverless function (vercel.json points api/index.js at @vercel/node)

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

/* ------------------------------------------------------------------ */
/*  Middleware                                                         */
/* ------------------------------------------------------------------ */

// Allow only the configured frontend origin (or '*' for open access during dev/testing)
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.json({ limit: '10kb' })); // small limit — this endpoint only ever needs a short form payload

// Handle bad input to the body parser itself (malformed JSON, oversized payload) with
// proper 4xx JSON responses instead of letting them fall through to a generic 500.
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body must be valid JSON.' });
  }
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }
  next(err);
});

/* ------------------------------------------------------------------ */
/*  SMTP transporter                                                   */
/* ------------------------------------------------------------------ */

function buildTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for port 465, false for 587/others
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Built once and reused across requests (and across warm serverless invocations)
let transporter;
function getTransporter() {
  if (!transporter) transporter = buildTransporter();
  return transporter;
}

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: { min: 2, max: 100 },
  email: { min: 5, max: 254 }, // 5 = shortest plausible address, e.g. a@b.co ; 254 = RFC 5321 max
  phone: { min: 7, max: 20 }, // only enforced when phone is provided at all — it's optional
  message: { min: 10, max: 2000 },
};

function validateContactPayload(body) {
  const errors = [];
  const clean = {};

  // Reject non-object bodies outright (e.g. a bare string or number sent as JSON) rather
  // than letting every field below silently fall back to "".
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { errors: ['Request body must be a JSON object.'], clean: null };
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const message = String(body.message ?? '').trim();
  const date = String(body.date ?? '').trim();
  const time = String(body.time ?? '').trim();
  const guests = String(body.guests ?? '').trim();

  // --- name: required, min/max length ---
  if (!name) {
    errors.push('Name is required.');
  } else if (name.length < LIMITS.name.min) {
    errors.push(`Name must be at least ${LIMITS.name.min} characters.`);
  } else if (name.length > LIMITS.name.max) {
    errors.push(`Name must be no more than ${LIMITS.name.max} characters.`);
  }

  // --- email: required, format, min/max length ---
  if (!email) {
    errors.push('Email is required.');
  } else if (email.length < LIMITS.email.min || email.length > LIMITS.email.max) {
    errors.push(`Email must be between ${LIMITS.email.min} and ${LIMITS.email.max} characters.`);
  } else if (!EMAIL_RE.test(email)) {
    errors.push('Please provide a valid email address.');
  }

  // --- phone: optional, but validated if present ---
  if (phone) {
    if (phone.length < LIMITS.phone.min || phone.length > LIMITS.phone.max) {
      errors.push(`Phone number must be between ${LIMITS.phone.min} and ${LIMITS.phone.max} characters.`);
    } else if (!/^[\d\s()+\-.]+$/.test(phone)) {
      errors.push('Please provide a valid phone number.');
    }
  }

  // --- message: required, min/max length ---
  if (!message) {
    errors.push('Message is required.');
  } else if (message.length < LIMITS.message.min) {
    errors.push(`Message must be at least ${LIMITS.message.min} characters.`);
  } else if (message.length > LIMITS.message.max) {
    errors.push(`Message must be no more than ${LIMITS.message.max} characters.`);
  }

  // Honeypot field: real users never fill a visually-hidden field.
  // If it's populated, silently treat as spam by flagging it — the route handles the response.
  const isBot = Boolean(String(body.company_website ?? '').trim());

  clean.name = name;
  clean.email = email;
  clean.phone = phone;
  clean.message = message;
  clean.date = date;
  clean.time = time;
  clean.guests = guests;
  clean.isBot = isBot;

  return { errors, clean };
}

/* ------------------------------------------------------------------ */
/*  Routes                                                              */
/* ------------------------------------------------------------------ */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
  });
});

app.post('/api/contact', async (req, res) => {
  const { errors, clean } = validateContactPayload(req.body);

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors.join(' ') });
  }

  // Quietly accept-and-drop suspected bot submissions instead of revealing the honeypot exists
  if (clean.isBot) {
    return res.status(200).json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  }

  const detailRows = [
    ['Name', clean.name],
    ['Email', clean.email],
    clean.phone && ['Phone', clean.phone],
    clean.date && ['Date', clean.date],
    clean.time && ['Time', clean.time],
    clean.guests && ['Guests', clean.guests],
  ].filter(Boolean);

  const textBody = [
    'New contact form submission:',
    '',
    ...detailRows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Message:',
    clean.message,
  ].join('\n');

  const htmlRows = detailRows
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#667779;font-size:13px;"><b>${k}</b></td><td style="padding:4px 0;font-size:13px;">${escapeHtml(v)}</td></tr>`)
    .join('');

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="color:#07515a;">New Contact Form Submission</h2>
      <table style="border-collapse:collapse;margin:12px 0;">${htmlRows}</table>
      <p style="color:#0a3439;font-size:14px;"><b>Message</b></p>
      <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;color:#333;">${escapeHtml(clean.message)}</p>
    </div>`;

  try {
    const mailer = getTransporter();
    await mailer.sendMail({
      from: `"${clean.name}" <${process.env.SMTP_USER}>`, // must be the authenticated SMTP user for most providers
      to: process.env.COMPANY_EMAIL,
      replyTo: clean.email, // clicking "Reply" in the inbox goes straight to the visitor
      subject: `New enquiry from ${clean.name}`,
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
    });
  } catch (err) {
    console.error('SMTP send failed:', err.message);
    return res.status(502).json({
      success: false,
      message: 'We could not send your message right now. Please try again shortly.',
    });
  }
});

// Wrong method on a known route (e.g. GET /api/contact) → 405, not a bare 404.
app.all('/api/contact', (req, res) => {
  res.set('Allow', 'POST');
  res.status(405).json({ success: false, message: 'Method not allowed. Use POST.' });
});
app.all('/api/health', (req, res) => {
  res.set('Allow', 'GET');
  res.status(405).json({ success: false, message: 'Method not allowed. Use GET.' });
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ------------------------------------------------------------------ */
/*  Fallbacks                                                           */
/* ------------------------------------------------------------------ */

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;
