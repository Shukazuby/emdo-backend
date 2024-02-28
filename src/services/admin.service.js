const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { userService } = require(".");

const createAdmin = async (id, adminBody) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const admin = await db.admins.create({
    ...adminBody,
    userId: user.id,
  });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
  }
  return admin;
};

const updateAdmin = async (id, updateBody) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  await db.users.update(updateBody, { where: { id } });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const updateAdmin = await db.admins.update(updateBody, {
    where: {
      userId: user.id,
    },
  });
  return updateAdmin;
};

const updateNewAdminsByUserId = async (id, updateBody) => {
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

  if (updateBody.accessLevel || updateBody.adminId) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not allowed to update this field"
    );
  }
  const updateAdmin = await db.newAdmins.update(updateBody, {
    where: {
      userId: user.id,
    },
  });
  return updateAdmin;
};

const updateNewAdmins = async (id, updateBody, adminId) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const admin = await db.newAdmins.findOne({
    where: { id: adminId },
    include: { model: db.users, as: "user" },
  });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
  }

  const updateUser = await db.users.update(updateBody, {
    where: { id: admin.user.id },
  });

  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const updateAdmin = await db.newAdmins.update(updateBody, {
    where: {
      id: adminId,
      adminId: user.id,
    },
  });

  return { updateUser, updateAdmin };
};

const getAdminByUserId = async (id) => {
  const admin = await db.admins.findOne({ where: { id } });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
  }
  return admin;
};

const getAllAdminData = async (id) => {
  const user = await db.users.findOne({
    where: { id },
    include: { model: db.admins },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  return user;
};

const addNewAdmin = async (id, adminBody) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const admin = await db.admins.findOne({
    where: { userId: user.id },
  });
  if (!admin) {
    throw new ApiError(httpStatus.NOT_FOUND, "admin not found");
  }

  const newAdmin = await userService.createUser("admin", adminBody);

  // const newAdministrator = await db.employers.create({
  //   ...adminBody,
  //   userId: newAdmin.id,
  // });

  const addAdmin = await db.newAdmins.create({
    ...adminBody,
    userId: newAdmin.id,
    adminId: admin.id,
  });
  return { addAdmin };
};
module.exports = {
  createAdmin,
  updateAdmin,
  getAdminByUserId,
  getAllAdminData,
  updateNewAdmins,
  addNewAdmin,
  updateNewAdminsByUserId,
};
