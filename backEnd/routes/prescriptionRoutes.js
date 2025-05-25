const express = require('express');
const PrescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

// POST: Create a prescription
router.post('/prescriptions', PrescriptionController.createPrescription);

// GET: Retrieve a prescription by patientId (query param)
router.get('/prescriptions', PrescriptionController.getPrescription);

// POST: Revoke a prescription
router.post('/prescriptions/revoke', PrescriptionController.revokePrescription);

// PUT: Update a prescription
router.put('/prescriptions', PrescriptionController.updatePrescription);

// GET: Get prescription history for a doctor
router.get('/prescriptions/doctor/:doctorId', PrescriptionController.getDoctorPrescriptionHistory);

// GET: Patient verification callback
router.get('/verifypatient', PrescriptionController.verifypatient);

module.exports = router;

