module.exports = (sequelize, dataType) => {
  const newAdmin = sequelize.define('newAdmin', {
    accessLevel: {
      type: dataType.ENUM('superAdmin', 'administrator', 'standard'),
      defaultValue: 'superAdmin',
    },   
    firstName:{
      type: dataType.STRING
    },
    lastName:{
      type: dataType.STRING
    },
  });

  return newAdmin;
};
