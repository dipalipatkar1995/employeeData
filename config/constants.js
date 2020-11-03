let constants = {};

constants.JWT_ACCESS_TOKEN_EXPIRY_TIME = '30m';
constants.JWT_SECRET_FOR_ACCESS_TOKEN = 'XBNPRpRuehFsyMa2';
constants.JWT_TOKEN_ALGORITHM_TYPE = 'HS256';



//pagination

constants.list = {
    limit: 10,
    offset: 0,
    page: 1
  }
  


module.exports = constants;
