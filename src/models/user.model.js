const validator = require('validator');

module.exports = (sequelize, dataType) => {
  const user = sequelize.define('users', {
    fullName: {
      type: dataType.STRING,
      allowNull: false,
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
    password: {
      type: dataType.STRING,
      allowNull: false,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
    isEmailVerified: {
      type: dataType.BOOLEAN,
      defaultValue: false,
    },
    userType: {
      type: dataType.ENUM('employer', 'employee'),
      trim: true
    },
    addressLine1: {
      type: dataType.STRING,
      trim: true,
    },
    addressLine2: {
      type: dataType.STRING,
      trim: true,
    },
    city: {
      type: dataType.STRING,
      trim: true,
    },
    country: {
      type: dataType.STRING,
      trim: true,
    },
    postcode: {
      type: dataType.STRING,
      trim: true,
    },
    industry: {
      type: dataType.STRING,
      trim: true,
    },
    phoneNumber: {
      type: dataType.STRING,
      trim: true,
    },

  });

  return user;
};
