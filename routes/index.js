
var employeeRoutes = require('./employeeRoutes');
var loginAndRegistrationRoutes = require('./loginAndRegistrationRoutes')

module.exports = function(app) {
    employeeRoutes(app),
    loginAndRegistrationRoutes(app)
}
