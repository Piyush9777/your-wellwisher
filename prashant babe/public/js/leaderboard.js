// ==========================================================================
// PREPVAULT LEADERBOARD & DAILY CHALLENGE CONTROLLER
// Rankings Podium, Real-time Point Standings & Daily Challenge Solver
// ==========================================================================

const Leaderboard = (() => {
  let leaderboardData = [];

  const render = () => {
    leaderboardData = App.state.leaderboard || window.PREP_SEEDS.leaderboard;
    renderPodium();
    renderLeaderboardTable();
    renderDailyChallenge();
  };

  const renderPodium = () => {
    const podiumEl = document.getElementById('leaderboard-podium');
    if (!podiumEl || leaderboardData.length < 3) return;

    const top1 = leaderboardData[0];
    const top2 = leaderboardData[1];
    const top3 = leaderboardData[2];

    podiumEl.innerHTML = `
      <!-- Rank 2 -->
      <div class="podium-step podium-rank-2">
        <img src="${top2.avatar}" alt="${top2.name}" style="width:52px; height:52px; border-radius:50%; border:2px solid #cbd5e1; margin-bottom:6px;" />
        <div style="font-size:0.85rem; font-weight:700;">${top2.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${top2.score} XP</div>
        <div class="podium-pillar" style="height:110px; background:linear-gradient(180deg, #94a3b8 0%, #64748b 100%);">
          <i class="fas fa-medal" style="color:#e2e8f0; font-size:1.8rem;"></i>
        </div>
      </div>

      <!-- Rank 1 -->
      <div class="podium-step podium-rank-1">
        <i class="fas fa-crown" style="color:#f59e0b; font-size:1.6rem; margin-bottom:4px;"></i>
        <img src="${top1.avatar}" alt="${top1.name}" style="width:64px; height:64px; border-radius:50%; border:3px solid #f59e0b; margin-bottom:6px;" />
        <div style="font-size:0.95rem; font-weight:800; color:#f59e0b;">${top1.name}</div>
        <div style="font-size:0.8rem; font-weight:600;">${top1.score} XP</div>
        <div class="podium-pillar" style="height:150px; background:linear-gradient(180deg, #f59e0b 0%, #d97706 100%);">
          <i class="fas fa-trophy" style="color:#fef3c7; font-size:2.2rem;"></i>
        </div>
      </div>

      <!-- Rank 3 -->
      <div class="podium-step podium-rank-3">
        <img src="${top3.avatar}" alt="${top3.name}" style="width:48px; height:48px; border-radius:50%; border:2px solid #d97706; margin-bottom:6px;" />
        <div style="font-size:0.85rem; font-weight:700;">${top3.name}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${top3.score} XP</div>
        <div class="podium-pillar" style="height:85px; background:linear-gradient(180deg, #b45309 0%, #78350f 100%);">
          <i class="fas fa-award" style="color:#fed7aa; font-size:1.6rem;"></i>
        </div>
      </div>
    `;
  };

  const renderLeaderboardTable = () => {
    const tableBody = document.getElementById('leaderboard-table-body');
    if (!tableBody) return;

    tableBody.innerHTML = leaderboardData.map((u, idx) => {
      const isTop3 = idx < 3;
      const rankColor = idx === 0 ? '#f59e0b' : idx === 1 ? '#94a3b8' : idx === 2 ? '#b45309' : 'inherit';

      return `
        <tr>
          <td style="font-weight:700; color:${rankColor}; font-size:1rem;">
            ${isTop3 ? `<i class="fas ${idx === 0 ? 'fa-trophy' : 'fa-medal'}"></i> #${idx + 1}` : `#${idx + 1}`}
          </td>
          <td>
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <img src="${u.avatar}" alt="${u.name}" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" />
              <div>
                <div style="font-weight:600;">${u.name}</div>
                <div style="font-size:0.75rem; color:var(--text-dim);">${u.badge || 'Candidate'}</div>
              </div>
            </div>
          </td>
          <td><span style="font-weight:600;">${u.solved || 0}</span> solved</td>
          <td><span style="color:#f59e0b; font-weight:600;">🔥 ${u.streak || 1} Days</span></td>
          <td style="font-weight:700; color:var(--accent-primary); font-size:0.95rem;">${u.score} XP</td>
        </tr>
      `;
    }).join('');
  };

  const renderDailyChallenge = () => {
    const dc = App.state.dailyChallenge || window.PREP_SEEDS.dailyChallenge;
    const title = document.getElementById('lb-dc-title');
    const desc = document.getElementById('lb-dc-desc');
    const points = document.getElementById('lb-dc-points');

    if (title) title.textContent = dc.title;
    if (desc) desc.textContent = dc.description;
    if (points) points.textContent = `+${dc.points} XP`;
  };

  const solveDailyChallenge = () => {
    // Open Code Workspace with daily challenge
    const dc = App.state.dailyChallenge || window.PREP_SEEDS.dailyChallenge;
    const dummyQ = {
      _id: 'q_daily_challenge',
      title: dc.title,
      description: dc.description,
      difficulty: dc.difficulty,
      subCategory: 'JavaScript',
      tags: ['Daily Challenge', 'Stack'],
      starterCode: {
        javascript: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (char === '(' || char === '{' || char === '[') {\n      stack.push(char);\n    } else {\n      if (stack.pop() !== map[char]) return false;\n    }\n  }\n  return stack.length === 0;\n}\n\nconsole.log(isValid("()[]{}"));`
      },
      solution: `function isValid(s) {\n  const stack = [];\n  const map = { ')': '(', '}': '{', ']': '[' };\n  for (let char of s) {\n    if (['(', '{', '['].includes(char)) {\n      stack.push(char);\n    } else if (stack.pop() !== map[char]) {\n      return false;\n    }\n  }\n  return stack.length === 0;\n}`,
      testCases: dc.testCases
    };

    // Temporarily add to questions list
    App.state.questions.unshift(dummyQ);
    Technical.openCodeWorkspace('q_daily_challenge');
  };

  return {
    render,
    solveDailyChallenge
  };
})();
