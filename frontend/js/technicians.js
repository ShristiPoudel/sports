import { authFetch } from "./utils/authFetch.js";

const API_URL = "/api/technicians";

// DOM elements
const form = document.getElementById("technicianForm");
const tbody = document.querySelector("tbody");

// Form inputs
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");

// Fetch and display all technicians
async function fetchTechnicians() {
  try {
    const res = await authFetch(API_URL); // uses GET by default
    const result = await res.json();

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
  }
}

// Render technician table
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

  // Attach delete button events
  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// Handle form submission to add technician
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

    if (!technician.firstName || !technician.lastName || !technician.email || !technician.phone || !technician.password) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await authFetch(`${API_URL}/addbyadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(technician),
      });

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
    }
  });
}

// Handle delete technician
async function handleDelete(e) {
  const id = e.target.dataset.id;
  if (!id) return;

  if (confirm(`Delete technician ID ${id}?`)) {
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
    }
  }
}

// Initial load
fetchTechnicians();
