// uploadFile.js
const { db } = require("../models");
const { uploader } = require("../config/cloudinary");
const { dataUri } = require("../config/multer");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const uploadFile = async (userId, file) => {
  try {
    const user = await db.users.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND,'User not found');
    }

    const fileUri = dataUri(file);
    
    const uploadResult = await uploader.upload(fileUri.content);
    
    const createdUpload = await db.uploads.create({
      fileName: file.originalName,
      path: uploadResult.secure_url,
      userId: user.id,
    });

    return createdUpload;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new ApiError(httpStatus.BAD_REQUEST, error);
  }
};

module.exports = {
  uploadFile,
};
