require('dotenv').config(); // Load environment variables.
const express = require('express');
const cors = require("cors");  // Import CORS
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { pgClient, couch } = require('./db');

const app = express();  // Initialize app FIRST

// Middleware
app.use(cors());  // Now apply CORS middleware AFTER initializing app
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import routes
const authRoutes = require('../routes/authRoutes');
const patientRoutes = require('../routes/patientRoutes');
const prescriptionRoutes = require('../routes/prescriptionRoutes');

// Routes
app.use('/auth', authRoutes);
app.use('/patients', patientRoutes);
app.use('/prescriptions', prescriptionRoutes);

app.get('/', (req, res) => {
  res.send('UmodziRx Backend is running');
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
