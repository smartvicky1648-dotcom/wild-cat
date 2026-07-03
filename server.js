const express = require('express');
const cors = require('cors');
const path = require('path');
const whatsappRoutes = require('./routes/whatsapp');
const { initializeWhatsApp } = require('./services/whatsappService');
const { initializeScheduler } = require('./services/scheduler');

const app = express();
const PORT = process.env.PORT || 3001;

// Global error handlers to prevent Puppeteer/WhatsApp crashes from killing the server
process.on('uncaughtException', (err) => {
    console.error('CRITICAL: Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/whatsapp', whatsappRoutes);

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    
    // Initialize services
    initializeWhatsApp();
    initializeScheduler();
});
