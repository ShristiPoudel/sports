import { authFetch } from './utils/authFetch.js';

document.addEventListener("DOMContentLoaded", async () => {
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");

  const loadingIndicator = document.getElementById("loadingIndicator");
  const submitLoading = document.getElementById("submitLoading");
  const technicianForm = document.getElementById("technicianForm");
  const submitBtn = technicianForm?.querySelector('button[type="submit"]');

  // Utility functions
  function showLoading(msg = "Loading, please wait...") {
    if (loadingIndicator) {
      loadingIndicator.textContent = msg;
      loadingIndicator.classList.remove("hidden");
    }
  }

  function hideLoading() {
    if (loadingIndicator) loadingIndicator.classList.add("hidden");
  }

  function showSubmitLoading() {
    if (submitLoading) submitLoading.classList.remove("hidden");
  }

  function hideSubmitLoading() {
    if (submitLoading) submitLoading.classList.add("hidden");
  }

  function disableSubmit() {
    if (submitBtn) submitBtn.disabled = true;
  }

  function enableSubmit() {
    if (submitBtn) submitBtn.disabled = false;
  }

  // Check role
  if (!userID || role !== "technician") {
    window.location.href = "login_users.html";
    return;
  }

  // Check if technician profile already exists
  showLoading("Verifying your profile...");
  try {
    const res = await authFetch("/api/technicians/me");

    await new Promise(resolve => setTimeout(resolve, 500)); 

    hideLoading();

    if (res.ok) {
      // Already exists, redirect
      window.location.href = "index.html";
      return;
    } else if (res.status !== 404) {
      throw new Error(`Unexpected status: ${res.status}`);
    }
  } catch (err) {
    hideLoading();
    console.error("Error checking technician profile:", err);
    alert("Error verifying your profile. Please try again later.");
    return;
  }

  if (!technicianForm) {
    console.error("Technician form not found");
    return;
  }

  // Submit new technician data
  technicianForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      userID: Number(userID),
      firstName: document.getElementById("firstName").value.trim(),
      lastName: document.getElementById("lastName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
    };

    disableSubmit();
    showSubmitLoading();

    try {
      const res = await authFetch("/api/technicians/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      await new Promise(resolve => setTimeout(resolve, 500)); 

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
    } finally {
      hideSubmitLoading();
      enableSubmit();
    }
  });
});
