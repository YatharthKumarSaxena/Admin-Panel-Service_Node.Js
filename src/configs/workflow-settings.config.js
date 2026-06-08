/**
 * WORKFLOW SETTINGS CONFIGURATION
 * 
 * Per-request-type workflow configuration with risk-based escalation rules.
 * 
 * Each request type can have:
 * - Custom workflow mode (overrides global default)
 * - Risk level classification
 * - Review requirement (enforce or optional)
 * - Auto-execution setting
 * - Execution timeout
 * - Context-based escalation rules
 */

const { WorkflowMode, WorkflowRiskLevel, WorkflowConfigKeys, DefaultWorkflowSettings } = require("./workflow.config");
const { requestType } = require("./enums.config");
const { AdminTypes } = require("./enums.config");

/**
 * Get global workflow mode from environment
 */
function getGlobalWorkflowMode() {
  return process.env[WorkflowConfigKeys.DEFAULT_MODE] || DefaultWorkflowSettings.mode;
}

/**
 * Check if auto-execute is globally enabled
 */
function isAutoExecuteEnabled() {
  const envValue = process.env[WorkflowConfigKeys.ENABLE_AUTO_EXECUTE];
  if (envValue === undefined) return DefaultWorkflowSettings.autoExecute;
  return envValue !== 'false';
}

/**
 * Check if review phase is globally enabled
 */
function isReviewPhaseEnabled() {
  const envValue = process.env[WorkflowConfigKeys.ENABLE_REVIEW_PHASE];
  if (envValue === undefined) return DefaultWorkflowSettings.reviewEnabled;
  return envValue === 'true';
}

/**
 * Get workflow mode for high-risk operations
 */
function getHighRiskMode() {
  return process.env[WorkflowConfigKeys.HIGH_RISK_MODE] || DefaultWorkflowSettings.highRiskMode;
}

/**
 * Get workflow mode for critical-risk operations
 */
function getCriticalRiskMode() {
  return process.env[WorkflowConfigKeys.CRITICAL_RISK_MODE] || DefaultWorkflowSettings.criticalRiskMode;
}

/**
 * Workflow Settings Per Request Type
 * 
 * Configuration structure:
 * - mode: Workflow mode (can be overridden by .env)
 * - riskLevel: Risk classification
 * - requiresReview: Force review phase regardless of global setting
 * - autoExecute: Allow auto-execution (if mode supports it)
 * - executionTimeoutMs: Max time for execution operation
 * - escalationRules: Context-based workflow escalation (optional)
 */
const WorkflowSettings = {
  /**
   * ACTIVATION REQUEST
   * Activate previously deactivated admin
   * Risk: MEDIUM (restores access, auditable)
   */
  [requestType.ACTIVATION]: {
    mode: process.env[WorkflowConfigKeys.ACTIVATION_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.MEDIUM,
    requiresReview: false,
    autoExecute: true,
    executionTimeoutMs: 30000,
    description: "Activate deactivated admin account"
  },
  
  /**
   * DEACTIVATION REQUEST
   * Deactivate active admin (removes access)
   * Risk: HIGH (immediate access loss, security impact)
   */
  [requestType.DEACTIVATION]: {
    mode: process.env[WorkflowConfigKeys.DEACTIVATION_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.HIGH,
    requiresReview: true,  // Force review for deactivation
    autoExecute: true,
    executionTimeoutMs: 30000,
    description: "Deactivate active admin account"
  },
  
  /**
   * ROLE CHANGE REQUEST
   * Change admin role (privilege escalation/de-escalation)
   * Risk: HIGH to CRITICAL (depends on target role)
   */
  [requestType.ROLE_CHANGE]: {
    mode: process.env[WorkflowConfigKeys.ROLE_CHANGE_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.HIGH,
    requiresReview: true,
    autoExecute: false,  // Requires explicit execution
    executionTimeoutMs: 60000,
    description: "Change admin role",
    
    // Escalation rules: Higher target role = stricter workflow
    escalationRules: {
      // Changing to SUPER_ADMIN = CRITICAL risk
      [AdminTypes.SUPER_ADMIN]: WorkflowMode.FULL_SEPARATION,
      // Changing to ORG_ADMIN = HIGH risk
      [AdminTypes.ORG_ADMIN]: WorkflowMode.CONDITIONAL_EXECUTE,
      // Other roles = standard workflow
      default: null  // Use configured mode
    }
  },
  
  /**
   * PERMISSION GRANT REQUEST
   * Grant special permission to admin
   * Risk: HIGH (security control bypass)
   */
  [requestType.PERMISSION_GRANT]: {
    mode: process.env[WorkflowConfigKeys.PERMISSION_GRANT_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.HIGH,
    requiresReview: true,
    autoExecute: false,
    executionTimeoutMs: 60000,
    description: "Grant special permission to admin"
  },
  
  /**
   * PERMISSION REVOKE REQUEST
   * Revoke/block admin permission
   * Risk: HIGH (access restriction)
   */
  [requestType.PERMISSION_REVOKE]: {
    mode: process.env[WorkflowConfigKeys.PERMISSION_REVOKE_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.HIGH,
    requiresReview: true,
    autoExecute: false,
    executionTimeoutMs: 60000,
    description: "Revoke admin permission"
  },
  
  /**
   * CLIENT ONBOARDING (Self-initiated)
   * User converts themselves to client
   * Risk: MEDIUM (user-initiated, reversible)
   */
  [requestType.CLIENT_ONBOARDING]: {
    mode: process.env[WorkflowConfigKeys.CLIENT_ONBOARDING_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.MEDIUM,
    requiresReview: false,
    autoExecute: true,
    executionTimeoutMs: 45000,
    description: "User-initiated client conversion"
  },
  
  /**
   * CLIENT ONBOARDING ADMIN (Admin-initiated)
   * Admin converts user to client
   * Risk: LOW (standard operation)
   */
  [requestType.CLIENT_ONBOARDING_ADMIN]: {
    mode: process.env[WorkflowConfigKeys.CLIENT_ONBOARDING_ADMIN_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.LOW,
    requiresReview: false,
    autoExecute: true,
    executionTimeoutMs: 45000,
    description: "Admin-initiated client conversion"
  },
  
  /**
   * CLIENT REVERT REQUEST
   * Revert client back to regular user
   * Risk: HIGH (status change, data implications)
   */
  [requestType.CLIENT_REVERT]: {
    mode: process.env[WorkflowConfigKeys.CLIENT_REVERT_MODE] || getGlobalWorkflowMode(),
    riskLevel: WorkflowRiskLevel.HIGH,
    requiresReview: true,
    autoExecute: false,
    executionTimeoutMs: 60000,
    description: "Revert client to regular user"
  }
};

/**
 * Resolve workflow mode for a request
 * 
 * Applies escalation rules based on context (target role, permissions, etc.)
 * 
 * @param {string} requestType - Type of request
 * @param {object} context - Request context (targetRole, targetType, etc.)
 * @returns {string} Resolved workflow mode
 */
function getWorkflowMode(requestType, context = {}) {
  const settings = WorkflowSettings[requestType];
  
  if (!settings) {
    // Fallback to global default for unknown request types
    return getGlobalWorkflowMode();
  }
  
  // Check for context-based escalation rules
  if (settings.escalationRules && context.targetRole) {
    const escalatedMode = settings.escalationRules[context.targetRole] 
      || settings.escalationRules.default;
    
    if (escalatedMode) {
      return escalatedMode;
    }
  }
  
  // Apply risk-based escalation if no explicit mode set
  if (settings.mode === getGlobalWorkflowMode()) {
    if (settings.riskLevel === WorkflowRiskLevel.CRITICAL) {
      return getCriticalRiskMode();
    }
    if (settings.riskLevel === WorkflowRiskLevel.HIGH) {
      const highRiskMode = getHighRiskMode();
      // Only escalate if not explicitly set to SIMPLE
      if (process.env[WorkflowConfigKeys[`${requestType.toUpperCase()}_MODE`]]) {
        return settings.mode;  // Explicitly configured, don't override
      }
      return highRiskMode;
    }
  }
  
  return settings.mode;
}

/**
 * Get complete workflow settings for a request
 * 
 * @param {string} requestType - Type of request
 * @param {object} context - Request context
 * @returns {object} Complete workflow settings with resolved mode
 */
function getWorkflowSettings(requestType, context = {}) {
  const settings = WorkflowSettings[requestType];
  
  if (!settings) {
    return {
      mode: getGlobalWorkflowMode(),
      riskLevel: WorkflowRiskLevel.MEDIUM,
      requiresReview: false,
      autoExecute: isAutoExecuteEnabled(),
      executionTimeoutMs: 30000,
      description: "Unknown request type"
    };
  }
  
  return {
    ...settings,
    mode: getWorkflowMode(requestType, context)
  };
}

module.exports = {
  WorkflowSettings,
  getWorkflowMode,
  getWorkflowSettings,
  getGlobalWorkflowMode,
  isAutoExecuteEnabled,
  isReviewPhaseEnabled,
  getHighRiskMode,
  getCriticalRiskMode
};
