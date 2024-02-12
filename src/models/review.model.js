const validator = require('validator');
module.exports = (sequelize, dataType) => {
  const review = sequelize.define("review", {
    stars: {
      type: dataType.INTEGER,
      validate:{
        min: 1,
        max: 5,
      },
    },
    message: {
      type: dataType.STRING,
      trim: true,
    },
  });

  return review;
};
