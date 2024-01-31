module.exports = (sequelize, dataType) => {
  const cv = sequelize.define('cv', {
    cv: {
      type: dataType.STRING,
      trim: true,
    },

  });

  return cv;
};
