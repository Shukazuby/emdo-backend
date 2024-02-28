const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { jobService, employerService } = require('../services');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');

const createJob = catchAsync(async (req, res) => {
  const { id } = req.user;
  const job = await jobService.createJob(id, req.body);
  res.status(httpStatus.CREATED).send(job);
});

// const getJob = catchAsync(async (req, res) => {
//   const { jobId } = req.params;
//   const job = await jobService.getJobsById(jobId);
//   if (!job) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'job not found');
//   }
//   res.status(httpStatus.OK).send(job);
// });

const getJob = catchAsync(async (req, res) => {
  const job = await jobService.getJobsById(req.user.id, req.params.jobId);
  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, 'job not found');
  }
  res.status(httpStatus.OK).send(job);
});

const getJobs = catchAsync(async (req, res) => {
  const filter = pick(req.query, [ 'status', 'new']);
  const options = pick(req.query, ['order', 'limit', 'page']);
  const result = await jobService.getJobs(filter, options);
  res.send(result);
});

const newStatus = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['date']);
  const options = pick(req.query, ['limit', 'page']);
  const result = await jobService.newStatus(filter, options);
  res.send(result);
});

const ongoingStatus = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['date']);
  const options = pick(req.query, ['order', 'limit', 'page']);
  const result = await jobService.ongoingStatus(filter, options);
  res.send(result);
});

const completeStatus = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['date']);
  const options = pick(req.query, ['order', 'limit', 'page']);
  const result = await jobService.completeStatus(filter, options);
  res.send(result);
});

const getJobsByAnEmployer = catchAsync(async (req, res) => {
  const { id } = req.user;
  const employer = await employerService.getEmployerByUserId(id);
  const jobs = await jobService.getJobsByAnEmployer(employer.id);
  res.send(jobs);
});

const updateJob = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { jobId } = req.params;
  const employer = await employerService.getEmployerByUserId(id);
  const job = await jobService.getJobsById(jobId);
  if (employer.id !== job.employerId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const updatedJob = await jobService.updateJobById(jobId, req.body);
  res.send(updatedJob);
}
);

const deleteJob = catchAsync(async (req, res) => {
  const { id } = req.user;
  const { jobId } = req.params;
  const deleteJob = await jobService.deleteJobById(id, jobId);
  res.status(httpStatus.NO_CONTENT).send();
});

const allFilter = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['location','role', 'company', 'time', 'distance', 'minPrice', 'maxPrice', 'date',]);
  const options = pick(req.query, ['order', 'limit', 'page']);
  const result = await jobService.allFilter(filter, options);
  res.send(result);
});

const getAllJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.getAllJobs(req.user.id);
  res.send(jobs);
});

const getActiveJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.getActiveJobs(req.user.id);
  res.send(jobs);
});

const getCancelledJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.getCancelledJobs(req.user.id);
  res.send(jobs);
});

const getCompletedJobs = catchAsync(async (req, res) => {
  const jobs = await jobService.getCompletedJobs(req.user.id);
  res.send(jobs);
});

const getActiveJobsByEmployerId = catchAsync(async (req, res) => {
  const jobs = await jobService.getActiveJobsByEmployerId(req.user.id, req.params.employerId);
  res.send(jobs);
});

const getCancelledJobsByEmployerId = catchAsync(async (req, res) => {
  const jobs = await jobService.getCancelledJobsByEmployerId(req.user.id, req.params.employerId);
  res.send(jobs);
});

const getCompletedJobsByEmployerId = catchAsync(async (req, res) => {
  const jobs = await jobService.getCompletedJobsByEmployerId(req.user.id, req.params.employerId);
  res.send(jobs);
});

const getActiveJobsByEmployeeId = catchAsync(async (req, res) => {
  const jobs = await jobService.getActiveJobsByEmployeeId(req.user.id, req.params.employeeId);
  res.send(jobs);
});

const getCancelledJobsByEmployeeId = catchAsync(async (req, res) => {
  const jobs = await jobService.getCancelledJobsByEmployeeId(req.user.id, req.params.employeeId);
  res.send(jobs);
});

const getCompletedJobsByEmployeeId = catchAsync(async (req, res) => {
  const jobs = await jobService.getCompletedJobsByEmployeeId(req.user.id, req.params.employeeId);
  res.send(jobs);
});

const bookmarkJob = catchAsync(async (req, res) => {
  const bookmark = await jobService.bookmarkJob(req.user.id, req.params.jobId);
  res.send(bookmark);
});
const getABookmarkedJob = catchAsync(async (req, res) => {
  const bookmark = await jobService.getABookmarkedJob(req.user.id, req.params.jobId);
  res.send(bookmark);
});
const getBookmarkedJobs = catchAsync(async (req, res) => {
  const bookmark = await jobService.getBookmarkedJobs(req.user.id);
  res.send(bookmark);
});
const deleteABookmarkedJob = catchAsync(async (req, res) => {
  const bookmark = await jobService.deleteABookmarkedJob(req.user.id, req.params.jobId);
  res.send({message: bookmark});
});



module.exports = {
  createJob,
  getJob,
  getJobs,
  getJobsByAnEmployer,
  updateJob,
  deleteJob,
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
  getBookmarkedJobs,deleteABookmarkedJob,
  getCompletedJobs, getCompletedJobsByEmployerId,
  getCompletedJobsByEmployeeId
};