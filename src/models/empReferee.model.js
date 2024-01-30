const validator = require('validator');
module.exports = (sequelize, dataType) => {
  const referee = sequelize.define('referee', {
    title: {
      type: dataType.ENUM('miss', 'mr', 'dr', 'mrs'),
      trim: true,
    },
    firstName: {
      type: dataType.STRING,
      trim: true,
    },
    lastName: {
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
    phoneNumber: {
      type: dataType.STRING,
      trim: true,
    },
    position: {
      type: dataType.STRING,
      trim: true,
    },
    organization: {
      type: dataType.STRING,
      trim: true,
    },
    orgAddress: {
      type: dataType.STRING,
      trim: true,
    },
    city: {
      type: dataType.STRING,
      trim: true,
    },
    postCode: {
      type: dataType.STRING,
      trim: true,
    },
    country: {
      type: dataType.STRING,
      trim: true,
    },
    refereeFile:{
      type: dataType.STRING,
      trim: true,
    }

  });

  return referee;
};
