const httpStatus = require("http-status");
const { db } = require("../models");
const ApiError = require("../utils/ApiError");
const { userService, jobService, employerService, emailService } = require(".");
const { Op } = require("sequelize");

const jobApplication = async (id, jobId) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const job = await db.jobs.findOne({ where: { id: jobId } });
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "job not found");
  }
  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });

  if (job.noOfStaff === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You can not apply for this job");
  }

  const existingApplication = await db.jobApply.findOne({
    where: {
      employeeId: employee.id,
      jobId,
    },
  });

  if (existingApplication) {
    throw new ApiError(httpStatus.BAD_REQUEST,"You have previously applied for the job");
  }

  if (user.userType !== "employee") {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized to apply for this job");
  }
  await emailService.appliedJobEmail(user.email, job.title);

  const applyJob = await db.jobApply.create({
    employeeId: employee.id,
    jobId,
  });
  return applyJob;
};

const jobApproval = async (id, applicationId, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }
  const application = await db.jobApply.findOne({
    where: { id: applicationId },
    include: [{ model: db.jobs }],
  });

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job application not found");
  }

  if (user.userType === "employer") {
    const employer = await db.employers.findOne({ where: { userId: user.id } });

    if (options.status !== "approved" && options.status !== "declined") {
      throw new ApiError(httpStatus.BAD_REQUEST,"Employers can only 'approved' or 'declined' job applications");
    }
    if (employer.id !== application.job.employerId) {
      throw new ApiError( httpStatus.UNAUTHORIZED, "Unauthorized: You did not post this job");
    }

    if (options.status === "approved") {
      await application.update(options);
      await db.jobs.update(
        { status: "ongoing" },
        {where: {id: application.jobId}}
      );
      const applicant = await db.employees.findOne({
        where: { id: application.employeeId },
        include:[{model:db.users}]
      });
      if (applicant) {
        await emailService.approvedJobEmail(
          applicant.user.email,
          application.job.title
        );
      }
    } else {
      await application.update(options);
      await emailService.declinedJobEmail(user.email, application.job.title);
    }
  } else if (user.userType === "employee") {

    const employer = await db.employers.findOne({
      where: { id: application.job.employerId },
      include:{model: db.users}
    });

    const employee = await db.employers.findOne({ where: { userId: user.id } });
    if (!employee) {
      throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
    }
      if (options.status !== "confirmed" && options.status !== "rejected") {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Employees can only 'confirmed' or 'rejected' job applications"
      );
    }
    if (user.id !== application.employeeId) {
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
      await emailService.confirmedJobEmail(
        employer.user.email,
        application.job.title
      );
    } else {
      await emailService.rejectedJobEmail(
        employer.user.email,
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

const getUserJobApplications = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const employee = await db.employees.findOne({
    where: {
      userId: user.id,
    },
  });
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

  const appliedJobs = await db.jobApply.findAll({
    where: {
      employeeId: employee.id,
    },
    include: {
      model: db.jobs,
    },

    ...bothOptions,
  });
  if (!appliedJobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "You don't have any job you applied for");
  }
  return appliedJobs;
};

const getAppliedJobs = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employer = await db.employers.findOne({where:{ userId: user.id }});
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }

  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAll({
    where: { employerId: employer.id },
    include: [
      {
        model: db.jobApply,
        where: { status: "applied" }, 
        include: [
          {
            model: db.employees,
            include: [
              {
                model: db.users,
              },
            ],
          },
        ],
      },
    ],
    ...bothOptions,
  });
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Applied jobs not found");
  }

  return jobs;
};

const getConfirmedJobs = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employer = await db.employers.findOne({where:{ userId: user.id }});
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }
  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobs.findAll({
    where: {
      employerId: employer.id,
    },
    include: [
      {
        model: db.jobApply,
        where: { status: "confirmed" },
        include: [
          {
            model: db.employees,
            include: [
              {
                model: db.users,
              },
            ],
          },
        ],
      },
    ],
    ...bothOptions,
  });
  return jobs;
};

const getCompletedJobs = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employer = await db.employers.findOne({where:{ userId: user.id }});
  if (!employer) {
    throw new ApiError(httpStatus.NOT_FOUND, "employer not found");
  }

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
      employerId: employer.id,
      shiftEndDate: { [Op.lt]: currentDate },
    },
    include: [
      {
        model: db.jobApply,
        where: { status: "confirmed" },
        include: [
          {
            model: db.employees,
            include: {
              model: db.users,
            },
          },
        ],
      },
    ],
    ...bothOptions,
  });

  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "Confirmed jobs not found");
  }

  return jobs;
};

const getApprovedJobs = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employee = await db.employees.findOne({where:{ userId: user.id }});
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };

  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobApply.findAll({
    where: {
      employeeId: employee.id,
      status: "approved",
    },
    ...bothOptions,
  });
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Approved jobs yet");
  }

  return jobs;
};

const getEmployeeCompletedJobs = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employee = await db.employees.findOne({where:{ userId: user.id }});
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

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
      shiftEndDate: { [Op.lt]: currentDate },
    },
    include: [
      {
        model: db.jobApply,
        where: { employeeId: employee.id, status: "confirmed" },
      },
    ],
    ...bothOptions,
  });

  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "No completed jobs found");
  }

  return jobs;
};

const getEmployeeRejectedJobs = async (id, options) => {
  const user = await db.users.findOne({where:{ id }});
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "user not found");
  }

  const employee = await db.employees.findOne({where:{ userId: user.id }});
  if (!employee) {
    throw new ApiError(httpStatus.NOT_FOUND, "employee not found");
  }

  const defaultOptions = {
    limit: parseInt(options.limit),
    offset: (parseInt(options.page) - 1) * parseInt(options.limit),
  };
  const bothOptions = {
    ...defaultOptions,
  };

  const jobs = await db.jobApply.findAndCountAll({
    where: { employeeId: employee.id, status: "rejected" },
    ...bothOptions,
  });
  if (!jobs) {
    throw new ApiError(httpStatus.NOT_FOUND, "No rejected jobs not found");
  }

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
