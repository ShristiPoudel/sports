import { authFetch } from './utils/authFetch.js';

const API_BASE = "/api/products";

// Select elements
const tbody = document.querySelector("tbody");
const productForm = document.getElementById("productForm");
const actionHeader = document.getElementById("actionHeader");
const loadingIndicator = document.getElementById("loadingIndicator");
const loadingAddIndicator = document.getElementById("loadingAddIndicator");
const role = localStorage.getItem("userRole");

// Hide the Action column if not admin
if (role !== "admin" && actionHeader) {
  actionHeader.style.display = "none";
}

// Utility delay function (500ms)
function delay(ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Show main loading indicator with optional message
function showLoading(message = "Loading products...") {
  if (loadingIndicator) {
    loadingIndicator.textContent = message;
    loadingIndicator.classList.remove("hidden");
  }
}

// Hide main loading indicator
function hideLoading() {
  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }
}

// Show add-product loading indicator
function showAddLoading(message = "Adding product...") {
  if (loadingAddIndicator) {
    loadingAddIndicator.textContent = message;
    loadingAddIndicator.classList.remove("hidden");
  }
}

// Hide add-product loading indicator
function hideAddLoading() {
  if (loadingAddIndicator) {
    loadingAddIndicator.classList.add("hidden");
  }
}

// Load all products on page load
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  const formPanel = document.querySelector(".form-panel");
  if (role !== "admin" && formPanel) {
    formPanel.style.display = "none";
  }
});

// Fetch and display products
async function loadProducts() {
  showLoading("Loading products...");
  try {
    const res = await authFetch(API_BASE);
    await delay(500);

    if (!res) {
      tbody.innerHTML = "<tr><td colspan='5'>Failed to load products.</td></tr>";
      hideLoading();
      return;
    }

    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      renderProducts(result.data);
    } else {
      tbody.innerHTML = "<tr><td colspan='5'>No products found.</td></tr>";
    }
  } catch (err) {
    console.error("Error loading products:", err);
    tbody.innerHTML = "<tr><td colspan='5'>Error loading products.</td></tr>";
  } finally {
    hideLoading();
  }
}

// Render products in the table
function renderProducts(products) {
  if (!Array.isArray(products)) {
    console.error("renderProducts error:", products);
    tbody.innerHTML = "<tr><td colspan='5'>Invalid product list.</td></tr>";
    return;
  }

  tbody.innerHTML = "";

  products.forEach(product => {
    const row = document.createElement("tr");

    let rowHTML = `
      <td>${product.productCode}</td>
      <td>${product.name}</td>
      <td>${product.version}</td>
      <td>${product.releaseDate}</td>
    `;

    if (role === "admin") {
      rowHTML += `
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteProduct(event, '${product.productCode}')">Delete</button>
        </td>
      `;
    } else {
      rowHTML += `<td style="display:none;"></td>`; // Empty cell, hidden
    }

    row.innerHTML = rowHTML;
    tbody.appendChild(row);
  });
}

// Handle add product form submission
productForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const product = {
    productCode: document.getElementById("code").value.trim(),
    name: document.getElementById("name").value.trim(),
    version: parseFloat(document.getElementById("version").value),
    releaseDate: document.getElementById("releaseDate").value,
  };

  if (!product.productCode || !product.name || isNaN(product.version) || !product.releaseDate) {
    alert("Please fill out all fields correctly.");
    return;
  }

  showAddLoading("Adding product...");
  try {
    const res = await authFetch(`${API_BASE}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    await delay(500);

    if (!res) {
      alert("Failed to add product.");
      hideAddLoading();
      return;
    }

    const result = await res.json();

    if (res.ok) {
      alert("Product added successfully.");
      productForm.reset();
      loadProducts();
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    console.error("Add product error:", err);
    alert("An error occurred while adding the product.");
  } finally {
    hideAddLoading();
  }
});

// Delete product function (only admin will have access to this)
window.deleteProduct = async function (event, productCode) {
  const button = event.target;

  if (!confirm(`Are you sure you want to delete product "${productCode}"?`)) return;

  // Disable the button and show loading text
  button.disabled = true;
  const originalText = button.textContent;
  button.textContent = "Deleting...";

  try {
    const res = await authFetch(`${API_BASE}/delete/${productCode}`, {
      method: "DELETE",
    });

    await delay(500);

    if (!res) {
      alert("Failed to delete product.");
      button.disabled = false;
      button.textContent = originalText;
      return;
    }

    const result = await res.json();

    if (res.ok) {
      alert("Product deleted successfully.");
      loadProducts();
    } else {
      alert("Delete failed: " + result.message);
      button.disabled = false;
      button.textContent = originalText;
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("An error occurred while deleting the product.");
    button.disabled = false;
    button.textContent = originalText;
  }
};
