const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
adminService} = require("../services");


const addNewAdmin = catchAsync(async (req, res) => {
    const admin = await adminService.addNewAdmin(req.user.id, req.body);
  
    res.status(httpStatus.CREATED).send({
      message: "New Admin added successfully",
      admin,
    });
  });
  
  const updateAdmins = catchAsync(async(req,res)=>{
    const admin = await adminService.updateAdmin( req.user.id, req.body,)
    res.status(httpStatus.OK).send(admin)
})

  const updateNewAdminsByUserId = catchAsync(async(req,res)=>{
    const admin = await adminService.updateNewAdminsByUserId( req.user.id, req.body,)
    res.status(httpStatus.OK).send(admin)
})


  const updateNewAdmin = catchAsync(async(req,res)=>{
    const admin = await adminService.updateNewAdmins(req.user.id, req.body, req.params.adminId,)
    res.status(httpStatus.OK).send(admin)
})

  module.exports = {
    addNewAdmin,
    updateNewAdmin,
    updateAdmins,
    updateNewAdminsByUserId
  }