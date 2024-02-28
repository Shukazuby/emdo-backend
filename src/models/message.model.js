module.exports = (sequelize, dataType) => {
  const message = sequelize.define('message', {
    name: {
      type: dataType.STRING,
      trim: true,
    },
    content: {
      type: dataType.STRING,
      trim: true,
    },
    receiverId:{
      type: dataType.STRING,
      trim: true,
    },
    senderId:{
      type: dataType.STRING,
      trim: true,
    }

  });

  return message;
};
