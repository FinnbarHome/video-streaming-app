require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./utils/connectDB');
const mongoose = require('mongoose');
const passport = require('passport');
require('./config/passport'); // Passport config

// Import your route files
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');

// Initialize Express app
const app = express();


console.log('Hi Mike Crabb!!!!!');


// Middleware
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 250, // Limit each IP to 250 requests
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(morgan('combined'));


// Initialize Passport
app.use(passport.initialize());

// Connect to MongoDB Atlas
if (require.main === module) {
  connectDB();
}

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', async (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected, 0 = disconnected
  res.status(200).json({
    message: 'API is running',
    database: dbState === 1 ? 'connected' : 'disconnected',
  });
});

// Add user routes (register, login, watchlist, history)
app.use('/api/users', userRoutes);

// Add video routes
app.use('/api/videos', videoRoutes);

// Error Handling
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

app.use((error, req, res, next) => {
  console.error('ERROR:', error.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
if (require.main === module) {
  const PORT = process.env.PORT;
  const server = app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}!`);
  });

  // Graceful Shutdown
  const shutdown = async (signal) => {
    console.log(`Received ${signal}. Closing server...`);
    await mongoose.connection.close();
    console.log('Database connection closed.');
    server.close(() => {
      console.log('Server shut down.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

module.exports = app;
