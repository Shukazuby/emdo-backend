const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { db } = require('../models');

/**
 * creates a subject
 * @param {Object} employeeBody
 * @returns {Promise<Object>}
 */
const createEmployee = async (id, employeeBody) => {
  const user = await db.users.findOne({
    where:{
      id
    }
  })
  const employee = db.employees.create({
    ...employeeBody,
    userId: user.id
  });
  if(!employee){
    throw new ApiError(httpStatus.NOT_FOUND, 'employer not found')
  }
  return employee;
};

module.exports ={
    createEmployee
}