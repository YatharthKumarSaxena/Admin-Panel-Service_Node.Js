/**
 * ⚙️ Migration Executor
 * Core migration logic for moving documents from legacy to unified collection
 */

const mongoose = require("mongoose");
const { BaseRequestModel } = require("@models/base-request.model");
const { determineModelAndType } = require("./migration-mapper");

/**
 * Migrate a single document
 * @param {object} doc - Document from legacy collection
 * @param {object} config - Collection configuration
 * @returns {{success: boolean, type: string, requestId: string, error?: string}}
 */
async function migrateSingleDocument(doc, config) {
  try {
    // Determine model and type
    const { model, type } = determineModelAndType(doc, config);

    // Check if already migrated
    const existing = await BaseRequestModel.findOne({
      requestId: doc.requestId
    });

    if (existing) {
      return {
        success: false,
        skipped: true,
        requestId: doc.requestId,
        type
      };
    }

    // Remove MongoDB _id to let new collection generate it
    const { _id, __v, ...docData } = doc;

    // Create in new unified collection
    await model.create({
      ...docData,
      requestType: type // Ensure discriminator is set
    });

    return {
      success: true,
      requestId: doc.requestId,
      type
    };

  } catch (error) {
    return {
      success: false,
      requestId: doc.requestId,
      error: error.message
    };
  }
}

/**
 * Migrate all documents from a legacy collection
 * @param {string} collectionName - Name of legacy collection
 * @param {object} config - Collection configuration
 * @param {object} stats - Migration stats object
 */
async function migrateLegacyCollection(collectionName, config, stats) {
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
    stats.addTotal(docs.length);

    // Migrate each document
    for (const doc of docs) {
      const result = await migrateSingleDocument(doc, config);

      if (result.success) {
        stats.recordMigrated(result.type);
        console.log(`   ✅ Migrated ${result.requestId} (${result.type})`);
      } else if (result.skipped) {
        stats.recordSkipped();
        console.log(`   ⏭️  Skipped ${result.requestId} (already exists)`);
      } else {
        stats.recordError(result.requestId, result.error);
        console.error(`   ❌ Failed to migrate ${result.requestId}:`, result.error);
      }
    }

  } catch (error) {
    console.error(`❌ Error migrating ${collectionName}:`, error);
    throw error;
  }
}

module.exports = {
  migrateSingleDocument,
  migrateLegacyCollection
};
