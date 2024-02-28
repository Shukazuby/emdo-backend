const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const ApiError = require("../utils/ApiError");
const { db } = require("../models");

const addReview = async (id, employeeId, reviewBody) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employer = await db.employers.findOne({ where: { userId: user.id } });
  if (!employer) {
    throw new Error("Employer not found");
  }
  const employee = await db.employees.findOne({ where: { id: employeeId } });

  if (!employee) {
    throw new Error("Employee not found");
  }

  const review = await db.reviews.create({
    employerId: employer,
    id,
    employeeId: employeeId,
    ...reviewBody,
  });

  return review;
};

const getReviewByEmployee = async (id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }
  const review = await db.reviews.findAll({
    where: {
      employeeId: employee.id,
    },
  });
  return review;
};

const getReviews = async (id, employeeId) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const review = await db.reviews.findAll({
    where: { employeeId: employeeId },
  });
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee has no reviews");
  }

  return review;
};

const getAllReviewsByAdmin = async (id) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const review = await db.reviews.findAll();

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "Can not fetch all reviews");
  }

  return review;
};

const getEmployeeAllReviewsByAdmin = async (id, employeeId) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const review = await db.reviews.findAll({
    where: {
      employeeId: employeeId,
    },
  });

  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, "This employees do not have an review");
  }

  return review;
};

module.exports = {
  addReview,
  getReviewByEmployee,
  getReviews,
  getAllReviewsByAdmin,
  getEmployeeAllReviewsByAdmin,
};
