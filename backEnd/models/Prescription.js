const { pgClient } = require('../config/db');

class Prescription {
  static async create(prescriptionData) {
    const { patient_id, medication, dosage, instructions, ipfs_cid, metadata_hash } = prescriptionData;
    const query = `
      INSERT INTO prescriptions (patient_id, medication, dosage, instructions, ipfs_cid, metadata_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [patient_id, medication, dosage, instructions, ipfs_cid, metadata_hash];
    const result = await pgClient.query(query, values);
    return result.rows[0];
  }

  static async findById(prescriptionId) {
    const query = 'SELECT * FROM prescriptions WHERE id = $1';
    const result = await pgClient.query(query, [prescriptionId]);
    return result.rows[0];
  }

  static async findByPatientId(patientId) {
    const query = 'SELECT * FROM prescriptions WHERE patient_id = $1';
    const result = await pgClient.query(query, [patientId]);
    return result.rows;
  }

  static async update(prescriptionId, updateData) {
    const { medication, dosage, instructions, ipfs_cid, metadata_hash } = updateData;
    const query = `
      UPDATE prescriptions
      SET medication = $1, dosage = $2, instructions = $3, ipfs_cid = $4, metadata_hash = $5
      WHERE id = $6
      RETURNING *;
    `;
    const values = [medication, dosage, instructions, ipfs_cid, metadata_hash, prescriptionId];
    const result = await pgClient.query(query, values);
    return result.rows[0];
  }

  static async delete(prescriptionId) {
    const query = 'DELETE FROM prescriptions WHERE id = $1 RETURNING *';
    const result = await pgClient.query(query, [prescriptionId]);
    return result.rows[0];
  }
}

module.exports = Prescription;
