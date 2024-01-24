const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { uploadService } = require('../services');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

const upload = catchAsync(async (req, res) => {
  const file = await uploadService.uploadFile(req.user.id, req.file);
  res.status(httpStatus.CREATED).send(file);
});


module.exports = {
  upload,
};