const Patient = require('../models/Patient');

class PatientController {
  static async getPrescriptions(req, res) {
    const { mosip_id_hash } = req.params;
    try {
      const prescriptions = await Patient.getPrescriptions(mosip_id_hash);
      res.json(prescriptions);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = PatientController;
