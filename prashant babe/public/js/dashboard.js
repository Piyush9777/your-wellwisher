// ==========================================================================
// PREPVAULT DASHBOARD CONTROLLER
// Interactive Charts (Chart.js), Readiness Gauge, KPI Cards & Activity Feed
// ==========================================================================

const Dashboard = (() => {
  let radarChartInstance = null;
  let activityChartInstance = null;

  const render = () => {
    const user = App.state.user || window.PREP_SEEDS.users[1];
    const stats = user.stats || { technicalSolved: 24, aptitudeTestsTaken: 6, mockInterviewsCompleted: 2, currentStreak: 5, totalPoints: 720 };
    const readiness = user.readinessScore || calculateReadiness(stats);

    // Populate Welcome Section
    const welcomeName = document.getElementById('dash-welcome-name');
    if (welcomeName) welcomeName.textContent = user.name || 'Candidate';

    const targetRole = document.getElementById('dash-target-role');
    if (targetRole) targetRole.textContent = user.targetRole || 'Full Stack SDE';

    // Populate KPI Cards
    const kpiSolved = document.getElementById('kpi-tech-solved');
    const kpiApt = document.getElementById('kpi-apt-tests');
    const kpiMock = document.getElementById('kpi-mock-count');
    const kpiStreak = document.getElementById('kpi-streak-val');

    if (kpiSolved) kpiSolved.textContent = stats.technicalSolved;
    if (kpiApt) kpiApt.textContent = stats.aptitudeTestsTaken;
    if (kpiMock) kpiMock.textContent = stats.mockInterviewsCompleted;
    if (kpiStreak) kpiStreak.textContent = `${stats.currentStreak} Days 🔥`;

    // Populate Readiness Gauge & Sub-bars
    const gaugeVal = document.getElementById('dash-readiness-percent');
    if (gaugeVal) gaugeVal.textContent = `${readiness}%`;

    const techProgress = Math.min(Math.round((stats.technicalSolved / 40) * 100), 100);
    const aptProgress = Math.min(Math.round((stats.aptitudeTestsTaken / 10) * 100), 100);
    const mockProgress = Math.min(Math.round((stats.mockInterviewsCompleted / 5) * 100), 100);

    const fillTech = document.getElementById('bar-fill-tech');
    const fillApt = document.getElementById('bar-fill-apt');
    const fillMock = document.getElementById('bar-fill-mock');

    if (fillTech) fillTech.style.width = `${techProgress}%`;
    if (fillApt) fillApt.style.width = `${aptProgress}%`;
    if (fillMock) fillMock.style.width = `${mockProgress}%`;

    const valTech = document.getElementById('val-fill-tech');
    const valApt = document.getElementById('val-fill-apt');
    const valMock = document.getElementById('val-fill-mock');

    if (valTech) valTech.textContent = `${techProgress}%`;
    if (valApt) valApt.textContent = `${aptProgress}%`;
    if (valMock) valMock.textContent = `${mockProgress}%`;

    // Render Daily Challenge Card
    renderDailyChallenge();

    // Render Recent Activities Timeline
    renderRecentActivities();

    // Initialize or Update Chart.js Graphs
    renderCharts(stats);
  };

  const calculateReadiness = (stats) => {
    const tech = Math.min(stats.technicalSolved * 2.5, 40);
    const apt = Math.min(stats.aptitudeTestsTaken * 6, 30);
    const mock = Math.min(stats.mockInterviewsCompleted * 10, 30);
    return Math.min(Math.round(tech + apt + mock), 100);
  };

  const renderDailyChallenge = () => {
    const dc = App.state.dailyChallenge || window.PREP_SEEDS.dailyChallenge;
    const titleEl = document.getElementById('dash-dc-title');
    const descEl = document.getElementById('dash-dc-desc');
    const diffEl = document.getElementById('dash-dc-difficulty');
    const pointsEl = document.getElementById('dash-dc-points');

    if (titleEl) titleEl.textContent = dc.title;
    if (descEl) descEl.textContent = dc.description;
    if (diffEl) {
      diffEl.textContent = dc.difficulty;
      diffEl.className = `badge badge-${dc.difficulty.toLowerCase()}`;
    }
    if (pointsEl) pointsEl.textContent = `+${dc.points} XP`;
  };

  const renderRecentActivities = () => {
    const feed = document.getElementById('dash-activity-feed');
    if (!feed) return;

    const activities = [
      { title: "Solved 'Two Sum Problem'", desc: "DSA • Arrays & Hash Map", time: "2 hours ago", xp: "+20 XP" },
      { title: "Completed 'Quantitative Aptitude Quiz'", desc: "Scored 100% • Speed, Work & Percentages", time: "Yesterday", xp: "+60 XP" },
      { title: "AI Mock Interview Practice", desc: "Software Development Engineer (SDE) • Score 86%", time: "2 days ago", xp: "+50 XP" },
      { title: "Saved Resume Draft", desc: "Updated Silicon Valley Tech Template", time: "3 days ago", xp: "+10 XP" }
    ];

    feed.innerHTML = activities.map(act => `
      <div class="activity-item">
        <div class="activity-dot"></div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${act.title}</strong>
            <span class="badge badge-accent" style="font-size:0.7rem;">${act.xp}</span>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">${act.desc}</div>
          <div class="activity-time">${act.time}</div>
        </div>
      </div>
    `).join('');
  };

  const renderCharts = (stats) => {
    if (typeof Chart === 'undefined') return;

    // 1. Radar Chart: Domain Competencies
    const ctxRadar = document.getElementById('chart-skills-radar');
    if (ctxRadar) {
      if (radarChartInstance) radarChartInstance.destroy();
      
      const isDark = App.state.theme === 'dark';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      const labelColor = isDark ? '#9ca3af' : '#475569';

      radarChartInstance = new Chart(ctxRadar, {
        type: 'radar',
        data: {
          labels: ['DSA', 'Languages', 'Database (SQL)', 'OS & Networks', 'Aptitude', 'HR & STAR'],
          datasets: [{
            label: 'Candidate Competency',
            data: [82, 75, 78, 68, 85, 80],
            backgroundColor: 'rgba(99, 102, 241, 0.25)',
            borderColor: '#6366f1',
            pointBackgroundColor: '#06b6d4',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#06b6d4',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              angleLines: { color: gridColor },
              grid: { color: gridColor },
              pointLabels: { color: labelColor, font: { size: 11, family: 'Inter' } },
              ticks: { display: false, max: 100, min: 0 }
            }
          },
          plugins: {
            legend: { display: false }
          }
        }
      });
    }

    // 2. Bar / Line Chart: Weekly Preparation Activity
    const ctxActivity = document.getElementById('chart-weekly-activity');
    if (ctxActivity) {
      if (activityChartInstance) activityChartInstance.destroy();

      const isDark = App.state.theme === 'dark';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';
      const labelColor = isDark ? '#9ca3af' : '#475569';

      activityChartInstance = new Chart(ctxActivity, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Questions Solved',
              data: [4, 6, 3, 7, 5, 8, 4],
              backgroundColor: 'rgba(99, 102, 241, 0.8)',
              borderRadius: 6
            },
            {
              label: 'Quizzes Taken',
              data: [1, 2, 0, 2, 1, 3, 1],
              backgroundColor: 'rgba(6, 182, 212, 0.8)',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: { display: false },
              ticks: { color: labelColor }
            },
            y: {
              grid: { color: gridColor },
              ticks: { color: labelColor, stepSize: 2 }
            }
          },
          plugins: {
            legend: {
              position: 'top',
              labels: { color: labelColor, font: { size: 12, family: 'Inter' }, boxWidth: 14 }
            }
          }
        }
      });
    }
  };

  return {
    render
  };
})();
