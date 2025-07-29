import { authFetch } from "./utils/authFetch.js";
//Delat
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// function to Show/Hide loading messages
function showRegisterLoading(msg = "Loading...") {
  const indicator = document.getElementById("registerLoadingIndicator");
  if (indicator) {
    indicator.textContent = msg;
    indicator.classList.remove("hidden");
  }
}
function hideRegisterLoading() {
  const indicator = document.getElementById("registerLoadingIndicator");
  if (indicator) indicator.classList.add("hidden");
}
function showSubmitLoading() {
  const loading = document.getElementById("submitLoading");
  if (loading) loading.classList.remove("hidden");
}
function hideSubmitLoading() {
  const loading = document.getElementById("submitLoading");
  if (loading) loading.classList.add("hidden");
}

document.addEventListener("DOMContentLoaded", async () => {
  const productSelect = document.getElementById("productCode");
  const customerNameSpan = document.querySelector(".customer-name");
  const registerBtn = document.getElementById("registerBtn");
  const successPanel = document.querySelector(".success-panel");
  const registrationPanel = document.querySelector(".registration-panel");
  const successMessage = document.getElementById("successMessage");
  const registerAnotherBtn = document.getElementById("registerAnother");
  const registeredProductsContainer = document.querySelector(".registered-products-container");

  if (
    !productSelect ||
    !customerNameSpan ||
    !registerBtn ||
    !registeredProductsContainer ||
    !registrationPanel ||
    !successPanel ||
    !successMessage ||
    !registerAnotherBtn
  ) {
    console.error("Required elements not found");
    return;
  }

  let customer = null;

  try {
    // Show loading while fetching customer and products
    showRegisterLoading("Fetching customer info...");

    // 1. Fetch current customer info
    const res = await authFetch("/api/customers/me");
    await delay();
    const data = await res.json();

    if (!data.exists) {
      throw new Error(data.message || "Customer profile not found");
    }

    customer = data.data;
    customerNameSpan.textContent = `${customer.firstName} ${customer.lastName}`;

    // 2. Load product list
    showRegisterLoading("Loading products...");
    const productRes = await authFetch("/api/products");
    await delay();
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
    await loadRegisteredProducts(customer.customerID);
  } catch (err) {
    console.error("Initialization failed:", err);
    alert("Initialization failed: " + err.message);
    return;
  } finally {
    hideRegisterLoading();
  }

  // 4. Register button click
  registerBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const productCode = productSelect.value;

    if (!productCode) {
      alert("Please select a product to register.");
      return;
    }

    const body = {
      customerID: customer.customerID,
      productCode,
    };

    registerBtn.disabled = true;
    showSubmitLoading();

    try {
      const res = await authFetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      await delay();
      const result = await res.json();

      if (res.ok && result.success) {
        successMessage.textContent = "Product registered successfully!";
        registrationPanel.classList.add("hidden");
        successPanel.classList.remove("hidden");

        await loadRegisteredProducts(customer.customerID);
      } else {
        alert(result.message || "Product registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert("Failed to register product. Try again.");
    } finally {
      registerBtn.disabled = false;
      hideSubmitLoading();
    }
  });

  // 5. Register another product
  registerAnotherBtn.addEventListener("click", () => {
    productSelect.selectedIndex = 0;
    registrationPanel.classList.remove("hidden");
    successPanel.classList.add("hidden");
  });

  // Helper to load and display registered products
  async function loadRegisteredProducts(customerID) {
    try {
      showRegisterLoading("Loading your registered products...");
      const res = await authFetch(`/api/registrations/${customerID}`);
      await delay();
      const data = await res.json();

      if (res.ok && data.success) {
        const products = data.data;

        if (!products.length) {
          registeredProductsContainer.innerHTML = "<p>No products are registered yet.</p>";
        } else {
          registeredProductsContainer.innerHTML = products
            .map(
              (product) => `<p>${product.name} - Version: ${product.version}</p>`
            )
            .join("");
        }
      } else {
        registeredProductsContainer.innerHTML =
          "<p>Could not load registered products.</p>";
      }
    } catch (err) {
      console.error("Error loading registered products:", err);
      registeredProductsContainer.innerHTML =
        "<p>Error loading registered products.</p>";
    } finally {
      hideRegisterLoading();
    }
  }
});
