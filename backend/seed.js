const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/job-portal-college');
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    console.log('Existing data cleared.');

    // 1. Create Users
    // Passwords will be automatically hashed by pre-save hooks
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@portal.com',
      password: 'admin123',
      role: 'admin',
    });

    const recruiter1 = await User.create({
      name: 'Alice Smith (Google)',
      email: 'recruiter1@portal.com',
      password: 'recruiter123',
      role: 'recruiter',
      profile: {
        companyName: 'Google LLC',
        phone: '1234567890',
        bio: 'Technical Recruiter at Google, hiring top tier software engineers.'
      }
    });

    const recruiter2 = await User.create({
      name: 'Bob Jones (Microsoft)',
      email: 'recruiter2@portal.com',
      password: 'recruiter123',
      role: 'recruiter',
      profile: {
        companyName: 'Microsoft Corporation',
        phone: '9876543210',
        bio: 'Talent Acquisition Partner at Microsoft.'
      }
    });

    const student1 = await User.create({
      name: 'John Doe',
      email: 'student1@portal.com',
      password: 'student123',
      role: 'student',
      profile: {
        bio: 'Computer Science undergraduate student passionate about web technologies and machine learning.',
        skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python'],
        department: 'Computer Science and Engineering',
        graduationYear: 2026,
        phone: '5551234567',
        resume: 'sample_resume.pdf',
        resumeOriginalName: 'John_Doe_CS_Resume.pdf'
      }
    });

    const student2 = await User.create({
      name: 'Jane Miller',
      email: 'student2@portal.com',
      password: 'student123',
      role: 'student',
      profile: {
        bio: 'Information Technology senior seeking frontend development roles.',
        skills: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Vue.js'],
        department: 'Information Technology',
        graduationYear: 2025,
        phone: '5559876543',
        resume: '',
      }
    });

    console.log('Sample Users created.');

    // 2. Create Companies
    const company1 = await Company.create({
      name: 'Google LLC',
      description: 'A global technology leader focusing on search, cloud computing, and AI technologies.',
      website: 'https://google.com',
      location: 'Mountain View, CA',
      createdBy: recruiter1._id,
    });

    const company2 = await Company.create({
      name: 'Microsoft Corporation',
      description: 'A multinational technology corporation producing software, electronics, and personal computers.',
      website: 'https://microsoft.com',
      location: 'Redmond, WA',
      createdBy: recruiter2._id,
    });

    // Link companies back to recruiters' profiles
    recruiter1.profile.company = company1._id;
    await recruiter1.save();

    recruiter2.profile.company = company2._id;
    await recruiter2.save();

    console.log('Sample Companies created.');

    // 3. Create Jobs
    const job1 = await Job.create({
      title: 'Associate Software Engineer',
      description: 'We are looking for an entry-level software engineer to join our cloud platform team. You will participate in building scalable backend services and working with modern technology stacks.',
      requirements: ['Bachelor\'s in CS or related field', 'Strong knowledge of JavaScript and Node.js', 'Understanding of RESTful APIs', 'Basic knowledge of databases'],
      salary: '$110,000 - $130,000',
      location: 'Mountain View, CA (Hybrid)',
      jobType: 'Full-time',
      position: 3,
      company: company1._id,
      recruiter: recruiter1._id,
    });

    const job2 = await Job.create({
      title: 'Frontend Developer Intern',
      description: 'Join us as a frontend developer intern! You will help shape user experiences, write clean frontend components, and work closely with product managers and designer teams.',
      requirements: ['Knowledge of HTML, CSS, and modern JS', 'Familiarity with React or other component-based libraries', 'Strong communication skills'],
      salary: '$45 - $55 per hour',
      location: 'Redmond, WA (Remote)',
      jobType: 'Internship',
      position: 2,
      company: company2._id,
      recruiter: recruiter2._id,
    });

    const job3 = await Job.create({
      title: 'Full Stack Engineer',
      description: 'We are seeking a senior full stack developer to drive end-to-end features. You will build and scale backend systems in Node and frontend interfaces in React.',
      requirements: ['3+ years of web development experience', 'Proficiency in React and Express.js', 'Experience with MongoDB and indexing', 'Familiarity with Docker'],
      salary: '$140,000 - $160,000',
      location: 'Redmond, WA (On-site)',
      jobType: 'Full-time',
      position: 1,
      company: company2._id,
      recruiter: recruiter2._id,
    });

    console.log('Sample Jobs created.');

    // 4. Create Applications
    const app1 = await Application.create({
      job: job1._id,
      student: student1._id,
      status: 'applied',
      resume: student1.profile.resume,
      resumeOriginalName: student1.profile.resumeOriginalName,
    });

    job1.applicants.push(student1._id);
    await job1.save();

    const app2 = await Application.create({
      job: job2._id,
      student: student1._id,
      status: 'shortlisted',
      resume: student1.profile.resume,
      resumeOriginalName: student1.profile.resumeOriginalName,
    });

    job2.applicants.push(student1._id);
    await job2.save();

    console.log('Sample Applications created.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
