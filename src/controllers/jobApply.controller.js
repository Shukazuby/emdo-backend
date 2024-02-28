const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { jobApplyService } = require("../services");
const pick = require("../utils/pick");

const createJobApplication = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { jobId } = req.params;

  const application = await jobApplyService.jobApplication(id, jobId);

  res
    .status(httpStatus.CREATED)
    .send({ message: "Application created", application });
});

const jobApproval = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { applicationId } = req.params;
  const options = { status: req.query.status };
  const application = await jobApplyService.jobApproval(
    id,
    applicationId,
    options
  );

  res
    .status(httpStatus.OK)
    .send({ message: "Job application updated", application });
});

const getUserJobApplications = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  if (options.limit) {
    options.limit = parseInt(options.limit, 10);
  }
  const applications = await jobApplyService.getUserJobApplications(
    id,
    options
  );

  res.status(httpStatus.OK).send(applications);
});

const getAppliedJobs = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["limit", "page"]);
const appliedJobs = await jobApplyService.getAppliedJobs(id, options);
  res
    .status(httpStatus.OK)
    .send({ message: "Applied jobs retrieved successfully", appliedJobs });
});

const getConfirmedJobs = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["limit", "page"]);
  const confirmedJobs = await jobApplyService.getConfirmedJobs(id, options);
  res
    .status(httpStatus.OK)
    .send({ message: "Confirmed jobs retrieved successfully", confirmedJobs });
});

const getCompletedJobs = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["limit", "page"]);
  const completedJobs = await jobApplyService.getCompletedJobs(id, options);
  res
    .status(httpStatus.OK)
    .send({ message: "Completed jobs retrieved successfully", completedJobs });
});

const getApprovedJobs = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["limit", "page"]);
  const approvedJobs = await jobApplyService.getApprovedJobs(id, options);
  res
    .status(httpStatus.OK)
    .send({ message: "Approved jobs retrieved successfully", approvedJobs });
});

const getEmployeeCompletedJobs = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["limit", "page"]);
  const completedJobs = await jobApplyService.getEmployeeCompletedJobs(id, options);
  res
    .status(httpStatus.OK)
    .send({ message: "Completed jobs retrieved successfully", completedJobs });
});

const getEmployeeRejectedJobs = catchAsync(async (req, res) => {
  const { id } = req.user;
  const options = pick(req.query, ["limit", "page"]);
  const rejectedJobs = await jobApplyService.getEmployeeRejectedJobs(id, options);
  res
    .status(httpStatus.OK)
    .send({ message: "Rejected jobs retrieved successfully", rejectedJobs });
});



module.exports = {
  createJobApplication,
  getUserJobApplications,
  jobApproval,
  getAppliedJobs,
  getConfirmedJobs,
  getCompletedJobs,
  getApprovedJobs,
  getEmployeeCompletedJobs,
  getEmployeeRejectedJobs,
};
