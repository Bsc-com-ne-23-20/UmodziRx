const express = require('express');
const PatientController = require('../controllers/patientController');

const router = express.Router();

// Patient prescription routes
router.get('/prescriptions', PatientController.getPrescriptions);

module.exports = router;
