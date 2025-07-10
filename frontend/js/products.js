const API_BASE = "/api/products"; // API for all products

// Select elements
const tbody = document.querySelector("tbody");
const productForm = document.getElementById("productForm");

// Load all products on page load
loadProducts();

// Fetch and display products
async function loadProducts() {
  try {
    const res = await fetch(API_BASE);
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
    console.error("renderProducts", products);
    tbody.innerHTML = "<tr><td colspan='5'>Invalid product list.</td></tr>";
    return;
  }
  tbody.innerHTML = "";
  products.forEach(product => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${product.productCode}</td>
      <td>${product.name}</td>
      <td>${product.version}</td>
      <td>${product.releaseDate}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product.productCode}')">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}


// Handle add product form submission
productForm.addEventListener("submit", async (e) => {
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
    const res = await fetch(`${API_BASE}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });

    const result = await res.json();

    if (res.ok) {
      alert("Product added successfully.");
      productForm.reset();
      loadProducts(); // Reload product list after adding
    } else {
      alert("Error: " + result.message);
    }
  } catch (err) {
    console.error("Add product error:", err);
    alert("An error occurred while adding the product.");
  }
});

// Delete product function
async function deleteProduct(productCode) {
  if (!confirm(`Are you sure you want to delete product "${productCode}"?`)) return;

  try {
    const res = await fetch(`${API_BASE}/delete/${productCode}`, {
      method: "DELETE",
    });

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
}
