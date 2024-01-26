module.exports = (sequelize, dataType) => {
  const teamManager = sequelize.define('teamManager', {
    fullName: {
      type: dataType.STRING,
      trim: true,
    },

    email: {
      type: dataType.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    accessLevel: {
      type: dataType.ENUM('administrator', 'standard'),
      trim: true,
    },

    
  });

  return teamManager;
};
