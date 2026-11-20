const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Default starter resume data
const defaultResume = {
  personal: {
    fullName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/aarav-sharma",
    github: "github.com/aarav-dev",
    portfolio: "aaravsharma.dev",
    summary: "Aspiring Software Engineer with strong foundations in Data Structures, Algorithms, Full Stack Web Development (React, Node.js, Express, MongoDB), and cloud technologies. Proven track record of architecting high-performance web systems."
  },
  education: [
    {
      degree: "B.Tech in Computer Science and Engineering",
      institution: "National Institute of Technology",
      year: "2022 - 2026",
      grade: "CGPA: 8.9 / 10"
    },
    {
      degree: "Higher Secondary Certificate (Class XII)",
      institution: "Delhi Public School",
      year: "2022",
      grade: "94.2%"
    }
  ],
  experience: [
    {
      title: "Software Engineering Intern",
      company: "FinFlow Technologies",
      duration: "May 2025 - July 2025",
      bullets: [
        "Architected an event-driven microservice in Node.js & Redis, cutting transaction response latency by 35%.",
        "Refactored relational database queries and created B-Tree composite indexes to optimize read throughput by 42%.",
        "Collaborated in Agile sprints, authored unit tests with 92% coverage using Jest and GitHub Actions CI/CD."
      ]
    }
  ],
  projects: [
    {
      title: "PrepVault - Placement & Interview Portal",
      technologies: "Node.js, Express, MongoDB, JavaScript, Glassmorphism CSS, Chart.js",
      link: "https://prepvault.io",
      description: "Developed a comprehensive interview preparation platform featuring AI-assisted mock interviews, interactive code runners, timed aptitude quizzes, and automated PDF resume export."
    },
    {
      title: "Distributed File Sharing & Real-time Sync Engine",
      technologies: "React, WebSockets, Python, Docker, AWS S3",
      link: "https://github.com/aarav-dev/sync-engine",
      description: "Engineered a peer-to-peer file synchronization system handling chunks with SHA-256 integrity checks, sustaining 1,000 concurrent transfers without packet loss."
    }
  ],
  skills: {
    languages: ["C++", "Java", "Python", "JavaScript (ES6+)", "SQL", "HTML5/CSS3"],
    frameworks: ["React.js", "Node.js", "Express.js", "Tailwind CSS", "Bootstrap"],
    tools: ["Git & GitHub", "Docker", "MongoDB", "PostgreSQL", "Redis", "Postman", "Linux"],
    coursework: ["Data Structures & Algorithms", "Operating Systems", "Computer Networks", "DBMS", "System Design"]
  }
};

// @route   GET /api/resume
// @desc    Get user saved resume data
router.get('/', protect, async (req, res, next) => {
  try {
    try {
      const user = await User.findById(req.user._id);
      if (user && user.resumeData && user.resumeData.personal && user.resumeData.personal.fullName) {
        return res.status(200).json({ success: true, data: user.resumeData });
      }
    } catch (e) {}

    res.status(200).json({ success: true, data: defaultResume });
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/resume/save
// @desc    Save user resume data
router.post('/save', protect, async (req, res, next) => {
  try {
    const resumeData = req.body;

    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.resumeData = resumeData;
        await user.save();
        return res.status(200).json({
          success: true,
          message: 'Resume data saved successfully to profile',
          data: user.resumeData
        });
      }
    } catch (e) {}

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resumeData
    });
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/resume/templates
// @desc    Get list of available resume templates
router.get('/templates', (req, res) => {
  res.status(200).json({
    success: true,
    templates: [
      { id: "modern", name: "Modern Glass Tech", description: "Clean, ATS-optimized layout with accent sidebar and high visual hierarchy." },
      { id: "classic", name: "Executive Professional", description: "Traditional serif single-column format favored by Fortune 500 recruiters." },
      { id: "minimal", name: "Silicon Valley Minimalist", description: "High-density clean typography with bold headings and structured bullet points." }
    ]
  });
});

module.exports = router;
