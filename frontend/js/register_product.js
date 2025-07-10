document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "/api";
    let customerId = null;
  
    const loginPanel = document.querySelector(".login-panel");
    const registrationPanel = document.querySelector(".registration-panel");
    const successPanel = document.querySelector(".success-panel");
  
    const emailInput = document.getElementById("email");
    const loginBtn = document.getElementById("loginBtn");
    const customerNameEl = document.querySelector(".customer-name");
    const productSelect = document.getElementById("product");
    const registerBtn = document.getElementById("registerBtn");
    const successMessage = document.getElementById("successMessage");
    const registerAnotherBtn = document.getElementById("registerAnother");
  
    // Login
    loginBtn.addEventListener("click", async () => {
      const email = emailInput.value.trim();
      if (!email) return alert("Please enter your email.");
  
      try {
        const res = await fetch(`${API_BASE}/customers/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        });
  
        const data = await res.json();
  
        if (!data.success) throw new Error(data.message);
  
        const customer = data.data;
        customerId = customer.customerID;
        customerNameEl.textContent = `${customer.firstName} ${customer.lastName}`;
  
        loginPanel.classList.add("hidden");
        registrationPanel.classList.remove("hidden");
  
        loadProducts();
      } catch (err) {
        alert("Login failed: " + err.message);
      }
    });
  
    async function loadProducts() {
      try {
        const res = await fetch(`${API_BASE}/products`);
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
  
        data.data.forEach(product => {
          const option = document.createElement("option");
          option.value = product.productCode;
          option.textContent = `${product.name} ${product.version}`;
          productSelect.appendChild(option);
        });
      } catch (err) {
        alert("Failed to load products: " + err.message);
      }
    }
  
    registerBtn.addEventListener("click", async () => {
      const productCode = productSelect.value;
      if (!productCode) return alert("Please select a product.");
  
      try {
        const res = await fetch(`${API_BASE}/registrations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ customerID: customerId, productCode })
        });
  
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
  
        registrationPanel.classList.add("hidden");
        successMessage.textContent = `Product (${productCode}) was registered successfully.`;
        successPanel.classList.remove("hidden");
      } catch (err) {
        alert("Registration failed: " + err.message);
      }
    });
  
    registerAnotherBtn.addEventListener("click", () => {
      productSelect.value = "";
      successPanel.classList.add("hidden");
      registrationPanel.classList.remove("hidden");
    });
  });
  