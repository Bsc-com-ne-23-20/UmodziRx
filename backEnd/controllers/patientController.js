const axios = require('axios');

class PatientController {
  static async getPrescriptions(req, res) {
    const { patientId } = req.query;

    if (!patientId) {
      return res.status(400).json({ 
        error: "Patient ID is required" 
      });
    }

    try {
      // Query blockchain
      const response = await axios.get(`${process.env.BLOCKCHAIN_API_URL}/query`, {
        params: {
          channelid: process.env.CHANNEL_ID,
          chaincodeid: process.env.CHAINCODE_ID,
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
        historyData = JSON.parse(rawData);
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
      let patientName = "N/A";
      
      historyData.forEach(entry => {
        if (entry.patientId === patientId) {
          patientName = entry.patientName || patientName;
          
          if (entry.prescriptions) {
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
        }
      });

      // Format the response
      const formattedData = {
        patientId,
        patientName,
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
        error: "Failed to retrieve prescriptions",
        details: error.response?.data || error.message,
      });
    }
  }

  
}



module.exports = PatientController;