module.exports = function(sequelize, DataTypes) {
    /********* employee_data ************/
  
    return sequelize.define('auth_token', {
        id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      employee_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      freezeTableName: true
    });
  
  };
  