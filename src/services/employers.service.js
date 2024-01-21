const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * creates a subject
 * @param {Object} employerBody
 * @returns {Promise<Object>}
 */
const createEmployer = async (id, employerBody) => {

  const user = await db.users.findOne({
    where:{
      id
    }
  })
  const employer = db.employers.create({
    ...employerBody,
    userId: user.id
  });
  if(!employer){
    throw new ApiError(httpStatus.NOT_FOUND, 'employer not found')
  }
  return employer;
};

module.exports ={
    createEmployer
}