const axios = require('axios');
const { URLSearchParams } = require('url');

class PrescriptionController {
  static async createPrescription(req, res) {
    const { patientId, doctorId, patientName, prescriptions } = req.body;

    // Validate request
    if (!patientId || !doctorId || !patientName || !prescriptions) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: { patientId, doctorId, patientName, prescriptions }
      });
    }

    try {
      // Prepare blockchain request
      const requestData = new URLSearchParams();
      requestData.append('channelid', 'mychannel');
      requestData.append('chaincodeid', 'basic');
      requestData.append('function', 'CreateAsset');
      requestData.append('args', patientId);
      requestData.append('args', doctorId);
      requestData.append('args', patientName);
      requestData.append('args', JSON.stringify(prescriptions.map(p => ({
        MedicationName: p.medicationName || p.medication || 'Unknown',
        Dosage: p.dosage,
        Instructions: p.instructions,
        DoctorId: doctorId
      }))));

      // Send to blockchain
      const blockchainResponse = await axios.post(
        'http://localhost:45000/invoke', 
        requestData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      // Return formatted response
      res.status(201).json({
        success: true,
        message: 'Prescription created successfully',
        data: {
          id: patientId,
          doctorId,
          patientId,
          patientName,
          prescriptions: prescriptions.map(p => ({
            medicationName: p.medicationName || p.medication || 'Unknown',
            dosage: p.dosage,
            instructions: p.instructions
          })),
          txId: blockchainResponse.data.txId,
          createdAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error:', error.response?.data || error.message);
      res.status(500).json({ 
        error: 'Failed to create prescription',
        details: error.response?.data || error.message
      });
    }
  }

  static async getPrescription(req, res) {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ error: "Patient ID is required" });
    }

    try {
      // Query blockchain
      const response = await axios.get("http://localhost:45000/query", {
        params: {
          channelid: "mychannel",
          chaincodeid: "basic",
          function: "GetAssetHistory",
          args: patientId,
        },
      });

      // Check if response contains valid data
      if (!response.data || response.data.error) {
        return res.status(404).json({
          success: false,
          error: "Prescription not found",
        });
      }

      let rawData = response.data;

      // If response is a string starting with "Response: ", extract the JSON part
      if (typeof rawData === "string" && rawData.startsWith("Response: ")) {
        rawData = rawData.replace("Response: ", "").trim();
      }

      let historyData;
      try {
        historyData = JSON.parse(rawData); // Attempt JSON parsing
      } catch (err) {
        return res.status(500).json({
          success: false,
          error: "Failed to parse blockchain response",
          details: err.message,
        });
      }

      // Validate that historyData is an array
      if (!Array.isArray(historyData)) {
        return res.status(500).json({
          success: false,
          error: "Unexpected response format from blockchain",
        });
      }

      // Process prescription history
      const prescriptionsForPatient = [];
      historyData.forEach(entry => {
        if (entry.patientId === patientId && entry.prescriptions) {
          entry.prescriptions.forEach(prescription => {
            prescriptionsForPatient.push({
              medicationName: prescription.MedicationName || "Unknown",
              dosage: prescription.Dosage || "N/A",
              instructions: prescription.Instructions || "N/A",
              doctorId: prescription.DoctorId || "N/A",
              timestamp: prescription.Timestamp ? 
                new Date(prescription.Timestamp.seconds * 1000).toISOString() : 
                new Date().toISOString(),
            });
          });
        }
      });

      if (prescriptionsForPatient.length === 0) {
        return res.status(404).json({
          success: false,
          error: "No valid prescription found",
        });
      }

      // Format the response
      const formattedData = {
        patientId: patientId,
        patientName: historyData[0]?.patientName || "N/A",
        prescriptions: prescriptionsForPatient,
      };

      return res.status(200).json({
        success: true,
        data: formattedData,
      });
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      return res.status(500).json({
        success: false,
        error: "Failed to retrieve prescription",
        details: error.response?.data || error.message,
      });
    }
  }
}

module.exports = PrescriptionController;