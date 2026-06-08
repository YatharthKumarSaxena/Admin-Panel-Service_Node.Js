/**
 * STATE MACHINE UTILITIES
 * 
 * Manages state transitions for the flexible workflow system.
 * Validates transitions based on workflow mode and enforces state machine rules.
 */

const { WorkflowMode } = require("../configs/workflow.config");
const { requestStatus } = require("../configs/enums.config");

/**
 * Valid State Transitions Per Workflow Mode
 * 
 * Defines allowed state transitions for each workflow mode.
 * Enforces state machine integrity and prevents invalid transitions.
 */
const WORKFLOW_TRANSITIONS = Object.freeze({
  
  /**
   * SIMPLE Mode Transitions
   * CREATE → APPROVE (auto-execute) / REJECT
   */
  [WorkflowMode.SIMPLE]: {
    [requestStatus.PENDING]: [
      requestStatus.APPROVED,
      requestStatus.REJECTED,
      requestStatus.CANCELLED,
      requestStatus.EXPIRED
    ],
    [requestStatus.APPROVED]: [
      requestStatus.EXECUTED  // Auto-execution sets this
    ],
    [requestStatus.EXECUTED]: [],  // Terminal state
    [requestStatus.REJECTED]: [],  // Terminal state
    [requestStatus.CANCELLED]: [], // Terminal state
    [requestStatus.EXPIRED]: []    // Terminal state
  },
  
  /**
   * REVIEW_OPTIONAL Mode Transitions
   * CREATE → [REVIEW] → APPROVE (auto-execute) / REJECT
   * Review can be skipped (direct to APPROVE/REJECT)
   */
  [WorkflowMode.REVIEW_OPTIONAL]: {
    [requestStatus.PENDING]: [
      requestStatus.UNDER_REVIEW,  // Enter review
      requestStatus.APPROVED,      // Skip review, direct approve
      requestStatus.REJECTED,      // Skip review, direct reject
      requestStatus.CANCELLED,
      requestStatus.EXPIRED
    ],
    [requestStatus.UNDER_REVIEW]: [
      requestStatus.REVIEWED,
      requestStatus.REJECTED,      // Can reject during review
      requestStatus.CANCELLED
    ],
    [requestStatus.REVIEWED]: [
      requestStatus.APPROVED,
      requestStatus.REJECTED,
      requestStatus.CANCELLED
    ],
    [requestStatus.APPROVED]: [
      requestStatus.EXECUTED  // Auto-execution
    ],
    [requestStatus.EXECUTED]: [],
    [requestStatus.REJECTED]: [],
    [requestStatus.CANCELLED]: [],
    [requestStatus.EXPIRED]: []
  },
  
  /**
   * CONDITIONAL_EXECUTE Mode Transitions
   * CREATE → APPROVE → EXECUTE (auto if has permission, manual otherwise)
   */
  [WorkflowMode.CONDITIONAL_EXECUTE]: {
    [requestStatus.PENDING]: [
      requestStatus.APPROVED,
      requestStatus.REJECTED,
      requestStatus.CANCELLED,
      requestStatus.EXPIRED
    ],
    [requestStatus.APPROVED]: [
      requestStatus.EXECUTED,           // If auto-execute (has permission)
      requestStatus.AWAITING_EXECUTION  // If manual execute required
    ],
    [requestStatus.AWAITING_EXECUTION]: [
      requestStatus.EXECUTING,
      requestStatus.CANCELLED
    ],
    [requestStatus.EXECUTING]: [
      requestStatus.EXECUTED,
      requestStatus.EXECUTION_FAILED
    ],
    [requestStatus.EXECUTION_FAILED]: [
      requestStatus.EXECUTING  // Retry execution
    ],
    [requestStatus.EXECUTED]: [],
    [requestStatus.REJECTED]: [],
    [requestStatus.CANCELLED]: [],
    [requestStatus.EXPIRED]: []
  },
  
  /**
   * FULL_SEPARATION Mode Transitions
   * CREATE → REVIEW → APPROVE → EXECUTE (all manual)
   */
  [WorkflowMode.FULL_SEPARATION]: {
    [requestStatus.PENDING]: [
      requestStatus.UNDER_REVIEW,
      requestStatus.CANCELLED,
      requestStatus.EXPIRED
    ],
    [requestStatus.UNDER_REVIEW]: [
      requestStatus.REVIEWED,
      requestStatus.REJECTED,
      requestStatus.CANCELLED
    ],
    [requestStatus.REVIEWED]: [
      requestStatus.APPROVED,
      requestStatus.REJECTED,
      requestStatus.CANCELLED
    ],
    [requestStatus.APPROVED]: [
      requestStatus.AWAITING_EXECUTION  // Always manual execution
    ],
    [requestStatus.AWAITING_EXECUTION]: [
      requestStatus.EXECUTING,
      requestStatus.CANCELLED
    ],
    [requestStatus.EXECUTING]: [
      requestStatus.EXECUTED,
      requestStatus.EXECUTION_FAILED
    ],
    [requestStatus.EXECUTION_FAILED]: [
      requestStatus.EXECUTING  // Retry
    ],
    [requestStatus.EXECUTED]: [],
    [requestStatus.REJECTED]: [],
    [requestStatus.CANCELLED]: [],
    [requestStatus.EXPIRED]: []
  }
});

/**
 * Validate State Transition
 * 
 * Checks if a state transition is valid based on workflow mode.
 * 
 * @param {string} currentStatus - Current request status
 * @param {string} newStatus - Desired new status
 * @param {string} workflowMode - Workflow mode of the request
 * @param {object} context - Additional context (optional)
 * @returns {object} { valid: boolean, error?: string }
 */
function validateWorkflowTransition(currentStatus, newStatus, workflowMode, context = {}) {
  // Validate inputs
  if (!currentStatus || !newStatus || !workflowMode) {
    return {
      valid: false,
      error: "Missing required parameters for state transition validation"
    };
  }
  
  // Get valid transitions for workflow mode
  const transitions = WORKFLOW_TRANSITIONS[workflowMode];
  
  if (!transitions) {
    return {
      valid: false,
      error: `Invalid workflow mode: ${workflowMode}`
    };
  }
  
  // Check if current status exists in transition map
  if (!transitions[currentStatus]) {
    return {
      valid: false,
      error: `Invalid current status: ${currentStatus} for workflow mode ${workflowMode}`
    };
  }
  
  // Get allowed next states
  const allowedNextStates = transitions[currentStatus];
  
  // Check if transition is allowed
  if (!allowedNextStates.includes(newStatus)) {
    return {
      valid: false,
      error: `Invalid state transition from ${currentStatus} to ${newStatus} in ${workflowMode} mode. Allowed: ${allowedNextStates.join(', ') || 'none (terminal state)'}`
    };
  }
  
  return { valid: true };
}

/**
 * Get Allowed Next States
 * 
 * Returns list of valid next states for current request state.
 * 
 * @param {string} currentStatus - Current request status
 * @param {string} workflowMode - Workflow mode
 * @returns {array} Array of allowed next states
 */
function getAllowedNextStates(currentStatus, workflowMode) {
  const transitions = WORKFLOW_TRANSITIONS[workflowMode];
  
  if (!transitions || !transitions[currentStatus]) {
    return [];
  }
  
  return transitions[currentStatus];
}

/**
 * Check if Status is Terminal
 * 
 * Determines if a status is a terminal state (no further transitions).
 * 
 * @param {string} status - Request status
 * @param {string} workflowMode - Workflow mode
 * @returns {boolean} True if terminal state
 */
function isTerminalState(status, workflowMode) {
  const allowedNext = getAllowedNextStates(status, workflowMode);
  return allowedNext.length === 0;
}

/**
 * Check if Request Can Be Reviewed
 * 
 * Determines if a request is in a state where it can be reviewed.
 * 
 * @param {string} status - Current request status
 * @param {string} workflowMode - Workflow mode
 * @returns {boolean} True if can be reviewed
 */
function canBeReviewed(status, workflowMode) {
  const reviewableStates = [requestStatus.PENDING, requestStatus.UNDER_REVIEW];
  const reviewSupportedModes = [WorkflowMode.REVIEW_OPTIONAL, WorkflowMode.FULL_SEPARATION];
  
  return reviewableStates.includes(status) && reviewSupportedModes.includes(workflowMode);
}

/**
 * Check if Request Can Be Approved
 * 
 * Determines if a request is in a state where it can be approved.
 * 
 * @param {string} status - Current request status
 * @param {string} workflowMode - Workflow mode
 * @returns {boolean} True if can be approved
 */
function canBeApproved(status, workflowMode) {
  const approvableStates = {
    [WorkflowMode.SIMPLE]: [requestStatus.PENDING],
    [WorkflowMode.REVIEW_OPTIONAL]: [requestStatus.PENDING, requestStatus.REVIEWED],
    [WorkflowMode.CONDITIONAL_EXECUTE]: [requestStatus.PENDING],
    [WorkflowMode.FULL_SEPARATION]: [requestStatus.REVIEWED]
  };
  
  const validStates = approvableStates[workflowMode] || [];
  return validStates.includes(status);
}

/**
 * Check if Request Can Be Executed
 * 
 * Determines if a request is in a state where it can be executed.
 * 
 * @param {string} status - Current request status
 * @param {string} workflowMode - Workflow mode
 * @returns {boolean} True if can be executed
 */
function canBeExecuted(status, workflowMode) {
  const executableStates = [
    requestStatus.APPROVED,
    requestStatus.AWAITING_EXECUTION,
    requestStatus.EXECUTION_FAILED  // Can retry
  ];
  
  return executableStates.includes(status);
}

/**
 * Get State Transition Path
 * 
 * Returns the expected path from current state to target state.
 * Useful for UI display and validation.
 * 
 * @param {string} currentStatus - Current status
 * @param {string} targetStatus - Target status
 * @param {string} workflowMode - Workflow mode
 * @returns {array|null} Path array or null if no valid path
 */
function getTransitionPath(currentStatus, targetStatus, workflowMode) {
  if (currentStatus === targetStatus) return [currentStatus];
  
  const transitions = WORKFLOW_TRANSITIONS[workflowMode];
  if (!transitions) return null;
  
  // BFS to find shortest path
  const queue = [[currentStatus]];
  const visited = new Set([currentStatus]);
  
  while (queue.length > 0) {
    const path = queue.shift();
    const current = path[path.length - 1];
    
    const nextStates = transitions[current] || [];
    
    for (const next of nextStates) {
      if (next === targetStatus) {
        return [...path, next];
      }
      
      if (!visited.has(next)) {
        visited.add(next);
        queue.push([...path, next]);
      }
    }
  }
  
  return null;  // No valid path
}

module.exports = {
  WORKFLOW_TRANSITIONS,
  validateWorkflowTransition,
  getAllowedNextStates,
  isTerminalState,
  canBeReviewed,
  canBeApproved,
  canBeExecuted,
  getTransitionPath
};
