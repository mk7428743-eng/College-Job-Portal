const express = require('express');
const {
  createCompany,
  getCompanies,
  getCompany,
  getRecruiterCompanies,
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const { companyValidation } = require('../middleware/validator');

const router = express.Router();

router.get('/', getCompanies);
router.get('/recruiter/me', protect, authorize('recruiter'), getRecruiterCompanies);
router.get('/:id', getCompany);

router.post('/', protect, authorize('recruiter'), companyValidation, createCompany);

module.exports = router;
