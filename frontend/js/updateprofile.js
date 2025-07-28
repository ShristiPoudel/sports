import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userNameInput = document.getElementById('userName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const updateBtn = document.querySelector('.btn-primary');
  const cancelBtn = document.querySelector('.btn-secondary');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const submitLoading = document.getElementById('submitLoading');

  // Delay utility
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Utility functions
  function showLoading(msg = "Loading...") {
    if (loadingIndicator) {
      loadingIndicator.textContent = msg;
      loadingIndicator.classList.remove("hidden");
    }
  }

  function hideLoading() {
    if (loadingIndicator) {
      loadingIndicator.classList.add("hidden");
    }
  }

  function showSubmitLoading() {
    if (submitLoading) {
      submitLoading.classList.remove("hidden");
    }
  }

  function hideSubmitLoading() {
    if (submitLoading) {
      submitLoading.classList.add("hidden");
    }
  }

  function disableSubmit() {
    updateBtn.disabled = true;
  }

  function enableSubmit() {
    updateBtn.disabled = false;
  }

  // Fetch and populate user profile
  showLoading("Loading profile...");
  try {
    const res = await authFetch('/api/profile');
    await delay(500); // Simulated delay

    if (!res || !res.ok) throw new Error("Failed to fetch user data");

    const data = await res.json();
    const user = data.data;

    userNameInput.value = user.username || '';
    emailInput.value = user.email || '';
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Failed to load profile information.");
  } finally {
    hideLoading();
  }

  // Handle update
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    disableSubmit();
    showSubmitLoading();

    const updatedData = {
      username: userNameInput.value.trim(),
      email: emailInput.value.trim(),
    };

    const newPassword = passwordInput.value.trim();
    if (newPassword) {
      updatedData.password = newPassword;
    }

    try {
      await delay(500); // Simulate backend delay

      const res = await authFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Profile updated successfully.");
        passwordInput.value = ''; // Clear password field
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong while updating your profile.");
    } finally {
      hideSubmitLoading();
      enableSubmit();
    }
  });

  // Handle cancel
  cancelBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
