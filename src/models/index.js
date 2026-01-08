const { ActivityTrackerModel } = require("./activity-tracker.model");
const { AdminModel } = require("./admin.model");
const { UserModel } = require("./user.model");
const { AdminStatusRequestModel } = require("./admin-status-request.model");
const { DeviceModel } = require("./device.model");

const models = {
  ActivityTrackerModel,
  AdminModel,
  UserModel,
  AdminStatusRequestModel,
  DeviceModel
}

module.exports = {
  ...models
};