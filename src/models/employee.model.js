module.exports = (sequelize, dataType) => {
  const employee = sequelize.define('employee', {
    categoryOfJobSought: {
      type: dataType.STRING,
      trim: true,
    },

  });

  return employee;
};
