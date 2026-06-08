/**
 * WORKFLOW UTILITIES
 * 
 * Helper functions for workflow management, auto-execution logic,
 * permission checking, and workflow mode resolution.
 */

const { WorkflowMode, WorkflowRiskLevel } = require("../configs/workflow.config");
const { getWorkflowMode, getWorkflowSettings, isAutoExecuteEnabled, isReviewPhaseEnabled } = require("../configs/workflow-settings.config");
const { requestStatus } = require("../configs/enums.config");
const { roleHasPermission } = require("./rbac.utils");

/**
 * Determine if Request Should Auto-Execute After Approval
 * 
 * Decision logic:
 * 1. Check global auto-execute setting
 * 2. Check workflow mode
 * 3. For CONDITIONAL_EXECUTE: check actor's execute permission
 * 4. Check config's autoExecute flag
 * 
 * @param {object} request - Request document
 * @param {object} actor - Admin performing approval
 * @param {object} workflowSettings - Workflow settings for request type
 * @returns {Promise<boolean>} True if should auto-execute
 */
async function shouldAutoExecuteRequest(request, actor, workflowSettings) {
  const { mode, autoExecute } = workflowSettings;
  
  // Global auto-execute disabled = always manual execution
  const globalAutoExecuteEnabled = isAutoExecuteEnabled();
  if (!globalAutoExecuteEnabled) {
    return false;
  }
  
  // SIMPLE and REVIEW_OPTIONAL always auto-execute (if global enabled)
  if (mode === WorkflowMode.SIMPLE || mode === WorkflowMode.REVIEW_OPTIONAL) {
    return true;
  }
  
  // CONDITIONAL_EXECUTE: check if actor has execute permission
  if (mode === WorkflowMode.CONDITIONAL_EXECUTE) {
    const hasExecutePermission = await checkExecutePermission(actor, request.requestType);
    
    // Auto-execute only if:
    // 1. Config allows auto-execute (autoExecute = true)
    // 2. Actor has execute permission
    // 3. Global auto-execute is enabled (already checked above)
    return hasExecutePermission && autoExecute;
  }
  
  // FULL_SEPARATION: never auto-execute (always manual)
  return false;
}

/**
 * Check if Actor Has Execute Permission for Request Type
 * 
 * Verifies if the actor has the 'requests:execute' permission.
 * 
 * @param {object} actor - Admin document
 * @param {string} requestType - Type of request
 * @returns {Promise<boolean>} True if has execute permission
 */
async function checkExecutePermission(actor, requestType) {
  // Check if actor has requests:execute permission
  const hasPermission = await roleHasPermission(
    actor.adminType,
    "requests:execute"
  );
  
  return hasPermission;
}

/**
 * Resolve Workflow Mode for Request
 * 
 * Applies escalation rules and risk-based escalation.
 * Wrapper around getWorkflowMode from config.
 * 
 * @param {string} requestType - Type of request
 * @param {object} context - Request context (targetRole, targetType, etc.)
 * @returns {string} Resolved workflow mode
 */
function resolveWorkflowMode(requestType, context = {}) {
  return getWorkflowMode(requestType, context);
}

/**
 * Get Complete Workflow Settings for Request
 * 
 * Returns full settings with resolved mode, risk level, etc.
 * 
 * @param {string} requestType - Type of request
 * @param {object} context - Request context
 * @returns {object} Complete workflow settings
 */
function getCompleteWorkflowSettings(requestType, context = {}) {
  return getWorkflowSettings(requestType, context);
}

/**
 * Check if Review Phase is Available for Request
 * 
 * Determines if review API should be accessible based on:
 * - Global review setting
 * - Workflow mode (supports review or not)
 * 
 * @param {string} workflowMode - Workflow mode
 * @returns {boolean} True if review is available
 */
function isReviewPhaseAvailable(workflowMode) {
  const globalReviewEnabled = isReviewPhaseEnabled();
  
  const reviewSupportedModes = [
    WorkflowMode.REVIEW_OPTIONAL,
    WorkflowMode.FULL_SEPARATION
  ];
  
  // Review is available if globally enabled OR workflow mode supports it
  return globalReviewEnabled || reviewSupportedModes.includes(workflowMode);
}

/**
 * Check if Manual Execution is Required
 * 
 * Determines if execute API should be available based on:
 * - Request status (AWAITING_EXECUTION = definitely needs manual)
 * - Global auto-execute setting
 * - Workflow mode
 * 
 * @param {string} workflowMode - Workflow mode
 * @param {string} requestStatus - Current request status
 * @returns {boolean} True if manual execution required
 */
function isManualExecutionRequired(workflowMode, currentStatus) {
  // If request is in AWAITING_EXECUTION, it definitely needs manual execution
  if (currentStatus === requestStatus.AWAITING_EXECUTION) {
    return true;
  }
  
  // If request failed execution, can retry
  if (currentStatus === requestStatus.EXECUTION_FAILED) {
    return true;
  }
  
  // If auto-execute is disabled globally, all requests need manual execution
  const globalAutoExecuteEnabled = isAutoExecuteEnabled();
  if (!globalAutoExecuteEnabled) {
    return true;
  }
  
  // Modes that may require manual execution
  const manualExecutionModes = [
    WorkflowMode.CONDITIONAL_EXECUTE,  // Sometimes manual (depends on permission)
    WorkflowMode.FULL_SEPARATION       // Always manual
  ];
  
  return manualExecutionModes.includes(workflowMode);
}

/**
 * Get Next Expected Status After Approval
 * 
 * Determines what status the request should transition to after approval.
 * Used by orchestrator to set correct status.
 * 
 * @param {object} request - Request document
 * @param {object} actor - Approving admin
 * @param {object} workflowSettings - Workflow settings
 * @returns {Promise<string>} Next status (EXECUTED, AWAITING_EXECUTION, or APPROVED)
 */
async function getNextStatusAfterApproval(request, actor, workflowSettings) {
  const willAutoExecute = await shouldAutoExecuteRequest(request, actor, workflowSettings);
  
  if (willAutoExecute) {
    // Will auto-execute, final status will be EXECUTED (set by execution service)
    // Orchestrator will call execution immediately
    return requestStatus.APPROVED;  // Temporary, execution will change to EXECUTED
  }
  
  // Manual execution required
  return requestStatus.AWAITING_EXECUTION;
}

/**
 * Check if Request Requires Review Before Approval
 * 
 * Based on workflow settings and mode.
 * 
 * @param {object} workflowSettings - Workflow settings
 * @param {string} currentStatus - Current request status
 * @returns {boolean} True if review is mandatory before approval
 */
function requiresReviewBeforeApproval(workflowSettings, currentStatus) {
  const { mode, requiresReview } = workflowSettings;
  
  // If workflow config forces review
  if (requiresReview) {
    // In FULL_SEPARATION, must be REVIEWED to approve
    if (mode === WorkflowMode.FULL_SEPARATION) {
      return currentStatus !== requestStatus.REVIEWED;
    }
    
    // In REVIEW_OPTIONAL with requiresReview, should be reviewed (but not mandatory)
    // This is a soft requirement - we still allow skipping
    return false;
  }
  
  // In FULL_SEPARATION mode, review is always mandatory
  if (mode === WorkflowMode.FULL_SEPARATION) {
    return currentStatus !== requestStatus.REVIEWED;
  }
  
  return false;
}

/**
 * Get Workflow Step Description
 * 
 * Returns human-readable description of current workflow step.
 * Useful for UI/notifications.
 * 
 * @param {string} status - Request status
 * @param {string} workflowMode - Workflow mode
 * @returns {string} Description
 */
function getWorkflowStepDescription(status, workflowMode) {
  const descriptions = {
    [requestStatus.PENDING]: "Awaiting review or approval",
    [requestStatus.UNDER_REVIEW]: "Under review",
    [requestStatus.REVIEWED]: "Reviewed, awaiting approval",
    [requestStatus.APPROVED]: "Approved",
    [requestStatus.AWAITING_EXECUTION]: "Approved, awaiting execution",
    [requestStatus.EXECUTING]: "Execution in progress",
    [requestStatus.EXECUTED]: "Successfully executed",
    [requestStatus.EXECUTION_FAILED]: "Execution failed, can retry",
    [requestStatus.REJECTED]: "Rejected",
    [requestStatus.CANCELLED]: "Cancelled",
    [requestStatus.EXPIRED]: "Expired"
  };
  
  return descriptions[status] || "Unknown status";
}

/**
 * Calculate Workflow Progress Percentage
 * 
 * Returns progress percentage based on current status and workflow mode.
 * Useful for progress bars in UI.
 * 
 * @param {string} status - Current status
 * @param {string} workflowMode - Workflow mode
 * @returns {number} Progress percentage (0-100)
 */
function getWorkflowProgress(status, workflowMode) {
  const progressMap = {
    [WorkflowMode.SIMPLE]: {
      [requestStatus.PENDING]: 25,
      [requestStatus.APPROVED]: 75,
      [requestStatus.EXECUTED]: 100,
      [requestStatus.REJECTED]: 100,
      [requestStatus.CANCELLED]: 100,
      [requestStatus.EXPIRED]: 100
    },
    [WorkflowMode.REVIEW_OPTIONAL]: {
      [requestStatus.PENDING]: 20,
      [requestStatus.UNDER_REVIEW]: 40,
      [requestStatus.REVIEWED]: 60,
      [requestStatus.APPROVED]: 80,
      [requestStatus.EXECUTED]: 100,
      [requestStatus.REJECTED]: 100,
      [requestStatus.CANCELLED]: 100,
      [requestStatus.EXPIRED]: 100
    },
    [WorkflowMode.CONDITIONAL_EXECUTE]: {
      [requestStatus.PENDING]: 25,
      [requestStatus.APPROVED]: 50,
      [requestStatus.AWAITING_EXECUTION]: 60,
      [requestStatus.EXECUTING]: 80,
      [requestStatus.EXECUTED]: 100,
      [requestStatus.EXECUTION_FAILED]: 70,
      [requestStatus.REJECTED]: 100,
      [requestStatus.CANCELLED]: 100,
      [requestStatus.EXPIRED]: 100
    },
    [WorkflowMode.FULL_SEPARATION]: {
      [requestStatus.PENDING]: 15,
      [requestStatus.UNDER_REVIEW]: 30,
      [requestStatus.REVIEWED]: 50,
      [requestStatus.APPROVED]: 60,
      [requestStatus.AWAITING_EXECUTION]: 70,
      [requestStatus.EXECUTING]: 85,
      [requestStatus.EXECUTED]: 100,
      [requestStatus.EXECUTION_FAILED]: 75,
      [requestStatus.REJECTED]: 100,
      [requestStatus.CANCELLED]: 100,
      [requestStatus.EXPIRED]: 100
    }
  };
  
  const modeProgress = progressMap[workflowMode];
  if (!modeProgress) return 0;
  
  return modeProgress[status] || 0;
}

module.exports = {
  shouldAutoExecuteRequest,
  checkExecutePermission,
  resolveWorkflowMode,
  getCompleteWorkflowSettings,
  isReviewPhaseAvailable,
  isManualExecutionRequired,
  getNextStatusAfterApproval,
  requiresReviewBeforeApproval,
  getWorkflowStepDescription,
  getWorkflowProgress
};
