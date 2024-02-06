const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { userService, jobService, employerService } = require(".");

const jobApplication = async (id, jobId) => {
  const user = await userService.getUserById(id);
  const job = await jobService.getJobsById(jobId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  if (job.noOfStaff === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can not apply for this job"
    );
  }

  const existingApplication = await db.jobApply.findOne({
    where: {
      userId: id,
      jobId,
    },
  });

  if (existingApplication) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have previously applied for the job"
    );
  }

  if (user.userType !== "employee") {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to apply for this job"
    );
  }
  const applyJob = await db.jobApply.create({
    userId: id,
    jobId,
  });
  return applyJob;
};

const jobApproval = async (userId, applicationId, options) => {
  const user = await db.users.findOne({ where: { id: userId } });
  const application = await db.jobApply.findOne({
    where: { id: applicationId },
    include: [{ model: db.jobs, as: "job" }],
  });

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job application not found");
  }

  if (user.userType === "employer") {
    if (options.status !== "approved" && options.status !== "declined") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Employers can only 'approved' or 'declined' job applications"
      );
    }
    if (user.id !== application.job.employerId) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized: You did not post this job"
      );
    }
    await application.update(options);
  } else if (user.userType === "employee") {
    if (options.status !== "confirmed" && options.status !== "rejected") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Employees can only 'confirmed' or 'rejected' job applications"
      );
    }
    if (user.id !== application.userId) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized: You did not apply for this job"
      );
    }
    await application.update(options);
    if (options.status === "confirmed") {
      await application.job.update({
        noOfStaff: application.job.noOfStaff - 1,
      });
    }
  } else {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized: You are not authorized to perform this action"
    );
  }

  return application;
};

const getUserJobApplications = async (id, options) => {
  const appliedJobs = await db.users.findAll({
    where: { id },
    ...options,
    include: {
      model: db.jobApply,
    },
  });
  if (!appliedJobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  return appliedJobs;
};

const getAppliedJobs = async (employerId, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAll({
      where: { employerId }, 
      include: [{
          model: db.jobApply,
          where: { status: 'applied' }, 
          include: [{
              model: db.users,
              where: { userType: 'employee' }, 
          }]
      }],
     bothOptions 
  });
  return jobs;
};
const getConfirmedJobs = async (employerId, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAll({
      where: { employerId }, 
      include: [{
          model: db.jobApply,
          where: { status: 'confirmed' }, 
          include: [{
              model: db.users,
              where: { userType: 'employee' }, 
          }]
      }],
     bothOptions 
  });
  return jobs;
};

module.exports = {
  jobApplication,
  getUserJobApplications,
  jobApproval,
  getAppliedJobs,
  getConfirmedJobs,
};
