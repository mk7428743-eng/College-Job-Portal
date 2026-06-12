const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  getRecruiterJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');
const { jobValidation } = require('../middleware/validator');

const router = express.Router();

router.get('/', getJobs);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterJobs);
router.get('/:id', getJob);

router.post('/', protect, authorize('recruiter'), jobValidation, createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter', 'admin'), deleteJob);

module.exports = router;
