// ==========================================================================
// PREPVAULT AI MOCK INTERVIEW CONTROLLER
// Speech-to-Text Recording, Real-time AI Evaluation & Performance Report
// ==========================================================================

const MockInterview = (() => {
  let isInterviewActive = false;
  let activeRole = 'Software Development Engineer (SDE)';
  let currentQIndex = 0;
  let speechRecognizer = null;
  let isRecording = false;
  let sessionScores = [];

  const questionsRoleMap = {
    'Software Development Engineer (SDE)': [
      {
        question: "Walk me through how you would optimize an algorithm that currently runs in O(N^2) time to O(N) or O(N log N). Share a real example.",
        category: "Technical / Algorithms",
        keywords: ["hash map", "two pointers", "binary search", "trade-off", "space complexity", "sorting"]
      },
      {
        question: "How do you ensure thread-safety when multiple threads modify a shared resource in memory?",
        category: "Concurrency & OS",
        keywords: ["mutex", "semaphore", "atomic", "locks", "deadlock", "race condition", "synchronized"]
      },
      {
        question: "Describe a complex bug you encountered in production or during a project. How did you isolate and resolve it?",
        category: "Behavioral / Problem Solving",
        keywords: ["reproduce", "logs", "debugger", "root cause", "testing", "monitoring", "profiler"]
      }
    ],
    'Frontend Developer': [
      {
        question: "Explain how the Browser Critical Rendering Path works and what techniques you use to achieve sub-second LCP (Largest Contentful Paint).",
        category: "Web Performance",
        keywords: ["dom", "cssom", "render tree", "lazy loading", "code splitting", "caching", "layout"]
      },
      {
        question: "How does the JavaScript Event Loop handle microtasks vs macrotasks? Provide an example with Promises and setTimeout.",
        category: "Core JavaScript",
        keywords: ["call stack", "microtask queue", "macrotask", "promise", "settimeout", "non-blocking"]
      },
      {
        question: "Tell me about a time you had to make a design trade-off between user experience and technical feasibility.",
        category: "Behavioral",
        keywords: ["user experience", "performance", "trade-off", "stakeholders", "compromise", "accessibility"]
      }
    ],
    'Full Stack Developer': [
      {
        question: "How do you design a secure RESTful API that handles authentication, authorization, and rate limiting?",
        category: "System Design & Security",
        keywords: ["jwt", "oauth", "middleware", "token", "rate limit", "https", "cors", "hash"]
      },
      {
        question: "Compare SQL relational databases vs NoSQL document stores. Under what circumstances would you choose MongoDB over PostgreSQL?",
        category: "Database Architecture",
        keywords: ["acid", "schema", "flexible", "horizontal scale", "indexes", "transactions", "json"]
      },
      {
        question: "Describe a situation where you had to quickly learn a new framework or tool to meet a project deliverable.",
        category: "Behavioral / Growth Mindset",
        keywords: ["documentation", "hands-on", "prototype", "mentor", "delivery", "fast learning"]
      }
    ]
  };

  const render = () => {
    initSpeechRecognition();
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      speechRecognizer = new SpeechRecognition();
      speechRecognizer.continuous = true;
      speechRecognizer.interimResults = true;
      speechRecognizer.lang = 'en-US';

      speechRecognizer.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        const inputArea = document.getElementById('mock-answer-input');
        if (inputArea) {
          inputArea.value = (inputArea.value + ' ' + transcript).trim();
        }
      };

      speechRecognizer.onerror = (event) => {
        console.warn('Speech recognition warning:', event.error);
        stopRecording();
      };

      speechRecognizer.onend = () => {
        isRecording = false;
        updateRecordingUI();
      };
    }
  };

  const toggleRecording = () => {
    if (!speechRecognizer) {
      App.showToast('Web Speech API not supported in this browser. Please type your answer directly.', 'info');
      return;
    }

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    try {
      speechRecognizer.start();
      isRecording = true;
      updateRecordingUI();
      App.showToast('Microphone active. Speak your answer clearly...', 'info');
    } catch (e) {
      console.warn('Speech recognition error:', e);
    }
  };

  const stopRecording = () => {
    if (speechRecognizer && isRecording) {
      speechRecognizer.stop();
      isRecording = false;
      updateRecordingUI();
    }
  };

  const updateRecordingUI = () => {
    const btn = document.getElementById('btn-mock-record');
    const status = document.getElementById('mock-record-status');
    if (btn) {
      btn.classList.toggle('recording', isRecording);
      btn.innerHTML = isRecording ? '<i class="fas fa-stop"></i>' : '<i class="fas fa-microphone"></i>';
    }
    if (status) {
      status.textContent = isRecording ? 'Recording active... (Speak now)' : 'Click mic to record or type below';
      status.style.color = isRecording ? '#ef4444' : 'var(--text-dim)';
    }
  };

  const startInterview = () => {
    const roleSelect = document.getElementById('mock-role-select');
    activeRole = roleSelect ? roleSelect.value : 'Software Development Engineer (SDE)';
    currentQIndex = 0;
    sessionScores = [];
    isInterviewActive = true;

    // Switch views in UI
    document.getElementById('mock-setup-step').style.display = 'none';
    document.getElementById('mock-interview-room').style.display = 'grid';
    document.getElementById('mock-report-step').style.display = 'none';

    loadCurrentQuestion();
  };

  const loadCurrentQuestion = () => {
    const questions = questionsRoleMap[activeRole] || questionsRoleMap['Software Development Engineer (SDE)'];
    const q = questions[currentQIndex];

    const qNum = document.getElementById('mock-q-number');
    const qCat = document.getElementById('mock-q-category');
    const qText = document.getElementById('mock-q-text');
    const answerInput = document.getElementById('mock-answer-input');
    const feedbackBox = document.getElementById('mock-round-feedback');

    if (qNum) qNum.textContent = `Question ${currentQIndex + 1} of ${questions.length}`;
    if (qCat) qCat.textContent = q.category;
    if (qText) qText.textContent = q.question;
    if (answerInput) answerInput.value = '';
    if (feedbackBox) feedbackBox.style.display = 'none';

    // Animate AI Avatar
    const avatar = document.getElementById('mock-ai-avatar');
    if (avatar) {
      avatar.classList.add('speaking');
      setTimeout(() => avatar.classList.remove('speaking'), 2000);
    }
  };

  const evaluateAnswer = () => {
    stopRecording();
    const answerInput = document.getElementById('mock-answer-input');
    const answer = answerInput ? answerInput.value.trim() : '';

    if (!answer || answer.split(/\s+/).length < 5) {
      App.showToast('Please provide a substantive response (speak or type at least 1-2 sentences).', 'warning');
      return;
    }

    const questions = questionsRoleMap[activeRole] || questionsRoleMap['Software Development Engineer (SDE)'];
    const currentQ = questions[currentQIndex];

    // NLP evaluation heuristics
    const words = answer.toLowerCase();
    const matched = currentQ.keywords.filter(kw => words.includes(kw));
    const keywordScore = Math.round((matched.length / Math.max(currentQ.keywords.length, 1)) * 40);
    const lengthScore = Math.min(Math.round((answer.split(/\s+/).length / 50) * 35), 35);
    const clarityScore = answer.includes('for example') || answer.includes('result') || answer.includes('implemented') ? 25 : 18;

    const roundScore = Math.min(50 + keywordScore + lengthScore + (clarityScore - 15), 96);
    sessionScores.push(roundScore);

    // Display Feedback Box
    const feedbackBox = document.getElementById('mock-round-feedback');
    const scoreVal = document.getElementById('mock-round-score');
    const critiqueText = document.getElementById('mock-critique-text');
    const keywordsBox = document.getElementById('mock-detected-keywords');

    if (scoreVal) scoreVal.textContent = `${roundScore}%`;
    if (critiqueText) {
      critiqueText.textContent = roundScore >= 80
        ? `Impressive technical articulation! You effectively addressed the key mechanics of ${currentQ.category}.`
        : `Good foundation. To strengthen this response, clearly articulate trade-offs and cite a practical example.`;
    }
    if (keywordsBox) {
      keywordsBox.innerHTML = matched.length > 0
        ? `<strong>Matched Keywords:</strong> ` + matched.map(m => `<span class="badge badge-accent" style="font-size:0.75rem; margin-right:4px;">${m}</span>`).join('')
        : `<span style="color:var(--text-dim);">Tip: Consider incorporating technical terms like: ${currentQ.keywords.slice(0, 3).join(', ')}.</span>`;
    }

    if (feedbackBox) feedbackBox.style.display = 'block';

    const btnNext = document.getElementById('btn-mock-next');
    if (btnNext) {
      btnNext.innerHTML = currentQIndex >= questions.length - 1 ? '<i class="fas fa-file-alt"></i> Complete & View Report' : 'Next Question <i class="fas fa-arrow-right"></i>';
    }
  };

  const nextQuestion = () => {
    const questions = questionsRoleMap[activeRole] || questionsRoleMap['Software Development Engineer (SDE)'];
    if (currentQIndex < questions.length - 1) {
      currentQIndex++;
      loadCurrentQuestion();
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    const avgScore = sessionScores.length > 0
      ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
      : 84;

    // Update user stats
    if (App.state.user) {
      if (!App.state.user.stats) App.state.user.stats = { technicalSolved: 0, aptitudeTestsTaken: 0, mockInterviewsCompleted: 0, currentStreak: 1, totalPoints: 0 };
      App.state.user.stats.mockInterviewsCompleted += 1;
      App.state.user.stats.totalPoints += 50;
      App.state.user.readinessScore = Math.min((App.state.user.readinessScore || 65) + 5, 100);
      localStorage.setItem('prepvault_current_user', JSON.stringify(App.state.user));
      App.updateUserUI();
    }

    // Switch to report view
    document.getElementById('mock-interview-room').style.display = 'none';
    const reportStep = document.getElementById('mock-report-step');
    if (reportStep) reportStep.style.display = 'block';

    const reportScore = document.getElementById('mock-report-score');
    const reportVerdict = document.getElementById('mock-report-verdict');

    if (reportScore) reportScore.textContent = `${avgScore}%`;
    if (reportVerdict) {
      const isPass = avgScore >= 75;
      reportVerdict.textContent = isPass ? 'RECOMMENDED FOR HIRE' : 'NEEDS PRACTICE';
      reportVerdict.className = `badge badge-${isPass ? 'easy' : 'medium'}`;
    }

    App.showToast(`Mock Interview Complete! Overall: ${avgScore}% (+50 XP)`, 'success');
  };

  const resetInterview = () => {
    document.getElementById('mock-setup-step').style.display = 'block';
    document.getElementById('mock-interview-room').style.display = 'none';
    document.getElementById('mock-report-step').style.display = 'none';
  };

  return {
    render,
    startInterview,
    toggleRecording,
    evaluateAnswer,
    nextQuestion,
    resetInterview
  };
})();
