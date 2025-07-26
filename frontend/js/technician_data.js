import { authFetch } from './utils/authFetch.js';

document.addEventListener("DOMContentLoaded", async () => {
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");

  // Redirect if not logged in or not a technician
  if (!userID || role !== "technician") {
    window.location.href = "login_users.html";
    return;
  }

  try {
    // Check if technician profile already exists
    const res = await authFetch("/api/technicians/me");

    if (res.ok) {
      // Technician profile exists — redirect to homepage/dashboard
      window.location.href = "index.html";
      return;
    } else if (res.status !== 404) {
      // Unexpected error (other than Not Found)
      throw new Error(`Unexpected response status: ${res.status}`);
    }
    // If 404, allow form to be filled
  } catch (err) {
    console.error("Error checking technician profile:", err);
    alert("Error verifying your profile. Please try again later.");
    return;
  }

  const technicianForm = document.getElementById("technicianForm");
  if (!technicianForm) {
    console.error("Technician form not found");
    return;
  }

  technicianForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      userID: Number(userID),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
    };

    try {
      const res = await authFetch("/api/technicians/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(formData),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = { message: "Invalid server response" };
      }

      if (res.ok) {
        alert("Technician profile created successfully.");
        window.location.href = "index.html";
      } else {
        console.error("Profile creation error:", result);
        alert(result.message || "Failed to create technician profile.");
      }
    } catch (err) {
      console.error("Network or JS error:", err);
      alert("Error submitting form. Please try again.");
    }
  });
});
