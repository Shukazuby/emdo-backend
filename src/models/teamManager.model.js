module.exports = (sequelize, dataType) => {
  const teamManager = sequelize.define('teamManager', {
    accessLevel: {
      type: dataType.ENUM('administrator', 'standard'),
      trim: true,
    },    
  });

  return teamManager;
};
