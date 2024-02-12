const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");

const addReview = async (employerId, employeeId, reviewBody) => {
  const employer = await db.employers.findByPk(employerId);
  const employee = await db.employees.findByPk(employeeId);

  if (!employer) {
    throw new Error("Employer not found");
  }

  if (!employee) {
    throw new Error("Employee not found");
  }

  const review = await db.reviews.create({
    employerId,
    employeeId,
    ...reviewBody,
  });

  return review;
};

const getReviewByEmployee = async (id) => {

  const employee = await db.employees.findOne({
    where: {
      userId: id,
    },
  });
  const review = await db.reviews.findAll({
    where: {
      employeeId: employee.id,
    },
  });
  return review;
};
const getReviews = async (id, employeeId) => {
    const user = await db.users.findOne({
        where: {
          id,
        },
      });

      if(!user){
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found')
      }
    
    const review = await db.reviews.findAll({ where: {employeeId: employeeId} });
    return review;
  };
  

module.exports = {
  addReview,
  getReviewByEmployee,
    getReviews
};
