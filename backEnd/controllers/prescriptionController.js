const axios = require('axios');

class PrescriptionController {
  static async createPrescription(req, res) {
    const { doctor_id, patient_id, medications } = req.body;

    // Validate the medications array
    if (!medications || !Array.isArray(medications)) {
        return res.status(400).json({ message: 'Invalid medications data' });
    }

    try {
        // Prepare the arguments for the blockchain transaction
        const args = [
            `pres-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Unique Prescription ID
            doctor_id,
            patient_id,
            JSON.stringify(medications), // Send all medications as a JSON string
            "24" ,// Example additional argument
            "additionalArg1" ,// Placeholder for the 6th argument
            "additionalArg2"  // Placeholder for the 7th argument
        ];

        const requestData = {
            headers: {
                type: "SendTransaction",
                signer: "user1",
                channel: "default-channel",
                chaincode: "chaincode_js"
            },
            func: "issuePrescription",
            args: args,
            init: false
        };

        // Send the transaction to the blockchain
        const response = await axios.post(
            'https://u0zy6vfzce-u0xgnn6gvm-connect.us0-aws-ws.kaleido.io/transactions',
            requestData,
            {
                headers: {
                    'accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic dTBkNjkyZ3hmaTpCb2tqQ3JreXIzNk1qZnowZDc4WkIyWmx5RGRDejdaczk1UDhIYnBQdzNF'
                }
            }
        );

        res.status(201).json({
            message: 'Prescription created successfully on blockchain',
            data: response.data
        });
    } catch (error) {
        console.error('Error creating prescription:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to create prescription' });
    }
  }

  static async getPrescription(req, res) {
    try {
        const response = await axios.get(
            'https://u0zy6vfzce-u0xgnn6gvm-connect.us0-aws-ws.kaleido.io/transactions/b4859309cd0da161b96be016aa06ba49eb61f5bb016d8dac72b8c212e2f9e2fc?fly-channel=default-channel&fly-signer=user1',
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Basic  dTBkNjkyZ3hmaTpSV1ZOUGI1LUhkNnZZRzJYX2xidGx3djNPUTlmMDRiRGxfT0VpeGZ2bHZR'
                }
            }
        );

        // Log the response before returning
        console.log("Prescription Response:", JSON.stringify(response.data, null, 2));

        // Send the response
        res.json({ message: 'Prescription retrieved successfully', data: response.data });
    } catch (error) {
        console.error('Error fetching prescription:', error.response ? error.response.data : error.message);

        res.status(500).json({ 
            message: 'Failed to retrieve prescription', 
            error: error.response ? error.response.data : error.message
        });
    }
}

}


module.exports = PrescriptionController;