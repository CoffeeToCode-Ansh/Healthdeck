const path = require('path');
const express = require('express');
const app = require('./api/index');

const PORT = process.env.PORT || 5000;

// In local development, also serve static files (HTML, CSS, JS)
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));
app.use(express.static(__dirname)); // Also allows files kept in root

app.listen(PORT, () => {
  console.log(`========================================`);
  console.log(`  Health Deck Server running on port ${PORT}`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  API Route:   http://localhost:${PORT}/api/contact`);
  console.log(`  Health:      http://localhost:${PORT}/api/health`);
  console.log(`========================================`);
});