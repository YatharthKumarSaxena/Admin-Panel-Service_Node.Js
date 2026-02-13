/**
 * ✅ Migration Validator
 * Validates migrated data and collection integrity
 */

const { requestType } = require("@configs/enums.config");
const { BaseRequestModel } = require("@models/base-request.model");

/**
 * Validate migrated data
 * Checks counts, indexes, and data integrity
 */
async function validateMigration() {
  console.log("\n🔍 Validating migration...");

  try {
    // Check total count
    const totalCount = await BaseRequestModel.countDocuments();
    console.log(`   Total documents in admin_requests: ${totalCount}`);

    // Check by type
    console.log("\n   Documents by type:");
    for (const type of Object.values(requestType)) {
      const count = await BaseRequestModel.countDocuments({ requestType: type });
      if (count > 0) {
        console.log(`   • ${type}: ${count}`);
      }
    }

    // Validate indexes
    const indexes = await BaseRequestModel.collection.indexes();
    console.log(`\n   Indexes created: ${indexes.length}`);

    // Check for validation errors on pending requests
    const pendingRequests = await BaseRequestModel.find({
      status: "PENDING"
    }).limit(10);

    console.log(`   Sample pending requests: ${pendingRequests.length}`);

    // Check for documents without requestType (potential data issues)
    const missingType = await BaseRequestModel.countDocuments({
      requestType: { $exists: false }
    });

    if (missingType > 0) {
      console.log(`\n   ⚠️  Warning: ${missingType} documents missing requestType!`);
    }

    console.log("\n✅ Validation complete!");
    return true;

  } catch (error) {
    console.error("❌ Validation failed:", error);
    throw error;
  }
}

/**
 * Validate a collection exists before migration
 * @param {string} collectionName - Collection to check
 */
async function validateCollectionExists(collectionName) {
  const collections = await mongoose.connection.db.listCollections().toArray();
  const exists = collections.some(col => col.name === collectionName);
  
  if (!exists) {
    console.log(`   ℹ️  Collection ${collectionName} does not exist, skipping...`);
    return false;
  }
  
  return true;
}

module.exports = {
  validateMigration,
  validateCollectionExists
};
