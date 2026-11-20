// ==========================================================================
// PREPVAULT - MASTER APPLICATION CONTROLLER & ROUTER
// Manages App Navigation, State, Theme, API/Mock Adapter & Global Modals
// ==========================================================================

const App = (() => {
  // Global State
  const state = {
    user: null,
    token: localStorage.getItem('prepvault_token') || null,
    theme: localStorage.getItem('prepvault_theme') || 'dark',
    currentRoute: 'dashboard',
    isOnlineServer: false,
    questions: [],
    quizzes: [],
    companies: [],
    resources: [],
    leaderboard: [],
    dailyChallenge: null
  };

  // Base API URL
  const API_BASE = '/api';

  // Initialize Application
  const init = async () => {
    applyTheme(state.theme);
    setupEventListeners();
    await checkServerConnection();
    await loadInitialData();
    await Auth.checkSession();
    handleRouteFromHash();
    updateUserUI();
  };

  // Check if Node server is reachable or fallback to seeds
  const checkServerConnection = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(1500) });
      if (res.ok) {
        state.isOnlineServer = true;
        console.log('[PrepVault]: Connected to Express Backend');
        return;
      }
    } catch (e) {
      state.isOnlineServer = false;
      console.log('[PrepVault]: Running in Standalone / Client-Side Persistence Engine');
    }
  };

  // Load datasets either from API or built-in PREP_SEEDS
  const loadInitialData = async () => {
    if (state.isOnlineServer) {
      try {
        const [qRes, qzRes, cRes, rRes, lRes] = await Promise.all([
          fetch(`${API_BASE}/questions`),
          fetch(`${API_BASE}/quizzes`),
          fetch(`${API_BASE}/companies`),
          fetch(`${API_BASE}/resources`),
          fetch(`${API_BASE}/leaderboard`)
        ]);
        const [qData, qzData, cData, rData, lData] = await Promise.all([
          qRes.json(), qzRes.json(), cRes.json(), rRes.json(), lRes.json()
        ]);
        state.questions = qData.data || window.PREP_SEEDS.questions;
        state.quizzes = qzData.data || window.PREP_SEEDS.quizzes;
        state.companies = cData.data || window.PREP_SEEDS.companies;
        state.resources = rData.data || window.PREP_SEEDS.resources;
        state.leaderboard = lData.leaderboard || window.PREP_SEEDS.leaderboard;
        state.dailyChallenge = lData.dailyChallenge || window.PREP_SEEDS.dailyChallenge;
        return;
      } catch (err) {
        console.warn('API fetch failed, falling back to client seeds:', err);
      }
    }

    // Client-side fallback from window.PREP_SEEDS
    const seeds = window.PREP_SEEDS;
    state.questions = JSON.parse(localStorage.getItem('prepvault_questions')) || seeds.questions;
    state.quizzes = JSON.parse(localStorage.getItem('prepvault_quizzes')) || seeds.quizzes;
    state.companies = seeds.companies;
    state.resources = seeds.resources;
    state.leaderboard = JSON.parse(localStorage.getItem('prepvault_leaderboard')) || seeds.leaderboard;
    state.dailyChallenge = seeds.dailyChallenge;
  };

  // Single-Page Application Router
  const navigateTo = (route) => {
    state.currentRoute = route;
    window.location.hash = route;

    // Update Navigation item active states
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-route') === route);
    });

    // Update View Sections
    document.querySelectorAll('.view-section').forEach(el => {
      el.classList.remove('active');
    });

    const activeView = document.getElementById(`view-${route}`);
    if (activeView) {
      activeView.classList.add('active');
    } else {
      document.getElementById('view-dashboard')?.classList.add('active');
    }

    // Trigger module renderers
    switch (route) {
      case 'dashboard':
        Dashboard.render();
        break;
      case 'technical':
        Technical.render();
        break;
      case 'aptitude':
        Aptitude.render();
        break;
      case 'hr':
        HR.render();
        break;
      case 'mock-interview':
        MockInterview.render();
        break;
      case 'resume-builder':
        ResumeBuilder.render();
        break;
      case 'companies':
        CompanyPrep.render();
        break;
      case 'resources':
        Resources.render();
        break;
      case 'leaderboard':
        Leaderboard.render();
        break;
      case 'certificate':
        Certificate.render();
        break;
      case 'admin':
        Admin.render();
        break;
    }

    // Auto-scroll to top of viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close mobile sidebar if open
    document.querySelector('.sidebar')?.classList.remove('mobile-open');
  };

  const handleRouteFromHash = () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    navigateTo(hash);
  };

  // Theme Management (Dark / Light)
  const toggleTheme = () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  };

  const applyTheme = (theme) => {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('prepvault_theme', theme);
    const themeIcon = document.getElementById('theme-icon');
    if (themeIcon) {
      themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
  };

  // Setup Global Event Listeners
  const setupEventListeners = () => {
    window.addEventListener('hashchange', handleRouteFromHash);

    // Sidebar navigation clicks
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const route = btn.getAttribute('data-route');
        if (route) navigateTo(route);
      });
    });

    // Mobile sidebar toggle
    document.getElementById('btn-sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.sidebar')?.classList.toggle('mobile-open');
    });

    // Theme toggle button
    document.getElementById('btn-theme-toggle')?.addEventListener('click', toggleTheme);

    // Global Modal Overlay clicks to dismiss
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
      });
    });

    // Global Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', closeModal);
    });

    // Global Search Bar Handler
    const searchInput = document.getElementById('global-search-input');
    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length > 1) {
        if (state.currentRoute !== 'technical' && state.currentRoute !== 'resources') {
          navigateTo('technical');
        }
        Technical.applySearchFilter(query);
      }
    });
  };

  // Global Modal Helpers
  const openModal = (modalId) => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    const target = document.getElementById(modalId);
    if (target) {
      target.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    document.body.style.overflow = '';
  };

  // Toast Notification System
  const showToast = (message, type = 'info', duration = 3500) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'danger' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  };

  // Update User Elements in Navigation and Sidebar
  const updateUserUI = () => {
    const user = state.user;
    const readinessScore = user ? (user.readinessScore || 65) : 35;
    const name = user ? user.name : 'Guest Candidate';
    const role = user ? (user.targetRole || 'Full Stack SDE') : 'Student';
    const avatar = user ? (user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80') : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';

    // Top navbar readiness pill
    const pill = document.getElementById('nav-readiness-val');
    if (pill) pill.textContent = `${readinessScore}%`;

    // Sidebar user details
    const userNameEl = document.getElementById('sidebar-user-name');
    const userRoleEl = document.getElementById('sidebar-user-role');
    const userAvatarEl = document.getElementById('sidebar-user-avatar');

    if (userNameEl) userNameEl.textContent = name;
    if (userRoleEl) userRoleEl.textContent = role;
    if (userAvatarEl) userAvatarEl.src = avatar;

    // Show/hide admin nav button
    const adminNav = document.getElementById('nav-admin-link');
    if (adminNav) {
      adminNav.style.display = (user && user.role === 'admin') ? 'flex' : 'none';
    }
  };

  return {
    state,
    init,
    navigateTo,
    openModal,
    closeModal,
    showToast,
    updateUserUI,
    loadInitialData
  };
})();

document.addEventListener('DOMContentLoaded', App.init);
