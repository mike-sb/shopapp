'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
      createdAt:{
        type: DataTypes.DATE,
        allowNull:false,
    },
    updatedAt:{
        type: DataTypes.DATE,
        allowNull:true,
    }
  });
  return User;
}