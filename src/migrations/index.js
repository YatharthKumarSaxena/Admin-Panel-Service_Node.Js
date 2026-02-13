/**
 * 🔄 Request Models Migration Script - Main Orchestrator
 * 
 * Migrates data from separate request collections to unified admin_requests collection
 * using Mongoose discriminator pattern.
 * 
 * Architecture:
 * - migration-config.js: Legacy collections configuration
 * - migration-stats.js: Statistics tracking (SRP)
 * - migration-mapper.js: Request type to model mapping (SRP)
 * - migration-executor.js: Core migration logic (SRP)
 * - migration-validator.js: Validation functions (SRP)
 * - migration-cleanup.js: Legacy collection cleanup (SRP)
 * - migration-reporter.js: Summary reporting (SRP)
 * 
 * Usage:
 *   node src/migrations/index.js [options]
 * 
 * Options:
 *   --validate-only  Only validate existing data, don't migrate
 *   --drop-old       Drop legacy collections after successful migration
 * 
 * Examples:
 *   node src/migrations/index.js
 *   node src/migrations/index.js --validate-only
 *   node src/migrations/index.js --drop-old
 */

const mongoose = require("mongoose");
require("module-alias/register");

// Import migration modules
const { LEGACY_COLLECTIONS } = require("./migration-config");
const { MigrationStats } = require("./migration-stats");
const { migrateLegacyCollection } = require("./migration-executor");
const { validateMigration } = require("./migration-validator");
const { dropLegacyCollections } = require("./migration-cleanup");
const { printSummary, printHeader, printCompletion } = require("./migration-reporter");

/**
 * Main migration orchestrator
 */
async function runMigration() {
  const args = process.argv.slice(2);
  const validateOnly = args.includes("--validate-only");
  const dropOld = args.includes("--drop-old");

  // Initialize stats
  const stats = new MigrationStats();

  // Print header
  printHeader(validateOnly ? "VALIDATION ONLY" : "FULL MIGRATION", { dropOld });

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/admin_panel";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    if (validateOnly) {
      // Only validate existing data
      await validateMigration();
    } else {
      // Full migration process
      console.log("\n🔄 Starting migration process...");

      // Migrate each legacy collection
      for (const [collectionName, config] of Object.entries(LEGACY_COLLECTIONS)) {
        await migrateLegacyCollection(collectionName, config, stats);
      }

      // Validate migrated data
      await validateMigration();

      // Print summary
      printSummary(stats);

      // Drop legacy collections if requested
      if (dropOld) {
        await dropLegacyCollections(LEGACY_COLLECTIONS);
      }
    }

    printCompletion(true);

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
    printCompletion(false);
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
