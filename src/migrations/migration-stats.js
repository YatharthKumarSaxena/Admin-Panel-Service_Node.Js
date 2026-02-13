/**
 * 📊 Migration Statistics Manager
 * Tracks migration progress and errors
 */

class MigrationStats {
  constructor() {
    this.total = 0;
    this.migrated = 0;
    this.skipped = 0;
    this.errors = [];
    this.byType = {};
  }

  /**
   * Increment total documents count
   */
  addTotal(count) {
    this.total += count;
  }

  /**
   * Record successful migration
   */
  recordMigrated(type) {
    this.migrated++;
    this.byType[type] = (this.byType[type] || 0) + 1;
  }

  /**
   * Record skipped document
   */
  recordSkipped() {
    this.skipped++;
  }

  /**
   * Record error
   */
  recordError(requestId, error) {
    this.errors.push({
      requestId,
      error: error.message || error
    });
  }

  /**
   * Get current statistics
   */
  getStats() {
    return {
      total: this.total,
      migrated: this.migrated,
      skipped: this.skipped,
      errors: this.errors,
      byType: this.byType
    };
  }

  /**
   * Reset statistics
   */
  reset() {
    this.total = 0;
    this.migrated = 0;
    this.skipped = 0;
    this.errors = [];
    this.byType = {};
  }
}

module.exports = {
  MigrationStats
};
