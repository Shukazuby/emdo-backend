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
    verification: {
      type: dataType.ENUM('verified', 'rejected', 'pending'),
      defaultValue: 'pending',
      trim: true,
    },


  });

  return employee;
};
