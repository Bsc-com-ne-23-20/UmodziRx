package chaincode

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-contract-api-go/v2/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

// An Asset is a prescription, with the following attributes
type Asset struct {
	DoctorId      string         `json:"DoctorId"` // issuing DoctorId
	PatientName   string         `json:"PatientName"`
	PatientId     string         `json:"PatientId"`
	DateOfBirth   string         `json:"DateOfBirth,omitempty"`
	Prescriptions []Prescription `json:"Prescriptions"`
	LastUpdated   string         `json:"LastUpdated"`
}

// Predefined Prescription structure
type Prescription struct {
	PrescriptionId string `json:"PrescriptionId"`
	PatientId      string `json:"PatientId"`
	CreatedBy      string `json:"CreatedBy"`
	MedicationName string `json:"MedicationName"`
	Dosage         string `json:"Dosage"`
	Instructions   string `json:"Instructions"`
	Status         string `json:"Status"`
	TxID           string `json:"TxID"`
	Timestamp      string `json:"Timestamp"`
	ExpiryDate     string `json:"ExpiryDate,omitempty"`
}

// Issue Prescriptions
func (s *SmartContract) IssuePrescription(
	ctx contractapi.TransactionContextInterface,
	prescriptionId string,
	patientId string,
	medicationName string,
	dosage string,
	instructions string,
	expiryDate string,
) (*Prescription, error) {

	// Obtain user's identity
	clientId, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("Failed to get user ID: %v", err)
	}

	// Obtain value of key 'role'
	role, found, err := ctx.GetClientIdentity().GetAttributeValue("role")
	if err != nil || !found {
		return nil, fmt.Errorf("Failed to get user role: %v", err)
	}

	// Ensure Doctor is not self-prescribing 
	if clientId == patientId {
		return nil, fmt.Errorf("Doctors may not prescribe medications to themselves")
	}

	// Ensure user has Doctor role
	if role != "doctor" {
		return nil, fmt.Errorf("Only doctors can issue prescriptions")
	}

	asset, err := s.ReadAsset(ctx, patientId)
	if err != nil {
		asset = &Asset{
			DoctorId:      clientId,
			PatientId:     patientId,
			PatientName:   "Unknown",
			Prescriptions: []Prescription{},
			LastUpdated:   time.Now().Format(time.RFC3339),
		}
	}

	// Create the Prescription
	prescription := Prescription{
		PrescriptionId: prescriptionId,
		PatientId:      patientId,
		MedicationName: medicationName,
		Dosage:         dosage,
		Instructions:   instructions,
		Status:         "Active",
		CreatedBy:      clientId,
		TxID:           ctx.GetStub().GetTxID(),
		Timestamp:      time.Now().Format(time.RFC3339),
		ExpiryDate:     expiryDate,
	}

	asset.Prescriptions = append(asset.Prescriptions, prescription)
	asset.LastUpdated = time.Now().Format(time.RFC3339)

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal updated asset: %v", err)
	}

	err = ctx.GetStub().PutState(patientId, assetJSON)
	if err != nil {
		return nil, fmt.Errorf("failed to put updated asset into world state: %v", err)
	}

	eventPayload := fmt.Sprintf(`{"type":"prescription_issued","patientId":"%s","prescriptionId":"%s"}`, patientId, prescriptionId)
	ctx.GetStub().SetEvent("PrescriptionIssued", []byte(eventPayload))

	return &prescription, nil
}

// Revoke issued prescriptions
func (s *SmartContract) RevokePrescription(
	ctx contractapi.TransactionContextInterface,
	patientId string,
	prescriptionId string,
) error {

	callerId, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return fmt.Errorf("failed to get caller identity: %v", err)
	}

	role, found, err := ctx.GetClientIdentity().GetAttributeValue("role")
	if err != nil || !found {
		return fmt.Errorf("failed to verify user role: %v", err)
	}

	// only doctors may revoke presriptions
	if role != "doctor" {
		return fmt.Errorf("only doctors can revoke prescriptions")
	}

	asset, err := s.ReadAsset(ctx, patientId)
	if err != nil {
		return fmt.Errorf("failed to read patient record: %v", err)
	}

	var targetPrescription *Prescription
	for i := range asset.Prescriptions {
		if asset.Prescriptions[i].PrescriptionId == prescriptionId {
			targetPrescription = &asset.Prescriptions[i]
			break
		}
	}

	if targetPrescription == nil {
		return fmt.Errorf("prescription not found")
	}

	// only active prescriptions may be revoked
	if targetPrescription.Status != "Active" {
		return fmt.Errorf("cannot revoke %s prescription", targetPrescription.Status)
	}

	if targetPrescription.CreatedBy != callerId {
		return fmt.Errorf("only prescribing doctor can revoke")
	}

	targetPrescription.Status = "Revoked"
	targetPrescription.TxID = ctx.GetStub().GetTxID()
	targetPrescription.Timestamp = time.Now().Format(time.RFC3339)
	asset.LastUpdated = time.Now().Format(time.RFC3339)

	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return fmt.Errorf("failed to marshal asset: %v", err)
	}

	if err := ctx.GetStub().PutState(patientId, assetJSON); err != nil {
		return fmt.Errorf("failed to update patient record: %v", err)

	}

	eventPayload := fmt.Sprintf(`{"type":"prescription_revoked","patientId":"%s","prescriptionId":"%s"}`,
		patientId, prescriptionId)
	ctx.GetStub().SetEvent("PrescriptionRevoked", []byte(eventPayload))

	return nil
}

func (s *SmartContract) GetMyPrescriptions(ctx contractapi.TransactionContextInterface) ([]Prescription, error) {
	patientId, err := ctx.GetClientIdentity().GetID()
	if err != nil {
		return nil, fmt.Errorf("failed to get patient ID: %v", err)
	}

	// if role, _ := s.GetUserRole(ctx); role != "patient" {
	// 	return nil, fmt.Errorf("only patients can access their prescriptions")
	// }

	asset, err := s.ReadAsset(ctx, patientId)
	if err != nil {
		return nil, err
	}


	// Retrieve all prescriptions
	prescriptions := make([]Prescription, len(asset.Prescriptions))
	copy(prescriptions, asset.Prescriptions)
	return prescriptions, nil

}

func (s *SmartContract) FillPrescription(
    ctx contractapi.TransactionContextInterface,
    patientId string,
    prescriptionId string,
) (*Prescription, error) {
	
    // 1. Verify caller is pharmacist
    if role, _ := s.GetUserRole(ctx); role != "pharmacist" {
        return nil, fmt.Errorf("only pharmacists can fill prescriptions")
    }

    // 2. Get patient record
    asset, err := s.ReadAsset(ctx, patientId)
    if err != nil {
        return nil, err
    }

    // 3. Find the prescription
    var targetRx *Prescription
    for i := range asset.Prescriptions {
        if asset.Prescriptions[i].PrescriptionId == prescriptionId {
            targetRx = &asset.Prescriptions[i]
            break
        }
    }

    if targetRx == nil {
        return nil, fmt.Errorf("prescription not found")
    }

    // 4. Validate prescription state
    switch targetRx.Status {
    case "Revoked":
        return nil, fmt.Errorf("cannot fill revoked prescription")
    case "Filled":
        return nil, fmt.Errorf("prescription already filled")
    case "Expired":
        return nil, fmt.Errorf("cannot fill expired prescription")
    case "Active":
        // Proceed to check expiry date
    default:
        return nil, fmt.Errorf("invalid prescription status: %s", targetRx.Status)
    }

    // 5. Check expiry date
    expiry, err := time.Parse("2006-01-02", targetRx.ExpiryDate)
    if err != nil {
        return nil, fmt.Errorf("invalid expiry date format")
    }
    if time.Now().After(expiry) {
        targetRx.Status = "Expired" // Auto-update status
        return nil, fmt.Errorf("cannot fill expired prescription")
    }

    // 6. Update prescription
    targetRx.Status = "Filled"
    targetRx.TxID = ctx.GetStub().GetTxID()
    targetRx.Timestamp = time.Now().Format(time.RFC3339)
    asset.LastUpdated = targetRx.Timestamp

    // 7. Save changes
    assetJSON, err := json.Marshal(asset)
    if err != nil {
        return nil, fmt.Errorf("failed to marshal asset: %v", err)
    }
    if err := ctx.GetStub().PutState(patientId, assetJSON); err != nil {
        return nil, fmt.Errorf("failed to update patient record: %v", err)
    }

    return targetRx, nil
}


func (s *SmartContract) ReadAsset(ctx contractapi.TransactionContextInterface, patientId string) (*Asset, error) {
	assetJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)

	}
	if assetJSON == nil {
		return nil, fmt.Errorf("the asset %s does not exist", patientId)
	}

	var asset Asset
	if err := json.Unmarshal(assetJSON, &asset); err != nil {
		return nil, err
	}

	return &asset, nil
}

func (s *SmartContract) AssetExists(ctx contractapi.TransactionContextInterface, patientId string) (bool, error) {
	assetJSON, err := ctx.GetStub().GetState(patientId)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}
	return assetJSON != nil, nil
}

func (s *SmartContract) GetUserRole(ctx contractapi.TransactionContextInterface) (string, error) {
	clientIdentity := ctx.GetClientIdentity()
	role, found, err := clientIdentity.GetAttributeValue("role")
	if err != nil || !found {
		return "", fmt.Errorf("failed to get user's role attribute")
	}
	return role, nil
}

func (s *SmartContract) GetPrescriptionHistory(
	ctx contractapi.TransactionContextInterface,
	patientId string,
	medicationName string,
) ([]*Prescription, error) {
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
		return nil, fmt.Errorf("no prescription found for medication %s", medicationName)
	}
	return prescriptionHistory, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		fmt.Printf("Error creating prescription chaincode: %v", err)
		return


	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting prescription chaincode: %v", err)
	}
}

