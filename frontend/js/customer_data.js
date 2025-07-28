import { authFetch } from './utils/authFetch.js';

document.addEventListener("DOMContentLoaded", async () => {
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");

  const loadingIndicator = document.getElementById("loadingIndicator"); 
  const submitLoading = document.getElementById("submitLoading");       
  const customerForm = document.getElementById("customerForm");
  const submitBtn = customerForm?.querySelector('button[type="submit"]');

  //  functions to show/hide loading state
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

  // Redirect if not logged in or not a customer
  if (!userID || role !== "customer") {
    window.location.href = "login_users.html";
    return;
  }

  // Check if customer profile already exists, with  delay to see loading
  showLoading("Verifying your profile...");
  try {
    const res = await authFetch("/api/customers/me");

    await new Promise(resolve => setTimeout(resolve, 500));

    hideLoading();

    if (res.ok) {
      window.location.href = "index.html";
      return;
    } else if (res.status !== 404) {
      throw new Error(`Unexpected status: ${res.status}`);
    }
    
  } catch (err) {
    hideLoading();
    console.error("Error checking customer profile:", err);
    alert("Error verifying your profile. Try again later.");
    return;
  }

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

    disableSubmit();
    showSubmitLoading();

    try {
      const res = await authFetch("/api/customers/add", {
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
        alert("Customer profile created successfully.");
        window.location.href = "index.html";
      } else {
        console.error("Profile creation error:", result);
        alert(result.message || "Failed to create profile.");
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
