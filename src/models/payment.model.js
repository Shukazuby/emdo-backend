module.exports = (sequelize, datatypes) => {
  const payment = sequelize.define('payment', {
    status:{
      type: datatypes.ENUM('successful', 'pending', 'failed'),
    },
    amount:{
      type: datatypes.INTEGER,
    },
    sessionId:{
      type: datatypes.STRING,
    }
  });
  return payment;
};