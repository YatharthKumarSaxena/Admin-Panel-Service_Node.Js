/**
 * 🔄 Request Models Migration Script
 * 
 * Migrates data from separate request collections to unified admin_requests collection
 * 
 * Strategy:
 * 1. Copy data from legacy collections
 * 2. Add discriminator field (requestType)
 * 3. Validate migrated data
 * 4. Optionally drop old collections
 * 
 * Usage:
 * node src/models/migrate-requests.js [--validate-only] [--drop-old]
 */

const mongoose = require("mongoose");
require("module-alias/register");
const { requestType } = require("@configs/enums.config");

// Import new models
const { BaseRequestModel } = require("./base-request.model");
const { RoleChangeRequestModel } = require("./role-change-request.model");
const { AdminActivationRequestModel, AdminDeactivationRequestModel } = require("./admin-status-request.model");
const { PermissionGrantRequestModel, PermissionRevokeRequestModel } = require("./permission-request.model");
const { ClientOnboardingRequestModel } = require("./client-onboarding-request.model");

const LEGACY_COLLECTIONS = {
  role_change_requests: {
    model: RoleChangeRequestModel,
    type: requestType.ROLE_CHANGE
  },
  admin_status_requests: {
    model: null, // Determined by requestType field
    typeField: "requestType" // Uses existing requestType to determine discriminator
  },
  permission_requests: {
    model: null, // Determined by requestType field
    typeField: "requestType"
  },
  client_onboarding_requests: {
    model: ClientOnboardingRequestModel,
    type: requestType.CLIENT_ONBOARDING
  }
};

/**
 * Migration Statistics
 */
const stats = {
  total: 0,
  migrated: 0,
  skipped: 0,
  errors: [],
  byType: {}
};

/**
 * Migrate documents from legacy collection to unified collection
 */
async function migrateLegacyCollection(collectionName, config) {
  console.log(`\n📦 Migrating ${collectionName}...`);
  
  try {
    // Get legacy collection
    const legacyCollection = mongoose.connection.collection(collectionName);
    const docs = await legacyCollection.find({}).toArray();
    
    if (docs.length === 0) {
      console.log(`   ℹ️  No documents found in ${collectionName}`);
      return;
    }
    
    console.log(`   Found ${docs.length} documents`);
    stats.total += docs.length;
    
    for (const doc of docs) {
      try {
        // Determine request type and model
        let model, type;
        
        if (config.typeField) {
          // Use existing requestType field to determine discriminator
          type = doc[config.typeField];
          
          // Map to appropriate discriminator model
          if (type === requestType.ACTIVATION) {
            model = AdminActivationRequestModel;
          } else if (type === requestType.DEACTIVATION) {
            model = AdminDeactivationRequestModel;
          } else if (type === requestType.PERMISSION_GRANT) {
            model = PermissionGrantRequestModel;
          } else if (type === requestType.PERMISSION_REVOKE) {
            model = PermissionRevokeRequestModel;
          }
        } else {
          model = config.model;
          type = config.type;
        }
        
        // Check if already migrated
        const existing = await BaseRequestModel.findOne({ 
          requestId: doc.requestId 
        });
        
        if (existing) {
          console.log(`   ⏭️  Skipped ${doc.requestId} (already exists)`);
          stats.skipped++;
          continue;
        }
        
        // Remove MongoDB _id to let new collection generate it
        const { _id, __v, ...docData } = doc;
        
        // Create in new unified collection
        await model.create({
          ...docData,
          requestType: type // Ensure discriminator is set
        });
        
        stats.migrated++;
        stats.byType[type] = (stats.byType[type] || 0) + 1;
        
        console.log(`   ✅ Migrated ${doc.requestId} (${type})`);
        
      } catch (error) {
        console.error(`   ❌ Failed to migrate ${doc.requestId}:`, error.message);
        stats.errors.push({
          requestId: doc.requestId,
          error: error.message
        });
      }
    }
    
  } catch (error) {
    console.error(`❌ Error migrating ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Validate migrated data
 */
async function validateMigration() {
  console.log("\n🔍 Validating migration...");
  
  try {
    // Check total count
    const totalCount = await BaseRequestModel.countDocuments();
    console.log(`   Total documents in admin_requests: ${totalCount}`);
    
    // Check by type
    for (const type of Object.values(requestType)) {
      const count = await BaseRequestModel.countDocuments({ requestType: type });
      console.log(`   ${type}: ${count} documents`);
    }
    
    // Validate indexes
    const indexes = await BaseRequestModel.collection.indexes();
    console.log(`   Indexes: ${indexes.length} created`);
    
    // Check for validation errors
    const pendingRequests = await BaseRequestModel.find({ 
      status: "PENDING" 
    }).limit(10);
    
    console.log(`   Sample pending requests: ${pendingRequests.length}`);
    
    console.log("\n✅ Validation complete!");
    
  } catch (error) {
    console.error("❌ Validation failed:", error);
    throw error;
  }
}

/**
 * Drop legacy collections (use with caution!)
 */
async function dropLegacyCollections() {
  console.log("\n⚠️  Dropping legacy collections...");
  
  for (const collectionName of Object.keys(LEGACY_COLLECTIONS)) {
    try {
      await mongoose.connection.collection(collectionName).drop();
      console.log(`   ✅ Dropped ${collectionName}`);
    } catch (error) {
      if (error.code === 26) {
        console.log(`   ℹ️  ${collectionName} doesn't exist`);
      } else {
        console.error(`   ❌ Failed to drop ${collectionName}:`, error.message);
      }
    }
  }
}

/**
 * Print migration summary
 */
function printSummary() {
  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total documents found:    ${stats.total}`);
  console.log(`Successfully migrated:    ${stats.migrated}`);
  console.log(`Skipped (already exist):  ${stats.skipped}`);
  console.log(`Errors:                   ${stats.errors.length}`);
  console.log("\nBy Request Type:");
  
  for (const [type, count] of Object.entries(stats.byType)) {
    console.log(`  ${type.padEnd(25)} ${count}`);
  }
  
  if (stats.errors.length > 0) {
    console.log("\n❌ Errors:");
    stats.errors.forEach(err => {
      console.log(`  ${err.requestId}: ${err.error}`);
    });
  }
  
  console.log("=".repeat(60));
}

/**
 * Main migration function
 */
async function runMigration() {
  const args = process.argv.slice(2);
  const validateOnly = args.includes("--validate-only");
  const dropOld = args.includes("--drop-old");
  
  console.log("🚀 Request Models Migration");
  console.log("=".repeat(60));
  
  if (validateOnly) {
    console.log("Mode: VALIDATION ONLY");
  } else {
    console.log("Mode: FULL MIGRATION");
    if (dropOld) {
      console.log("⚠️  Legacy collections will be DROPPED after migration!");
    }
  }
  
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/admin_panel");
    console.log("✅ Connected to MongoDB");
    
    if (validateOnly) {
      await validateMigration();
    } else {
      // Migrate each legacy collection
      for (const [collectionName, config] of Object.entries(LEGACY_COLLECTIONS)) {
        await migrateLegacyCollection(collectionName, config);
      }
      
      // Validate migration
      await validateMigration();
      
      // Print summary
      printSummary();
      
      // Drop legacy collections if requested
      if (dropOld) {
        console.log("\n⚠️  Waiting 5 seconds before dropping legacy collections...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        await dropLegacyCollections();
      }
    }
    
    console.log("\n✅ Migration completed successfully!");
    
  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
}

// Run migration if executed directly
if (require.main === module) {
  runMigration().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { runMigration };
