const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// ==========================================
// 1. CORS & Body Parsers
// ==========================================
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
  })
);

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// ==========================================
// 2. Nodemailer Transporter Setup
// ==========================================
const createTransporter = () => {
  const isSecure = process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465';

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    secure: isSecure, // true for port 465, false for 587 / 25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Optional timeout settings
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  });
};

// ==========================================
// 3. Validation & Sanitization Helper
// ==========================================
function validateContactPayload({ name, email, message }) {
  const errors = [];

  // Check existence
  if (!name || typeof name !== 'string') {
    errors.push('Name is required.');
  } else if (name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long.');
  } else if (name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters.');
  }

  // Email format regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string') {
    errors.push('Email is required.');
  } else if (!emailRegex.test(email.trim())) {
    errors.push('Please provide a valid email address.');
  } else if (email.trim().length > 120) {
    errors.push('Email cannot exceed 120 characters.');
  }

  // Message length check
  if (!message || typeof message !== 'string') {
    errors.push('Message is required.');
  } else if (message.trim().length < 10) {
    errors.push('Message must be at least 10 characters long.');
  } else if (message.trim().length > 3000) {
    errors.push('Message cannot exceed 3000 characters.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized: {
      name: name ? name.trim().replace(/[<>]/g, '') : '',
      email: email ? email.trim().toLowerCase() : '',
      message: message ? message.trim().replace(/[<>]/g, '') : ''
    }
  };
}

// ==========================================
// 4. API Endpoints
// ==========================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Health Deck SMTP Mailer'
  });
});

// Contact Form Endpoint: POST /api/contact
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};

    // Run backend validation
    const validation = validateContactPayload({ name, email, message });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.errors[0],
        errors: validation.errors
      });
    }

    const cleanData = validation.sanitized;
    const companyEmail = process.env.COMPANY_EMAIL || 'care@healthdeck.example';

    // Verify SMTP configuration before sending
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('[SMTP Config Error]: Missing SMTP_USER or SMTP_PASS.');
      return res.status(500).json({
        success: false,
        message: 'Mail service is currently unconfigured. Please contact support.'
      });
    }

    const transporter = createTransporter();

    // Prepare Branded Email Template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4fafb; margin: 0; padding: 24px; color: #173238; }
          .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 18px; overflow: hidden; border: 1px solid #d9f1f4; box-shadow: 0 10px 25px rgba(39, 120, 133, 0.08); }
          .header { background: linear-gradient(145deg, #65cad4, #2799aa); color: #ffffff; padding: 28px; text-align: left; }
          .header h1 { margin: 0; font-size: 22px; letter-spacing: -0.02em; font-weight: 800; }
          .badge { display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.25); border-radius: 99px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.1em; }
          .content { padding: 32px 28px; }
          .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          .info-table td { padding: 10px 0; border-bottom: 1px solid #eef6f7; font-size: 14px; }
          .info-label { width: 110px; font-weight: bold; color: #637c82; }
          .info-val { color: #173238; font-weight: 600; }
          .message-box { background: #f0fbfc; border-left: 4px solid #2799aa; padding: 18px; border-radius: 0 12px 12px 0; font-size: 15px; line-height: 1.6; color: #23454c; white-space: pre-wrap; word-break: break-word; }
          .footer { padding: 20px 28px; background: #eef8fa; text-align: center; font-size: 12px; color: #739097; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">New Inquiry</span>
            <h1>Health Deck Contact Message</h1>
          </div>
          <div class="content">
            <table class="info-table">
              <tr>
                <td class="info-label">Sender Name:</td>
                <td class="info-val">${cleanData.name}</td>
              </tr>
              <tr>
                <td class="info-label">Sender Email:</td>
                <td class="info-val"><a href="mailto:${cleanData.email}" style="color:#2799aa; text-decoration:none;">${cleanData.email}</a></td>
              </tr>
              <tr>
                <td class="info-label">Received At:</td>
                <td class="info-val">${new Date().toLocaleString('en-US', { timeZoneName: 'short' })}</td>
              </tr>
            </table>

            <p style="font-size: 13px; font-weight: bold; color: #637c82; margin: 0 0 8px;">MESSAGE:</p>
            <div class="message-box">${cleanData.message}</div>
          </div>
          <div class="footer">
            Delivered directly via Health Deck SMTP Integration.<br>
            You can reply directly to this email to contact <strong>${cleanData.name}</strong>.
          </div>
        </div>
      </body>
      </html>
    `;

    // Mail options
    const mailOptions = {
      from: `"Health Deck Contact" <${process.env.SMTP_USER}>`,
      to: companyEmail,
      replyTo: `"${cleanData.name}" <${cleanData.email}>`, // Enables 1-click reply to the patient
      subject: `[Health Deck Enquiry] from ${cleanData.name}`,
      text: `You received a new inquiry from Health Deck:\n\nName: ${cleanData.name}\nEmail: ${cleanData.email}\nDate: ${new Date().toISOString()}\n\nMessage:\n${cleanData.message}`,
      html: emailHtml
    };

    // Send email via SMTP
    const info = await transporter.sendMail(mailOptions);
    console.log('[SMTP Message Sent]: ID =', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully to the Health Deck team.',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('[SMTP Mail Delivery Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send your message due to a server error. Please try again later.'
    });
  }
});

// Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Export app for Vercel serverless execution
module.exports = app;