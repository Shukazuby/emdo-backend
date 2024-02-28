module.exports = (sequelize, dataType) => {
  const notification = sequelize.define('notification', {
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

  return notification;
};
