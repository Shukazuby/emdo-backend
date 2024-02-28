const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { userService } = require("../services");
const { uploader } = require("../config/cloudinary");
const { dataUri } = require("../config/multer");

const createEmployer = async (id, employerBody, file) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const fileUri = dataUri(file);

  const logoFile = await uploader.upload(fileUri.content);

  const employer = await db.employers.create({
    ...employerBody,
    logo: logoFile.secure_url,
    userId: user.id,
  });
  return employer;
};

const updateEmployer = async (updateBody, id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  await db.users.update(updateBody, {
    where: { id },
  });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const updateEmployer = await db.employers.update(updateBody, {
    where: {
      userId: user.id,
    },
  });
  return updateEmployer;
};

// const getEmployerByUserId = async (id) => {
//   const employer = await db.employers.findOne({ where: { id } });
//   if (!employer) {
//     throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
//   }
//   return employer;
// };

const getAllEmployerData = async (id) => {
  const user = await db.users.findOne({
    where: { id },
    include: { model: db.employers },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  return user;
};

const adminGetAllEmployerData = async (id, employerId) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employer = await db.employers.findOne({
    where: { id: employerId },
    include: { model: db.users },
  });

  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employer not found");
  }

  return employer;
};

const getAllEmployers = async (id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employers = await db.employers.findAndCountAll({
    include: { model: db.users },
  });

  if (!employers) {
    throw new ApiError(httpStatus.NOT_FOUND, "No employer fetched");
  }

  return employers;
};

const getApprovedEmployers = async (id) => {
  const user = await db.users.findOne({ where: { id } });

  const employers = await db.employers.findAll({
    where: {
      verification: "verified",
    },
    include: { model: db.users },
  });
  if (!employers) {
    throw new ApiError(httpStatus.NOT_FOUND, "No approved employers found");
  }

  return employers;
};

const getAnApprovedEmployer = async (id, employerId) => {
  const user = await db.users.findOne({ where: { id } });

  const employers = await db.employers.findOne({
    where: {
      id: employerId,
      verification: "verified",
    },
    include: { model: db.users },
  });

  if (!employers) {
    throw new ApiError(httpStatus.NOT_FOUND, "approved employer not found");
  }

  return employers;
};

const deleteAnApprovedEmployer = async (id, employerId) => {
  const user = await db.users.findOne({ where: { id } });

  const employers = await db.employers.destroy({
    where: {
      id: employerId,
      verification: "verified",
    },
    include: { model: db.users },
  });

  if (!employers) {
    throw new ApiError(httpStatus.NOT_FOUND, "No approved employers found");
  }

  return employers;
};

module.exports = {
  createEmployer,
  updateEmployer,
  getAllEmployerData,
  adminGetAllEmployerData,
  getAllEmployers,
  getApprovedEmployers,
  getAnApprovedEmployer,
  deleteAnApprovedEmployer,
};
