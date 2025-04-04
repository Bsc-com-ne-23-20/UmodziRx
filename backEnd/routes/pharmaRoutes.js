const express = require('express');
const router = express.Router();
const PharmacistController = require('../controllers/pharmacistController');


//const PharmacistController = require('./controllers/PharmacistController');
router.get('/veripatient', PharmacistController.veripatient);

// Prescription management routes
router.get('/prescriptions', PharmacistController.getPrescriptions);
router.post('/dispense',  PharmacistController.dispenseMedication);

module.exports = router;