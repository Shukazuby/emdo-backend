const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');
const logger = require('../config/logger');
const { dataUri } = require('../config/multer');
const { uploader } = require('../config/cloudinary');

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @returns {Promise<boolean>}
 */
const isEmailTaken = async function (email) {
  const user = await db.users.findOne({ where: { email } });
  logger.info(user);
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
const isPasswordMatch = async function (password, user) {
  const comp = bcrypt.compareSync(password, user.password);
  logger.info(comp);
  return comp;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userType, userBody,) => {
  if (await isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // const fileUri = dataUri(file);
    
  // const uploadPicture = await uploader.upload(fileUri.content);
  

  // eslint-disable-next-line no-param-reassign
  userBody.password = bcrypt.hashSync(userBody.password, 8);
  return db.users.create({
    ...userBody,
    // picture: uploadPicture.secure_url,
    userType,
  });
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return db.users.findOne({ where: { email }, 
      include:[{
      model: db.employers
    },
  ] });
  };

  const getUserById = async (id) => {
    return db.users.findByPk(id);
  };
  

  const updateUserById = async (userId, updateBody) => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.update(updateBody);
    return user;
  };
  
  /**
   * Delete user by id
   * @param {ObjectId} userId
   * @returns {Promise<User>}
   */
  const deleteUserById = async (userId) => {
    const user = await getUserById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await db.users.destroy(user);
    return user;
  };
  
  
module.exports = {
    isEmailTaken,
    isPasswordMatch,
    createUser,
    getUserByEmail,
    getUserById,
    updateUserById,
    deleteUserById,
}