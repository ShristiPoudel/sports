const INCIDENT_API = "/api/incidents";
const CUSTOMER_API = "/api/customers";
const PRODUCT_API = "/api/products";

// DOM Elements
const customerSelect = document.getElementById("customer");
const productSelect = document.getElementById("product");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const createBtn = document.getElementById("createBtn");
const successPanel = document.getElementById("successPanel");
const successMessage = document.getElementById("successMessage");

// Load customers
async function loadCustomers() {
  try {
    const res = await fetch(CUSTOMER_API);
    const { data } = await res.json();
    customerSelect.innerHTML = `<option value="">-- Select a Customer --</option>`;
    data.forEach((cust) => {
      customerSelect.innerHTML += `<option value="${cust.customerID}">${cust.firstName} ${cust.lastName} (${cust.email})</option>`;
    });
  } catch (err) {
    console.error("Failed to load customers:", err);
    customerSelect.innerHTML = `<option value="">-- Error loading customers --</option>`;
  }
}

// Load products
async function loadProducts() {
  try {
    const res = await fetch(PRODUCT_API);
    const { data } = await res.json();
    productSelect.innerHTML = `<option value="">-- Select a Product --</option>`;
    data.forEach((prod) => {
      productSelect.innerHTML += `<option value="${prod.productCode}">${prod.name}</option>`;
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    productSelect.innerHTML = `<option value="">-- Error loading products --</option>`;
  }
}

// Submit form
createBtn.addEventListener("click", async () => {
  const customerID = customerSelect.value;
  const productCode = productSelect.value;
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!customerID || !productCode || !title || !description) {
    return alert("Please fill in all fields.");
  }

  try {
    const res = await fetch(INCIDENT_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerID,
        productCode,
        title,
        description,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      successMessage.textContent = `Incident was successfully created and assigned incident ID #${result.data.incidentID}.`;
      successPanel.classList.remove("hidden");

      // Reset form
      customerSelect.value = "";
      productSelect.value = "";
      titleInput.value = "";
      descriptionInput.value = "";
    } else {
      alert(result.message || "Failed to create incident.");
    }
  } catch (err) {
    console.error("Create error:", err);
    alert("An error occurred while creating the incident.");
  }
});

// Load dropdowns on page load
document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
  loadProducts();
});
