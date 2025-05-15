const express = require('express');
const PrescriptionController = require('../controllers/prescriptionController');
const router = express.Router();

// POST: Create a prescription
router.post('/prescriptions', PrescriptionController.createPrescription);

// GET: Retrieve a prescription by patientId (query param)
router.get('/prescriptions', PrescriptionController.getPrescription);

// GET: Verify patient
router.get('/verifypatient', PrescriptionController.verifypatient);

// GET: Retrieve doctor statistics
router.get('/statistics', PrescriptionController.getStatistics);

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

