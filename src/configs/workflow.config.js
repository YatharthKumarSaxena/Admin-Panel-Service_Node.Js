/**
 * WORKFLOW CONFIGURATION
 * 
 * Defines workflow modes and risk levels for the flexible
 * multi-phase request approval system.
 * 
 * This configuration enables organizations to customize their
 * governance workflow based on risk tolerance and compliance needs.
 */

/**
 * Workflow Modes
 * 
 * Define the approval and execution flow for requests:
 * 
 * - SIMPLE: CREATE → APPROVE (auto-execute) / REJECT
 *   * Most common (90%+ systems)
 *   * Fast, suitable for low-risk operations
 *   * Approval immediately executes the action
 * 
 * - REVIEW_OPTIONAL: CREATE → [REVIEW] → APPROVE (auto-execute) / REJECT
 *   * Review step is optional (can skip to approve/reject)
 *   * Used in financial services, healthcare
 *   * Adds accountability layer without slowing workflow
 * 
 * - CONDITIONAL_EXECUTE: CREATE → APPROVE → EXECUTE (auto if has permission)
 *   * Execution happens automatically if approver has execute permission
 *   * Otherwise requires manual execution by authorized admin
 *   * Balances convenience with security
 * 
 * - FULL_SEPARATION: CREATE → REVIEW → APPROVE → EXECUTE (all manual)
 *   * Complete separation of duties
 *   * Review mandatory, execution always manual
 *   * Used in banking, critical infrastructure
 *   * Provides buffer time for rollback planning
 */
const WorkflowMode = Object.freeze({
  SIMPLE: "SIMPLE",
  REVIEW_OPTIONAL: "REVIEW_OPTIONAL",
  CONDITIONAL_EXECUTE: "CONDITIONAL_EXECUTE",
  FULL_SEPARATION: "FULL_SEPARATION"
});

/**
 * Workflow Risk Levels
 * 
 * Classify request types by operational risk:
 * 
 * - LOW: Minimal impact, reversible actions
 * - MEDIUM: Standard operations, some impact
 * - HIGH: Security-critical, significant impact
 * - CRITICAL: System-wide impact, irreversible
 * 
 * Risk level can trigger automatic workflow escalation
 * (e.g., HIGH risk → CONDITIONAL_EXECUTE, CRITICAL → FULL_SEPARATION)
 */
const WorkflowRiskLevel = Object.freeze({
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
});

/**
 * Workflow Configuration Keys
 * 
 * Environment variable keys for workflow settings
 */
const WorkflowConfigKeys = Object.freeze({
  // Global defaults
  DEFAULT_MODE: "WORKFLOW_DEFAULT_MODE",
  ENABLE_AUTO_EXECUTE: "WORKFLOW_ENABLE_AUTO_EXECUTE",
  ENABLE_REVIEW_PHASE: "WORKFLOW_ENABLE_REVIEW_PHASE",
  
  // Risk-based defaults
  HIGH_RISK_MODE: "WORKFLOW_HIGH_RISK_MODE",
  CRITICAL_RISK_MODE: "WORKFLOW_CRITICAL_RISK_MODE",
  
  // Per-request-type overrides
  ACTIVATION_MODE: "WORKFLOW_ACTIVATION_MODE",
  DEACTIVATION_MODE: "WORKFLOW_DEACTIVATION_MODE",
  ROLE_CHANGE_MODE: "WORKFLOW_ROLE_CHANGE_MODE",
  PERMISSION_GRANT_MODE: "WORKFLOW_PERMISSION_GRANT_MODE",
  PERMISSION_REVOKE_MODE: "WORKFLOW_PERMISSION_REVOKE_MODE",
  CLIENT_ONBOARDING_MODE: "WORKFLOW_CLIENT_ONBOARDING_MODE",
  CLIENT_ONBOARDING_ADMIN_MODE: "WORKFLOW_CLIENT_ONBOARDING_ADMIN_MODE",
  CLIENT_REVERT_MODE: "WORKFLOW_CLIENT_REVERT_MODE"
});

/**
 * Default Workflow Settings
 * 
 * Fallback values when .env is not configured
 */
const DefaultWorkflowSettings = Object.freeze({
  mode: WorkflowMode.SIMPLE,
  autoExecute: true,
  reviewEnabled: false,
  highRiskMode: WorkflowMode.CONDITIONAL_EXECUTE,
  criticalRiskMode: WorkflowMode.FULL_SEPARATION
});

module.exports = {
  WorkflowMode,
  WorkflowRiskLevel,
  WorkflowConfigKeys,
  DefaultWorkflowSettings
};
