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

const adminGetAllEmployerData = catchAsync(async (req, res) => {
  const employer= await employerService.adminGetAllEmployerData(req.user.id, req.params.employerId);
  res.status(httpStatus.OK).send(employer);
});

const getAllEmployers = catchAsync(async(req,res)=>{
  const employer = await employerService.getAllEmployers(req.user.id)
  res.status(httpStatus.OK).send(employer)
})

const getApprovedEmployers = catchAsync(async(req,res)=>{
  const employer = await employerService.getApprovedEmployers(req.user.id)
  res.status(httpStatus.OK).send(employer)
})

const getAnApprovedEmployer = catchAsync(async(req,res)=>{
  const employer = await employerService.getAnApprovedEmployer(req.user.id, req.params.employerId)
  res.status(httpStatus.OK).send(employer)
})
const deleteAnApprovedEmployer = catchAsync(async(req,res)=>{
  const employer = await employerService.deleteAnApprovedEmployer(req.user.id, req.params.employerId)
  res.status(httpStatus.OK).send({message: employer})
})

module.exports = {
    updateEmployer,
    getEmployerByUserId,
    adminGetAllEmployerData,
    getAllEmployers,
    getApprovedEmployers,
    getAnApprovedEmployer,
    deleteAnApprovedEmployer,
}