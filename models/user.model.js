const mongoose = require("mongoose");
const { fullPhoneNumberLength, emailLength } = require("../configs/fields-length.config");
const { BlockReasons, UnblockReasons, BlockVia, UnblockVia } = require("../configs/enums.config")
const { emailRegex , fullPhoneNumberRegex} = require("../configs/regex.config");

/* User Schema */

/*
 * User_ID
 * Email_ID
 * isVerified
 * isBlocked
 * blockedBy
 * unblockedBy
 * blockedAt
 * unblockedAt
 * blockVia
 * unblockVia
 * blockReason
 * unblockReason
 * blockCount
 * unblockCount
*/

// Defined Document Structure of a User
const userSchema = mongoose.Schema({
    fullPhoneNumber: {
        type: String,
        unique: true,
        trim: true,
        index: true,
        required: true,
        match: fullPhoneNumberRegex,
        minlength: fullPhoneNumberLength.min,
        maxlength: fullPhoneNumberLength.max
    },
    userID:{
        type: String,
        unique: true,
        immutable: true,
        index: true // Perfect for performance in token-based auth.
    },
    emailID:{
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        minlength: emailLength.min,
        maxlength: emailLength.max,
        // At least one character before @
        // Exactly one @ symbol
        // At least one character before and after the . in domain
        // No spaces allowed
        match: emailRegex // simple regex for basic email format
    },
    isBlocked:{ // This is controlled by Admins Only
        type: Boolean,
        default: false
    },
    blockReason: {
        type: String,
        enum: Object.values(BlockReasons),
        default: null
    },
    blockedBy : {
        type: String,
        default: null
    },
    blockedVia: {
        type: String,
        enum: Object.values(BlockVia),
        default: null
    },
    blockCount: { 
        type: Number, 
        default: 0 
    },
    unblockReason: {
        type: String,
        enum: Object.values(UnblockReasons),
        default: null
    },
    unblockedBy: {
        type: String,
        default: null
    },
    unblockedVia: {
        type: String,
        enum: Object.values(UnblockVia),
        default: null
    },
    unblockCount: { 
        type: Number, 
        default: 0 
    },
    blockedAt: {
        type: Date,
        default: null
    },
    unblockedAt: {
        type: Date,
        default: null
    }
},{timestamps:true,versionKey:false});

// Creating a Collection named Users that will Include User Documents / Records
// module.exports convert the whole file into a Module
module.exports = mongoose.model("User",userSchema); 
// By Default Mongoose Convert User into Plural Form i.e Users