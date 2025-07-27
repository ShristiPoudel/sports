import { authFetch } from './utils/authFetch.js';

const API_BASE = "/api/products";

// Select elements
const tbody = document.querySelector("tbody");
const productForm = document.getElementById("productForm");
const actionHeader = document.getElementById("actionHeader");
const role = localStorage.getItem("userRole");

// Hide the Action column if not admin
if (role !== "admin" && actionHeader) {
  actionHeader.style.display = "none";
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
  try {
    const res = await authFetch(API_BASE);
    if (!res) return;

    const result = await res.json();

    if (result.success && Array.isArray(result.data)) {
      renderProducts(result.data);
    } else {
      tbody.innerHTML = "<tr><td colspan='5'>No products found.</td></tr>";
    }
  } catch (err) {
    console.error("Error loading products:", err);
    tbody.innerHTML = "<tr><td colspan='5'>Error loading products.</td></tr>";
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
          <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.productCode}')">Delete</button>
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

  try {
    const res = await authFetch(`${API_BASE}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!res) return;

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
  }
});

// Delete product function (only admin will have access to this)
window.deleteProduct = async function (productCode) {
  if (!confirm(`Are you sure you want to delete product "${productCode}"?`)) return;

  try {
    const res = await authFetch(`${API_BASE}/delete/${productCode}`, {
      method: "DELETE",
    });
    if (!res) return;

    const result = await res.json();

    if (res.ok) {
      alert("Product deleted successfully.");
      loadProducts();
    } else {
      alert("Delete failed: " + result.message);
    }
  } catch (err) {
    console.error("Delete error:", err);
    alert("An error occurred while deleting the product.");
  }
};
