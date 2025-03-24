package chaincode

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

// Asset represents an asset that includes doctor's prescription information
type Asset struct {
	DoctorId     string         `json:"DoctorId"`
	PatientName  string         `json:"PatientName"`
	PatientId    string         `json:"PatientId"`
	Prescriptions []Prescription `json:"Prescriptions"` // Array of prescriptions
}

// Prescription represents a medication prescription
type Prescription struct {
	MedicationName string `json:"MedicationName"`
	Dosage         string `json:"Dosage"`
	Instructions   string `json:"Instructions"`
	Status         string `json:"Status"` // Prescription status (e.g., "issued", "dispensed")
	TxID           string `json:"TxID"`   // Transaction ID
	Timestamp      string `json:"Timestamp"` // Timestamp of the transaction
}

// InitLedger adds a base set of assets to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	// Define a sample asset with a list of prescriptions
	assets := []Asset{
		{
			DoctorId:    "doctor1",
			PatientName: "John Doe",
			PatientId:   "patient1",
			Prescriptions: []Prescription{
				{"Aspirin", "100mg", "Take once daily with food.", "issued", "", ""},
				{"Ibuprofen", "200mg", "Take as needed for pain.", "issued", "", ""},
			},
		},
		{
			DoctorId:    "doctor2",
			PatientName: "Jane Smith",
			PatientId:   "patient2",
			Prescriptions: []Prescription{
				{"Amoxicillin", "500mg", "Take 1 capsule every 8 hours.", "issued", "", ""},
			},
		},
	}

	// Store assets in the ledger
	for _, asset := range assets {
		assetJSON, err := json.Marshal(asset)
		if err != nil {
			return err
		}

		err = ctx.GetStub().PutState(asset.PatientId, assetJSON)
		if err != nil {
			return fmt.Errorf("failed to put to world state. %v", err)
		}
	}

	return nil
}

// beforeTransaction is a hook for validation before a transaction.
func (s *SmartContract) beforeTransaction(ctx contractapi.TransactionContextInterface) error {
	// Example: Ensure only doctors can issue prescriptions
	// userRole, err := s.GetUserRole(ctx)
	// if err != nil {
	// 	return err
	// }
	// if userRole != "doctor" {
	// 	return fmt.Errorf("only a doctor can issue prescriptions")
	// }
	return nil
}

// afterTransaction is a hook for logging after a transaction.
func (s *SmartContract) afterTransaction(ctx contractapi.TransactionContextInterface) error {
	// Example: Log the transaction or send notifications.
	return nil
}

// CreateAsset issues a new asset to the world state with given details.
func (s *SmartContract) CreateAsset(ctx contractapi.TransactionContextInterface, patientId string, doctorId string, patientName string, prescriptions []Prescription) error {
	userRole, err := s.GetUserRole(ctx)
	if err != nil {
		return err
	}
	if userRole != "doctor" {
		return fmt.Errorf("only a doctor can issue prescriptions")

	// Create new asset (prescription)
	asset := Asset{
		DoctorId:    doctorId,
		PatientName: patientName,
		PatientId:   patientId,
		Prescriptions: prescriptions,
	}

	// Save asset in world state
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(patientId, assetJSON)
}

// ReadAsset returns the asset stored in the world state with given patientId.
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, patientId string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", patientId)
	}

	var asset Asset
	err = json.Unmarshal(assetJSON, &asset)
	if err != nil {
		return nil, err
	}

	return &asset, nil
}

// UpdateAsset updates an existing asset in the world state with provided parameters.
func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, patientId string, doctorId string, patientName string, prescriptions []Prescription) error {
	// Check if asset exists
	exists, err := s.AssetExists(ctx, patientId)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the asset %s does not exist", patientId)
	}

	// Update prescription status
	for i := range prescriptions {
		if prescriptions[i].Status == "issued" {
			prescriptions[i].Status = "dispensed"
		}
	}

	// Add the transaction ID and timestamp to each prescription
	txID := ctx.GetStub().GetTxID()
	timestamp := time.Now().Format(time.RFC3339)
	for i := range prescriptions {
		prescriptions[i].TxID = txID
		prescriptions[i].Timestamp = timestamp
	}

	// Update asset details
	asset := Asset{
		DoctorId:    doctorId,
		PatientName: patientName,
		PatientId:   patientId,
		Prescriptions: prescriptions,
	}

	// Save updated asset in world state
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(patientId, assetJSON)
}

// DeleteAsset deletes an asset from the world state.
func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, patientId string) error {
	// Check if asset exists
	exists, err := s.AssetExists(ctx, patientId)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the asset %s does not exist", patientId)
	}

	// Delete asset from world state
	return ctx.GetStub().DelState(patientId)
}

// AssetExists checks if the asset exists in the world state.
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, patientId string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return assetJSON != nil, nil
}

// GetPrescriptionHistory retrieves the history of a prescription.
func (s *SmartContract) GetPrescriptionHistory(ctx contractapi.TransactionContextInterface, prescriptionId string) ([]*Prescription, error) {
	resultsIterator, err := ctx.GetStub().GetHistoryForKey(prescriptionId)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var prescriptions []*Prescription
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var prescription Prescription
		err = json.Unmarshal(queryResponse.Value, &prescription)
		if err != nil {
			return nil, err
		}
		prescriptions = append(prescriptions, &prescription)
	}

	return prescriptions, nil
}

// GetUserRole retrieves the current user's role from their attributes
func (s *SmartContract) GetUserRole(ctx contractapi.TransactionContextInterface) (string, error) {
	// Retrieve the current user's identity
	clientIdentity := ctx.GetClientIdentity()

	// Get the attribute for the role (assuming "role" attribute is stored in the user's certificate)
	role, found, err := clientIdentity.GetAttributeValue("role")
	if err != nil {
		return "", fmt.Errorf("failed to get role attribute: %v", err)
	}
	if !found {
		return "", fmt.Errorf("role attribute not found")
	}

	// Return the role
	return role, nil
}
