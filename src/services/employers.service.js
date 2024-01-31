const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");
const { userService } = require("../services");
const { uploader } = require("../config/cloudinary");
const { dataUri } = require("../config/multer");

/**
 * creates a subject
 * @param {Object} employerBody
 * @returns {Promise<Object>}
 */
const createEmployer = async (id, employerBody,file) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const fileUri = dataUri(file);
    
  const logoFile = await uploader.upload(fileUri.content);
  
  
  const employer = db.employers.create({
    ...employerBody,
    logo: logoFile.secure_url,
    userId: user.id,
  });
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }
  return employer;
};

const updateEmployer = async (updateBody, id) => {
  const user = await db.users.findOne({
    where: {
      id,
    },
  });

  await db.users.update(updateBody, {
    where: {
      id,
    },
  });
  if (updateBody.email && (await userService.isEmailTaken(updateBody.email))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  const updateEmployer = db.employers.update(updateBody, {
    where: {
      userId: user.id,
    },
  });
  return updateEmployer;
};

const getEmployerByUserId = async (id) => {
  const employer = db.employers.findOne({ where: { id } });
  if(!employer){
    throw new ApiError(httpStatus.NOT_FOUND, 'employer not found')
  }
  return employer;
};

const getAllEmployerData = async (id) => {
  const employers = db.users.findByPk(id, {
    include: [
      {
        model: db.employers,
        as: 'employer',
      },
    ],
  });

  if(!employers){
    throw new ApiError(httpStatus.NOT_FOUND, 'employer not found')
  }

  return employers;
};

module.exports = {
  createEmployer,
  updateEmployer,
  getEmployerByUserId,
  getAllEmployerData
};
