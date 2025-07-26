const refreshToken = localStorage.getItem("refreshToken");

if (!refreshToken) {
  // No token found, just redirect
  localStorage.clear();
  window.location.href = "login_users.html";
} else {
  try {
    // Send logout request to backend
    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })
      .then((response) => {
        // Regardless of success/failure, clear local storage
        localStorage.clear();
        // Redirect to login
        window.location.href = "login_users.html";
      })
      .catch((error) => {
        console.error("Logout error:", error);
        localStorage.clear();
        window.location.href = "login_users.html";
      });
  } catch (err) {
    console.error("Logout failed:", err);
    localStorage.clear();
    window.location.href = "login_users.html";
  }
}