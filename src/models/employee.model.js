module.exports = (sequelize, dataType) => {
  const employee = sequelize.define('employee', {
    categoryOfJobSought: {
      type: dataType.STRING,
      trim: true,
    },
    cv: {
      type: dataType.STRING,
      trim: true,
    },
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

  return employee;
};
