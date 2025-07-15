const express = require('express');
const cors = require('cors');
const path = require('path');

// Import API routes and middleware
const apiRoutes = require('./api/routes');
const errorHandler = require('./api/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist')); // Serve the built React app

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Guidelines: http://localhost:${PORT}/api/guidelines`);
  console.log(`🤖 Moderation: http://localhost:${PORT}/api/moderate`);
}); 