const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const ApiError = require("../utils/ApiError");
const {
  messageService
} = require("../services");


const getBothMessages = catchAsync(async (req, res) => {

  const messages = await messageService.getBothMessages(req.user.id, req.params.receiverId);

  res.status(httpStatus.OK).send( messages);
});

const getAllReceiversBySenderId = catchAsync(async (req, res) => {

  const receivers = await messageService.getAllReceiversBySenderId(req.user.id);

  res.status(httpStatus.OK).send({message:'Receivers', receivers});
});


module.exports = {
  getBothMessages,
  getAllReceiversBySenderId
}