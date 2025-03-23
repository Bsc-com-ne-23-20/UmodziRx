const express = require('express');
const PatientController = require('../controllers/patientController');

const router = express.Router();

router.get('/:mosip_id_hash/prescriptions', PatientController.getPrescriptions);

module.exports = router;
