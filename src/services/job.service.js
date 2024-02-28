const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { getUserById } = require("./user.service");
const { Op } = require("sequelize");

const createJob = async (id, data) => {
  const user = await db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  if (user.userType !== "employer") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
  }
  const employer = await db.employers.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }

  const job = await db.jobs.create({
    ...data,
    employerId: employer.id,
  });

  return job;
};

const getJobs = async (filter, options) => {
  const defaultOptions = {
    order: [["createdAt", "DESC"]],
  };

  const combinedOptions = {
    ...defaultOptions,
    ...options,
  };

    if (filter.status === "new") {
      combinedOptions.limit = 20;
      const jobs = await db.jobs.findAll({
        ...combinedOptions,
      });
      if (!jobs) {
        throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
      }
      return { count: jobs.length, jobs };
    }
    const jobs = await db.jobs.findAll({
      where: filter,
      ...combinedOptions,
    });
    if (!jobs) {
      throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
    }

    return { count: jobs.length, jobs };
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
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
  }
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
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
  }

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
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
  }
  return jobs;
};

const getJobsById = async (id, jobId) => {
  const user = db.users.findOne({ where: { id } });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
const job = db.jobs.findOne({
    where: { id: jobId },
    include: { model: db.employers },
  });
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "job not found");
  }
  return job;
};

const getJobsByAnEmployer = async (employerId) => {
  const jobs = db.jobs.findAll({ where: { employerId } });
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
  }
  return jobs;
};

const updateJobById = async (jobId, data) => {
  const job = await db.jobs.findOne({where:{id:jobId}});
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }
  const updatedJob = await job.update(data);
  return updatedJob;
};

const deleteJobById = async (id, jobId) => {
  const user = await db.users.findOne({where:{id}});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employer = await db.employers.findOne({where:{userId: user.id}})
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }

  const job = await db.jobs.findOne({where:{id:jobId}});
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  await db.jobs.update(
    { status: "cancelled" },
    {
      where: {
        id: jobId,
        employerId: employer.id
      },
    }
  );

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
    const roles = filter.role.split(" ");
    filter.title = {
      [Op.or]: roles.map((role) => ({ [Op.like]: `%${role}%` })),
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

const getAllJobs = async (id) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobs = await db.jobs.findAll({
    include: {
      model: db.employers,
    },
  });
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "jobs not found");
  }

  return jobs;
};

const getActiveJobs = async(id)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobs = await db.jobs.findAll({where:{
    status: ['ongoing','active']
  }})
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "active jobs not found");
  }

  return jobs
};

const getCancelledJobs = async(id)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobs = await db.jobs.findAll({where:{
    status: 'cancelled'
  }})
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Cancelled jobs not found");
  }

  return jobs
};

const getCompletedJobs = async(id)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const jobs = await db.jobs.findAll({where:{
    status: 'completed'
  }})
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Completed jobs not found");
  }
  return jobs
};

const getActiveJobsByEmployerId = async(id, employerId)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobs = await db.jobs.findAll({where:{
    employerId: employerId,
    status: ['ongoing','active']
  }});
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employers active jobs not found");
  }

  return jobs
};

const getCancelledJobsByEmployerId = async(id, employerId)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobs = await db.jobs.findAll({where:{
    employerId: employerId,
    status: 'cancelled',
  }});
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employers cancelled jobs not found");
  }

  return jobs
};

const getActiveJobsByEmployeeId = async(id, employeeId)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobApply = await db.jobApply.findAll({where:{
    employeeId: employeeId,
  },
  include:{
    model: db.jobs,
    where:{
      status: ['ongoing','active']
    }
  }
});
if (!jobApply) {
  throw new ApiError(httpStatus.NOT_FOUND, "Employees active jobs not found");
}

  return jobApply
};

const getCancelledJobsByEmployeeId = async(id, employeeId)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobApply = await db.jobApply.findAll({where:{
    employeeId: employeeId,
  },
  include:{ 
    model: db.jobs,
    where:{
      status: 'cancelled',
    }
  }
});
if (!jobApply) {
  throw new ApiError(httpStatus.NOT_FOUND, "Employees cancelled jobs not found");
}

  return jobApply
};

const getCompletedJobsByEmployerId = async(id, employerId)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const jobs = await db.jobs.findAll({where:{
    employerId: employerId,
    status: 'completed',
  }})
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employers completed jobs not found");
  }
  return jobs
};

const getCompletedJobsByEmployeeId = async(id, employeeId)=>{
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const jobApply = await db.jobApply.findAll({where:{
    employeeId: employeeId,
  },
  include:{ 
    model: db.jobs,
    where:{
      status: 'completed',
    }
  }
});
if (!jobApply) {
  throw new ApiError(httpStatus.NOT_FOUND, "Employees completed jobs not found");
}
  return jobApply
};


const bookmarkJob = async (id, jobId) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({ where: { userId: user.id } });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  
  const bookmark = await db.bookmarks.create({
    employeeId: employee.id,
    jobId: jobId,
  });

  return bookmark;
};

const getABookmarkedJob= async (id, jobId) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({where:{userId:user.id}})
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }  
  const bookmark = await db.bookmarks.findOne({
    where: {
      employeeId: employee.id,
      jobId: jobId,
    },
  });

  if (!bookmark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Job not bookmarked')
  }

  return bookmark;
};

const deleteABookmarkedJob= async (id, jobId) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const employee = await db.employees.findOne({where:{userId:user.id}});
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  const bookmark = await db.bookmarks.destroy({
    where: {
      employeeId: employee.id,
      jobId: jobId,
    },
  });

  if (!bookmark) {
    throw new ApiError(httpStatus.NOT_FOUND, 'bookmark not deleted')
  }

  return bookmark;
};

const getBookmarkedJobs = async (id) => {
  const user = await db.users.findOne({where:{id}});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const employee = await db.employees.findOne({where:{userId: user.id}})
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee not found");
  }
  const bookmarks = await db.bookmarks.findAll({
    where: {
      employeeId: employee.id,
    },
  });
  if (!bookmarks) {
    throw new ApiError(httpStatus.NOT_FOUND, "bookmarks not found");
  }

  return bookmarks;
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
  getAllJobs,
  getActiveJobs,
  getCancelledJobs,
  getActiveJobsByEmployerId,
  getCancelledJobsByEmployerId,
  getActiveJobsByEmployeeId,
  getCancelledJobsByEmployeeId,
  bookmarkJob, getABookmarkedJob, 
  getBookmarkedJobs, deleteABookmarkedJob,
  getCompletedJobs, getCompletedJobsByEmployerId,
  getCompletedJobsByEmployeeId

};
