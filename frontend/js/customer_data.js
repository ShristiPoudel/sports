import { authFetch } from './utils/authFetch.js';

document.addEventListener("DOMContentLoaded", async () => {
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");

  // Redirect if not logged in or not a customer
  if (!userID || role !== "customer") {
    window.location.href = "login_users.html";
    return;
  }

  try {
    // Check if customer profile already exists
    const res = await authFetch("/api/customers/me");

    if (res.ok) {
      // Customer profile exists — redirect to homepage
      window.location.href = "index.html";
      return;
    } else if (res.status !== 404) {
      // Unexpected error other than "Not Found"
      throw new Error(`Unexpected status: ${res.status}`);
    }
    // If 404, allow form to be filled
  } catch (err) {
    console.error("Error checking customer profile:", err);
    alert("Error verifying your profile. Try again later.");
    return;
  }

  const customerForm = document.getElementById("customerForm");
  if (!customerForm) {
    console.error("Customer form not found");
    return;
  }

  customerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      userID: Number(userID),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      postalCode: document.getElementById("postalCode").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      countryCode: document.getElementById("countryCode").value.trim(),
    };

    try {
      const res = await authFetch("/api/customers/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },  // <- add this
        body: JSON.stringify(formData),
      });

      let result;
      try {
        result = await res.json();
      } catch {
        result = { message: "Invalid server response" };
      }

      if (res.ok) {
        alert("Customer profile created successfully.");
        window.location.href = "index.html";
      } else {
        console.error("Profile creation error:", result);
        alert(result.message || "Failed to create profile.");
      }

    } catch (err) {
      console.error("Network or JS error:", err);
      alert("Error submitting form. Please try again.");
    }
  });
});
