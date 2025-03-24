const express = require('express');
const PrescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

// POST: Create a prescription
router.post('/', PrescriptionController.createPrescription);

// GET: Retrieve a prescription by patientId (query param)
router.get('/', PrescriptionController.getPrescription); //
module.exports = router;

