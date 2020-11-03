
var constants = require('../config/constants.js');
var getEmployeeService = require("../service").getEmployeeService;
const Joi = require('@hapi/joi');



var getEmployeeData = function(req, res, next) {
    const schema = Joi.object().keys({
        search:Joi.string().optional(),
        limit: Joi.number().optional(),
        page: Joi.number().optional(),
        offset: Joi.number().optional()
     });
        return Joi.validate(req.body, schema, function (err, params) {

            if (err) {
                next(err);
                return;
            }
            var limit = req.body.limit ? req.body.limit : constants.list.limit;
            var page = req.body.page ? req.body.page : constants.list.page;
            var offset = (page > 0) ? (page - 1) * limit : constants.list.offset;

            getEmployeeService.getEmployeeData(limit,page,offset,params.search)
            .then((result)=>{
                res.status(200).send({success:true,data:result});
              });
        });
};

exports.getEmployeeData = getEmployeeData;