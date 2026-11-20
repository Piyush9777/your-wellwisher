// ==========================================================================
// PREPVAULT ADMIN PANEL CONTROLLER
// System Analytics, User Management, Question Authoring & CRUD
// ==========================================================================

const Admin = (() => {
  let adminUsers = [];

  const render = () => {
    adminUsers = App.state.isOnlineServer ? [] : window.PREP_SEEDS.users;
    renderAnalytics();
    renderUsersTable();
    renderQuestionsTable();
  };

  const renderAnalytics = () => {
    const totalUsers = document.getElementById('admin-stat-users');
    const totalQuestions = document.getElementById('admin-stat-questions');
    const totalQuizzes = document.getElementById('admin-stat-quizzes');
    const avgScore = document.getElementById('admin-stat-avg');

    if (totalUsers) totalUsers.textContent = '1,420';
    if (totalQuestions) totalQuestions.textContent = App.state.questions.length;
    if (totalQuizzes) totalQuizzes.textContent = '3,842';
    if (avgScore) avgScore.textContent = '72.4%';
  };

  const renderUsersTable = () => {
    const tbody = document.getElementById('admin-users-table-body');
    if (!tbody) return;

    const list = adminUsers.length > 0 ? adminUsers : window.PREP_SEEDS.users;

    tbody.innerHTML = list.map(u => `
      <tr>
        <td>
          <div style="font-weight:600;">${u.name}</div>
          <div style="font-size:0.75rem; color:var(--text-dim);">${u.email}</div>
        </td>
        <td>${u.college || 'Engineering Institute'}</td>
        <td>${u.targetRole || 'Full Stack SDE'}</td>
        <td>
          <span class="badge ${u.role === 'admin' ? 'badge-accent' : 'badge-easy'}">${u.role.toUpperCase()}</span>
        </td>
        <td>
          <span style="font-weight:700; color:var(--accent-primary);">${u.readinessScore || 65}%</span>
        </td>
        <td>
          <button class="btn btn-outline btn-sm" onclick="Admin.toggleUserRole('${u._id}')">
            ${u.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'}
          </button>
        </td>
      </tr>
    `).join('');
  };

  const toggleUserRole = (userId) => {
    const u = (adminUsers.length > 0 ? adminUsers : window.PREP_SEEDS.users).find(item => item._id === userId);
    if (!u) return;
    u.role = u.role === 'admin' ? 'user' : 'admin';
    App.showToast(`User role updated to ${u.role.toUpperCase()}`, 'success');
    renderUsersTable();
  };

  const renderQuestionsTable = () => {
    const tbody = document.getElementById('admin-questions-table-body');
    if (!tbody) return;

    tbody.innerHTML = App.state.questions.slice(0, 15).map(q => `
      <tr>
        <td style="max-width:240px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${q.title}</td>
        <td><span class="mini-tag">${q.category}</span></td>
        <td>${q.subCategory}</td>
        <td><span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span></td>
        <td>
          <button class="btn btn-outline btn-sm" style="color:#ef4444; border-color:rgba(239,68,68,0.3);" onclick="Admin.deleteQuestion('${q._id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `).join('');
  };

  const openAddQuestionModal = () => {
    document.getElementById('form-add-q-title').value = '';
    document.getElementById('form-add-q-desc').value = '';
    document.getElementById('form-add-q-sol').value = '';
    App.openModal('modal-admin-add-question');
  };

  const saveNewQuestion = () => {
    const title = document.getElementById('form-add-q-title').value.trim();
    const category = document.getElementById('form-add-q-cat').value;
    const subCategory = document.getElementById('form-add-q-subcat').value.trim();
    const difficulty = document.getElementById('form-add-q-diff').value;
    const desc = document.getElementById('form-add-q-desc').value.trim();
    const solution = document.getElementById('form-add-q-sol').value.trim();

    if (!title || !desc) {
      App.showToast('Please provide a title and question description.', 'warning');
      return;
    }

    const newQ = {
      _id: 'q_custom_' + Date.now(),
      title,
      category,
      subCategory: subCategory || 'General',
      difficulty,
      description: desc,
      solution: solution || '// Solution reference',
      tags: ['Custom', category],
      starterCode: {
        javascript: `// Write your ${category} solution here\nfunction solve() {\n  \n}`
      },
      testCases: [{ input: 'Sample Input', expectedOutput: 'Success' }]
    };

    App.state.questions.unshift(newQ);
    localStorage.setItem('prepvault_questions', JSON.stringify(App.state.questions));

    App.closeModal();
    App.showToast('New question added to database!', 'success');
    renderQuestionsTable();
    renderAnalytics();
  };

  const deleteQuestion = (qId) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    App.state.questions = App.state.questions.filter(q => q._id !== qId);
    localStorage.setItem('prepvault_questions', JSON.stringify(App.state.questions));
    App.showToast('Question deleted successfully.', 'info');
    renderQuestionsTable();
    renderAnalytics();
  };

  return {
    render,
    toggleUserRole,
    openAddQuestionModal,
    saveNewQuestion,
    deleteQuestion
  };
})();
