import { authFetch } from "./utils/authFetch.js";

const API_URL = "/api/customers";

// DOM elements
const form = document.getElementById("customerForm");
const tbody = document.querySelector("tbody");
const loadingIndicator = document.getElementById("loadingIndicator");
const submitLoading = document.getElementById("submitLoading");
const submitBtn = form?.querySelector('button[type="submit"]');

// Form inputs
const firstNameInput = document.getElementById("addFirstName");
const lastNameInput = document.getElementById("addLastName");
const emailInput = document.getElementById("addEmail");
const phoneInput = document.getElementById("addPhone");
const passwordInput = document.getElementById("addPassword");
const addressInput = document.getElementById("addAddress");
const cityInput = document.getElementById("addCity");
const stateInput = document.getElementById("addState");
const postalCodeInput = document.getElementById("addPostalCode");
const countryInput = document.getElementById("addCountry");

// Utility functions for loading state
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

// Fetch and display all customers
async function fetchCustomers() {
  showLoading("Loading customers...");
  try {
    const res = await authFetch(API_URL);
    const result = await res.json();

    await new Promise(resolve => setTimeout(resolve, 500)); // Optional delay

    if (result.success && Array.isArray(result.data)) {
      renderTable(result.data);
    } else {
      alert("Failed to load customers: " + (result.message || "Invalid response"));
      tbody.innerHTML = "<tr><td colspan='5'>No customers found.</td></tr>";
    }
  } catch (err) {
    console.error("Error fetching customers:", err);
    alert("Error fetching customers: " + err.message);
    tbody.innerHTML = "<tr><td colspan='5'>Error loading data.</td></tr>";
  } finally {
    hideLoading();
  }
}

// Render customer table
function renderTable(customers) {
  tbody.innerHTML = "";
  customers.forEach((cust) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${cust.firstName}</td>
      <td>${cust.lastName}</td>
      <td>${cust?.User?.email ?? "-"}</td>
      <td>${cust.phone || "-"}</td>
      <td><button class="btn btn-danger" data-id="${cust.customerID}">Delete</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// Handle form submission
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const customer = {
      firstName: firstNameInput.value.trim(),
      lastName: lastNameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      password: passwordInput.value.trim(),
      address: addressInput.value.trim(),
      city: cityInput.value.trim(),
      state: stateInput.value.trim(),
      postalCode: postalCodeInput.value.trim(),
      countryCode: countryInput.value,
    };

    const isEmpty = Object.values(customer).some((val) => !val);
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
        body: JSON.stringify(customer),
      });

      await new Promise(resolve => setTimeout(resolve, 500)); // Optional delay

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Customer added!");
        form.reset();
        fetchCustomers();
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

// Handle delete customer
async function handleDelete(e) {
  const id = e.target.dataset.id;
  if (!id) return;

  if (confirm(`Delete customer ID ${id}?`)) {
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
        fetchCustomers();
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



// Load country list dynamically
async function loadCountries() {
  showLoading("Loading countries...");
  try {
    const res = await authFetch("/api/countries");
    const result = await res.json();

    await new Promise(resolve => setTimeout(resolve, 500)); // Optional delay

    const select = document.getElementById("addCountry");
    select.innerHTML = "";

    if (res.ok && result.success && Array.isArray(result.data)) {
      result.data.forEach((country) => {
        const option = document.createElement("option");
        option.value = country.countryCode;
        option.textContent = country.countryName;
        select.appendChild(option);
      });
    } else {
      select.innerHTML = `<option value="">Failed to load countries</option>`;
    }
  } catch (err) {
    console.error("Error loading countries:", err);
    const select = document.getElementById("addCountry");
    select.innerHTML = `<option value="">Error loading countries</option>`;
  } finally {
    hideLoading();
  }
}

// Initial load
loadCountries();
fetchCustomers();
