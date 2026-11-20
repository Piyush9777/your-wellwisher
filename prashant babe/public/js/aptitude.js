// ==========================================================================
// PREPVAULT APTITUDE & MOCK TEST CONTROLLER
// Timed Quizzes, Countdown Timer, Question Palette, Auto-Grading & Review
// ==========================================================================

const Aptitude = (() => {
  let activeQuiz = null;
  let currentQuestionIndex = 0;
  let userAnswers = {}; // { questionIndex: chosenOptionIndex }
  let timerInterval = null;
  let timeRemainingSeconds = 0;
  let totalTimeSeconds = 0;

  const render = () => {
    renderQuizCards();
  };

  const renderQuizCards = () => {
    const container = document.getElementById('aptitude-quizzes-grid');
    if (!container) return;

    const quizzes = App.state.quizzes || window.PREP_SEEDS.quizzes;

    container.innerHTML = quizzes.map(q => {
      const qCount = q.questions ? q.questions.length : 4;
      const categoryLabel = q.category === 'quantitative' ? 'Quantitative Aptitude' : q.category === 'logical' ? 'Logical Reasoning' : 'Verbal Ability';
      const icon = q.category === 'quantitative' ? 'fa-calculator' : q.category === 'logical' ? 'fa-brain' : 'fa-font';

      return `
        <div class="glass-card aptitude-topic-card">
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
              <span class="badge badge-accent"><i class="fas ${icon}"></i> ${categoryLabel}</span>
              <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
            </div>
            <h3 style="margin-bottom:0.6rem;">${q.title}</h3>
            <p style="font-size:0.85rem; margin-bottom:1.25rem;">Targeted for ${q.companyTarget || 'TCS / Infosys / Accenture'}. Tests speed, precision and analytical reasoning.</p>
            
            <div style="display:flex; gap:1.25rem; font-size:0.82rem; color:var(--text-muted); margin-bottom:1.5rem;">
              <span><i class="fas fa-question-circle"></i> ${qCount} Questions</span>
              <span><i class="fas fa-clock"></i> ${q.durationMinutes} Minutes</span>
              <span><i class="fas fa-percentage"></i> Pass: ${q.passingPercentage}%</span>
            </div>
          </div>
          <button class="btn btn-primary" onclick="Aptitude.startQuiz('${q._id}')">
            <i class="fas fa-play"></i> Start Timed Assessment
          </button>
        </div>
      `;
    }).join('');
  };

  const startQuiz = (quizId) => {
    const q = (App.state.quizzes || window.PREP_SEEDS.quizzes).find(item => item._id === quizId);
    if (!q) return;

    activeQuiz = q;
    currentQuestionIndex = 0;
    userAnswers = {};
    totalTimeSeconds = q.durationMinutes * 60;
    timeRemainingSeconds = totalTimeSeconds;

    // Setup modal elements
    const titleEl = document.getElementById('quiz-modal-title');
    if (titleEl) titleEl.textContent = q.title;

    renderPalette();
    renderCurrentQuestion();
    startTimer();

    App.openModal('modal-quiz-runner');
  };

  const startTimer = () => {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
      timeRemainingSeconds--;
      updateTimerDisplay();

      if (timeRemainingSeconds <= 0) {
        clearInterval(timerInterval);
        App.showToast('Time is up! Submitting assessment automatically...', 'warning');
        submitQuiz();
      }
    }, 1000);
  };

  const updateTimerDisplay = () => {
    const timerBadge = document.getElementById('quiz-timer-display');
    if (!timerBadge) return;

    const mins = Math.floor(timeRemainingSeconds / 60);
    const secs = timeRemainingSeconds % 60;
    timerBadge.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    if (timeRemainingSeconds < 120) {
      timerBadge.style.color = '#ef4444';
      timerBadge.style.borderColor = '#ef4444';
    } else {
      timerBadge.style.color = 'inherit';
      timerBadge.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    }
  };

  const renderPalette = () => {
    const palette = document.getElementById('quiz-palette-container');
    if (!palette || !activeQuiz) return;

    palette.innerHTML = activeQuiz.questions.map((_, idx) => {
      const isAnswered = userAnswers[idx] !== undefined;
      const isActive = idx === currentQuestionIndex;
      return `
        <button class="palette-btn ${isActive ? 'active' : ''} ${isAnswered ? 'answered' : ''}" onclick="Aptitude.jumpToQuestion(${idx})">
          ${idx + 1}
        </button>
      `;
    }).join('');
  };

  const renderCurrentQuestion = () => {
    if (!activeQuiz) return;
    const q = activeQuiz.questions[currentQuestionIndex];
    const total = activeQuiz.questions.length;

    const numEl = document.getElementById('quiz-q-number');
    const textEl = document.getElementById('quiz-q-text');
    const optionsContainer = document.getElementById('quiz-options-container');

    if (numEl) numEl.textContent = `Question ${currentQuestionIndex + 1} of ${total}`;
    if (textEl) textEl.textContent = q.questionText;

    const selectedOption = userAnswers[currentQuestionIndex];

    if (optionsContainer) {
      optionsContainer.innerHTML = q.options.map((opt, optIdx) => `
        <div class="quiz-option-item ${selectedOption === optIdx ? 'selected' : ''}" onclick="Aptitude.selectOption(${optIdx})">
          <div class="option-circle">${String.fromCharCode(65 + optIdx)}</div>
          <div style="flex:1;">${opt}</div>
        </div>
      `).join('');
    }

    // Prev / Next button states
    const btnPrev = document.getElementById('btn-quiz-prev');
    const btnNext = document.getElementById('btn-quiz-next');
    if (btnPrev) btnPrev.disabled = currentQuestionIndex === 0;
    if (btnNext) {
      btnNext.innerHTML = currentQuestionIndex === total - 1 ? '<i class="fas fa-check"></i> Review & Submit' : 'Next <i class="fas fa-arrow-right"></i>';
    }
  };

  const selectOption = (optionIndex) => {
    userAnswers[currentQuestionIndex] = optionIndex;
    renderCurrentQuestion();
    renderPalette();
  };

  const jumpToQuestion = (index) => {
    currentQuestionIndex = index;
    renderPalette();
    renderCurrentQuestion();
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      currentQuestionIndex++;
      renderPalette();
      renderCurrentQuestion();
    } else {
      submitQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderPalette();
      renderCurrentQuestion();
    }
  };

  const submitQuiz = () => {
    clearInterval(timerInterval);

    // Calculate score
    let correctCount = 0;
    const reviewData = activeQuiz.questions.map((q, idx) => {
      const userChoice = userAnswers[idx];
      const isCorrect = userChoice !== undefined && userChoice === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionText: q.questionText,
        options: q.options,
        userAnswer: userChoice,
        correctAnswer: q.correctAnswer,
        isCorrect,
        formulaUsed: q.formulaUsed,
        explanation: q.explanation
      };
    });

    const total = activeQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const passed = percentage >= activeQuiz.passingPercentage;
    const pointsEarned = correctCount * 15;

    // Update user stats
    if (App.state.user) {
      if (!App.state.user.stats) App.state.user.stats = { technicalSolved: 0, aptitudeTestsTaken: 0, mockInterviewsCompleted: 0, currentStreak: 1, totalPoints: 0 };
      App.state.user.stats.aptitudeTestsTaken += 1;
      App.state.user.stats.totalPoints += pointsEarned;
      App.state.user.readinessScore = Math.min((App.state.user.readinessScore || 65) + 3, 100);
      localStorage.setItem('prepvault_current_user', JSON.stringify(App.state.user));
      App.updateUserUI();
    }

    App.closeModal();

    // Render Quiz Result Modal
    renderResultModal({
      title: activeQuiz.title,
      total,
      correctCount,
      percentage,
      passed,
      pointsEarned,
      review: reviewData
    });
  };

  const renderResultModal = (res) => {
    const resTitle = document.getElementById('quiz-res-title');
    const resScore = document.getElementById('quiz-res-score');
    const resVerdict = document.getElementById('quiz-res-verdict');
    const resPoints = document.getElementById('quiz-res-points');
    const resReview = document.getElementById('quiz-res-review-container');

    if (resTitle) resTitle.textContent = res.title;
    if (resScore) resScore.textContent = `${res.percentage}% (${res.correctCount}/${res.total} Correct)`;
    if (resVerdict) {
      resVerdict.textContent = res.passed ? 'PASSED QUALIFIER' : 'NEEDS PRACTICE';
      resVerdict.className = `badge badge-${res.passed ? 'easy' : 'hard'}`;
    }
    if (resPoints) resPoints.textContent = `+${res.pointsEarned} XP Earned`;

    if (resReview) {
      resReview.innerHTML = res.review.map((item, idx) => `
        <div style="background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius-sm); padding:1rem; margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <strong>Question ${idx + 1}</strong>
            <span class="badge ${item.isCorrect ? 'badge-easy' : 'badge-hard'}">${item.isCorrect ? 'Correct' : 'Incorrect'}</span>
          </div>
          <p style="font-size:0.88rem; margin-bottom:0.6rem;">${item.questionText}</p>
          <div style="font-size:0.82rem; margin-bottom:0.4rem;">
            <strong>Your Answer:</strong> ${item.userAnswer !== undefined ? item.options[item.userAnswer] : '<span style="color:#ef4444;">Unanswered</span>'}
          </div>
          <div style="font-size:0.82rem; color:#10b981; margin-bottom:0.6rem;">
            <strong>Correct Answer:</strong> ${item.options[item.correctAnswer]}
          </div>
          ${item.formulaUsed ? `<div style="background:rgba(99,102,241,0.1); border-left:3px solid var(--accent-primary); padding:0.5rem 0.75rem; font-size:0.8rem; margin-top:0.4rem;">
            <strong>Formula / Method:</strong> ${item.formulaUsed}
          </div>` : ''}
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:0.4rem;">
            <strong>Explanation:</strong> ${item.explanation}
          </div>
        </div>
      `).join('');
    }

    App.openModal('modal-quiz-result');
  };

  return {
    render,
    startQuiz,
    jumpToQuestion,
    selectOption,
    nextQuestion,
    prevQuestion,
    submitQuiz
  };
})();
