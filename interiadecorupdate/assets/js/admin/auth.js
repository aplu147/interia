// assets/js/admin/auth.js

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "in2025" // Note: Removed '@' symbol from password to simplify
};

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes session timeout

document.addEventListener('DOMContentLoaded', function() {
  // Set current year in footer if element exists
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
  
  // Check if already logged in when on login page
  if (window.location.pathname.includes('login.html')) {
    if (isAuthenticated()) {
      redirectToDashboard();
    }
  }
  
  // Handle login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      authenticate();
    });
  }
  
  // Check authentication for protected pages
  if (!window.location.pathname.includes('login.html')) {
    checkAuth();
  }
});

function isAuthenticated() {
  const token = localStorage.getItem('auth_token');
  const lastActivity = localStorage.getItem('last_activity');
  return token && lastActivity && (Date.now() - parseInt(lastActivity) < SESSION_TIMEOUT);
}

function authenticate() {
  console.log('Authentication started');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  
  if (!usernameInput || !passwordInput) {
    showError('Login form elements not found');
    return;
  }

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  console.log('Attempting login with:', username, password);
  console.log('Expected credentials:', ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    console.log('Credentials matched');
    const token = btoa(`${username}:${Date.now()}`);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('last_activity', Date.now());
    console.log('Auth token set, redirecting...');
    redirectToDashboard();
  } else {
    console.log('Invalid credentials');
    showError('Invalid credentials. Please try again.');
    // Clear password field on error
    passwordInput.value = '';
  }
}

function checkAuth() {
  if (!isAuthenticated()) {
    console.log('Not authenticated, logging out');
    logout();
    return;
  }
  
  // Update activity timestamp on any interaction
  document.addEventListener('click', function() {
    localStorage.setItem('last_activity', Date.now());
  });
  
  // Initialize logout button if exists
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }
}

function redirectToDashboard() {
  console.log('Redirecting to dashboard');
  // Check if we're already on dashboard to prevent loops
  if (!window.location.pathname.includes('dashboard.html')) {
    window.location.href = 'manage/dashboard.html';
  }
}

function logout() {
  console.log('Logging out');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('last_activity');
  
  // Prevent redirect loop
  if (!window.location.pathname.includes('login.html')) {
    window.location.href = '../login.html';
  }
}

function showError(message) {
  console.log('Showing error:', message);
  // Try to find error message element or create one
  let errorElement = document.getElementById('login-error');
  
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = 'login-error';
    errorElement.className = 'alert alert-danger';
    errorElement.style.marginTop = '15px';
    
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.appendChild(errorElement);
    } else {
      document.body.prepend(errorElement);
    }
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Helper function for making authenticated requests
async function authFetch(url, options = {}) {
  if (!isAuthenticated()) {
    logout();
    return null;
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Basic ${localStorage.getItem('auth_token')}`
      }
    });
    
    if (response.status === 401) {
      logout();
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('Auth fetch error:', error);
    return null;
  }
}