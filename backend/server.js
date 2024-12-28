require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Initialize Express app
const app = express();

// Middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 250, // Limit each IP to 250 requests
    message: "Too many requests, please try again later.",
});

app.use(limiter); // Apply rate limiting to all requests
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests
app.use(compression()); // Compress responses
app.use(morgan('combined')); // HTTP request logger

// Environment variable validation
const requiredEnvVars = ['PORT', 'MONGO_URI'];
requiredEnvVars.forEach((key) => {
    if (!process.env[key]) {
        console.error(`ERROR: ${key} not specified in .env`);
        process.exit(1);
    }
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Database connection failed:', err);
        throw err;
    }
};

// Routes
app.get('/', (req, res) => {
    res.send("Hello World!");
});

// Error handling
app.use((req, res, next) => {
    res.status(404).json({ error: "Resource not found" }); // 404 handler
});

app.use((error, req, res, next) => {
    console.error("ERROR:", error.stack);
    res.status(500).json({ error: "Internal Server Error" }); // Global error handler
});

// Graceful shutdown
const gracefulShutdown = (signal, server) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    mongoose.connection.close(() => {
        console.log('Database connection closed.');
        server.close(() => {
            console.log('Closed remaining connections.');
            process.exit(0);
        });
    });
};

// Start server and connect to database
if (require.main === module) {
    connectDB()
        .then(() => {
            const PORT = process.env.PORT || 3000;
            const server = app.listen(PORT, () => {
                console.log(`API server listening on port ${PORT}!`);
            });

            process.on('SIGINT', () => gracefulShutdown('SIGINT', server));
            process.on('SIGTERM', () => gracefulShutdown('SIGTERM', server));
        })
        .catch((error) => {
            console.error("ERROR: Database connection failed", error);
            process.exit(1);
        });
}

module.exports = app; // Export app for testing or reuse
