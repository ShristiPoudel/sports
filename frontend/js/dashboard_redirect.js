// dashboard_redirect.js

const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

// Helper function to check if JWT is expired
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // Convert to ms
  } catch (err) {
    return true; // Treat as expired if invalid
  }
}

// Function to refresh access token using refresh token
async function refreshAccessToken() {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error('Token refresh failed:', err);
    return null;
  }
}

// Main logic
(async () => {
  if (!accessToken || isTokenExpired(accessToken)) {
    if (refreshToken) {
      const newToken = await refreshAccessToken();
      if (!newToken) {
        // Refresh failed – redirect to login
        window.location.href = 'login_users.html';
      }
    } else {
      // No tokens at all – redirect to login
      window.location.href = 'login_users.html';
    }
  }
})();
