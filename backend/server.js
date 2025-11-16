require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { sequelize } = require('./database/connection');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use(morgan('combined'));

// Routes
app.use('/api/auth', require('./api/auth'));
app.use('/api/users', require('./api/users'));
app.use('/api/symptoms', require('./api/symptoms'));
app.use('/api/chat', require('./api/chat'));
app.use('/api/ml', require('./api/ml'));
app.use('/api/community', require('./api/community'));
app.use('/api/posts', require('./api/posts'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    
    // Sync database (use { force: true } only in development)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database synced.');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
}

startServer();

module.exports = app;

