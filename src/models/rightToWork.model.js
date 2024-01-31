module.exports = (sequelize, dataType) => {
  const rightToWork = sequelize.define('rightToWork', {
    rightToWork: {
      type: dataType.STRING,
      trim: true,
    },
    shareCode: {
      type: dataType.STRING,
      trim: true,
    },
    dbsNumber: {
      type: dataType.STRING,
      trim: true,
    },

  });

  return rightToWork;
};
