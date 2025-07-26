import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const userNameInput = document.getElementById('userName');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const updateBtn = document.querySelector('.btn-primary');
  const cancelBtn = document.querySelector('.btn-secondary');

  // Fetch and populate user profile
  try {
    const res = await authFetch('/api/profile');
    if (!res || !res.ok) throw new Error("Failed to fetch user data");

    const data = await res.json();
    const user = data.data;

    userNameInput.value = user.username || '';
    emailInput.value = user.email || '';
  } catch (err) {
    console.error("Error fetching profile:", err);
    alert("Failed to load profile information.");
  }

  // Handle update
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const updatedData = {
      username: userNameInput.value.trim(),
      email: emailInput.value.trim(),
    };

    const newPassword = passwordInput.value.trim();
    if (newPassword) {
      updatedData.password = newPassword;
    }

    try {
      const res = await authFetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(updatedData),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Profile updated successfully.");
        passwordInput.value = ''; // Clear password field after update
      } else {
        alert(result.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong while updating your profile.");
    }
  });

  // Handle cancel
  cancelBtn.addEventListener('click', () => {
    window.location.href = 'index.html'; // or wherever you want to redirect
  });
});
