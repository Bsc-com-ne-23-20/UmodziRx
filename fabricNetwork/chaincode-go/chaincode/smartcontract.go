package chaincode

import (
	"encoding/json"
	"fmt"
	"time"
	"strings"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

type Asset struct {
	DoctorId      string         `json:"DoctorId"`
	PatientName   string         `json:"PatientName"`
	PatientId     string         `json:"PatientId"`
	Prescriptions []Prescription `json:"Prescriptions"`
}

type Prescription struct {
	PrescriptionId string `json:"PrescriptionId"`
	PatientId      string `json:"PatientId"`
	DrugDetails    string `json:"DrugDetails"`
	CreatedBy      string `json:"CreatedBy"`
	MedicationName string `json:"MedicationName"`
	Dosage         string `json:"Dosage"`
	Instructions   string `json:"Instructions"`
	Status         string `json:"Status"`
	TxID           string `json:"TxID"`
	Timestamp      string `json:"Timestamp"`
}

// InitLedger adds dummy patient assets to the ledger - or demonstration purposes

// func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
// 	patients := []Asset{
// 		{DoctorId: "doc1", PatientName: "Alice Johnson", PatientId: "pat1", Prescriptions: []Prescription{}},
// 		{DoctorId: "doc2", PatientName: "Bob Smith", PatientId: "pat2", Prescriptions: []Prescription{}},
// 		{DoctorId: "doc3", PatientName: "Charlie Brown", PatientId: "pat3", Prescriptions: []Prescription{}},
// 	}

// 	for _, patient := range patients {
// 		patientJSON, err := json.Marshal(patient)
// 		if err != nil {
// 			return fmt.Errorf("failed to marshal patient: %v", err)
// 		}
// 		err = ctx.GetStub().PutState(patient.PatientId, patientJSON)
// 		if err != nil {
// 			return fmt.Errorf("failed to put patient into world state: %v", err)
// 		}
// 	}

// 	return nil
// }


// MakePrescription creates a prescription and stores it in the ledger
func (s *SmartContract) issuePrescription(ctx contractapi.TransactionContextInterface, prescriptionId string, patientId string, medicationName string, dosage string, instructions string) (*Prescription, error) {
	
	// Get the client(User) ID
	clientId, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get user ID: %v", err)
	}

	// Get the client role
	role, found, err := ctx.GetClientIdentity().GetAttributeValue("role")
	if err != nil || !found {
		return nil, fmt.Errorf("failed to get user role: %v", err)
	}

	// Check if the client is authorized - only doctors are authorized to issue prescriptions
	if strings.ToLower(role) != "doctor" {
		return nil, fmt.Errorf("Unauthorized User: Only doctors can issue prescriptions.")
	}

	// Create the prescription
	prescription := Prescription{
		PrescriptionId: prescriptionId,
		PatientId:      patientId,
		MedicationName: medicationName,
		Dosage:         dosage,
		Instructions:   instructions,
		Status:         "Active", // Prescriptions start as active
		CreatedBy:      clientId,
		TxID:           ctx.GetStub().GetTxID(),
		Timestamp:      time.Now().Format(time.RFC3339),
	}

	// Get existing asset (patient data)
	asset, err := s.ReadAsset(ctx, patientId)
	if err != nil {
		return nil, err
	}

	// Add the new prescription to the asset's list
	asset.Prescriptions = append(asset.Prescriptions, prescription)

	// Update the asset with the new prescription
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal updated asset: %v", err)
	}

	err = ctx.GetStub().PutState(patientId, assetJSON)
	if err != nil {
		return nil, fmt.Errorf("failed to put updated asset into world state: %v", err)
	}

	return &prescription, nil
}

// ReadAsset reads the asset from the ledger
func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, patientId string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return nil, fmt.Errorf("Failed to read from world state: %v", err)
	}
	if assetJSON == nil {
		return nil, fmt.Errorf("The asset %s does not exist", patientId)
	}
	var asset Asset
	if err := json.Unmarshal(assetJSON, &asset); err != nil {
		return nil, err
	}
	return &asset, nil
}

// UpdateAsset updates an existing asset with new data
func (s *SmartContract) UpdateAsset(ctx contractapi.TransactionContextInterface, patientId string, doctorId string, patientName string, prescriptionsJSON string) error {
	exists, err := s.AssetExists(ctx, patientId)
	if err != nil || !exists {
		return fmt.Errorf("The user %s does not exist", patientId)
	}
	var prescriptions []Prescription
	if err := json.Unmarshal([]byte(prescriptionsJSON), &prescriptions); err != nil {
		return fmt.Errorf("Failed to parse prescriptions JSON: %v", err)
	}
	txID := ctx.GetStub().GetTxID()
	timestamp := time.Now().Format(time.RFC3339)
	for i := range prescriptions {
		prescriptions[i].TxID = txID
		prescriptions[i].Timestamp = timestamp
	}
	asset := Asset{DoctorId: doctorId, PatientName: patientName, PatientId: patientId, Prescriptions: prescriptions}
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}
	return ctx.GetStub().PutState(patientId, assetJSON)
}

// DeleteAsset deletes an asset from the ledger
func (s *SmartContract) DeleteAsset(ctx contractapi.TransactionContextInterface, patientId string) error {
	exists, err := s.AssetExists(ctx, patientId)
	if err != nil || !exists {
		return fmt.Errorf("The asset %s does not exist", patientId)
	}
	return ctx.GetStub().DelState(patientId)
}

// AssetExists checks if an asset exists in the ledger
func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, patientId string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return false, fmt.Errorf("Failed to read from world state: %v", err)
	}
	return assetJSON != nil, nil
}

// GetPrescriptionHistory retrieves the prescription history for a specific medication
func (s *SmartContract) GetPrescriptionHistory(ctx contractapi.TransactionContextInterface, patientId string, medicationName string) ([]*Prescription, error) {
	asset, err := s.ReadAsset(ctx, patientId)
	if err != nil {
		return nil, err
	}
	var prescriptionHistory []*Prescription
	for _, prescription := range asset.Prescriptions {
		if prescription.MedicationName == medicationName {
			prescriptionHistory = append(prescriptionHistory, &prescription)
		}
	}
	if len(prescriptionHistory) == 0 {
		return nil, fmt.Errorf("No prescription found for medication %s", medicationName)
	}
	return prescriptionHistory, nil
}

// GetUserRole retrieves the role of the current user
func (s *SmartContract) GetUserRole(ctx contractapi.TransactionContextInterface) (string, error) {
	clientIdentity := ctx.GetClientIdentity()
	role, found, err := clientIdentity.GetAttributeValue("role")
	if err != nil || !found {
		return "", fmt.Errorf("Failed to get user's role attribute")
	}
	return role, nil
}