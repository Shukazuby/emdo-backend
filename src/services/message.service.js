const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
// const server = require("../index");
const { Op } = require("sequelize");

const sendMessage = async (senderId, receiverId, content) => {
  const user = await db.users.findOne({ where: { id: senderId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const message = await db.messages.create({
    senderId,
    receiverId,
    content,
  });

  console.log(message);

  return message;
};

const getBothMessages = async (senderId, receiverId) => {
  const user = await db.users.findOne({ where: { id: senderId } });

  if (!user ) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const messages = await db.messages.findAll({
    where: {
      [Op.or]: [
        {
          senderId: senderId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId, 
          receiverId: senderId,
        },
      ],
    },
  });

  return messages;
};

const getAllReceiversBySenderId = async (senderId) => {
  const sender = await db.users.findOne({ where: { id: senderId } });

  if (!sender) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const receivers = await db.messages.findAll({
    where: {
      senderId: senderId
    },
    attributes: ['receiverId'], 
    group: ['receiverId'], 
    raw: true 
  });

  const receiverIds = receivers.map(receiver => receiver.receiverId);
  const receiverUsers = await db.users.findAll({
    where: {
      id: receiverIds
    },
    attributes: ['id', 'fullName', 'email', 'userType', 'picture'], 
    // raw: true 
  });

  return receiverUsers;
};

module.exports = {
  sendMessage,
  getBothMessages,
  getAllReceiversBySenderId,
};
