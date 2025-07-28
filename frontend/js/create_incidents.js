import { authFetch } from "./utils/authFetch.js";

const INCIDENT_API = "/api/incidents";
const PRODUCT_API = "/api/products";

// DOM Elements
const productSelect = document.getElementById("product");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const createBtn = document.getElementById("createBtn");
const successPanel = document.getElementById("successPanel");
const successMessage = document.getElementById("successMessage");
const loadingIndicator = document.getElementById("loadingIndicator");    // for initial product loading
const createLoading = document.getElementById("createLoading");        // for form submit loading

// Show/hide loading and disable/enable submit button
function showLoading(msg = "Loading, please wait...") {
  if (loadingIndicator) {
    loadingIndicator.textContent = msg;
    loadingIndicator.classList.remove("hidden");
  }
}
function hideLoading() {
  if (loadingIndicator) loadingIndicator.classList.add("hidden");
}
function showCreateLoading() {
  if (createLoading) createLoading.classList.remove("hidden");
}
function hideCreateLoading() {
  if (createLoading) createLoading.classList.add("hidden");
}
function disableSubmit() {
  if (createBtn) createBtn.disabled = true;
}
function enableSubmit() {
  if (createBtn) createBtn.disabled = false;
}

// Load products with loading indicator and artificial delay
async function loadProducts() {
  showLoading("Loading products...");
  try {
    const res = await authFetch(PRODUCT_API);

    // Artificial delay so loading message is visible briefly
    await new Promise(resolve => setTimeout(resolve, 500));

    if (!res || !res.ok) throw new Error("Failed to load products");
    const { data } = await res.json();

    productSelect.innerHTML = `<option value="">-- Select a Product --</option>`;
    data.forEach(prod => {
      productSelect.innerHTML += `<option value="${prod.productCode}">${prod.name}</option>`;
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    productSelect.innerHTML = `<option value="">-- Error loading products --</option>`;
  } finally {
    hideLoading();
  }
}

// Handle form submission with loading states and delay
createBtn.addEventListener("click", async () => {
  const productCode = productSelect.value;
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!productCode || !title || !description) {
    alert("Please fill in all fields.");
    return;
  }

  disableSubmit();
  showCreateLoading();

  try {
    const res = await authFetch(INCIDENT_API, {
      method: "POST",
      body: JSON.stringify({ productCode, title, description }),
      headers: { "Content-Type": "application/json" },
    });

    // Artificial delay to keep loading visible for half a second
    await new Promise(resolve => setTimeout(resolve, 500));

    const result = await res.json();

    if (res.ok) {
      successMessage.textContent = "Incident was successfully created.";
      successPanel.classList.remove("hidden");

      // Reset form fields
      productSelect.value = "";
      titleInput.value = "";
      descriptionInput.value = "";
    } else {
      alert(result.message || "Failed to create incident.");
    }
  } catch (err) {
    console.error("Create error:", err);
    alert("An error occurred while creating the incident.");
  } finally {
    hideCreateLoading();
    enableSubmit();
  }
});

// Load products on DOM load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
