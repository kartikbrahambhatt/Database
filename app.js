const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./Routes/userroutes');

require('dotenv').config();

const app = express();

// CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://user-dashboard-iota-eight.vercel.app',
    'https://database-bg72.onrender.com'
  ],
  credentials: true,
}));

// Cross-Origin-Opener-Policy
app.use((req, res, next) => {
  res.setHeader(
    'Cross-Origin-Opener-Policy',
    'same-origin-allow-popups'
  );
  next();
});

// Middleware
app.use(express.json());

// Static uploads folder
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
}

// API Routes
app.use('/api', userRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Hello from backend');
});

// Server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});