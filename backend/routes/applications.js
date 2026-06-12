const express = require('express');
const {
  applyJob,
  getAppliedJobs,
  getJobApplicants,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/apply/:jobId', protect, authorize('student'), upload.single('resume'), applyJob);
router.get('/applied', protect, authorize('student'), getAppliedJobs);
router.get('/applicants/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.put('/status/:applicationId', protect, authorize('recruiter'), updateApplicationStatus);

module.exports = router;
