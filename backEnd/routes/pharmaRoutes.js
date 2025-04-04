const express = require('express');
const router = express.Router();
const PharmacistController = require('../controllers/pharmacistController');


//const PharmacistController = require('./controllers/PharmacistController');
router.get('/veripatient', PharmacistController.veripatient);

module.exports = router;