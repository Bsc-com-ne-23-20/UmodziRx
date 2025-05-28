const express = require('express');
const PrescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

// POST: Issue a prescription
router.post('/prescriptions', PrescriptionController.issuePrescription);

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

// GET: Retrieve doctor statistics
router.get('/statistics', (req, res) => {
  // Placeholder: No statistics implemented yet
  res.status(501).json({
    success: false,
    error: 'Not implemented',
    details: 'Doctor statistics endpoint is not implemented in the backend.'
  });
});

// GET: Handle authentication errors
router.get('/auth/error', (req, res) => {
  const { error } = req.query;
  res.status(401).json({
    success: false,
    error: error || 'Authentication failed',
    details: 'Please try verifying the patient again'
  });
});

module.exports = router;

