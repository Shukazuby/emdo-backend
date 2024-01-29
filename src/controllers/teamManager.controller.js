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


const addNewUser = catchAsync(async (req, res) => {
  const employer = await teamManagerService.addNewUser(req.user.id, req.body);

  res.status(httpStatus.CREATED).send({
    message: "Team added successfully",
    employer,
  });
});


const updateNewUser = catchAsync(async(req,res)=>{
    const teamManager = await teamManagerService.updateUser(req.body, req.params.id)
    res.status(httpStatus.OK).send(teamManager)
})


module.exports = {
  updateNewUser,
  addNewUser
}