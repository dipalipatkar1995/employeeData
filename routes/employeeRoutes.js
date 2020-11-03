
const addEmployeeController = require('../controller').addEmployeeController;
const getEmployeeController = require('../controller').getEmployeeController;

const authService = require('../service').authServices;

module.exports = function(app) {
  app.post('/employee/get',authService.verifyTokenMiddleware,getEmployeeController.getEmployeeData);


}
