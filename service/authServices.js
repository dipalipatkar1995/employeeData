const constants = require('../config/constants');
var models = require('../models');
var userData = models.userData;
const bcrypt = require('bcrypt');
var authToken = models.authToken;
const JWT = require('jsonwebtoken');
const { required } = require('@hapi/joi');
var moment = require('moment');




var errors = {
    Runtime: {
      json: {
        code: "ERR41000",
        message: "Runtime Exception Occurred.",
        description: "Runtime Exception Occurred."
      },
      status: 503
    },
    unAuthorizedError: {
      json: {
        code: "ERR45000",
        message: "UnAuthorized user",
        description: "UnAuthorized user"
      },
      status: 401
    },
    invalidTokenError: {
      json: {
        code: "ERR46000",
        message: "Invalid or missing token",
        description: "Invalid or missing token"
      },
      status: 401
    },
    invalidInput: {
      json: {
        code: "ERR47000",
        message: "Missing or invalid username or password",
        description: "Please send username and password"
      },
      status: 400
    },
    EmpNotFound: {
      json: {
        code: "ERR48000",
        message: "Employee Not Found",
        description: "Employee Not Found"
      },
      status: 404
    },
  };
  
  var errorHandler = function(errName, res) {
    if (errors[errName])
      res.status(errors[errName].status).send(errors[errName].json);
    else {
      var ret = errors["Runtime"].json;
      ret.description = errName;
      res.status(500).send(ret);
    }
  };
  


let userLoginOrRegister = function(email, password){
  return new Promise(function(resolve, reject) {
    return userData.findOne({
        where : {
         email :email,
         password:password
       
       },
       attributes : ['email','employee_code'],
       raw : true
     })
     .then((userData) => {
         return resolve(userData);
     
 })
 .catch((error) => {
     return reject(error);
 })
  })
  
}



var checkValidUser = function (email,password) {
    return new Promise(function (resolve, reject) {
        return userData.findOne({
            where : {
             email :email,
             password:password
           
           },
           attributes : ['email','employee_code'],
           raw : true
         })
         .then((userData) => {
             return resolve(userData);
         
     })
     .catch((error) => {
         return reject(error);
     })
    })
}



let getToken = function(employeeCode,email) {
  return new Promise(function(resolve, reject) {
    var options = {
      algorithm: constants.JWT_TOKEN_ALGORITHM_TYPE,
      expiresIn: constants.JWT_ACCESS_TOKEN_EXPIRY_TIME
    };
    var payload = {
        "email": email,
        "employee_code": employeeCode,
       
    };
    let token = JWT.sign(payload, constants.JWT_SECRET_FOR_ACCESS_TOKEN, options);
    console.log("the value of token is"+token);
    return resolve({token:token});
  });
}

let saveToken = function(employeeCode,token) {
  return new Promise(function(resolve, reject) {
    
    //delete existing token
    authToken.destroy({
      where: {
        "employee_code": employeeCode
      }
    }).then((result)=>{
      // add new token
      authToken.create({
          "employee_code": employeeCode,
          "token": token
      })
      .then((result)=>{
        return resolve({status:true,message:"token saved"},result);
      })
      .catch((error)=>{ 
        return reject(new Error("InvalidTokenError"));
      });
    })
    .catch((error)=>{
      return reject(new Error("AccessDenied"));
    });
  });
}


//verify token


let verifyTokenMiddleware = function(req, res, next) {
    console.log("comes into the loop")
    
    if (req.headers['authorization']) {
        var authToken = req.headers['authorization'];
        var arr = authToken.split(' ');
      if (arr[0] === 'Bearer' && arr.length === 2) {
        var accessToken = arr[1];
        if (accessToken) {
          try {
            var decodedToken = JWT.decode(accessToken, {
              complete: true
            });
            if (!decodedToken) {
                errorHandler("invalidTokenError", res);
            }
  
            JWT.verify(accessToken, constants.JWT_SECRET_FOR_ACCESS_TOKEN, (err, authorizedData) => {
              if(err){
                  console.log(err);
                  errorHandler("invalidTokenError", res);
                  return;
              }
              verifyTokenFromDatabase(decodedToken.payload.employee_code,accessToken)
              .then((result)=>{
                if(result.sucess == "true"){
                  var req_decoded=decodedToken.payload;
                  var res_decoded=JWT.decode(result.data.token, {
                      complete: true
                  }).payload;
                  if(matchTokens(req_decoded,res_decoded)){
                      req.decoded = req_decoded;
                      next();
                  }
                  else{
                      errorHandler("invalidTokenError", {message:"Invalid user authentication"});
                  }
                } else {
                  errorHandler("invalidTokenError", res);
                }
              });
            });
  
          } catch (e) {
            console.log(e);
            errorHandler("invalidTokenError", res);
          }
        }
  
      } else {
        console.log(" auth err");
        errorHandler("invalidTokenError", res);
        return;
      }
    } else {
      errorHandler("invalidTokenError", res);
    }
  }
  
  let verifyTokenFromDatabase = function(employee_code, token) {
    return new Promise(function(resolve, reject) {
      authToken.findOne({
        where: {
          employee_code: employee_code,
          token: token
        }
      }).
      then(function(result) {
        if(result == null){
          errorHandler("invalidTokenError", res);
        } else {
          return resolve({sucess : "true",data:result});
        }
      }).
      catch(function(error) {
        return resolve({sucess : "false"},error);
      });
    });
  }
  function matchTokens(token1,token2){
    var keys_token1=Object.keys(token1);
    var keys_token2=Object.keys(token2);
    var match_keys=true;
    keys_token1.forEach((item)=>{ match_keys=(keys_token2.indexOf(item)==-1)?false:true});
    if(match_keys){
      var match_values=true;
      keys_token1.forEach((item)=>{match_values=(token1[item]==token2[item])});
      return match_values;
    }
    return false;
  }
  

exports.getToken = getToken;
exports.saveToken = saveToken;
exports.userLoginOrRegister = userLoginOrRegister;
exports.checkValidUser =checkValidUser;
exports.verifyTokenMiddleware = verifyTokenMiddleware;
