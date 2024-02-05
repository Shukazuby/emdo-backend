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
  const options = { status: req.query.status }; // Assuming status is provided via query params

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

// const employerDecision = catchAsync(async (req, res) => {
//     const { id } = req.user;
//   const { applicationId } = req.params;
//   const options = { status: req.query.status };
//   const application = await jobApplyService.employerDecision(id, applicationId, options);

//   res.status(httpStatus.OK).send({ message: 'Application updated', application });
// });

// const employeeFinal= catchAsync(async (req, res) => {
//     const { id } = req.user;
//     const { applicationId } = req.params;
//     const options = { status: req.query.status }; // Assuming status is provided via query params
//     const application = await jobApplyService.employeeFinal(id, applicationId, options);

//     res.status(httpStatus.OK).send({ message: 'Job application confirmed', application });
//   });

module.exports = {
  createJobApplication,
  getUserJobApplications,
  jobApproval,
  //   employerDecision,
  //   employeeFinal,
};
