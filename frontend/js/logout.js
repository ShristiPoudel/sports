const refreshToken = localStorage.getItem('refreshToken');

await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ refreshToken }),
});

localStorage.clear(); // or removeItem individually
window.location.href = 'login_users.html';
