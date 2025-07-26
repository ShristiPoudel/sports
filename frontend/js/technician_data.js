document.addEventListener("DOMContentLoaded", async () => {
  const userID = localStorage.getItem("userID");
  const role = localStorage.getItem("userRole");
  const token = localStorage.getItem("accessToken");

  // Redirect if not technician or not logged in
  if (!userID || role !== "technician" || !token) {
    window.location.href = "login.html";
    return;
  }

  try {
    // Check if technician profile already exists
    const res = await fetch("/api/technicians/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (res.ok) {
      // Technician profile exists, redirect to home or dashboard
      window.location.href = "index.html";
      return;
    } else if (res.status !== 404) {
      // Unexpected error other than 404
      throw new Error(`Unexpected response status: ${res.status}`);
    }
    // If 404, allow form to be filled and submitted
  } catch (err) {
    console.error("Error checking technician profile:", err);
    alert("Error verifying technician profile.");
    return;
  }

  // If technician doesn't exist, allow form submission
  const technicianForm = document.getElementById("technicianForm");

  technicianForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      userID: Number(userID),
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      phone: document.getElementById("phone").value,
    };

    try {
      const res = await fetch("/api/technicians/add", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();
      console.log("response:", result);

      if (res.ok) {
        alert("Technician profile created successfully.");
        window.location.href = "index.html";  // Or change to preferred landing page
      } else {
        console.error("Server returned error:", result);
        alert(result.message || JSON.stringify(result) || "Failed to create technician profile.");
      }
    } catch (err) {
      console.error("Network or JS error:", err);
      alert("Network error while submitting form.");
    }
  });
});
