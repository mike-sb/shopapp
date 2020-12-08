'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      }, username: {
      	allowNull: false,
      	type: Sequelize.STRING
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull:false,
    },
    updatedAt:{
        type: Sequelize.DATE,
        allowNull:true,
    }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
}