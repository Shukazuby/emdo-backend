const express = require('express')
const jobApplyController = require('../../controllers/jobApply.controller')
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/:jobId', auth(), jobApplyController.createJobApplication)
router.patch('/:applicationId', auth(), jobApplyController.jobApproval);
router.get('/job', auth(), jobApplyController.getUserJobApplications)
router.get('/applied', auth(), jobApplyController.getAppliedJobs)
router.get('/confirmed', auth(), jobApplyController.getConfirmedJobs)
// router.post('/:applicationId', auth(), jobApplyController.employerDecision);
// router.post('/final/:applicationId', auth(), jobApplyController.employeeFinal);

module.exports = router