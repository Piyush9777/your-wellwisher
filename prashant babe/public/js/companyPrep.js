// ==========================================================================
// PREPVAULT COMPANY-WISE PREPARATION CONTROLLER
// TCS, Infosys, Wipro, Accenture, Cognizant, Amazon, Microsoft & Google
// ==========================================================================

const CompanyPrep = (() => {
  let companies = [];

  const render = () => {
    companies = App.state.companies || window.PREP_SEEDS.companies;
    renderCompaniesGrid();
  };

  const renderCompaniesGrid = () => {
    const container = document.getElementById('companies-grid-container');
    if (!container) return;

    container.innerHTML = companies.map(c => `
      <div class="glass-card company-card" onclick="CompanyPrep.openCompanyDetail('${c.slug}')">
        <div>
          <div class="company-card-header">
            <img src="${c.logo}" alt="${c.name}" class="company-logo-img" />
            <div>
              <h3 style="margin-bottom:2px;">${c.name}</h3>
              <span class="badge" style="background:rgba(99,102,241,0.15); color:var(--accent-primary); font-size:0.7rem;">${c.tier}</span>
            </div>
          </div>
          <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.45; margin-bottom:1.25rem;">
            ${c.about.slice(0, 110)}...
          </p>
        </div>
        <div>
          <div style="font-size:0.8rem; color:var(--text-dim); margin-bottom:1rem; display:flex; justify-content:space-between;">
            <span><i class="fas fa-layer-group"></i> ${c.hiringProcess ? c.hiringProcess.length : 3} Rounds</span>
            <span><i class="fas fa-question-circle"></i> ${(c.frequentlyAskedQuestions || []).length} Past Questions</span>
          </div>
          <button class="btn btn-primary btn-sm" style="width:100%;">
            <i class="fas fa-compass"></i> View Hiring Pattern & Questions
          </button>
        </div>
      </div>
    `).join('');
  };

  const openCompanyDetail = (slug) => {
    const c = companies.find(item => item.slug.toLowerCase() === slug.toLowerCase());
    if (!c) return;

    const modalTitle = document.getElementById('company-modal-title');
    const modalTier = document.getElementById('company-modal-tier');
    const modalAbout = document.getElementById('company-modal-about');
    const roundsContainer = document.getElementById('company-rounds-timeline');
    const syllabusContainer = document.getElementById('company-syllabus-list');
    const faqsContainer = document.getElementById('company-faqs-list');
    const dosContainer = document.getElementById('company-dos-list');
    const dontsContainer = document.getElementById('company-donts-list');

    if (modalTitle) modalTitle.textContent = `${c.name} Recruitment Blueprint`;
    if (modalTier) modalTier.textContent = c.tier;
    if (modalAbout) modalAbout.textContent = c.about;

    // Rounds timeline
    if (roundsContainer) {
      roundsContainer.innerHTML = (c.hiringProcess || []).map(r => `
        <div class="round-timeline-item">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>Round ${r.roundNumber}: ${r.roundName}</strong>
            <span class="badge badge-accent" style="font-size:0.7rem;">${r.duration || '60 Mins'}</span>
          </div>
          <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:3px;">${r.details}</div>
          <div style="font-size:0.75rem; color:var(--text-dim); margin-top:2px;"><i class="fas fa-desktop"></i> Mode: ${r.mode}</div>
        </div>
      `).join('');
    }

    // Syllabus
    if (syllabusContainer) {
      syllabusContainer.innerHTML = (c.syllabusTopics || []).map(sec => `
        <div style="margin-bottom:0.85rem;">
          <div style="font-size:0.85rem; font-weight:700; color:var(--accent-secondary); margin-bottom:0.3rem;">${sec.section}</div>
          <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
            ${(sec.topics || []).map(t => `<span class="mini-tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // Past FAQs
    if (faqsContainer) {
      faqsContainer.innerHTML = (c.frequentlyAskedQuestions || []).map((faq, idx) => `
        <div style="background:var(--glass-bg); border:1px solid var(--glass-border); padding:0.85rem; border-radius:var(--radius-sm); margin-bottom:0.75rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
            <strong style="font-size:0.88rem;">${faq.question}</strong>
            <span class="badge badge-${faq.difficulty ? faq.difficulty.toLowerCase() : 'medium'}">${faq.difficulty || 'Medium'}</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-dim); margin-top:0.25rem;">
            <i class="fas fa-lightbulb" style="color:#f59e0b;"></i> <strong>Hint:</strong> ${faq.hint}
          </div>
        </div>
      `).join('');
    }

    // Dos & Don'ts
    if (dosContainer && c.dosAndDonts) {
      dosContainer.innerHTML = (c.dosAndDonts.dos || []).map(d => `<li>${d}</li>`).join('');
    }
    if (dontsContainer && c.dosAndDonts) {
      dontsContainer.innerHTML = (c.dosAndDonts.donts || []).map(d => `<li>${d}</li>`).join('');
    }

    App.openModal('modal-company-detail');
  };

  return {
    render,
    openCompanyDetail
  };
})();
