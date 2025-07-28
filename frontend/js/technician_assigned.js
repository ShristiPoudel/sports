import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tableBody = document.querySelector("#assigned-incidents-table tbody");
  const loadingIndicator = document.getElementById("assignedLoading");

  function showLoading(message = "Loading incidents...") {
    loadingIndicator.textContent = message;
    loadingIndicator.classList.remove("hidden");
  }

  function hideLoading() {
    loadingIndicator.classList.add("hidden");
  }

  showLoading();

  try {
    const response = await authFetch("/api/incidents/assigned");

    if (!response.ok) {
      throw new Error("Failed to fetch assigned incidents");
    }

    const result = await response.json();

    // Optional delay for UX consistency
    await new Promise(resolve => setTimeout(resolve, 500));

    const incidents = result.data;

    if (!incidents || incidents.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No assigned incidents found.</td></tr>`;
    } else {
      incidents.forEach(incident => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${incident.title}</td>
          <td>${incident.description}</td>
          <td>${incident.customerID}</td>
          <td>${new Date(incident.dateOpened).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error("Error fetching incidents:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error loading incidents.</td></tr>`;
  } finally {
    hideLoading();
  }
});
