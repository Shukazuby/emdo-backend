const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
// const { generateOtp } = require("../utils/helper");
const {
  authService,
  userService,
  tokenService,
  emailService,
  employerService,
  employeeService,
} = require("../services");

const createEmployer = catchAsync(async (req, res) => {
  const user = await userService.createUser("employer", req.body);
  const employer = await employerService.createEmployer(user.id, req.body);
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
  const employee = await employeeService.createEmployee(user.id,req.body);
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

module.exports = {
  createEmployer,
  createEmployee,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
};