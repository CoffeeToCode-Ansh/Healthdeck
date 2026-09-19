# SMTP Contact Form Integration

**Deliverable:** Frontend → API → Backend → SMTP → Company Email

A small full-stack piece: a contact/reservation form posts JSON to an Express API endpoint, the backend validates it, then sends it as an email via Nodemailer/SMTP to a company inbox.

## Stack
- Node.js + Express — HTTP server / API endpoint
- Nodemailer — SMTP email sending
- CORS — restricts which frontend origins may call the API
- dotenv — environment variable loading
- Vercel — deployment (serverless function + static frontend)

## Project structure
```
.
├── api/
│   └── index.js        # Express app: /api/contact, /api/health, validation, Nodemailer send
├── public/
│   ├── index.html       # Demo contact form
│   ├── style.css
│   └── script.js        # fetch() → POST /api/contact
├── server.js             # Local dev entry point (app.listen); not used on Vercel
├── vercel.json            # Routes /api/* to the serverless function, everything else to /public
├── package.json
├── .env.example           # Copy to .env and fill in real values (never commit .env)
└── .gitignore
```

## How the request flows
1. **Frontend** (`public/script.js`) collects the form fields and does a quick client-side check, then `fetch()`s `POST /api/contact` with a JSON body.
2. **API endpoint** (`api/index.js`) receives the request behind CORS and a JSON body parser.
3. **Backend validation** re-checks everything server-side (required fields, email format, phone format, length limits, a honeypot field to quietly drop bot submissions) — client-side checks alone are never trusted, since they're trivial to bypass.
4. **SMTP** — a Nodemailer transporter authenticates to the configured SMTP host and sends the message, with `replyTo` set to the visitor's email so a reply goes straight to them.
5. **Company email** — the message lands in the inbox set by `COMPANY_EMAIL`.

The API returns `{ success: true/false, message: "..." }` in every case, which the frontend uses to show a success or error state without a page reload.

## Local setup
```bash
npm install
cp .env.example .env
# edit .env with your real SMTP credentials and company email
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```

Then open **http://localhost:5000** for the demo form, or:
- `GET  http://localhost:5000/api/health` → `{"success":true,"message":"Server is healthy", ...}`
- `POST http://localhost:5000/api/contact` with a JSON body of `{ name, email, phone?, date?, time?, guests?, message }`

### Quick manual test with curl
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","message":"Testing the contact form."}'
```

### Gmail SMTP note
If `SMTP_HOST=smtp.gmail.com`, `SMTP_PASS` must be a **Gmail App Password** (Google Account → Security → App Passwords), not your normal account password — Gmail rejects regular passwords for SMTP.

## Connecting a different frontend
If you're pointing an existing site's form at this API instead of using `public/`, it just needs to:
- `POST` JSON to `/api/contact` with at least `name`, `email`, and `message`
- Read `response.json().success` / `.message` to show the result

Set `ALLOWED_ORIGIN` in `.env` to that frontend's deployed URL so CORS allows it (or leave `*` while developing).

## Deploying to Vercel
1. Push this repo to GitHub.
2. Import it in Vercel.
3. In **Project Settings → Environment Variables**, add every variable from `.env.example` with your real values (Vercel does not read your local `.env` file — environment variables must be set in the dashboard, or via `vercel env add`).
4. Deploy. `vercel.json` already routes `/api/*` to the serverless function in `api/index.js` and everything else to the static files in `public/`.
5. Verify with `https://<your-project>.vercel.app/api/health` and by submitting the form on the live URL.

## Security notes
- `.env` is git-ignored — never commit real SMTP credentials. Only `.env.example` (with placeholder values) belongs in the repo.
- If a real credential is ever exposed (committed, pasted somewhere, shared in a chat), rotate it immediately at the provider (e.g. regenerate the Gmail App Password) rather than just deleting it from the file.
