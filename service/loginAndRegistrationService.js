var models = require('../models');
var userData = models.userData;
var authServices = require("./authServices");




var register = function (object) {
    return new Promise(function (resolve, reject) {
        return userData.findOne({
            
            where : {
              employee_code:object.employee_code
            },
            attributes : ['employee_code','email'],
            raw : true
          })
          .then((employee) => {
            if(employee && employee.employee_code && employee.email ){
                resolve({status:false,error:"employee  already registered"});
             } 
           
              else{
                userData
                .create(object)
                .then((recordadded) => {
                    return resolve(recordadded);
                })
                .catch((error) => {
                        return reject(error);
                    })
                  }
            })
        .catch((error) => {
                return reject(error);
            })
    })

}



  
let login = function(employeeCode,email){
    return new Promise(function(resolve,reject){
        authServices.getToken(employeeCode,email)
            .then((tokenObject)=>{
              authServices.saveToken(employeeCode,tokenObject.token)
              .then((saveTokenResult)=>{
                return resolve({
                  status:true,
                  employeeData:saveTokenResult,
                  token:tokenObject.token
                })
              }).catch((error)=>reject(error))
            })
        })
       }
  



exports.login = login;
exports.register = register;
