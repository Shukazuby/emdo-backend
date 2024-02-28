const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  authService,
  userService,
  tokenService,
  emailService,
  employerService,
  employeeService,
  adminService,
} = require("../services");
const { db } = require("../models");
const pick = require("../utils/pick");

const createAdmin = catchAsync(async (req, res) => {
  const user = await userService.createUser("admin", req.body);
  const admin = await adminService.createAdmin(user.id, req.body);
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(
  //   user.dataValues
  // );
  // await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  res.status(httpStatus.CREATED).send({
    message: "admin registered successfully",
    user: user,
    admin,
  });
});

const createEmployer = catchAsync(async (req, res) => {
  const user = await userService.createUser("employer", req.body);
  const employer = await employerService.createEmployer(user.id, req.body, req.file);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    user.dataValues
  );
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  res.status(httpStatus.CREATED).send({
    message: "Employer registered successfully",
    user: user,
    employer,
  });
});

const createEmployee = catchAsync(async (req, res) => {
  const user = await userService.createUser("employee", req.body);
  const employee = await employeeService.createEmployee(user.id, req.body, req.file);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    user.dataValues
  );
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  res.status(httpStatus.CREATED).send({
    message: "Employee registered successfully",
    user: user,
    employee,
  });
});


const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Incorrect Email or Password", httpStatus.UNAUTHORIZED);
  }

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user.dataValues.id);

  res.status(httpStatus.OK).send({
    message: "login successful",
    tokens,
    user,
  });
});

const loginAdmin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Incorrect Email or Password", httpStatus.UNAUTHORIZED);
  }

  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const teamManager = await db.teamManagers.findOne({
    where: {
      userId: user.id
    }
  });

  if (!teamManager) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  if (teamManager.accessLevel !== 'administrator') {
    throw new ApiError("You are not authorized to log in", httpStatus.UNAUTHORIZED);
  }

  const tokens = await tokenService.generateAuthTokens(user.id);

  res.status(httpStatus.OK).send({
    message: "Login successful",
    tokens,
    user,
  });
});

const loginStandard = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError("Incorrect Email or Password", httpStatus.UNAUTHORIZED);
  }

  const user = await authService.loginUserWithEmailAndPassword(email, password);

  const teamManager = await db.teamManagers.findOne({
    where: {
      userId: user.id
    }
  });

  if (!teamManager) {
    throw new ApiError("User not found", httpStatus.NOT_FOUND);
  }

  if (teamManager.accessLevel !== 'standard') {
    throw new ApiError("You are not authorized to log in", httpStatus.UNAUTHORIZED);
  }

  const tokens = await tokenService.generateAuthTokens(user.id);

  res.status(httpStatus.OK).send({
    message: "Login successful",
    tokens,
    user,
  });
});


const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  // console.log(resetPasswordToken);
  const emailSend = await emailService.sendResetPasswordEmail(
    req.body.email,
    resetPasswordToken
  );
  res.status(httpStatus.NO_CONTENT).send(emailSend);
});

const resetPassword = catchAsync(async (req, res) => {
  const resetPass = await authService.resetPassword(
    req.query.token,
    req.body.password
  );
  res.status(httpStatus.NO_CONTENT).send(resetPass);
});

const verifyEmail = catchAsync(async (req, res) => {
  const verify = await authService.verifyEmail(req.body.token);
  res.status(httpStatus.OK).send("Email has been verified");
});

const verifyEmployee = catchAsync(async (req, res) => {
  const verify = await authService.verifyEmployee(req.user.id, req.params.employeeId, req.query.data);
  res.status(httpStatus.OK).send(verify);
});
const verifyEmployer = catchAsync(async (req, res) => {
  const verify = await authService.verifyEmployer(req.user.id, req.params.employerId, req.query.data);
  res.status(httpStatus.OK).send(verify);
});

module.exports = {
  createEmployer,
  createEmployee,
  createAdmin,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  loginAdmin,
  loginStandard,
  verifyEmployee,
  verifyEmployer,

};