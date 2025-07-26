document.getElementById("registrationForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value;

  const body = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    role
  };

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    let result;
    try {
      result = await res.json();
    } catch (err) {
      const text = await res.text();
      console.error("Server sent non-JSON response:", text);
      alert("Server error. Try again later.");
      return;
    }

    if (res.ok) {
      alert("Registration successful! You can now log in.");
      window.location.href = "login_users.html";
    } else {
      alert(result.message || "Registration failed.");
    }
  } catch (err) {
    alert("Network error");
    console.error(err);
  }
});
