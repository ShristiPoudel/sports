const API_URL = "/api/customers";

// DOM Elements
const searchBtn = document.querySelector(".search-row .btn");
const lastNameInput = document.getElementById("lastName");
const tbody = document.querySelector("tbody");
const editForm = document.querySelector(".form-panel");

// Form fields
const firstNameInput = document.getElementById("firstName");
const editLastNameInput = document.getElementById("editLastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const stateInput = document.getElementById("state");
const postalCodeInput = document.getElementById("postalCode");
const countrySelect = document.getElementById("country");
const phoneInput = document.getElementById("phone");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const updateBtn = document.querySelector(".button-group .btn-primary");
const cancelBtn = document.querySelector(".button-group .btn-secondary");

let selectedCustomerId = null;

// Search customer by last name
searchBtn.addEventListener("click", async () => {
  const lastName = lastNameInput.value.trim();
  if (!lastName) return alert("Enter last name");

  try {
    const res = await fetch(`${API_URL}/search/lastName?lastName=${encodeURIComponent(lastName)}`);
    const result = await res.json();

    if (!res.ok || !Array.isArray(result.data)) {
      alert(result.message || "No customer found");
      tbody.innerHTML = "";
      return;
    }

    renderCustomerTable(result.data);
  } catch (err) {
    console.error("Search error:", err);
    alert("Search failed. See console.");
  }
});

function renderCustomerTable(customers) {
  tbody.innerHTML = "";
  customers.forEach((c) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.firstName} ${c.lastName}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td><button class="btn btn-primary" data-id="${c.customerID}">View/Edit</button></td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll("button[data-id]").forEach((btn) =>
    btn.addEventListener("click", () => loadCustomerForEdit(btn.dataset.id))
  );
}

async function loadCustomerForEdit(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const customer = await res.json();

    if (!res.ok || !customer.customerID) {
      alert(customer.message || "Customer not found");
      return;
    }

    selectedCustomerId = id;
    firstNameInput.value = customer.firstName || "";
    editLastNameInput.value = customer.lastName || "";
    addressInput.value = customer.address || "";
    cityInput.value = customer.city || "";
    stateInput.value = customer.state || "";
    postalCodeInput.value = customer.postalCode || "";
    phoneInput.value = customer.phone || "";
    emailInput.value = customer.email || "";
    passwordInput.value = customer.password || "";
    countrySelect.value = customer.countryCode || "US";

    editForm.scrollIntoView({ behavior: "smooth" });
  } catch (err) {
    console.error("Error loading customer:", err);
  }
}

updateBtn.addEventListener("click", async () => {
  if (!selectedCustomerId) return alert("No customer selected");

  const updatedCustomer = {
    firstName: firstNameInput.value,
    lastName: editLastNameInput.value,
    address: addressInput.value,
    city: cityInput.value,
    state: stateInput.value,
    postalCode: postalCodeInput.value,
    phone: phoneInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    countryCode: countrySelect.value,
  };

  try {
    const res = await fetch(`${API_URL}/update/${selectedCustomerId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCustomer),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Customer updated successfully");
      lastNameInput.value = "";
      tbody.innerHTML = "";
      selectedCustomerId = null;
    } else {
      alert(result.message || "Update failed");
    }
  } catch (err) {
    console.error("Update error:", err);
  }
});

cancelBtn.addEventListener("click", () => {
  selectedCustomerId = null;
  editForm.reset();
});
