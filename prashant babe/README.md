# PrepVault - Modern Interview Preparation Portal

A production-grade, responsive, glassmorphic Interview Preparation & Placement Portal designed for students, job seekers, and campus recruiters.

Built with **HTML5, CSS3 (Glassmorphism), JavaScript (ES6+), Chart.js, jsPDF**, backed by a full **Node.js, Express, and MongoDB** architecture.

---

## 🌟 Key Features

### 1. User Authentication & Progress Tracking
- **JWT-Based Authentication**: Secure token generation, password hashing via `bcryptjs`.
- **Candidate Profiles**: Target role, graduation year, target companies, college details.
- **Dynamic Readiness Score (0 - 100%)**: Automatically computed across technical questions solved, aptitude quizzes passed, and mock interviews completed.
- **1-Click Demo Profiles**: Instant sign-in as **Student** (*Aarav Sharma*) or **Admin** (*Editorial Director*).

### 2. Interactive Dashboard
- **Personalized Welcome Section**: Motivational quotes and target role indicators.
- **Readiness Meter**: Gauge display with domain progress bars (Technical, Aptitude, Verbal).
- **KPI Metrics Cards**: Problems solved, tests taken, mock interviews completed, day streak counter.
- **Visual Analytics with Chart.js**:
  - *Domain Competency Radar Chart* (DSA, Languages, Database, OS/CN, Aptitude, HR).
  - *Weekly Activity Trend Chart* (Daily questions solved vs quizzes completed).
- **Today's Daily Challenge**: 1-click solver with bonus XP rewards.
- **Recent Activity Feed**: Timestamped milestone log.

### 3. Technical Interview Preparation
- **Comprehensive Coverage**:
  - Programming: **C, C++, Java, Python, JavaScript**
  - Data Structures & Algorithms (**DSA 75**: Arrays, Linked Lists, Trees, Graphs, DP)
  - Database Management Systems (**SQL Queries, Joins, Normalization, B-Trees, Indexing**)
  - Operating Systems (**Deadlocks, 4 Coffman Conditions, Banker's Algorithm, Paging, Virtual Memory**)
  - Computer Networks (**OSI 7 Layers, TCP 3-Way Handshake, DNS, HTTP/HTTPS, TIME_WAIT**)
- **Integrated Code Workspace**:
  - Language selector with starter code templates.
  - Interactive "Run Test Cases" with realistic compilation & execution output console.
  - Test case verification (inputs, expected vs actual outputs).
  - "Solution & Analysis" tab with Big-O time and space complexity explanations.
  - Bookmark questions to revisit later.

### 4. Aptitude & Placement Assessments
- **Three Core Pillars**: Quantitative Aptitude, Logical Reasoning, and Verbal Ability.
- **Real-Time Countdown Timer**: With warning visual cues in final minutes.
- **Question Palette Navigator**: Numbered bubble grid showing active, answered, and unanswered states.
- **Auto-Grading & Review**: Instant score percentage, pass/fail status, formula breakdown, and step-by-step mathematical explanations.

### 5. HR & Behavioral Interview (STAR Framework)
- **Top Frequently Asked HR Questions**: Sample high-scoring answers and recruiter dos & don'ts.
- **Interactive STAR Method Worksheet**:
  - **S**ituation (Context & Challenge)
  - **T**ask (Candidate ownership)
  - **A**ction (Technical initiatives implemented)
  - **R**esult (Quantified metrics & impact)
- **Real-time AI Evaluator**: Scores behavioral answers based on structure and metric quantification.

### 6. AI Mock Interview System
- **Role-Targeted Question Engine**: SDE, Frontend Engineer, and Full Stack Developer.
- **Speech-to-Text Input**: Built-in voice recognition using the **Web Speech API** (`webkitSpeechRecognition`) + typing editor.
- **Virtual Interviewer Stage**: Animated speaking avatar with visual sound waveforms.
- **Real-Time Evaluation**: Analyzes technical keywords, communication clarity, problem decomposition, and confidence.
- **Performance Report**: Overall score, recruiter hiring verdict (Recommended / Needs Practice), and dimensional progress bars.

### 7. Resume Builder & PDF Generation
- **Two-Column Live Workspace**: Input form on left, real-time preview canvas on right.
- **ATS-Optimized Templates**: *Modern Tech Glass*, *Executive Serif*, and *Silicon Valley Minimalist*.
- **Pre-fill Demo Data**: 1-click autofill with real-world software engineering bullet points.
- **Direct PDF Export**: High-resolution client-side PDF download powered by **jsPDF**.

### 8. Company-Wise Preparation Hub
Dedicated modules covering recruitment processes, packages, rounds, syllabus, and past interview questions for 8 major firms:
1. **TCS** (TCS NQT, Ninja vs Digital vs Prime, Advanced Coding in C/C++/Java/Python)
2. **Infosys** (InfyTQ, Pseudo-code, DSE & Specialist Programmer rounds)
3. **Wipro** (Elite NLTH, AMCAT test, Essay writing rules, coding)
4. **Accenture** (Cognitive, Wheebox technical assessment, automated voice communication round)
5. **Cognizant** (GenC, GenC Elevate, GenC Next coding tests)
6. **Amazon** (16 Leadership Principles, OA on HackerRank, Trees/Graphs, Bar Raiser round)
7. **Microsoft** (Codility OA, BSTs, Low-Level Design, Growth Mindset)
8. **Google** (Google Online Challenge, algorithmic edge cases, Googlyness)

### 9. Placement Resources & Learning Roadmaps
- **The Ultimate 90-Day SDE Placement Sprint**: 12-week roadmap with weekly milestones.
- **Real Interview Experiences**: Detailed interview rounds, CTC offered, and candidate advice.
- **Study Materials & Cheatsheets**: Quick revision notes for SQL, OS, and Networks.

### 10. Placement Leaderboard & Badges
- Top 10 candidate rankings with avatars, solved counts, streaks, and XP points.
- 1st, 2nd, and 3rd place podium graphics.
- Daily streak tracker and bonus XP rewards.

### 11. Verified Certificate of Readiness
- HTML5 Canvas dynamic certificate generator displaying Candidate Name, Target Role, Readiness Score, and verification hash.
- Exportable as high-res PNG or PDF.

### 12. Admin Management Panel
- System analytics (candidate count, question count, average scores).
- User role toggle (Student ↔ Admin).
- Question bank CRUD (Add, view, and delete questions across all categories).

---

## 📁 Project Structure

```
c:\prashant babe\
├── package.json                   # Project manifest & dependencies
├── .env.example                   # Environment configuration template
├── .env                           # Local environment configuration
├── server.js                      # Express application entry point
├── config/
│   └── db.js                      # MongoDB Mongoose connection
├── middleware/
│   ├── auth.js                    # JWT verification & role authorization
│   └── errorHandler.js            # Centralized API error handling
├── models/
│   ├── User.js                    # User & progress schema
│   ├── Question.js                # Technical & HR questions schema
│   ├── Quiz.js                    # Aptitude assessment schema
│   ├── MockSession.js             # AI Mock interview schema
│   ├── Company.js                 # Company recruitment blueprint schema
│   ├── Resource.js                # Roadmaps & interview experiences schema
│   └── Activity.js                # Activity timeline schema
├── routes/
│   ├── authRoutes.js              # /api/auth endpoints
│   ├── questionRoutes.js          # /api/questions endpoints
│   ├── quizRoutes.js              # /api/quizzes endpoints
│   ├── mockInterviewRoutes.js     # /api/mock-interview endpoints
│   ├── companyRoutes.js           # /api/companies endpoints
│   ├── resourceRoutes.js          # /api/resources endpoints
│   ├── resumeRoutes.js            # /api/resume endpoints
│   ├── leaderboardRoutes.js       # /api/leaderboard endpoints
│   └── adminRoutes.js             # /api/admin endpoints
├── data/
│   ├── seedData.js                # Curated seed database
│   └── seed.js                    # Database seed execution script
├── public/                        # Modern Glassmorphic Frontend
│   ├── index.html                 # Single Page Application HTML5
│   ├── css/
│   │   ├── style.css              # Glassmorphism design system & dark/light theme
│   │   └── components.css         # UI cards, code editor, quiz runner & modals
│   └── js/
│       ├── seedData.js            # Client-side fallback dataset
│       ├── app.js                 # SPA router, state manager & API adapter
│       ├── auth.js                # Authentication controller
│       ├── dashboard.js           # Chart.js graphs & readiness gauge
│       ├── technical.js           # Code editor & simulated test runner
│       ├── aptitude.js            # Timed quiz runner with countdown
│       ├── hr.js                  # HR questions & STAR practice builder
│       ├── mockInterview.js       # AI mock interview & speech-to-text
│       ├── resumeBuilder.js       # Resume designer & jsPDF generator
│       ├── companyPrep.js         # Company hubs & recruitment patterns
│       ├── resources.js           # Roadmaps & experiences
│       ├── leaderboard.js         # Leaderboard & daily challenge
│       ├── certificate.js         # HTML5 canvas certificate generator
│       └── admin.js               # Admin analytics & question CRUD
├── start-server.ps1               # Automated Windows PowerShell launcher
├── start.bat                      # 1-Click double-click launcher
└── README.md                      # Full documentation
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend UI** | HTML5, CSS3 Glassmorphism, Vanilla ES6+ Modules |
| **Typography & Icons**| Google Fonts (*Inter*), Font Awesome 6 |
| **Visual Charts** | Chart.js 4.4 |
| **PDF Generation** | jsPDF 2.5 |
| **Speech Recognition**| Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`) |
| **Backend Engine** | Node.js + Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) + bcryptjs |

---

## 🚀 How to Run the Application

### Option A: 1-Click Launcher (Windows)
Double-click `start.bat` or run:
```powershell
powershell -ExecutionPolicy Bypass -File .\start-server.ps1
```
*The launcher detects if Node.js is installed. If Node is present, it boots the Express server; if not, it automatically runs the Windows built-in HTTP server on port 5000 and opens your browser.*

### Option B: Node.js & Express (Standard)
1. Install dependencies:
   ```bash
   npm install
   ```
2. (Optional) Seed MongoDB database:
   ```bash
   npm run seed
   ```
3. Start the server:
   ```bash
   npm start
   ```
4. Open [http://localhost:5000](http://localhost:5000) in your browser.

### Option C: Direct Browser Launch
Open `public/index.html` directly in any modern browser (Chrome, Edge, Firefox, Brave, Safari).
The built-in client-side persistence and seed adapter will run all features offline seamlessly!

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Student** | `student@prepvault.io` | `Student@123` |
| **Administrator** | `admin@prepvault.io` | `Admin@123` |

*(You can also click the quick **"Login as Student"** or **"Login as Admin"** buttons inside the sign-in modal for immediate access).*

---

## 📡 REST API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create student account
- `POST /api/auth/login` - Authenticate & obtain JWT
- `GET /api/auth/me` - Get logged-in user profile
- `PUT /api/auth/profile` - Update profile & target companies
- `POST /api/auth/logout` - Invalidate session

### Technical Questions (`/api/questions`)
- `GET /api/questions` - List questions with category, difficulty, company filters
- `GET /api/questions/:id` - Fetch single question with test cases
- `POST /api/questions/:id/submit` - Execute test cases & update candidate score
- `POST /api/questions/:id/bookmark` - Toggle bookmark

### Aptitude Quizzes (`/api/quizzes`)
- `GET /api/quizzes` - Fetch quizzes by category (Quant, Logical, Verbal)
- `GET /api/quizzes/:id` - Fetch quiz with questions
- `POST /api/quizzes/:id/submit` - Auto-grade quiz, compute percentage & review

### Mock Interview (`/api/mock-interview`)
- `POST /api/mock-interview/start` - Initialize session for target role
- `POST /api/mock-interview/evaluate` - Evaluate spoken/typed answer using NLP heuristics
- `POST /api/mock-interview/finish` - Generate final interview performance report

### Companies (`/api/companies`)
- `GET /api/companies` - List 8 company recruitment blueprints
- `GET /api/companies/:slug` - Get selection rounds, syllabus & past questions

### Resume (`/api/resume`)
- `GET /api/resume` - Retrieve saved resume
- `POST /api/resume/save` - Save resume draft

### Admin (`/api/admin`)
- `GET /api/admin/analytics` - System metrics & readiness statistics
- `GET /api/admin/users` - Candidate list & role management
- `POST /api/admin/questions` - Create new questions
- `DELETE /api/admin/questions/:id` - Delete question

---

© 2026 PrepVault. Developed with best practices for software engineering and recruitment readiness.
