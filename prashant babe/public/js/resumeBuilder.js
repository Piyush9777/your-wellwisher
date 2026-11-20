// ==========================================================================
// PREPVAULT RESUME BUILDER CONTROLLER
// Interactive Resume Form, Real-time Preview, Templates & jsPDF Export
// ==========================================================================

const ResumeBuilder = (() => {
  let activeTemplate = 'modern';
  let resumeData = {
    personal: {
      fullName: "Aarav Sharma",
      email: "aarav.sharma@example.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      linkedin: "linkedin.com/in/aarav-sharma",
      github: "github.com/aarav-dev",
      summary: "Aspiring Software Engineer with solid foundations in Data Structures, Algorithms, and Full Stack Web Architecture. Experienced in developing scalable microservices in Node.js and interactive SPAs in React."
    },
    education: [
      { degree: "B.Tech in Computer Science & Engineering", institution: "National Institute of Technology", year: "2022 - 2026", grade: "CGPA: 8.9 / 10" },
      { degree: "Senior Secondary (XII - CBSE)", institution: "Delhi Public School", year: "2022", grade: "94.2%" }
    ],
    experience: [
      {
        title: "Software Engineering Intern",
        company: "FinFlow Technologies",
        duration: "May 2025 - July 2025",
        bullet1: "Architected event-driven microservice in Node.js & Redis, reducing transaction latency by 35%.",
        bullet2: "Optimized PostgreSQL database schemas and constructed composite B-Tree indexes.",
        bullet3: "Collaborated in Agile sprints and authored automated test suites with 92% coverage."
      }
    ],
    projects: [
      {
        title: "PrepVault - Placement & Interview Portal",
        technologies: "Node.js, Express, MongoDB, JavaScript, Glassmorphism CSS, Chart.js",
        description: "Engineered comprehensive placement preparation system featuring real-time AI mock interviews, code runners, timed aptitude quizzes, and client-side PDF resume generation."
      },
      {
        title: "Real-Time Distributed Collaboration Hub",
        technologies: "React, WebSockets, Python, Docker, AWS S3",
        description: "Built scalable collaborative workspace supporting 1,000 concurrent socket connections with SHA-256 chunk synchronization and sub-100ms message broadcast."
      }
    ],
    skills: {
      languages: "C++, Java, Python, JavaScript (ES6+), SQL, HTML5/CSS3",
      frameworks: "React.js, Node.js, Express.js, Tailwind CSS, Bootstrap",
      tools: "Git, Docker, MongoDB, PostgreSQL, Redis, Postman, Linux",
      coursework: "Data Structures & Algorithms, Operating Systems, Computer Networks, DBMS"
    }
  };

  const render = () => {
    populateFormFields();
    updateLivePreview();
  };

  const populateFormFields = () => {
    // Personal Info
    setVal('rb-name', resumeData.personal.fullName);
    setVal('rb-email', resumeData.personal.email);
    setVal('rb-phone', resumeData.personal.phone);
    setVal('rb-location', resumeData.personal.location);
    setVal('rb-linkedin', resumeData.personal.linkedin);
    setVal('rb-github', resumeData.personal.github);
    setVal('rb-summary', resumeData.personal.summary);

    // Education
    if (resumeData.education[0]) {
      setVal('rb-edu-degree', resumeData.education[0].degree);
      setVal('rb-edu-school', resumeData.education[0].institution);
      setVal('rb-edu-year', resumeData.education[0].year);
      setVal('rb-edu-grade', resumeData.education[0].grade);
    }

    // Experience
    if (resumeData.experience[0]) {
      setVal('rb-exp-title', resumeData.experience[0].title);
      setVal('rb-exp-comp', resumeData.experience[0].company);
      setVal('rb-exp-duration', resumeData.experience[0].duration);
      setVal('rb-exp-b1', resumeData.experience[0].bullet1);
      setVal('rb-exp-b2', resumeData.experience[0].bullet2);
    }

    // Projects
    if (resumeData.projects[0]) {
      setVal('rb-proj1-title', resumeData.projects[0].title);
      setVal('rb-proj1-tech', resumeData.projects[0].technologies);
      setVal('rb-proj1-desc', resumeData.projects[0].description);
    }
    if (resumeData.projects[1]) {
      setVal('rb-proj2-title', resumeData.projects[1].title);
      setVal('rb-proj2-tech', resumeData.projects[1].technologies);
      setVal('rb-proj2-desc', resumeData.projects[1].description);
    }

    // Skills
    setVal('rb-skills-lang', resumeData.skills.languages);
    setVal('rb-skills-fw', resumeData.skills.frameworks);
    setVal('rb-skills-tools', resumeData.skills.tools);
    setVal('rb-skills-course', resumeData.skills.coursework);
  };

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  const getVal = (id) => {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  // Called on input event from form fields
  const handleInputChange = () => {
    resumeData.personal.fullName = getVal('rb-name');
    resumeData.personal.email = getVal('rb-email');
    resumeData.personal.phone = getVal('rb-phone');
    resumeData.personal.location = getVal('rb-location');
    resumeData.personal.linkedin = getVal('rb-linkedin');
    resumeData.personal.github = getVal('rb-github');
    resumeData.personal.summary = getVal('rb-summary');

    resumeData.education[0] = {
      degree: getVal('rb-edu-degree'),
      institution: getVal('rb-edu-school'),
      year: getVal('rb-edu-year'),
      grade: getVal('rb-edu-grade')
    };

    resumeData.experience[0] = {
      title: getVal('rb-exp-title'),
      company: getVal('rb-exp-comp'),
      duration: getVal('rb-exp-duration'),
      bullet1: getVal('rb-exp-b1'),
      bullet2: getVal('rb-exp-b2')
    };

    resumeData.projects[0] = {
      title: getVal('rb-proj1-title'),
      technologies: getVal('rb-proj1-tech'),
      description: getVal('rb-proj1-desc')
    };

    resumeData.projects[1] = {
      title: getVal('rb-proj2-title'),
      technologies: getVal('rb-proj2-tech'),
      description: getVal('rb-proj2-desc')
    };

    resumeData.skills.languages = getVal('rb-skills-lang');
    resumeData.skills.frameworks = getVal('rb-skills-fw');
    resumeData.skills.tools = getVal('rb-skills-tools');
    resumeData.skills.coursework = getVal('rb-skills-course');

    updateLivePreview();
  };

  const changeTemplate = (tpl) => {
    activeTemplate = tpl;
    document.querySelectorAll('.resume-tpl-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tpl') === tpl);
    });
    updateLivePreview();
  };

  const updateLivePreview = () => {
    const previewContainer = document.getElementById('resume-live-preview');
    if (!previewContainer) return;

    const p = resumeData.personal;
    const edu = resumeData.education[0] || {};
    const exp = resumeData.experience[0] || {};
    const proj1 = resumeData.projects[0] || {};
    const proj2 = resumeData.projects[1] || {};
    const skl = resumeData.skills;

    // Theme variations
    const primaryColor = activeTemplate === 'classic' ? '#1e293b' : activeTemplate === 'minimal' ? '#0f172a' : '#2563eb';
    const fontFamily = activeTemplate === 'classic' ? '"Times New Roman", Times, serif' : 'Inter, sans-serif';

    previewContainer.style.fontFamily = fontFamily;

    previewContainer.innerHTML = `
      <div style="padding: 1.5rem; color: #1f2937;">
        <!-- Header -->
        <div style="text-align: center; border-bottom: 2px solid ${primaryColor}; padding-bottom: 12px; margin-bottom: 16px;">
          <h1 style="font-size: 26px; color: ${primaryColor}; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">${p.fullName || 'YOUR NAME'}</h1>
          <div style="font-size: 12px; color: #4b5563; display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
            ${p.email ? `<span><i class="fas fa-envelope"></i> ${p.email}</span>` : ''}
            ${p.phone ? `<span><i class="fas fa-phone"></i> ${p.phone}</span>` : ''}
            ${p.location ? `<span><i class="fas fa-map-marker-alt"></i> ${p.location}</span>` : ''}
            ${p.linkedin ? `<span><i class="fab fa-linkedin"></i> ${p.linkedin}</span>` : ''}
            ${p.github ? `<span><i class="fab fa-github"></i> ${p.github}</span>` : ''}
          </div>
        </div>

        <!-- Professional Summary -->
        ${p.summary ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 13px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px;">Professional Summary</div>
            <p style="font-size: 12px; line-height: 1.5; color: #374151;">${p.summary}</p>
          </div>
        ` : ''}

        <!-- Education -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 13px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px;">Education</div>
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #111827;">
            <span>${edu.degree || 'Degree Program'}</span>
            <span>${edu.year || '2022 - 2026'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: #4b5563;">
            <span>${edu.institution || 'University Name'}</span>
            <span>${edu.grade || ''}</span>
          </div>
        </div>

        <!-- Experience -->
        ${exp.title ? `
          <div style="margin-bottom: 14px;">
            <div style="font-size: 13px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px;">Work Experience</div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #111827;">
              <span>${exp.title} - ${exp.company}</span>
              <span>${exp.duration}</span>
            </div>
            <ul style="font-size: 11.5px; line-height: 1.5; color: #374151; margin-top: 4px; padding-left: 18px;">
              ${exp.bullet1 ? `<li>${exp.bullet1}</li>` : ''}
              ${exp.bullet2 ? `<li>${exp.bullet2}</li>` : ''}
            </ul>
          </div>
        ` : ''}

        <!-- Projects -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 13px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px;">Technical Projects</div>
          
          ${proj1.title ? `
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #111827;">
                <span>${proj1.title}</span>
                <span style="font-size: 11px; font-style: italic; color: #6b7280;">[${proj1.technologies}]</span>
              </div>
              <p style="font-size: 11.5px; line-height: 1.45; color: #374151; margin-top: 2px;">${proj1.description}</p>
            </div>
          ` : ''}

          ${proj2.title ? `
            <div>
              <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; color: #111827;">
                <span>${proj2.title}</span>
                <span style="font-size: 11px; font-style: italic; color: #6b7280;">[${proj2.technologies}]</span>
              </div>
              <p style="font-size: 11.5px; line-height: 1.45; color: #374151; margin-top: 2px;">${proj2.description}</p>
            </div>
          ` : ''}
        </div>

        <!-- Technical Skills -->
        <div>
          <div style="font-size: 13px; font-weight: bold; color: ${primaryColor}; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px;">Technical Skills</div>
          <div style="font-size: 11.5px; line-height: 1.6; color: #374151;">
            ${skl.languages ? `<div><strong>Languages:</strong> ${skl.languages}</div>` : ''}
            ${skl.frameworks ? `<div><strong>Frameworks & Libraries:</strong> ${skl.frameworks}</div>` : ''}
            ${skl.tools ? `<div><strong>Tools & Databases:</strong> ${skl.tools}</div>` : ''}
            ${skl.coursework ? `<div><strong>Core Coursework:</strong> ${skl.coursework}</div>` : ''}
          </div>
        </div>
      </div>
    `;
  };

  const downloadPDF = () => {
    const previewEl = document.getElementById('resume-live-preview');
    if (!previewEl) return;

    App.showToast('Generating high-resolution PDF...', 'info');

    // Check for jsPDF
    if (window.jspdf && window.jspdf.jsPDF) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({
        unit: 'pt',
        format: 'a4',
        orientation: 'portrait'
      });

      doc.html(previewEl, {
        callback: function (pdf) {
          pdf.save(`${(resumeData.personal.fullName || 'Resume').replace(/\s+/g, '_')}_PrepVault.pdf`);
          App.showToast('Resume PDF downloaded successfully!', 'success');
        },
        x: 10,
        y: 10,
        width: 575,
        windowWidth: 800
      });
    } else {
      // Fallback: browser print dialog
      window.print();
    }
  };

  const saveResumeToProfile = async () => {
    if (App.state.user) {
      App.state.user.resumeData = resumeData;
      localStorage.setItem('prepvault_current_user', JSON.stringify(App.state.user));
    }
    App.showToast('Resume progress saved to your profile!', 'success');
  };

  return {
    render,
    handleInputChange,
    changeTemplate,
    downloadPDF,
    saveResumeToProfile
  };
})();
