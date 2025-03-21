// Prescription routes
// Define routes for managing prescriptions here

const express = require('express');
const PrescriptionController = require('../controllers/prescriptionController');

const router = express.Router();

router.post('/', PrescriptionController.createPrescription);
router.get('/:prescriptionId', PrescriptionController.getPrescription);
router.put('/:prescriptionId', PrescriptionController.updatePrescription);
router.delete('/:prescriptionId', PrescriptionController.deletePrescription);

module.exports = router;
