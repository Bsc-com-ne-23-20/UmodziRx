// Handles prescription-related requests
// Define functions for managing prescriptions here

const Prescription = require('../models/Prescription');

class PrescriptionController {
  static async createPrescription(req, res) {
    const { patient_id, medication, dosage, instructions, ipfs_cid, metadata_hash } = req.body;
    try {
      const prescription = await Prescription.create({
        patient_id,
        medication,
        dosage,
        instructions,
        ipfs_cid,
        metadata_hash,
      });
      res.status(201).json(prescription);
    } catch (error) {
      console.error('Error creating prescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPrescription(req, res) {
    const { prescriptionId } = req.params;
    try {
      const prescription = await Prescription.findById(prescriptionId);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json(prescription);
    } catch (error) {
      console.error('Error fetching prescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updatePrescription(req, res) {
    const { prescriptionId } = req.params;
    const updateData = req.body;
    try {
      const prescription = await Prescription.update(prescriptionId, updateData);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json(prescription);
    } catch (error) {
      console.error('Error updating prescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deletePrescription(req, res) {
    const { prescriptionId } = req.params;
    try {
      const prescription = await Prescription.delete(prescriptionId);
      if (!prescription) {
        return res.status(404).json({ message: 'Prescription not found' });
      }
      res.json(prescription);
    } catch (error) {
      console.error('Error deleting prescription:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = PrescriptionController;
