const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for a job
// @route   POST /api/applications/apply/:jobId
// @access  Private (Student only)
exports.applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const studentId = req.user.id;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Check if student already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      student: studentId,
    });
    if (alreadyApplied) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job' });
    }

    // Handle resume choice
    let resumeFilename = '';
    let resumeOriginalName = '';

    // If new resume is uploaded with the application
    if (req.file) {
      resumeFilename = req.file.filename;
      resumeOriginalName = req.file.originalname;

      // Update student's default resume on profile as well, if they don't have one
      if (!req.user.profile.resume) {
        req.user.profile.resume = resumeFilename;
        req.user.profile.resumeOriginalName = resumeOriginalName;
        await req.user.save();
      }
    } else {
      // Fallback to student's profile resume
      if (!req.user.profile.resume) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a resume or add a resume to your profile first',
        });
      }
      resumeFilename = req.user.profile.resume;
      resumeOriginalName = req.user.profile.resumeOriginalName || 'Resume.pdf';
    }

    // Create Application
    const application = await Application.create({
      job: jobId,
      student: studentId,
      status: 'applied',
      resume: resumeFilename,
      resumeOriginalName: resumeOriginalName,
    });

    // Add to Job's applicants array
    job.applicants.push(studentId);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs applied by the student
// @route   GET /api/applications/applied
// @access  Private (Student only)
exports.getAppliedJobs = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate({
        path: 'job',
        populate: {
          path: 'company',
          select: 'name location website logo description',
        },
      })
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applicants for a job (Recruiter view)
// @route   GET /api/applications/applicants/:jobId
// @access  Private (Recruiter only)
exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Verify recruiter owns this job
    if (job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You did not post this job' });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email profile')
      .sort({ appliedAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/status/:applicationId
// @access  Private (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['shortlisted', 'rejected', 'selected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid application status' });
    }

    const application = await Application.findById(req.params.applicationId).populate('job');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Verify recruiter owns the job associated with application
    if (application.job.recruiter.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied: You did not post the job for this application' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({ success: true, message: `Application status updated to ${status}`, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
