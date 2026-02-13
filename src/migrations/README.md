# 🔄 Request Models Migration System

Database migration system for transitioning from separate request collections to unified admin_requests collection using Mongoose discriminator pattern.

## 📁 Architecture (SRP Compliant)

Each module has a **single responsibility**:

### Core Modules

| Module | Responsibility | Description |
|--------|---------------|-------------|
| `index.js` | Orchestration | Main entry point, coordinates all migration steps |
| `migration-config.js` | Configuration | Legacy collections mapping and settings |
| `migration-stats.js` | Statistics | Track migration progress and errors |
| `migration-mapper.js` | Type Mapping | Map request types to discriminator models |
| `migration-executor.js` | Execution | Core migration logic, move documents |
| `migration-validator.js` | Validation | Verify migrated data integrity |
| `migration-cleanup.js` | Cleanup | Drop legacy collections safely |
| `migration-reporter.js` | Reporting | Generate and print summary reports |

## 🚀 Usage

### Basic Migration
```bash
node src/migrations/index.js
```

### Validation Only
```bash
node src/migrations/index.js --validate-only
```

### Migration with Cleanup
```bash
node src/migrations/index.js --drop-old
```

## 📊 Migration Process

1. **Connect** to MongoDB
2. **Iterate** through legacy collections
3. **Map** request types to discriminator models
4. **Migrate** documents to unified collection
5. **Validate** migrated data
6. **Report** statistics
7. **Cleanup** (optional) - drop legacy collections

## 🗂️ Legacy Collections

The following collections are migrated:

- `role_change_requests` → `admin_requests` (ROLE_CHANGE)
- `admin_status_requests` → `admin_requests` (ACTIVATION/DEACTIVATION)
- `permission_requests` → `admin_requests` (PERMISSION_GRANT/REVOKE)
- `client_onboarding_requests` → `admin_requests` (CLIENT_ONBOARDING)

## 🎯 Discriminator Models

Unified collection uses discriminators based on `requestType`:

- `ROLE_CHANGE` → RoleChangeRequestModel
- `ACTIVATION` → AdminActivationRequestModel
- `DEACTIVATION` → AdminDeactivationRequestModel
- `PERMISSION_GRANT` → PermissionGrantRequestModel
- `PERMISSION_REVOKE` → PermissionRevokeRequestModel
- `CLIENT_ONBOARDING` → ClientOnboardingSelfRequestModel
- `CLIENT_ONBOARDING_ADMIN` → ClientOnboardingAdminRequestModel

## ⚠️ Safety Features

- **Duplicate Prevention**: Checks for existing requestId before migration
- **Error Tracking**: Records all failed migrations with details
- **Validation**: Post-migration data integrity checks
- **Delayed Cleanup**: 5-second delay before dropping collections
- **Graceful Failure**: Non-existent collections are skipped

## 📈 Statistics Tracked

- Total documents found
- Successfully migrated
- Skipped (already migrated)
- Errors with details
- Count by request type

## 🔧 Environment Variables

```env
MONGO_URI=mongodb://localhost:27017/admin_panel
```

## 🎨 Example Output

```
🚀 Request Models Migration
============================================================
Mode: FULL MIGRATION
============================================================
✅ Connected to MongoDB

🔄 Starting migration process...

📦 Migrating role_change_requests...
   Found 15 documents
   ✅ Migrated REQ001 (ROLE_CHANGE)
   ✅ Migrated REQ002 (ROLE_CHANGE)
   ...

🔍 Validating migration...
   Total documents in admin_requests: 45
   
   Documents by type:
   • ROLE_CHANGE: 15
   • ACTIVATION: 10
   • PERMISSION_GRANT: 20
   
   Indexes created: 8
   Sample pending requests: 5

✅ Validation complete!

============================================================
📊 MIGRATION SUMMARY
============================================================
Total documents found:    45
Successfully migrated:    45
Skipped (already exist):  0
Errors:                   0

By Request Type:
  ROLE_CHANGE                  15
  ACTIVATION                   10
  PERMISSION_GRANT             20
============================================================

✅ Migration completed successfully!

🔌 Database connection closed
```

## 🛡️ Best Practices

1. **Backup First**: Always backup your database before migration
2. **Test Validation**: Run `--validate-only` first
3. **Review Errors**: Check error logs before running cleanup
4. **Keep Backups**: Don't use `--drop-old` until verified
5. **Monitor Stats**: Review migration summary carefully

## 🔗 Integration

Import in other modules:

```javascript
const { runMigration } = require('@migrations');

// Run programmatically
await runMigration();
```

## 📝 Notes

- Migration is **idempotent** - safe to run multiple times
- Existing documents are skipped (not duplicated)
- Original `_id` is replaced to avoid conflicts
- `__v` version key is not migrated

## 🐛 Troubleshooting

**Migration fails midway:**
- Check MongoDB connection
- Review error messages in summary
- Re-run migration (skips completed items)

**Validation errors:**
- Run `--validate-only` to inspect
- Check model schemas match data
- Review discriminator configurations

**Collections not dropped:**
- Verify collection names in config
- Check MongoDB permissions
- Review cleanup error messages
