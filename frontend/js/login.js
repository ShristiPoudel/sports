const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginBtn.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();

    if (res.ok) {
      const { accessToken, refreshToken, user } = result;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userID', user.id);

      if (user.role === 'customer') {
        try {
          const profileRes = await fetch('/api/customers/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (profileRes.status === 200) {
            const profileData = await profileRes.json();
            if (profileData.exists === true) {
              window.location.href = "index.html";
            } else {
              window.location.href = "customer_data.html";
            }
          } else if (profileRes.status === 404) {
            window.location.href = "customer_data.html";
          } else {
            alert("Error checking customer profile.");
          }
        } catch (err) {
          console.error("Error fetching customer profile:", err);
          alert("Something went wrong checking your profile.");
        }

      } else if (user.role === 'technician') {
        try {
          const profileRes = await fetch('/api/technicians/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (profileRes.status === 200) {
            const profileData = await profileRes.json();
            if (profileData.exists === true) {
              window.location.href = "index.html";
            } else {
              window.location.href = "technician_data.html";
            }
          } else if (profileRes.status === 404) {
            window.location.href = "technician_data.html";
          } else {
            alert("Error checking technician profile.");
          }
        } catch (err) {
          console.error("Error fetching technician profile:", err);
          alert("Something went wrong checking your profile.");
        }

      } else if (user.role === 'admin') {
        window.location.href = "index.html";
      } else {
        alert("Unknown user role.");
      }

    } else {
      alert(result.message || "Invalid credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("Server/network error.");
  }
});
