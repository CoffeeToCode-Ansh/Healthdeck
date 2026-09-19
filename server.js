const path = require('path');
const express = require('express');
const apiApp = require('./api/index'); // defines /api/contact, /api/health, its own catch-all 404 + error handler

const app = express();
const PORT = process.env.PORT || 5000;

// IMPORTANT: static files are served FIRST. If this were reversed — mounting static
// after requiring api/index.js and reusing that same app instance — every request
// would hit api/index.js's catch-all 404 handler before ever reaching a real file,
// including GET /, which is exactly why the homepage wasn't showing.
app.use(express.static(path.join(__dirname, 'public')));

// Anything not matched by a static file (this covers every /api/* route) falls through here.
app.use(apiApp);

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  Health Deck Server running on port ${PORT}`);
  console.log(`  Homepage:    http://localhost:${PORT}`);
  console.log(`  Dashboard:   http://localhost:${PORT}/patient-dashboard.html`);
  console.log(`  API Route:   http://localhost:${PORT}/api/contact`);
  console.log(`  Health:      http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});
