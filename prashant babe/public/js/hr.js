// ==========================================================================
// PREPVAULT HR INTERVIEW & STAR FRAMEWORK CONTROLLER
// Frequently Asked Questions, High-Scoring Sample Answers & STAR Practice
// ==========================================================================

const HR = (() => {
  let hrQuestions = [];

  const render = () => {
    hrQuestions = App.state.questions.filter(q => q.category === 'hr');
    renderHRQuestions();
  };

  const renderHRQuestions = () => {
    const container = document.getElementById('hr-questions-container');
    if (!container) return;

    container.innerHTML = hrQuestions.map((q, idx) => {
      const g = q.hrGuidance || {};
      const star = g.starFramework || {};
      const dos = (g.dosAndDonts && g.dosAndDonts.dos) || [];
      const donts = (g.dosAndDonts && g.dosAndDonts.donts) || [];

      return `
        <div class="glass-card" style="margin-bottom: 1.5rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
            <div>
              <span class="badge badge-accent" style="margin-bottom:0.5rem;"><i class="fas fa-user-tie"></i> ${q.subCategory || 'Behavioral'}</span>
              <h3 style="margin-top:0.25rem;">${q.title}</h3>
            </div>
            <button class="btn btn-outline btn-sm" onclick="HR.loadIntoPractice('${q._id}')">
              <i class="fas fa-pencil-alt"></i> Practice in STAR Builder
            </button>
          </div>

          <p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1rem;">${q.description}</p>

          ${star.situation ? `
            <div style="background:rgba(99, 102, 241, 0.08); border-left:3px solid var(--accent-primary); border-radius:4px; padding:1rem; margin-bottom:1.25rem;">
              <h5 style="color:var(--accent-primary); margin-bottom:0.5rem;"><i class="fas fa-layer-group"></i> STAR Method Blueprint Breakdown:</h5>
              <div style="font-size:0.85rem; display:grid; gap:0.4rem;">
                <div><strong style="color:var(--accent-secondary);">Situation:</strong> ${star.situation}</div>
                <div><strong style="color:var(--accent-secondary);">Task:</strong> ${star.task}</div>
                <div><strong style="color:var(--accent-secondary);">Action:</strong> ${star.action}</div>
                <div><strong style="color:var(--accent-secondary);">Result:</strong> ${star.result}</div>
              </div>
            </div>
          ` : ''}

          <div style="background:rgba(16, 185, 129, 0.08); border-left:3px solid var(--accent-success); border-radius:4px; padding:1rem; margin-bottom:1.25rem;">
            <h5 style="color:var(--accent-success); margin-bottom:0.5rem;"><i class="fas fa-star"></i> High-Scoring Sample Answer:</h5>
            <p style="font-size:0.88rem; line-height:1.6; color:var(--text-main); font-style:italic;">"${g.sampleAnswer || q.solution}"</p>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:1rem; font-size:0.82rem;">
            <div style="background:rgba(16,185,129,0.05); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid rgba(16,185,129,0.2);">
              <strong style="color:#10b981;"><i class="fas fa-check-circle"></i> Interviewer Dos:</strong>
              <ul style="padding-left:1.2rem; margin-top:0.3rem;">
                ${dos.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
            <div style="background:rgba(239,68,68,0.05); padding:0.75rem; border-radius:var(--radius-sm); border:1px solid rgba(239,68,68,0.2);">
              <strong style="color:#ef4444;"><i class="fas fa-times-circle"></i> Common Pitfalls (Don'ts):</strong>
              <ul style="padding-left:1.2rem; margin-top:0.3rem;">
                ${donts.map(d => `<li>${d}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  const loadIntoPractice = (qId) => {
    const q = hrQuestions.find(item => item._id === qId);
    if (!q) return;

    const promptEl = document.getElementById('star-practice-prompt');
    if (promptEl) promptEl.textContent = q.title;

    // Reset inputs
    document.getElementById('star-input-s').value = '';
    document.getElementById('star-input-t').value = '';
    document.getElementById('star-input-a').value = '';
    document.getElementById('star-input-r').value = '';

    const reviewBox = document.getElementById('star-review-output');
    if (reviewBox) reviewBox.style.display = 'none';

    // Scroll to practice builder
    document.getElementById('hr-practice-builder')?.scrollIntoView({ behavior: 'smooth' });
    App.showToast('Question loaded into STAR practice builder below.', 'info');
  };

  const evaluateSTARPractice = () => {
    const s = document.getElementById('star-input-s').value.trim();
    const t = document.getElementById('star-input-t').value.trim();
    const a = document.getElementById('star-input-a').value.trim();
    const r = document.getElementById('star-input-r').value.trim();

    if (!s || !t || !a || !r) {
      App.showToast('Please complete all 4 STAR quadrants (Situation, Task, Action, Result).', 'warning');
      return;
    }

    const reviewBox = document.getElementById('star-review-output');
    const scoreVal = document.getElementById('star-score-val');
    const feedbackList = document.getElementById('star-feedback-list');

    let score = 70;
    const feedback = [];

    if (s.length > 30) { score += 5; feedback.push("Situation clearly defined context and constraints."); }
    if (t.length > 20) { score += 5; feedback.push("Task clearly framed candidate's specific ownership."); }
    if (a.toLowerCase().includes('i ') || a.toLowerCase().includes('implemented') || a.toLowerCase().includes('analyzed')) {
      score += 10;
      feedback.push("Action emphasizes proactive 'I' actions rather than passive team involvement.");
    }
    if (r.match(/\d+/) || r.includes('%') || r.includes('increased') || r.includes('reduced')) {
      score += 10;
      feedback.push("Result effectively leverages quantifiable metrics and measurable outcomes.");
    } else {
      feedback.push("Tip: Add concrete numbers or percentage improvements to elevate your Result section.");
    }

    if (scoreVal) scoreVal.textContent = `${score}/100`;
    if (feedbackList) {
      feedbackList.innerHTML = feedback.map(f => `<li><i class="fas fa-check" style="color:#10b981;"></i> ${f}</li>`).join('');
    }

    if (reviewBox) reviewBox.style.display = 'block';

    // Update points
    if (App.state.user) {
      App.state.user.stats.totalPoints += 25;
      localStorage.setItem('prepvault_current_user', JSON.stringify(App.state.user));
      App.updateUserUI();
    }
    App.showToast('STAR answer evaluated! +25 XP', 'success');
  };

  return {
    render,
    loadIntoPractice,
    evaluateSTARPractice
  };
})();
