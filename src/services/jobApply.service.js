const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { userService, jobService, employerService, emailService } = require(".");
const { Op } = require("sequelize");

const jobApplication = async (id, jobId) => {
  const user = await userService.getUserById(id);
  const job = await jobService.getJobsById(jobId);
  const employee = await db.employees.findOne({
    where:{
      userId: id
    }
  })

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
      employeeId: id,
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
  await emailService.appliedJobEmail(user.email, job.title);

  const applyJob = await db.jobApply.create({
    employeeId: employee.id,
    jobId,
  });
  return applyJob;
};

const jobApproval = async (userId, applicationId, options) => {
  const user = await db.users.findOne({ where: { id: userId } });
  const application = await db.jobApply.findOne({
    where: { id: applicationId },
    include: [{ model: db.jobs }],
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

    if (options.status === "approved") {
      await application.update(options);
      const applicant = await db.users.findOne({
        where: { id: application.userId },
      });
      if (applicant) {
        await emailService.approvedJobEmail(
          applicant.email,
          application.job.title
        );
      }
    } else {
      await application.update(options);
      await emailService.declinedJobEmail(user.email, application.job.title);
    }
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
    const employer = await db.users.findOne({
      where: { id: application.job.employerId },
    });
    await application.update(options);
    if (options.status === "confirmed") {
      await application.job.update({
        noOfStaff: application.job.noOfStaff - 1,
      });
      await emailService.confirmedJobEmail(
        employer.email,
        application.job.title
      );
    } else {
      await emailService.rejectedJobEmail(
        employer.email,
        application.job.title
      );
    }
  } else {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Unauthorized: You are not authorized to perform this action"
    );
  }

  return application;
};

const getUserJobApplications = async (employeeId, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions ={
    ...defaultOptions
  }

  const employee = await db.employees.findOne({
    where:{
      userId: employeeId
    }
  })

  const appliedJobs = await db.jobApply.findAll({
    where:{ 
      employeeId: employee.id
    },
    include: {
      model: db.jobs,
    },

    ...bothOptions
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
    where: { employerId},
    include: [
      {
        model: db.jobApply,
        where: { status: "applied" },
        include: [
          {
            model: db.employees,
            include: [{
              model: db.users
             }],
          },
        ],
      },
    ],
    ...bothOptions,
  });
  return jobs;
};

const getConfirmedJobs = async (employerId, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  console.log(defaultOptions)

  const bothOptions = {
    ...defaultOptions,
  };

  const employer = await db.employers.findOne({
    where:{
      userId: employerId
    }
  })

  const jobs = await db.jobs.findAll({
    where: {
       employerId: employer.id 
    },
    include: [
      {
        model: db.jobApply,
        where: { status: "confirmed" },
        include: [
          {
            model: db.employees,
            include:[ 
              {
                model: db.users
              }
            ],
          },
          
        ],
      },
    ],
    ...bothOptions,
  });
  return jobs;
};

const getCompletedJobs = async (employerId, options) => {
  let currentDate = new Date();
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAndCountAll({
    where: {
      employerId,
      shiftEndDate: { [Op.lt]: currentDate },
    },
    //  attributes: ['id', 'title'],
    include: [
      {
        model: db.jobApply,
        where: { status: "confirmed" },
        // attributes: ['id', 'status'],
        include: [
          {
            model: db.employees,
            include:{
              model: db.users
            }
          },
        ],
      },
    ],
    ...bothOptions
  });
  return jobs;
};


const getApprovedJobs = async (employeeId, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const employee = await db.employees.findOne({
    where:{
      userId: employeeId
    }
  })

  const jobs = await db.jobApply.findAll({
    where: {
       employeeId: employee.id,
       status: "approved"
    },
    ...bothOptions,
  });
  return jobs;
};

const getEmployeeCompletedJobs = async (employeeId, options) => {
  let currentDate = new Date();
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };
  const bothOptions = {
    ...defaultOptions,
  };

  const employee = await db.employees.findOne({
    where:{
      userId: employeeId
    }
  })


  const jobs = await db.jobs.findAndCountAll({
    where: {
      shiftEndDate: { [Op.lt]: currentDate },
    },
    //  attributes: ['id', 'title'],
    include: [
      {
        model: db.jobApply,
        where: {employeeId: employee.id,  status: "confirmed" },
      },
    ],
    ...bothOptions
  });
  return jobs;
};

const getEmployeeRejectedJobs = async (employeeId, options) => {
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };
  const bothOptions = {
    ...defaultOptions,
  };

  const employee = await db.employees.findOne({
    where:{
      userId: employeeId
    }
  })


  const jobs = await db.jobApply.findAndCountAll({
    where: {employeeId: employee.id,  status: "rejected" },
    ...bothOptions
  });
  return jobs;
};


module.exports = {
  jobApplication,
  getUserJobApplications,
  jobApproval,
  getAppliedJobs,
  getConfirmedJobs,
  getCompletedJobs,
  getApprovedJobs,
  getEmployeeCompletedJobs,
getEmployeeRejectedJobs,
};
