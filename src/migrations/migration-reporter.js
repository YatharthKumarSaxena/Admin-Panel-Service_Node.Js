/**
 * 📊 Migration Reporter
 * Generates and prints migration summary reports
 */

/**
 * Print migration summary
 * @param {object} stats - Migration statistics object
 */
function printSummary(stats) {
  const statsData = stats.getStats ? stats.getStats() : stats;

  console.log("\n" + "=".repeat(60));
  console.log("📊 MIGRATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total documents found:    ${statsData.total}`);
  console.log(`Successfully migrated:    ${statsData.migrated}`);
  console.log(`Skipped (already exist):  ${statsData.skipped}`);
  console.log(`Errors:                   ${statsData.errors.length}`);

  // Print by type
  if (Object.keys(statsData.byType).length > 0) {
    console.log("\nBy Request Type:");
    for (const [type, count] of Object.entries(statsData.byType)) {
      console.log(`  ${type.padEnd(30)} ${count}`);
    }
  }

  // Print errors if any
  if (statsData.errors.length > 0) {
    console.log("\n❌ Errors:");
    statsData.errors.forEach((err, index) => {
      console.log(`  ${index + 1}. ${err.requestId}: ${err.error}`);
    });
  }

  console.log("=".repeat(60));
}

/**
 * Print migration header
 * @param {string} mode - Migration mode (FULL, VALIDATION, etc.)
 * @param {object} options - Migration options
 */
function printHeader(mode, options = {}) {
  console.log("🚀 Request Models Migration");
  console.log("=".repeat(60));
  console.log(`Mode: ${mode}`);

  if (options.dropOld) {
    console.log("⚠️  Legacy collections will be DROPPED after migration!");
  }

  console.log("=".repeat(60));
}

/**
 * Print completion message
 * @param {boolean} success - Whether migration succeeded
 */
function printCompletion(success = true) {
  if (success) {
    console.log("\n✅ Migration completed successfully!");
  } else {
    console.log("\n❌ Migration completed with errors!");
  }
}

module.exports = {
  printSummary,
  printHeader,
  printCompletion
};
