const Company = require('../models/Company');

// @desc    Create a new company
// @route   POST /api/companies
// @access  Private (Recruiter only)
exports.createCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    // Check if company already exists
    const companyExists = await Company.findOne({ name });
    if (companyExists) {
      return res.status(400).json({ success: false, message: 'Company with this name already exists' });
    }

    const company = await Company.create({
      name,
      description,
      website,
      location,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Public
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate('createdBy', 'name email');
    res.status(200).json({ success: true, count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Public
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('createdBy', 'name email');
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }
    res.status(200).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter's created companies
// @route   GET /api/companies/recruiter/me
// @access  Private (Recruiter only)
exports.getRecruiterCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ createdBy: req.user.id });
    res.status(200).json({ success: true, count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
