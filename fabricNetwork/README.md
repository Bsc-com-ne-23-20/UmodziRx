<<<<<<< HEAD
# UmodziRx Fabric Network
- A Prescription-Fraud-Resistant Healthcare DLT Platform

## Overview
- UmodziRx is built on hyperledger fabric, an open source enterprise-grade permissioned distributed ledger technology (DLT) platform, designed for use in enterprise contexts.
- Unlike public blockchains, Fabric eliminates anonymity, enforcing accountability via X.509 digital identities and role-based access control (RBAC).

## Key Anti-Fraud Mechanisms
- Participant Identity Binding: Every entity (Org1, Org2) is cryptographically enrolled via a Certificate Authority (CA), tying actions to real-world identities.
- Immutable Audit Trails: All prescription transactions (issue, dispense and revoke) are recorded on-chain with provenance tracking.

## Network Architecture
### Consensus Algorithm: RAFT
- Enables orderers to achieve consensus even when some nodes fail.
- 3 Orderer nodes to ensure fault tolerance.

### Peer Organizations and Endorsement Policies
- 2 Organizations, with 2 Peers each:
    Org1 - Hospitals
    Org2 - Pharmacies
- Endorsement Policies: 

### Security
- TLS for all gRPC communications (node-to-node, client-to-node).
- Fabric-CA Integration: Custom attributes in certificates (e.g., role=doctor) enable role-based access control.

### Immutable Ledger: The blockchain
- Fabric utilizes 2 ledgers: World state and blockchain.
    - The world state is a database that holds current values (real-time values/records).
    - The blockchain is a transaction log that records all the changes that have resulted in the current world state. Keeps record of all historical transactions.
- Look at it this way, a prescription, ID:01 is issued, with default status: Active, waiting to either be dispensed or revoked. It is then dispensed by a pharmacist, status: Dispensed. 
- When queried:
    - The world state returns most recent value of prescription ID:01 with status: Dispensed. 
    - The blockchain returns entire history of prescription ID:01, from creation to all updates.

# Future Work
## Consensus Upgrade: BFT-Smart
- Migration to BFT (Byzantine Fault Tolerance) consensus upon upgrade to Fabric 3.0 or greater.
- Unlike RAFT, BFT enables reaching consensus when nodes act maliciously.

## Tracking Stock
- Implement tracking of real-time drug inventory in pharmacies, and whatever medications provided to patients.
- Will enable use of events such as prompting for restocking/refilling.
=======
# Go Chaincode/Smartcontract for UmodziRx

## Overview 
This is a Go Chaincode for UmodziRx, a blockchain-based platform for managing prescriptions. The chaincode facilitates secure storage and retrieval of prescription data on a permissioned blockchain network.

## Features
- Role-based Access Control. Only authorized users can access and modify prescription data. 
    - Only doctors can issue prescriptions.
    - Only pharmacists can view dispense prescriptions.
    - Doctors may not issue prescriptions to themselves
- Secure data storage. Prescription data is encrypted and stored on the blockchain.

## Prerequisites
- go 1.24.1 or later
- Hyperledger Fabric 2.5.x
- Docker 27.5.1 or later
- Docker Compose v2.32.4 or later

## Installation
1. Clone the repository: git pull https://github.com/Bsc-com-ne-23-20/UmodziRx.git
2. Navigate to the chaincode directory: cd UmodziRx/fabricNetwork/chaincode-go
3. Clean up dependencies: go mod tidy
4. Clean module cache and clear out old dependencies: go clean -modcache
5. Resolve dependencies: GODEBUG=gocacheverify=1 go mod download -x
6. Build the chaincode: go build -o mychaincode.bin
    - Note: The chaincode binary will be generated in the same directory.

    - 'mychaincode' is the name of the chaincode binary, you can change it as per your requirement.

>>>>>>> ec341a708247d7ff06c2e0f0629a47041ce60644
