module.exports = (sequelize, dataType) => {
  const employee = sequelize.define('employee', {
    categoryOfJobSought: {
      type: dataType.STRING,
      trim: true,
    },
    bank: {
      type: dataType.STRING,
      trim: true,
    },
    accountNumber: {
      type: dataType.INTEGER,
      trim: true,
    },


  });

  return employee;
};
