const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { Op } = require("sequelize");

const sendNotification = async (senderId, receiverId) => {
  const user = await db.users.findOne({ where: { id: senderId } });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const jobApply = await db.jobApply.findOne({
    where: {
      [Op.or]: [{ employerId: senderId }, { employeeId: receiverId }],
    },
  });
  if (!jobApply) {
    throw new Error("Application not found");
  }

  let notificationContent = "";
  if (jobApply.status === "applied") {
    notificationContent = `Someone applied for your job "${jobApply.job.title}"`;
  } else if (jobApply.status === "confirmed") {
    notificationContent = `Your application for the job "${jobApply.job.title}" has been confirmed by the employer`;
  } else if (jobApply.status === "declined") {
    notificationContent = `Your application for the job "${jobApply.job.title}" has been declined by the employer`;
  } else if (jobApply.status === "approved") {
    notificationContent = `Congratulations! Your application for the job "${jobApply.job.title}" has been approved by the employer`;
  } else if (jobApply.status === "rejected") {
    notificationContent = `Unfortunately, your application for the job "${jobApply.job.title}" has been rejected by the employer`;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid status");
  }

  const notification = await db.notifications.create({
    senderId,
    receiverId,
    content: notificationContent,
  });

  console.log(notification);
  return notification;
};

module.exports = {
  sendNotification,
};
