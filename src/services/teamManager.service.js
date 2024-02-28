const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { userService, tokenService, emailService } = require("../services");
const bcrypt = require("bcryptjs");

const addNewUser = async (id, addUserBody) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employer = await db.employers.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }

  const userTeam = await userService.createUser("employer", addUserBody);
  await emailService.addedUser(userTeam.email, userTeam.id);

  const newEmployer = await db.employers.create({
    ...addUserBody,
    userId: userTeam.id,
  });

  const addUser = await db.teamManagers.create({
    ...addUserBody,
    userId: userTeam.id,
    employerId: employer.id,
  });
  return { addUser, newEmployer };
};

const updateUser = async (updateBody, id) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  updateBody.password = bcrypt.hashSync(updateBody.password, 8);

  await db.users.update(updateBody, {
    where: {
      id,
    },
  });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  await db.employers.update(updateBody, {
    where: {
      id,
    },
  });

  const employer = await db.employers.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }

  const updateNewUser = await db.teamManagers.update(updateBody, {
    where: {
      userId: employer.id,
    },
  });
  return updateNewUser;
};

module.exports = {
  addNewUser,
  updateUser,
};
