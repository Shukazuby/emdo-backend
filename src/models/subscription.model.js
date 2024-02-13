module.exports = (sequelize, datatypes) => {
  const subscription = sequelize.define('subscription', {
    startDate: {
      type: datatypes.DATE,
    },
    endDate: {
      type: datatypes.DATE,
    },
    status:{
      type: datatypes.ENUM('active', 'canceled', 'expired'),
    },
  });
  return subscription;
};