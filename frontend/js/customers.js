import { authFetch } from "./utils/authFetch.js";

const API_URL = "/api/customers";

// DOM elements
const form = document.getElementById("customerForm");
const tbody = document.querySelector("tbody");

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

// Fetch and display all customers
async function fetchCustomers() {
  try {
    const res = await authFetch(API_URL); // uses GET by default
    const result = await res.json();

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

  // Attach delete button events
  document.querySelectorAll(".btn-danger").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// Handle form submission to add customer
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

    try {
      const res = await authFetch(`${API_URL}/addbyadmin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });

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
    }
  });
}

// Handle delete customer
async function handleDelete(e) {
  const id = e.target.dataset.id;
  if (!id) return;

  if (confirm(`Delete customer ID ${id}?`)) {
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
    }
  }
}


// Load country list dynamically
async function loadCountries() {
  try {
    const res = await authFetch("/api/countries");
    const result = await res.json();

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
  }
}


// Initial load
loadCountries();
fetchCustomers();
