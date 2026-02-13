/**
 * 🧹 Migration Cleanup
 * Handles dropping legacy collections after successful migration
 */

const mongoose = require("mongoose");

/**
 * Drop a single legacy collection
 * @param {string} collectionName - Name of collection to drop
 */
async function dropCollection(collectionName) {
  try {
    await mongoose.connection.collection(collectionName).drop();
    console.log(`   ✅ Dropped ${collectionName}`);
    return true;
  } catch (error) {
    if (error.code === 26) {
      // Collection doesn't exist
      console.log(`   ℹ️  ${collectionName} doesn't exist`);
      return true;
    } else {
      console.error(`   ❌ Failed to drop ${collectionName}:`, error.message);
      return false;
    }
  }
}

/**
 * Drop all legacy collections
 * @param {object} legacyCollections - Object with collection names as keys
 * @param {number} delaySeconds - Delay before dropping (safety measure)
 */
async function dropLegacyCollections(legacyCollections, delaySeconds = 5) {
  console.log("\n⚠️  Dropping legacy collections...");
  
  if (delaySeconds > 0) {
    console.log(`   Waiting ${delaySeconds} seconds before dropping collections...`);
    await new Promise(resolve => setTimeout(resolve, delaySeconds * 1000));
  }

  let successCount = 0;
  let failCount = 0;

  for (const collectionName of Object.keys(legacyCollections)) {
    const success = await dropCollection(collectionName);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log(`\n   Cleanup summary: ${successCount} dropped, ${failCount} failed`);
  return { successCount, failCount };
}

module.exports = {
  dropCollection,
  dropLegacyCollections
};
