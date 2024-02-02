const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { getUserById } = require("./user.service");
const { getEmployerByUserId } = require("./employers.service");
const { Op } = require("sequelize");
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
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.userType !== "employer") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const employer = await db.employers.findOne({
    where: {
      userId: user.id,
    },
  });

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
  const defaultOptions = {
    order: [["createdAt", "DESC"]],
  };

  const combinedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    if (filter.status === "new") {
      combinedOptions.limit = 20;
      const jobs = await db.jobs.findAll({
        ...combinedOptions,
      });

      return { count: jobs.length, jobs };
    }
    const jobs = await db.jobs.findAll({
      where: filter,
      ...combinedOptions,
    });

    return { count: jobs.length, jobs };
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching jobs");
  }
};

const newStatus = async (filter, options) => {
  const defaultOptions = {
    order: [["createdAt", "DESC"]],
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAll({
    where: filter,
    ...bothOptions,
  });
  return { counts: jobs.length, jobs };
};

const ongoingStatus = async (filter, options) => {
  const currentDate = new Date();
  filter.shiftEndDate = {
    [Op.or]: {
      [Op.gte]: currentDate,
      [Op.eq]: null,
    },
  };
  const jobs = await db.jobs.findAndCountAll({
    where: filter,
    ...options,
  });
  return jobs;
};

const completeStatus = async (filter, options) => {
  const currentDate = new Date();
  filter.shiftEndDate = {
    [Op.lt]: currentDate,
  };
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
 * @return {Promise<object>}
 */
const updateJobById = async (jobId, data) => {
  const job = await getJobsById(jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
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
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }
  await db.jobs.destroy({
    where: {
      id: jobId,
    },
  });
  return job;
};

const allFilter = async (filter, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  if (filter.minPrice !== undefined && filter.maxPrice !== undefined) {
    filter.hourlyPay = {
      [Op.between]: [filter.minPrice, filter.maxPrice],
    };
    delete filter.minPrice;
    delete filter.maxPrice;
  }

  if (filter.role) {
    const roles = filter.role.split(' ')
    filter.title = {
        [Op.or]: roles.map(role => ({ [Op.like]: `%${role}%` })),
    };
    delete filter.role;
}


  if (filter.company) {
    const employers = await db.employers.findAll({
      where: {
        companyName: {
          [Op.like]: `%${filter.company}%`,
        },
      },
    });
    const employerIds = employers.map((employer) => employer.id);
    filter.employerId = {
      [Op.in]: employerIds,
    };
    delete filter.company;
  }

  if (filter.date) {
    const currentDate = new Date();
    let startDate;

    switch (filter.date) {
      case "thisWeek":
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        break;
      case "nextWeek":
        startDate = new Date(currentDate);
        startDate.setDate(startDate.getDate() + (7 - startDate.getDay()));
        break;
      case "nextMonth":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          1
        );
        break;
      case "nextThreeMonths":
        startDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 3,
          1
        );
        break;
      default:
        throw new Error("Invalid date type");
    }

    const endDate = new Date(startDate);
    switch (filter.date) {
      case "thisWeek":
        endDate.setDate(endDate.getDate() + 6);
        break;
      case "nextWeek":
        endDate.setDate(endDate.getDate() + 6);
        break;
      case "nextMonth":
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0);
        break;
      case "nextThreeMonths":
        endDate.setMonth(endDate.getMonth() + 3);
        endDate.setDate(0);
        break;
      default:
        throw new Error("Invalid date type");
    }

    filter.shiftStartDate = {
      [Op.between]: [startDate, endDate],
    };

    delete filter.date;
  }

  if (filter.time) {
    const currentTime = new Date();
    const timeOptions = {
      morning: [0, 11],
      afternoon: [12, 17],
      evening: [18, 23],
    };

    let startTime, endTime;

    switch (filter.time) {
      case "morning":
        startTime = new Date(currentTime);
        startTime.setHours(
          timeOptions.morning[0],
          timeOptions.morning[1],
          0,
          0
        );
        endTime = new Date(currentTime);
        endTime.setHours(
          timeOptions.afternoon[0],
          timeOptions.afternoon[1],
          0,
          0
        );
        break;
      case "afternoon":
        startTime = new Date(currentTime);
        startTime.setHours(
          timeOptions.afternoon[0],
          timeOptions.afternoon[1],
          0,
          0
        );
        endTime = new Date(currentTime);
        endTime.setHours(timeOptions.evening[0], timeOptions.evening[1], 0, 0);
        break;
      case "evening":
        startTime = new Date(currentTime);
        startTime.setHours(
          timeOptions.evening[0],
          timeOptions.evening[1],
          0,
          0
        );
        endTime = new Date(currentTime);
        endTime.setDate(endTime.getDate() + 1); // Next day
        endTime.setHours(timeOptions.morning[0], timeOptions.morning[1], 0, 0);
        break;
      default:
        throw new ApiErrorError(httpStatus.NOT_FOUND, "Invalid time type");
    }

    filter.shiftStartDate = {
      [Op.between]: [startTime, endTime],
    };

    delete filter.time;
  }

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAll({
    where: filter,
    ...bothOptions,
  });

  return { counts: jobs.length, jobs };
};

module.exports = {
  createJob,
  getJobsById,
  getJobsByAnEmployer,
  getJobs,
  updateJobById,
  deleteJobById,
  ongoingStatus,
  completeStatus,
  newStatus,
  allFilter,
};
