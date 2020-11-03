var loginAndRegistrationService = require("../service").loginAndRegistrationService;
var authServices = require("../service").authServices;
const { required } = require("@hapi/joi");
const Joi = require('@hapi/joi');
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment');


var register = function(req, res, next) {
    const schema = Joi.object().keys({
        firstName: Joi.string().required(),
        lastName:Joi.string().required(),
        password: Joi.string().required(),
        organizationName:Joi.string().optional(),
        employeeCode:Joi.string().required(),
        email:Joi.string().required()
       
     });
        return Joi.validate(req.body, schema, function (err, params) {
            if (err) {
                next(err);
                return;
            }
            let object = {
                first_name:params.firstName,
                last_name:params.lastName,
                password:params.password,
                organization_name:params.organizationName,
                email:params.email,
                employee_code:params.employeeCode
            }
            loginAndRegistrationService.register(object)
            .then((result)=>{
                res.status(200).send({success:true,data:result});
              });
        });
};


// Login Api
let login = function(req, res, next) {
    const schema = Joi.object().keys({
      email:Joi.string().required(),
      password: Joi.string().required()
    });
     Joi.validate(req.body, schema, function(error, params){
      if(error){
        next(error)
      }else{

        authServices.checkValidUser(params.email, params.password)
          .then((result)=>{
              if(error){
                console.log("Error adding employee engagement logs:: ", error);
              }

              if(result){
                loginAndRegistrationService.login(result.employee_code,result.email)
                .then((result)=>{
                    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
                    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
                    res.setHeader('Authorization', 'Bearer ' + result.token);
                    res.status(200).send({
                      status:true,
                      employeeData:result.employeeData,
                      date: moment().format("MM-DD")
                    });
                  })
                
                .catch((error)=>{
                  next(error);
                })
            }
            else{
                res.status(400).send({
                    status:false,
                    err:"Invalid User"
                });
            }
        })
          .catch((error)=>{
            next(error);
          })
      }
    })
  }
  

  exports.login = login;
  exports.register = register;