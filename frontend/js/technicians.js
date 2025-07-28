import { authFetch } from "./utils/authFetch.js";

const API_URL = "/api/technicians";

// DOM elements
const form = document.getElementById("technicianForm");
const tbody = document.querySelector("tbody");
const loadingIndicator = document.getElementById("loadingIndicator");
const submitLoading = document.getElementById("submitLoading");
const submitBtn = form?.querySelector('button[type="submit"]');

// Form inputs
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

// Utility functions
function showLoading(msg = "Loading...") {
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

// Fetch and display technicians
async function fetchTechnicians() {
  showLoading("Loading technicians...");
  try {
    const res = await authFetch(API_URL);
    const result = await res.json();

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (result.success && Array.isArray(result.data)) {
      renderTable(result.data);
    } else {
      alert("Failed to load technicians: " + (result.message || "Invalid response"));
      tbody.innerHTML = "<tr><td colspan='5'>No technicians found.</td></tr>";
    }
  } catch (err) {
    console.error("Error fetching technicians:", err);
    alert("Error fetching technicians: " + err.message);
    tbody.innerHTML = "<tr><td colspan='5'>Error loading data.</td></tr>";
  } finally {
    hideLoading();
  }
}

// Render table
function renderTable(technicians) {
  tbody.innerHTML = "";
  technicians.forEach((tech) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tech.firstName}</td>
      <td>${tech.lastName}</td>
      <td>${tech?.User?.email ?? "-"}</td>
      <td>${tech.phone || "-"}</td>
      <td><button class="btn btn-danger" data-id="${tech.techID}">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// Form submit
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const technician = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      password: passwordInput.value.trim(),
    };

    const isEmpty = Object.values(technician).some((v) => !v);
    if (isEmpty) {
      alert("Please fill in all fields.");
      return;
    }

    disableSubmit();
    showSubmitLoading();

    try {
      const res = await authFetch(`${API_URL}/addbyadmin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(technician),
      });

      await new Promise((resolve) => setTimeout(resolve, 400));

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Technician added!");
        form.reset();
        fetchTechnicians();
      } else {
        alert("Add failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Add error:", err);
      alert("Add error: " + err.message);
    } finally {
      hideSubmitLoading();
      enableSubmit();
    }
  });
}

// Delete handler
async function handleDelete(e) {
  const id = e.target.dataset.id;
  if (!id) return;

  if (confirm(`Delete technician ID ${id}?`)) {
    const btn = e.target;
    const originalText = btn.textContent;
    btn.textContent = "Deleting...";
    btn.disabled = true;

    try {
      const res = await authFetch(`${API_URL}/delete/${id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (res.ok && result.success) {
        fetchTechnicians();
      } else {
        alert("Delete failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete error: " + err.message);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }
}

// Initial load
fetchTechnicians();
