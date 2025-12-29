const { CounterModel } = require("@models/counter.model");
const { 
    adminDataCapacity, 
    adminIDPrefix, 
    IP_Address_Code
} = require("@configs/system.config");
const { errorMessage } = require("@utils/error-handler.util");
const { logWithTime } = require("@utils/time-stamps.util");


const makeAdminId = async () => {
    try {
        // Step 1: Atomic Update (Find & Increment OR Create & Set 1)
        const counter = await CounterModel.findOneAndUpdate(
            { _id: adminIDPrefix },
            { $inc: { seq: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        if (!counter) {
            logWithTime("🛑 Critical: Failed to generate or retrieve admin counter.");
            return ""; 
        }

        let currentSeq = counter.seq;

        // Step 2: Check Capacity
        if (currentSeq > adminDataCapacity) {
            logWithTime("⚠️ Machine Capacity to Store Admin Data is full.");
            return "0"; 
        }

        // Step 3: ID Construction (Using Template Literals for cleaner code)
        // Logic: (Prefix + IP Code) + (BaseOffset + CurrentSequence)
        
        // Note: Make sure adminUserID is defined/imported properly
        const numericId = (adminDataCapacity+currentSeq); 
        
        const identityCode = `${adminIDPrefix}${IP_Address_Code}`;
        const adminId = `${identityCode}${numericId}`;

        return adminId;

    } catch (err) {
        logWithTime("🛑 Error in makeAdminId process");
        errorMessage(err);    
        return ""; 
    }
};

module.exports = {
    makeAdminId
};