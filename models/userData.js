module.exports = function(sequelize, DataTypes) {
    /********* employee_data ************/
  
    return sequelize.define('user_data', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
      employee_code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true
      },
    
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
   
      organization_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
    
    }, {
      freezeTableName: true
    });
  
  };
  