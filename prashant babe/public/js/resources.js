// ==========================================================================
// PREPVAULT PLACEMENT RESOURCES CONTROLLER
// Roadmaps, Real Interview Experiences, Study Materials & PYQs
// ==========================================================================

const Resources = (() => {
  let activeTab = 'all';

  const render = () => {
    setupFilterTabs();
    renderResourceCards();
  };

  const setupFilterTabs = () => {
    document.querySelectorAll('#resource-filter-pills .cat-pill').forEach(pill => {
      pill.onclick = () => {
        document.querySelectorAll('#resource-filter-pills .cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTab = pill.getAttribute('data-type') || 'all';
        renderResourceCards();
      };
    });
  };

  const renderResourceCards = () => {
    const container = document.getElementById('resources-list-container');
    if (!container) return;

    let items = App.state.resources || window.PREP_SEEDS.resources;
    if (activeTab !== 'all') {
      items = items.filter(r => r.type === activeTab);
    }

    container.innerHTML = items.map(res => {
      const typeBadge = res.type === 'roadmap' ? 'Learning Roadmap' : res.type === 'interview_experience' ? 'Interview Experience' : 'Study Material';
      const icon = res.type === 'roadmap' ? 'fa-road' : res.type === 'interview_experience' ? 'fa-user-graduate' : 'fa-book-open';

      return `
        <div class="glass-card" style="margin-bottom:1.5rem; cursor:pointer;" onclick="Resources.openResourceDetail('${res._id}')">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem;">
            <div>
              <span class="badge badge-accent" style="margin-bottom:0.4rem;"><i class="fas ${icon}"></i> ${typeBadge}</span>
              <h3 style="margin-top:0.25rem;">${res.title}</h3>
            </div>
            ${res.company && res.company !== 'General' ? `<span class="badge" style="background:rgba(245,158,11,0.15); color:#f59e0b;"><i class="fas fa-building"></i> ${res.company}</span>` : ''}
          </div>

          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.5; margin-bottom:1rem;">
            ${res.summary}
          </p>

          ${res.experienceDetails ? `
            <div style="display:flex; gap:1.25rem; font-size:0.82rem; color:var(--text-dim); margin-bottom:1rem; flex-wrap:wrap;">
              <span><i class="fas fa-money-bill-wave" style="color:#10b981;"></i> CTC: ${res.experienceDetails.ctcOffered}</span>
              <span><i class="fas fa-layer-group"></i> ${res.experienceDetails.roundsCount} Rounds</span>
              <span><i class="fas fa-chart-line"></i> Difficulty: ${res.experienceDetails.difficultyRating}</span>
              <span><i class="fas fa-check-circle" style="color:#10b981;"></i> Status: ${res.experienceDetails.status}</span>
            </div>
          ` : ''}

          <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--glass-border); padding-top:0.75rem; font-size:0.82rem; color:var(--text-dim);">
            <span>${res.author ? `Shared by ${res.author.name} (${res.author.college})` : 'Curated by Placement Editorial'}</span>
            <span style="color:var(--accent-primary); font-weight:600;">Read Full Resource <i class="fas fa-arrow-right"></i></span>
          </div>
        </div>
      `;
    }).join('');
  };

  const openResourceDetail = (resId) => {
    const res = (App.state.resources || window.PREP_SEEDS.resources).find(item => item._id === resId);
    if (!res) return;

    const modalTitle = document.getElementById('resource-modal-title');
    const modalContent = document.getElementById('resource-modal-body');

    if (modalTitle) modalTitle.textContent = res.title;

    if (modalContent) {
      if (res.type === 'roadmap' && res.roadmapSteps) {
        modalContent.innerHTML = `
          <p style="font-size:0.95rem; margin-bottom:1.5rem;">${res.summary}</p>
          <div style="display:flex; flex-direction:column; gap:1.25rem;">
            ${res.roadmapSteps.map(step => `
              <div style="background:var(--glass-bg); border:1px solid var(--glass-border); border-radius:var(--radius-sm); padding:1.25rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <h4 style="color:var(--accent-primary);">${step.phase}</h4>
                  <span class="badge badge-accent">${step.weekRange}</span>
                </div>
                <div style="font-size:0.85rem; margin-bottom:0.6rem;">
                  <strong>Milestone Goals:</strong>
                  <ul style="padding-left:1.2rem; margin-top:0.3rem;">
                    ${step.goals.map(g => `<li>${g}</li>`).join('')}
                  </ul>
                </div>
                <div style="font-size:0.8rem; color:var(--text-dim);">
                  <strong>Recommended Modules:</strong> ${step.resourcesToFollow.join(', ')}
                </div>
              </div>
            `).join('')}
          </div>
        `;
      } else {
        modalContent.innerHTML = `
          <div style="background:rgba(99,102,241,0.06); border-left:3px solid var(--accent-primary); padding:1rem; border-radius:4px; margin-bottom:1.5rem; font-size:0.9rem;">
            ${res.summary}
          </div>
          <div style="font-size:0.92rem; line-height:1.7; white-space:pre-wrap; color:var(--text-main);">
${res.content}
          </div>
        `;
      }
    }

    App.openModal('modal-resource-detail');
  };

  return {
    render,
    openResourceDetail
  };
})();
