const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const hotelRouter = require('./routes/hotels');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies
app.use('/api/auth', authRouter)
app.use('/api/hotels', hotelRouter)

// Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});