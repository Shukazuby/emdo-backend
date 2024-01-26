const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { userService } = require("../services");

/**
 * creates a subject
 * @param {Object} teamManagerBody
 * @returns {Promise<Object>}
 */
const createTeam = async (id, teamManagerBody) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employer = await db.employers.findOne({
    where: {
      id,
    },
  });
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const teamManager = db.teamManagers.create({
    ...teamManagerBody,
    userId: user.id,
    employerId: employer.id
  });
  if (!teamManager) {
    throw new ApiError(httpStatus.NOT_FOUND, "teamManager not found");
  }
  return teamManager;
};

const updateTeam = async (updateBody, id) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });

const updateTeam =  await db.teamManagers.update(updateBody, {
    where: {
      id,
    },
  });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  return updateTeam;
};

module.exports = {
  createTeam,
  updateTeam,
};
