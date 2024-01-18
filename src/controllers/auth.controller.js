const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const {
  authService,
  userService,
  tokenService,
  emailService,
  employerService,
} = require('../services');

const createEmployer = catchAsync(async (req,res)=>{
  const user = await userService.createUser('employer', req.body)
  const employer = await employerService.createEmployer(req.body)
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user.dataValues);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);

  res.status(httpStatus.CREATED).send({
    message: 'Employer registered successfully',
    user: user,
    employer,
  });
});

const employerLogin = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError('Incorrect Email or Password', httpStatus.UNAUTHORIZED);
  }

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user.dataValues.id);

  res.status(httpStatus.OK).send({
    message: 'login successful',
    tokens,
    user,
  });
});


module.exports = {
  createEmployer,
  employerLogin
}