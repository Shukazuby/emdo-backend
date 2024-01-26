const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
// const { generateOtp } = require("../utils/helper");
const {
  userService,
  teamManagerService,
  tokenService,
  emailService
} = require("../services");


const createTeamManager = catchAsync(async (req, res) => {
  const user = await userService.createUser("administrator", req.body);
  const team = await teamManagerService.createTeam(user.id, req.body);
  // const verifyEmailToken = await tokenService.generateVerifyEmailToken(
  //   user.dataValues
  // );
  await emailService.sendVerificationEmail(user.email);

  res.status(httpStatus.CREATED).send({
    message: "Team added successfully",
    user: user,
    team,
  });
});


const updateTeamManager = catchAsync(async(req,res)=>{
    const teamManager = await teamManagerService.updateTeam(req.body, req.params.id)
    res.status(httpStatus.OK).send(teamManager)
})


module.exports = {
  updateTeamManager,
  createTeamManager
}