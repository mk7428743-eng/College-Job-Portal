const { body, validationResult } = require('express-validator');

// Error handler middleware to send validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  next();
};

exports.registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['student', 'recruiter', 'admin']).withMessage('Invalid role'),
  validate,
];

exports.loginValidation = [
  body('email').trim().isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

exports.jobValidation = [
  body('title').trim().notEmpty().withMessage('Job title is required'),
  body('description').trim().notEmpty().withMessage('Job description is required'),
  body('location').trim().notEmpty().withMessage('Job location is required'),
  body('jobType').isIn(['Full-time', 'Part-time', 'Internship', 'Contract']).withMessage('Invalid job type'),
  body('position').isInt({ min: 1 }).withMessage('Positions must be at least 1'),
  body('company').trim().notEmpty().withMessage('Company ID is required'),
  body('salary').optional().trim(),
  body('requirements').optional(), // accepts both string (comma-separated) and array — controller handles splitting
  validate,
];

exports.companyValidation = [
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('description').trim().notEmpty().withMessage('Company description is required'),
  body('location').trim().notEmpty().withMessage('Company location is required'),
  body('website').optional().trim().isURL().withMessage('Please enter a valid URL'),
  validate,
];
