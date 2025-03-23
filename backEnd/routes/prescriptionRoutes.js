const express = require('express');
const PrescriptionController = require('../controllers/prescriptionController');

const router = express.Router();

// POST: Create a prescription
router.post('/', PrescriptionController.createPrescription);

// GET: Retrieve a prescription by ID
router.get('/:prescriptionId', PrescriptionController.getPrescription);


module.exports = router;
