document.addEventListener("DOMContentLoaded", async () => {
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("accessToken");

  // Redirect if not customer or not logged in
  if (!userID || role !== "customer" || !token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Check if customer profile already exists
    const res = await fetch("/api/customers/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      // Customer profile exists, redirect to home
      window.location.href = "index.html";
      return;
    } else if (res.status !== 404) {
      // If error is not "Not Found", something went wrong
      throw new Error(`Unexpected response status: ${res.status}`);
    }
    // If 404, continue and allow form to be filled
  } catch (err) {
    console.error("Error checking customer profile:", err);
    alert("Error verifying customer profile.");
    return;
  }

  // If customer doesn't exist, allow form submission
  const customerForm = document.getElementById("customerForm");

  customerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      userID: Number(userID),
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      state: document.getElementById("state").value,
      postalCode: document.getElementById("postalCode").value,
      phone: document.getElementById("phone").value,
      countryCode: document.getElementById("countryCode").value,
    };

    try {
      const res = await fetch("/api/customers/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
    
      const result = await res.json();
      console.log("response:", result);
    
      if (res.ok) {
        alert("Customer profile created successfully.");
        window.location.href = "index.html";
      } else {
        console.error("Server returned error:", result);
        alert(result.message || JSON.stringify(result) || "Failed to create customer profile.");
      }
    } catch (err) {
      console.error("Network or JS error:", err);
      alert("Network error while submitting form.");
    }
    
  });
});
