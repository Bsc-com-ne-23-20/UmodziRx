/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

const { Context } = require('fabric-contract-api');
const { ChaincodeStub } = require('fabric-shim');

const UmodziLedger = require('../lib/umodziLedger.js');

let assert = sinon.assert;
chai.use(sinonChai);

describe('UmodziLedger Tests', () => {
    let transactionContext, chaincodeStub, prescription;
    beforeEach(() => {
        transactionContext = new Context();

        chaincodeStub = sinon.createStubInstance(ChaincodeStub);
        transactionContext.setChaincodeStub(chaincodeStub);

        chaincodeStub.putState.callsFake((key, value) => {
            if (!chaincodeStub.states) {
                chaincodeStub.states = {};
            }
            chaincodeStub.states[key] = value;
        });

        chaincodeStub.getState.callsFake(async (key) => {
            return chaincodeStub.states ? chaincodeStub.states[key] : undefined;
        });

        chaincodeStub.deleteState.callsFake(async (key) => {
            if (chaincodeStub.states) {
                delete chaincodeStub.states[key];
            }
            return Promise.resolve();
        });

        prescription = {
            ID: 'presc1',
            PatientID: 'patient123',
            DoctorID: 'doctor456',
            Medication: 'Amoxicillin',
            Dosage: '500mg',
            Status: 'Pending'
        };
    });

    describe('Test CreatePrescription', () => {
        it('should successfully create a prescription', async () => {
            let ledger = new UmodziLedger();
            await ledger.CreatePrescription(transactionContext, prescription.ID, prescription.PatientID, prescription.DoctorID, prescription.Medication, prescription.Dosage, prescription.Status);
            let ret = JSON.parse((await chaincodeStub.getState(prescription.ID)).toString());
            expect(ret).to.eql(prescription);
        });
    });

    describe('Test ReadPrescription', () => {
        it('should return an existing prescription', async () => {
            let ledger = new UmodziLedger();
            await ledger.CreatePrescription(transactionContext, prescription.ID, prescription.PatientID, prescription.DoctorID, prescription.Medication, prescription.Dosage, prescription.Status);
            let ret = JSON.parse(await chaincodeStub.getState(prescription.ID));
            expect(ret).to.eql(prescription);
        });
    });

    describe('Test UpdatePrescription', () => {
        it('should update a prescription', async () => {
            let ledger = new UmodziLedger();
            await ledger.CreatePrescription(transactionContext, prescription.ID, prescription.PatientID, prescription.DoctorID, prescription.Medication, prescription.Dosage, prescription.Status);
            await ledger.UpdatePrescription(transactionContext, prescription.ID, 'Dispensed');
            let ret = JSON.parse(await chaincodeStub.getState(prescription.ID));
            expect(ret.Status).to.equal('Dispensed');
        });
    });

    describe('Test DeletePrescription', () => {
        it('should delete a prescription', async () => {
            let ledger = new UmodziLedger();
            await ledger.CreatePrescription(transactionContext, prescription.ID, prescription.PatientID, prescription.DoctorID, prescription.Medication, prescription.Dosage, prescription.Status);
            await ledger.DeletePrescription(transactionContext, prescription.ID);
            let ret = await chaincodeStub.getState(prescription.ID);
            expect(ret).to.equal(undefined);
        });
    });
});
