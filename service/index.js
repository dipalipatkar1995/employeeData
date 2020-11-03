const { required } = require('@hapi/joi');

module.exports = {
    loginAndRegistrationService:require('./loginAndRegistrationService'),
    authServices:require('./authServices'),
    getEmployeeService:require('./getEmployeeService')
}
  