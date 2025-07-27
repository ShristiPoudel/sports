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
const loadingIndicator = document.getElementById("loadingIndicator");
const createLoading = document.getElementById("createLoading");

// Timeout helper
function withTimeout(promise, timeoutMs = 5000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), timeoutMs)
    ),
  ]);
}

// Loading UI control
function showLoading() {
  if (loadingIndicator) loadingIndicator.classList.remove("hidden");
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

// Load products
async function loadProducts() {
  showLoading();
  try {
    const res = await withTimeout(authFetch(PRODUCT_API), 5000);
    if (!res || !res.ok) throw new Error("Response not OK");
    const { data } = await res.json();

    productSelect.innerHTML = `<option value="">-- Select a Product --</option>`;
    data.forEach((prod) => {
      productSelect.innerHTML += `<option value="${prod.productCode}">${prod.name}</option>`;
    });
  } catch (err) {
    console.error("Failed to load products:", err);
    productSelect.innerHTML = `<option value="">-- Error loading products --</option>`;
  } finally {
    hideLoading();
  }
}

// Submit form
createBtn.addEventListener("click", async () => {
  const productCode = productSelect.value;
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!productCode || !title || !description) {
    alert("Please fill in all fields.");
    return;
  }

  showCreateLoading();

  try {
    const res = await withTimeout(
      authFetch(INCIDENT_API, {
        method: "POST",
        body: JSON.stringify({ productCode, title, description }),
      }),
      5000
    );

    if (!res) throw new Error("No response");
    const result = await res.json();

    if (res.ok) {
      successMessage.textContent = `Incident was successfully created.`;
      successPanel.classList.remove("hidden");

      // Reset form
      productSelect.value = "";
      titleInput.value = "";
      descriptionInput.value = "";
    } else {
      alert(result.message || "Failed to create incident.");
    }
  } catch (err) {
    console.error("Create error:", err);
    alert(err.message || "An error occurred while creating the incident.");
  } finally {
    hideCreateLoading();
  }
});

// Load products on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
});
