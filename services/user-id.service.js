const { CounterModel } = require("../models/counter.model");
const { adminDataCapacity, adminIDPrefix, IP_Address_Code } = require("../configs/system.config");
const { errorMessage,throwInternalServerError } = require("../configs/error-handler.configs");
const { logWithTime } = require("../utils/time-stamps.util");

/*
  ✅ Single Responsibility Principle (SRP): 
  This function only handles the responsibility of incrementing the admin counter.
  ✅ Singleton Pattern:
  Operates on a single MongoDB document (id = "ADM"), treating it as a unique entity.

 // Increases the value of seq field in Admin Counter Document to generate unique ID for the new admin

 */

const increaseAdminCounter = async (res) => {
    try {
        const adminCounter = await CounterModel.findOneAndUpdate(
            { _id: adminIDPrefix },
            { $inc: { seq: 1 } },
            { new: true }
        );
        return adminCounter.seq;
    } catch (err) {
        logWithTime("🛑 Error in increasing admin counter");
        errorMessage(err);
        throwInternalServerError(res);
        return null;
    }
};

/*
  ✅ SRP: This function only creates the admin counter if it doesn't exist.
  ✅ Singleton Pattern:
  Ensures only one counter document exists with ID "ADM" — maintaining global admin count.
*/

// Creates Admin Counter whose seq value starts with 1 initially

const createAdminCounter = async (res) => {
    try {
        return await CounterModel.create({
            _id: adminIDPrefix,
            seq: 1
        });
    } catch (err) {
        logWithTime("⚠️ Error creating admin counter");
        errorMessage(err);
        throwInternalServerError(res);
        return null;
    }
};

// User ID Creation

/*
  ✅ Factory Pattern:
  This function encapsulates the logic to "create" a new adminID based on machine code and total customers.
  The logic varies dynamically depending on counter state but the output structure is consistent — like a factory.
  
  ✅ Open-Closed Principle (OCP):
  The function is closed for modification but open for extension.
  In future, more logic can be added to generate adminIDs differently for different admin types without modifying this logic directly.
  
  ✅ SRP:
  It only deals with adminID creation and nothing else — clean separation.
*/

// admin ID Creation
const makeAdminId = async(res) => {
    let totalAdmins = 1; // By default as Admin User Already Exists 
    let adminCounter; // To remove Scope Resolution Issue
    try{
        adminCounter = await CounterModel.findOne({_id: adminIdPrefix});
    }catch(err){
        logWithTime("⚠️ An Error Occured while accessing the Admin Counter Document");
        errorMessage(err);
        throwInternalServerError(res);
        return "";
    }
    if(adminCounter){ // Means Admin Counter Exist so Just increase Counter
        totalAdmins = await increaseAdminCounter(res);
        if(!totalAdmins)return "";
    }
    else{ // Means Admin Counter does not exist
        adminCounter = await createAdminCounter(res); // returns object
        if(!adminCounter)return "";
        totalAdmins = adminCounter.seq; // extract 'seq' field
    }
    let newId = totalAdmins;
    if(newId>=adminDataCapacity){
        logWithTime("⚠️ Machine Capacity to Store Admin Data is completely full");
        logWithTime("So Admin cannot be Registered");
        return ""; // Returning an Empty String that indicate Now no more new admin data can be registered on this machine
    }
    else{
        newId = newId+adminUserID;
        let machineCode = IP_Address_Code;
        let identityCode = adminCounter._id+machineCode;
        let idNumber = String(newId);
        const adminId = identityCode+idNumber;
        return adminId;
    }
}

module.exports = {
    makeAdminId
}