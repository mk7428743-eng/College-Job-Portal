const Job = require('../models/Job');
const Company = require('../models/Company');

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, salary, location, jobType, position, company } = req.body;

    // Check if company exists and belongs to recruiter (optional extra check, or just check existence)
    const companyExists = await Company.findById(company);
    if (!companyExists) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    const job = await Job.create({
      title,
      description,
      requirements: Array.isArray(requirements) ? requirements : (requirements ? requirements.split(',').map(r => r.trim()).filter(Boolean) : []),
      salary,
      location,
      jobType,
      position,
      company,
      recruiter: req.user.id,
    });

    res.status(201).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs (with search/filter query parameters)
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, location, jobType, salary } = req.query;
    let query = {};

    // Keyword search in title/description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (jobType) {
      query.jobType = jobType;
    }
    if (salary) {
      // Basic text search for salary matching
      query.salary = { $regex: salary, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('company', 'name location logo website description')
      .populate('recruiter', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job detail
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name location logo website description')
      .populate('recruiter', 'name email');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get recruiter's job postings
// @route   GET /api/jobs/recruiter
// @access  Private (Recruiter only)
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user.id })
      .populate('company', 'name location logo')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter only)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is the job owner/recruiter
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'User not authorized to update this job' });
    }

    const { title, description, requirements, salary, location, jobType, position, company } = req.body;

    const fieldsToUpdate = {};
    if (title) fieldsToUpdate.title = title;
    if (description) fieldsToUpdate.description = description;
    if (requirements) {
      fieldsToUpdate.requirements = Array.isArray(requirements) 
        ? requirements 
        : requirements.split(',').map(r => r.trim()).filter(Boolean);
    }
    if (salary !== undefined) fieldsToUpdate.salary = salary;
    if (location) fieldsToUpdate.location = location;
    if (jobType) fieldsToUpdate.jobType = jobType;
    if (position !== undefined) fieldsToUpdate.position = position;
    if (company) fieldsToUpdate.company = company;

    job = await Job.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Make sure user is recruiter owner or admin
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'User not authorized to delete this job' });
    }

    // Use deleteOne instead of remove which is deprecated in newer Mongoose
    await Job.deleteOne({ _id: req.params.id });

    // Also optionally clean up any associated Applications
    const Application = require('../models/Application');
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({ success: true, message: 'Job and all its applications deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
