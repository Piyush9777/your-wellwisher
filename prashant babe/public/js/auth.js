// ==========================================================================
// PREPVAULT AUTHENTICATION CONTROLLER
// Handles Sign Up, Login, Logout, Profile Management & JWT Sessions
// ==========================================================================

const Auth = (() => {
  const checkSession = async () => {
    const token = localStorage.getItem('prepvault_token');
    const localUser = localStorage.getItem('prepvault_current_user');

    if (token) {
      if (App.state.isOnlineServer) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.user) {
            App.state.user = data.user;
            localStorage.setItem('prepvault_current_user', JSON.stringify(data.user));
            return;
          }
        } catch (e) {}
      }
    }

    if (localUser) {
      try {
        App.state.user = JSON.parse(localUser);
        return;
      } catch (e) {}
    }

    // Default to Aaron Sharma demo student if not logged in
    const defaultStudent = window.PREP_SEEDS.users[1];
    App.state.user = defaultStudent;
    localStorage.setItem('prepvault_current_user', JSON.stringify(defaultStudent));
  };

  const login = async (email, password) => {
    if (App.state.isOnlineServer) {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('prepvault_token', data.token);
          App.state.token = data.token;
          App.state.user = data.user;
          localStorage.setItem('prepvault_current_user', JSON.stringify(data.user));
          App.updateUserUI();
          App.closeModal();
          App.showToast(`Welcome back, ${data.user.name}!`, 'success');
          App.navigateTo('dashboard');
          return;
        } else {
          App.showToast(data.error || 'Login failed', 'danger');
          return;
        }
      } catch (err) {}
    }

    // Client-side fallback login
    const found = window.PREP_SEEDS.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      App.state.user = found;
      localStorage.setItem('prepvault_current_user', JSON.stringify(found));
      localStorage.setItem('prepvault_token', 'mock_jwt_token_' + Date.now());
      App.updateUserUI();
      App.closeModal();
      App.showToast(`Welcome back, ${found.name}!`, 'success');
      App.navigateTo('dashboard');
    } else {
      App.showToast('Invalid email or password. Try student@prepvault.io', 'danger');
    }
  };

  const register = async (userData) => {
    if (App.state.isOnlineServer) {
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData)
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('prepvault_token', data.token);
          App.state.token = data.token;
          App.state.user = data.user;
          localStorage.setItem('prepvault_current_user', JSON.stringify(data.user));
          App.updateUserUI();
          App.closeModal();
          App.showToast(`Account created! Welcome to PrepVault, ${data.user.name}.`, 'success');
          App.navigateTo('dashboard');
          return;
        } else {
          App.showToast(data.error || 'Registration failed', 'danger');
          return;
        }
      } catch (err) {}
    }

    // Client-side fallback registration
    const newUser = {
      _id: 'usr_' + Date.now(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      college: userData.college || 'Engineering Institute',
      graduationYear: 2026,
      targetRole: userData.targetRole || 'Full Stack SDE',
      targetCompanies: ['Amazon', 'TCS', 'Accenture'],
      readinessScore: 35,
      stats: { technicalSolved: 0, aptitudeTestsTaken: 0, mockInterviewsCompleted: 0, currentStreak: 1, totalPoints: 100 },
      bookmarks: [],
      solvedQuestions: []
    };

    App.state.user = newUser;
    localStorage.setItem('prepvault_current_user', JSON.stringify(newUser));
    localStorage.setItem('prepvault_token', 'mock_jwt_token_' + Date.now());
    App.updateUserUI();
    App.closeModal();
    App.showToast(`Account created! Welcome, ${newUser.name}.`, 'success');
    App.navigateTo('dashboard');
  };

  const logout = () => {
    localStorage.removeItem('prepvault_token');
    localStorage.removeItem('prepvault_current_user');
    App.state.token = null;
    App.state.user = null;
    App.updateUserUI();
    App.showToast('You have been logged out.', 'info');
    openAuthModal('login');
  };

  const loginAsStudent = () => {
    const student = window.PREP_SEEDS.users[1];
    App.state.user = student;
    localStorage.setItem('prepvault_current_user', JSON.stringify(student));
    localStorage.setItem('prepvault_token', 'mock_student_token');
    App.updateUserUI();
    App.closeModal();
    App.showToast(`Logged in as Demo Student (${student.name})`, 'success');
    App.navigateTo('dashboard');
  };

  const loginAsAdmin = () => {
    const admin = window.PREP_SEEDS.users[0];
    App.state.user = admin;
    localStorage.setItem('prepvault_current_user', JSON.stringify(admin));
    localStorage.setItem('prepvault_token', 'mock_admin_token');
    App.updateUserUI();
    App.closeModal();
    App.showToast(`Logged in as Administrator (${admin.name})`, 'success');
    App.navigateTo('admin');
  };

  const openAuthModal = (mode = 'login') => {
    const loginForm = document.getElementById('auth-login-form');
    const signupForm = document.getElementById('auth-signup-form');
    const title = document.getElementById('auth-modal-title');

    if (mode === 'login') {
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
      if (title) title.textContent = 'Welcome Back to PrepVault';
    } else {
      loginForm.style.display = 'none';
      signupForm.style.display = 'block';
      if (title) title.textContent = 'Create Student Account';
    }
    App.openModal('modal-auth');
  };

  return {
    checkSession,
    login,
    register,
    logout,
    loginAsStudent,
    loginAsAdmin,
    openAuthModal
  };
})();
