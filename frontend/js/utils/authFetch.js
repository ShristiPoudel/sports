function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now(); // JWT exp is in seconds
  } catch (err) {
    return true;
  }
}

async function refreshAccessToken(refreshToken) {
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (res.ok && data.accessToken) {
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } else {
      console.error("Failed to refresh access token:", data.message);
      return null;
    }
  } catch (err) {
    console.error("Error during token refresh:", err);
    return null;
  }
}

export async function authFetch(url, options = {}) {
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!accessToken || !refreshToken) {
    localStorage.clear();
    window.location.href = 'login_users.html';
    return null;
  }

  // Check if access token is expired BEFORE making the request
  if (isTokenExpired(accessToken)) {
    console.warn("Access token expired. Attempting to refresh...");

    const newAccessToken = await refreshAccessToken(refreshToken);

    if (!newAccessToken) {
      localStorage.clear();
      window.location.href = 'login_users.html';
      return null;
    }

    accessToken = newAccessToken;
  }

  const baseHeaders = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };

  options.headers = {
    ...(options.headers || {}),
    ...baseHeaders,
  };

  try {
    const response = await fetch(url, options);
    return response;
  } catch (err) {
    console.error("Network error during fetch:", err);
    localStorage.clear();
    window.location.href = 'login_users.html';
    return null;
  }
}
