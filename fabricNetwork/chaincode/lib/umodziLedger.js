/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const { Contract } = require('fabric-contract-api');

class UmodziLedger extends Contract {
    constructor() {
        super('org.umodzi.UmodziLedger');
    }

    async instantiate(ctx) {
        console.log('UmodziLedger Smart Contract Instantiated');
    }

    async issuePrescription(ctx, prescriptionId, doctorId, patientId, medication, dosagePerDose, dosesPerDay, quantityDispensed) {
        console.info('Issuing new prescription:', prescriptionId);
        
        if (quantityDispensed <= 0 || dosagePerDose <= 0 || dosesPerDay <= 0) {
            throw new Error('Invalid prescription details: Ensure all numeric values are greater than zero.');
        }
        
        const prescription = {
            prescriptionId,
            doctorId,
            patientId,
            medication,
            dosagePerDose,
            dosesPerDay,
            quantityDispensed,
            status: 'issued',
            dispensingPharmacist: '',
            issuedDate: new Date().toISOString()
        };
        
        await ctx.stub.putState(prescriptionId, Buffer.from(JSON.stringify(prescription)));
        console.info('Prescription issued successfully:', prescriptionId);
    }

    async dispenseMedication(ctx, prescriptionId, pharmacistId) {
        console.info('Dispensing medication for prescription:', prescriptionId);
        
        const prescriptionAsBytes = await ctx.stub.getState(prescriptionId);
        if (!prescriptionAsBytes || prescriptionAsBytes.length === 0) {
            throw new Error(`Prescription ${prescriptionId} does not exist.`);
        }
        
        let prescription = JSON.parse(prescriptionAsBytes.toString());
        if (prescription.status === 'dispensed') {
            throw new Error(`Prescription ${prescriptionId} has already been dispensed.`);
        }
        
        prescription.status = 'dispensed';
        prescription.dispensingPharmacist = pharmacistId;
        prescription.dispensedDate = new Date().toISOString();
        
        await ctx.stub.putState(prescriptionId, Buffer.from(JSON.stringify(prescription)));
        console.info('Medication dispensed successfully:', prescriptionId);
    }

    async queryPrescription(ctx, prescriptionId) {
        console.info('Querying prescription:', prescriptionId);
        
        const prescriptionAsBytes = await ctx.stub.getState(prescriptionId);
        if (!prescriptionAsBytes || prescriptionAsBytes.length === 0) {
            throw new Error(`Prescription ${prescriptionId} does not exist.`);
        }
        
        return prescriptionAsBytes.toString();
    }

    async queryHistory(ctx, prescriptionId) {
        console.info('Retrieving history for prescription:', prescriptionId);
        let iterator = await ctx.stub.getHistoryForKey(prescriptionId);
        let history = [];
        let res = await iterator.next();
        while (!res.done) {
            if (res.value) {
                let obj = JSON.parse(res.value.value.toString('utf8'));
                history.push(obj);
            }
            res = await iterator.next();
        }
        await iterator.close();
        return JSON.stringify(history);
    }
}

module.exports = UmodziLedger;
