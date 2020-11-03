
const loginAndRegistrationController = require('../controller').loginAndRegistrationController;


module.exports = function(app) {
  app.post('/register',loginAndRegistrationController.register);
  app.post('/login',loginAndRegistrationController.login);

  
}
