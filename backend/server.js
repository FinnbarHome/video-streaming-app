require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./utils/connectDB');
const validateEnv = require('./utils/validateEnv'); 
const mongoose = require('mongoose');


// Validate required environment variables
validateEnv(['PORT', 'MONGO_URI']);

// Initialize Express app
const app = express();

// Middleware
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes
    max: 250, // Limit each IP to 250 requests
    message: "Too many requests, please try again later.",
});

app.use(limiter); // Apply rate limiting
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON requests
app.use(compression()); // Compress responses
app.use(morgan('combined')); // HTTP request logger

// Routes
app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/health', async (req, res) => {
    const dbState = mongoose.connection.readyState; // 1 = connected, 0 = disconnected
    res.status(200).json({
        message: "API is running",
        database: dbState === 1 ? "connected" : "disconnected",
    });
});

// Error Handling
app.use((req, res, next) => {
    res.status(404).json({ error: "Resource not found" });
});

app.use((error, req, res, next) => {
    console.error("ERROR:", error.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start server and connect to database
if (require.main === module) {
    connectDB().then(() => {
        const PORT = process.env.PORT || 3000;
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
    }).catch((error) => {
        console.error("ERROR: Database connection failed:", error);
        process.exit(1);
    });
}

module.exports = app; // Export app for testing
