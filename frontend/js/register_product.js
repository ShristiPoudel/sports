import { authFetch } from "./utils/authFetch.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productSelect = document.getElementById("product"); // Product select dropdown
  const customerNameSpan = document.querySelector(".customer-name"); // Display customer name
  const registerBtn = document.getElementById("registerBtn"); // Register button
  const successPanel = document.querySelector(".success-panel"); // Success message panel
  const registrationPanel = document.querySelector(".registration-panel"); // Registration form panel
  const successMessage = document.getElementById("successMessage"); // Success message text
  const registerAnotherBtn = document.getElementById("registerAnother"); // Button to register another product
  const registeredProductsContainer = document.querySelector(".registered-products-container"); // Container for registered products

  if (!productSelect || !customerNameSpan || !registerBtn || !registeredProductsContainer) {
    console.error("Required elements not found");
    return;
  }

  let customer = null;

  try {
    // 1. Fetch current customer
    const res = await authFetch("/api/customers/me");
    const data = await res.json();

    if (!data.exists) {
      throw new Error(data.message || "Customer profile not found");
    }

    customer = data.data;
    customerNameSpan.textContent = `${customer.firstName} ${customer.lastName}`;

    // 2. Load product list
    const productRes = await authFetch("/api/products");
    const productData = await productRes.json();

    if (!productData.success) {
      throw new Error(productData.message || "Failed to fetch products");
    }

    productData.data.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.productCode;
      option.textContent = product.name;
      productSelect.appendChild(option);
    });

    // 3. Fetch and display the products already registered by the customer
    const registeredProductsRes = await authFetch(`/api/registrations/${customer.customerID}`);
    const registeredProductsData = await registeredProductsRes.json();

    if (registeredProductsRes.ok && registeredProductsData.success) {
      const registeredProducts = registeredProductsData.data;

      // Display registered products as simple text
      if (registeredProducts.length === 0) {
        registeredProductsContainer.innerHTML = "<p>No products are registered yet.</p>";
      } else {
        let productText = '';
        registeredProducts.forEach((product) => {
          productText += `<p>${product.name} - Version: ${product.version}</p>`;
        });

        registeredProductsContainer.innerHTML = productText;
      }
    }

  } catch (err) {
    console.error("Initialization failed:", err);
    alert("Initialization failed: " + err.message);
    return;
  }

  // 4. Register button click
  registerBtn.addEventListener("click", async () => {
    const productCode = productSelect.value;

    if (!productCode) {
      alert("Please select a product to register.");
      return;
    }

    const body = {
      customerID: customer.customerID,
      productCode,
    };

    try {
      const res = await authFetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.ok) {
        successMessage.textContent = "Product registered successfully!";
        registrationPanel.classList.add("hidden");
        successPanel.classList.remove("hidden");

        // Refresh the list of registered products
        const registeredProductsRes = await authFetch(`/api/registrations/${customer.customerID}`);
        const registeredProductsData = await registeredProductsRes.json();

        if (registeredProductsRes.ok && registeredProductsData.success) {
          const registeredProducts = registeredProductsData.data;

          // Display registered products as simple text
          if (registeredProducts.length === 0) {
            registeredProductsContainer.innerHTML = "<p>No products are registered yet.</p>";
          } else {
            let productText = '';
            registeredProducts.forEach((product) => {
              productText += `<p>${product.name} - Version: ${product.version}</p>`;
            });

            registeredProductsContainer.innerHTML = productText;
          }
        }
      } else {
        alert(result.message || "Product registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Failed to register product. Try again.");
    }
  });

  // 5. Register another product
  registerAnotherBtn.addEventListener("click", () => {
    productSelect.selectedIndex = 0;
    registrationPanel.classList.remove("hidden");
    successPanel.classList.add("hidden");
  });
});
