const { REQUEST_ROUTES } = require("@configs/uri.config");

const {  
  CREATE_DEACTIVATION_REQUEST,
  APPROVE_DEACTIVATION_REQUEST, REJECT_DEACTIVATION_REQUEST,
  CREATE_ACTIVATION_REQUEST,
  APPROVE_ACTIVATION_REQUEST, REJECT_ACTIVATION_REQUEST,
  VIEW_STATUS_REQUEST,
  LIST_ALL_STATUS_REQUESTS
} = REQUEST_ROUTES;

const { requestMiddlewares } = require("@middlewares/requests/index");
const { commonMiddlewares } = require("@middlewares/common/index");
const { requestControllers } = require("@controllers/requests/index");
const { baseMiddlewares } = require("./middleware.gateway");

const requestRoutes = require("express").Router();

// ========== 🔄 DEACTIVATION REQUEST ROUTES ==========

// Create deactivation request (self)
requestRoutes.post(`${CREATE_DEACTIVATION_REQUEST}`,
  [
    ...baseMiddlewares,
    requestMiddlewares.validateCreateDeactivationRequestBody,
    requestMiddlewares.validateCreateDeactivationRequestFields
  ],
  requestControllers.createDeactivationRequest
);

// List all deactivation requests
requestRoutes.get(`${LIST_ALL_STATUS_REQUESTS}`,
  [
    ...baseMiddlewares
  ],
  requestControllers.listAllStatusRequests
);

// Approve deactivation request
requestRoutes.post(`${APPROVE_DEACTIVATION_REQUEST}`,
  [
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    requestMiddlewares.validateApproveDeactivationRequestBody,
    requestMiddlewares.validateApproveDeactivationRequestFields
  ],
  requestControllers.approveDeactivationRequest
);

// Reject deactivation request
requestRoutes.post(`${REJECT_DEACTIVATION_REQUEST}`,
  [
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    requestMiddlewares.validateRejectDeactivationRequestBody,
    requestMiddlewares.validateRejectDeactivationRequestFields
  ],
  requestControllers.rejectDeactivationRequest
);

// ========== 🔄 ACTIVATION REQUEST ROUTES =========
requestRoutes.post(`${CREATE_ACTIVATION_REQUEST}`,
  [
    ...baseMiddlewares,
    commonMiddlewares.authModeValidator,
    requestMiddlewares.validateCreateActivationRequestBody,
    requestMiddlewares.validateCreateActivationRequestFields,
    commonMiddlewares.fetchAdminMiddleware,
    commonMiddlewares.hierarchyGuard
  ],
  requestControllers.createActivationRequest
);

// Approve activation request
requestRoutes.post(`${APPROVE_ACTIVATION_REQUEST}`,
  [
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    requestMiddlewares.validateApproveActivationRequestBody,
    requestMiddlewares.validateApproveActivationRequestFields
  ],
  requestControllers.approveActivationRequest
);

// Reject activation request
requestRoutes.post(`${REJECT_ACTIVATION_REQUEST}`,
  [
    ...baseMiddlewares,
    commonMiddlewares.midAdminsAndSuperAdmins,
    requestMiddlewares.validateRejectActivationRequestBody,
    requestMiddlewares.validateRejectActivationRequestFields
  ],
  requestControllers.rejectActivationRequest
);

// View specific status request (activation or deactivation)
requestRoutes.get(`${VIEW_STATUS_REQUEST}`,
  [
    ...baseMiddlewares
  ],
  requestControllers.viewStatusRequest
);

module.exports = {
  requestRoutes
}