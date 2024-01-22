const httpStatus = require('http-status');
const { db } = require('../models');
const ApiError = require('../utils/ApiError');
const { getUserById } = require('./user.service');
const { getEmployerByUserId } = require('./employers.service');

/**
 * Creates a job with the given ID and data.
 *
 * @param {string} id 
 * @param {object} data 
 * @returns {object} 
 */
const createJob = async (id, data) => {
  const user = await getUserById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.userType !== 'employer') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const employer = await getEmployerByUserId(id);

  const job = await db.jobs.create({
    ...data,
    employerId: employer.id,
  });

  return job;
};

/**
 * Retrieves jobs based on the provided filter and options.
 *
 * @param {object} filter 
 * @param {object} options
 * @return {Promise<Array>} 
 */
const getJobs = async (filter, options) => {
  const jobs = await db.jobs.findAndCountAll({
    where: filter,
    ...options,
  });
  return jobs;
};

/**
 * Retrieves a job from the database by its ID.
 *
 * @param {number} id 
 * @return {Promise<Object|null>} 
 */
const getJobsById = async (id) => {
  const job = db.jobs.findByPk(id);
  return job;
};

/**
 * Retrieves all jobs associated with a specific employer.
 *
 * @param {number} employerId 
 * @return {Promise<Array>} 
 */
const getJobsByAnEmployer = async (employerId) => {
  const jobs = db.jobs.findAll({ where: { employerId } });
  return jobs;
};

/**
 * Updates a job by its ID.
 *
 * @param {string} jobId  
 * @param {object} data  
 * @return {Promise<object>} Th
 */
const updateJobById = async (jobId, data) => {
  const job = await getJobsById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  const updatedJob = await job.update(data);
  return updatedJob;
};

/**
 * Deletes a job by its ID.
 *
 * @param {string} jobId 
 * @throws {ApiError} 
 * @return {Object} 
 */
const deleteJobById = async (jobId) => {
  const job = await getJobsById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not found');
  }
  await db.jobs.destroy({
    where: {
      id: jobId,
    },
  });
  return job;
};

module.exports = {
  createJob,
  getJobsById,
  getJobsByAnEmployer,
  getJobs,
  updateJobById,
  deleteJobById,
};