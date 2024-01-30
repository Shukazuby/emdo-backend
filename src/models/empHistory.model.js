module.exports = (sequelize, dataType) => {
  const empHistory = sequelize.define('empHistory', {
    jobTitle: {
      type: dataType.STRING,
      trim: true,
    },
    companyName: {
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
    from: {
      type: dataType.DATE,
      trim: true,
    },
    to: {
      type: dataType.DATE,
      trim: true,
    },
    jobDescription: {
      type: dataType.STRING,
      trim: true,
    },

  });

  return empHistory;
};
