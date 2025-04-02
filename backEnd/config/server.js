require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('../routes/authRoutes');
const prescriptionRoutes = require('../routes/prescriptionRoutes');
const { connectDB } = require('../config/db'); 
const PrescriptionController = require('../controllers/prescriptionController');

const app = express();

// Middleware
// In your backend (app.js or server.js)
app.use(cors({
  origin: process.env.FRONTEND_BASE_URL,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 600
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.use('/auth', authRoutes);
app.use('/', prescriptionRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});