# Go Chaincode/Smartcontract for UmodziRx

## Overview 
This is a Go Chaincode for UmodziRx, a blockchain-based platform for managing medical supplies. The chaincode facilitates secure storage and retrieval of prescription data on a permissioned blockchain network.

## Features
- Role-based Access Control. Only authorized users can access and modify prescription data. 
    - Only doctors can issue prescriptions.
    - Only pharmacists can view dispense prescriptions.
    - Doctors may not issue prescriptions to themselves
- Secure data storage. Prescription data is encrypted and stored on the blockchain.

## Prequisites
- go 1.24.1 or later
- Hyperledger Fabric 2.5 or later
- Docker 27.5.1 or later
- Docker Compose v2.32.4 or later

## Installation
1. Clone the repository: git pull https://github.com/Bsc-com-ne-23-20/UmodziRx.git
2. Navigate to the chaincode directory: cd UmodziRx/fabricNetwork/chaincode-go
3. Resolve dependencies: go mod download
4. Build the chaincode: go build -o mychaincode.bin
    - Note: The chaincode binary will be generated in the same directory.
    - 'mychaincode' is the name of the chaincode binary, you can change it as per your requirement.