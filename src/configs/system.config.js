module.exports = {
  adminRegistrationCapacity: Number(process.env.ADMIN_REGISTRATION_CAPACITY),
  totalRequestCapacity: Number(process.env.REQUEST_DATA_CAPACITY),
  userRegistrationCapacity: Number(process.env.USER_REGISTRATION_CAPACITY),
  IP_Address_Code: process.env.IP_ADDRESS_CODE,
  adminIDPrefix: "ADM",
  requestIDPrefix: "REQ"
};