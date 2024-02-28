const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../config/tokens");
const bcrypt = require("bcryptjs");
const moment = require("moment");

const emailExist = async (email) => {
  const user = await db.users.findOne({
    where: {
      email: email,
    },
  });

  return user;
};

/**
 * creates a employer
 * @param {Object} hospitalBody
 * @returns {Promise<Object>}
 */
const createEmployer = async (employerBody) => {
  return db.employers.create(employerBody);
};

/**
 * creates a employee
 * @param {Object} hospitalBody
 * @returns {Promise<Object>}
 */
const createEmployee = async (employeeBody) => {
  return db.employers.create(employeeBody);
};

/**
 * creates a user
 * @param {Object} userBody
 * @returns {Promise<Object>}
 */
const registerUser = async (userBody) => {
  return db.users.create(userBody);
};

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (
    !user ||
    !(await userService.isPasswordMatch(password, user.dataValues))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await db.findOne({
    where: {
      token: refreshToken,
      type: tokenTypes.REFRESH,
      blacklisted: false,
    },
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  await refreshTokenDoc.remove();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await refreshTokenDoc.remove();
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error("User not found");
    }
    const newUserPassword = bcrypt.hashSync(newPassword, 8);
    await userService.updateUserById(user.id, { password: newUserPassword });
    await db.tokens.destroy({
      where: { user: user.id, type: tokenTypes.RESET_PASSWORD },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  try {
    // const verifyEmailTokenDoc = await tokenService.verifyToken(verifyEmailToken, tokenTypes.VERIFY_EMAIL);
    const verifyEmailTokenDoc = await db.tokens.findOne({
      where: { token: verifyEmailToken, type: tokenTypes.VERIFY_EMAIL },
    });
    if (!verifyEmailTokenDoc) {
      throw new ApiError(httpStatus.NOT_FOUND, "Verification token not found");
    }

    // Check if the token has expired
    const currentTimestamp = moment();
    const tokenExpiration = moment(verifyEmailTokenDoc.expires);

    if (currentTimestamp.isAfter(tokenExpiration)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Verification token has expired"
      );
    }
    const user = await userService.getUserById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    await db.tokens.destroy({
      where: { user: user.id, type: tokenTypes.VERIFY_EMAIL },
    });
    await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, error.message);
  }
};

const verifyEmployee = async (id, employeeId, data) => {
  const user = await db.users.findOne({ where: { id } });

  const employee = await db.employees.findOne({
    where: {
      id: employeeId,
    },
    include: { model: db.users },
  });
  if (employee.verification === "pending" || "null") {
    const updateVerification = await employee.update({
      verification: data,
    });
    return updateVerification;
  }
};
const verifyEmployer = async (id, employerId, data, options) => {
  const user = await db.users.findOne({ where: { id } });

  const employer = await db.employers.findOne({
    where: {
      id: employerId,
    },
    include: { model: db.users },
  });
  if (employer.verification === "pending" || "null") {
    const updateVerification = await employer.update({
      verification: data,
    });
    return updateVerification;
  }
};

module.exports = {
  createEmployer,
  createEmployee,
  registerUser,
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
  emailExist,
  verifyEmployee,
  verifyEmployer,
};
