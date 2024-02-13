module.exports = (sequelize, datatypes) => {
  const plan = sequelize.define('plan', {
    billingCycle: {
      type: datatypes.ENUM('monthly', 'yearly'),
    },
    planName: {
      type: datatypes.ENUM('Basic', 'Standard'),
    },
    amount:{
      type: datatypes.STRING,
    },
    priceId:{
      type: datatypes.STRING,
    }
  });
  return plan;
};