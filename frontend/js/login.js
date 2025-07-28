import { authFetch } from './utils/authFetch.js';

const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loadingIndicator = document.getElementById('loadingIndicator');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  // Show loading and disable button
  loadingIndicator.classList.remove('hidden');
  loginBtn.disabled = true;

  try {
    // Initial login request (no token required)
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // 500ms delay before parsing response
    await sleep(500);

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Invalid credentials.");
      return;
    }

    const { accessToken, refreshToken, user } = result;

    // Store tokens and user info
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('userRole', user.role);
    localStorage.setItem('userID', user.id);

    // 500ms delay before redirect/profile fetch
    await sleep(500);

    // Redirect based on role
    if (user.role === 'customer') {
      const profileRes = await authFetch('/api/customers/me');

      if (profileRes.status === 200) {
        const profileData = await profileRes.json();
        window.location.href = profileData.exists ? "index.html" : "customer_data.html";
      } else if (profileRes.status === 404) {
        window.location.href = "customer_data.html";
      } else {
        alert("Error checking customer profile.");
      }

    } else if (user.role === 'technician') {
      const profileRes = await authFetch('/api/technicians/me');

      if (profileRes.status === 200) {
        const profileData = await profileRes.json();
        window.location.href = profileData.exists ? "index.html" : "technician_data.html";
      } else if (profileRes.status === 404) {
        window.location.href = "technician_data.html";
      } else {
        alert("Error checking technician profile.");
      }

    } else if (user.role === 'admin') {
      window.location.href = "index.html";
    } else {
      alert("Unknown user role.");
    }

  } catch (err) {
    console.error("Login error:", err);
    alert("Server/network error.");
  } finally {
    // Hide loading and enable button
    loadingIndicator.classList.add('hidden');
    loginBtn.disabled = false;
  }
});
