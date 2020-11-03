
var models = require('../models');
var userData = models.userData;
var employee = models.employee;
var ld = require('lodash');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;


var getEmployeeData = function(limit,page,offset,search) {
    return new Promise(function (resolve, reject) {
        var resultfinal = {};
        var queryCondition = {};
    
            queryCondition = {
                [Op.or]: [{first_name: {[Op.like]: search + '%'}},
                { last_name: {[Op.like]: search + '%'} },
                {employee_code: {[Op.like]: search + '%'}}]
              };
           
        
              userData
            .findAll({
                where:queryCondition,
                raw: true,
                order: [
                    ['first_name', 'asc'],
                    ['last_name', 'asc'],
                    ['email', 'asc'],
                    ['employee_code', 'asc']
                 ],
                 attributes:['first_name','last_name','email','employee_code','organization_name']
               
            })
            .then((employeeCount) => {
                   resultfinal.employeeCount = employeeCount.length;
                    resultfinal.employeeDetails = ld.slice(employeeCount, offset, offset + limit);
                    return resolve(resultfinal);
                
            })
            .catch((error) => {
                return reject(error);
            })
    })

}

      
exports.getEmployeeData = getEmployeeData;


