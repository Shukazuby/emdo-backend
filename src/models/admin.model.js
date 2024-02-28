module.exports = (sequelize, dataType) => {
  const admin = sequelize.define('admin', {
    accessLevel: {
      type: dataType.ENUM('superAdmin', 'standard'),
      defaultValue: 'superAdmin',
    },    
  });

  return admin;
};
