const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
// const { generateOtp } = require("../utils/helper");
const {
  employerService,
} = require("../services");

const updateEmployer = catchAsync(async(req,res)=>{
    const employer = await employerService.updateEmployer(req.body, req.params.id)
    res.status(httpStatus.OK).send(employer)
})

const getEmployerByUserId = catchAsync(async(req,res)=>{
  const employerById = await employerService.getAllEmployerData(req.params.id)
  res.status(httpStatus.OK).send(employerById)
})

module.exports = {
    updateEmployer,
    getEmployerByUserId
}