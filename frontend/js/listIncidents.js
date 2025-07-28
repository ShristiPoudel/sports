import { authFetch } from "./utils/authFetch.js";

const INCIDENTS_API = "/api/incidents";
const tbody = document.getElementById("incidentsTableBody");
const loadingIndicator = document.getElementById("loadingIndicator");

document.addEventListener("DOMContentLoaded", () => {
  loadIncidentList();
});

function showLoading(message = "Loading, please wait...") {
  if (loadingIndicator) {
    loadingIndicator.textContent = message;
    loadingIndicator.classList.remove("hidden");
  }
}

function hideLoading() {
  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function loadIncidentList() {
  showLoading("Loading incidents...");

  try {
    const res = await authFetch(INCIDENTS_API);
    await delay(500);

    if (!res || !res.ok) {
      tbody.innerHTML = "<tr><td colspan='7'>Failed to load incidents.</td></tr>";
      return;
    }

    let json;
    try {
      json = await res.json();
    } catch (err) {
      console.error("Error parsing JSON:", err);
      tbody.innerHTML = "<tr><td colspan='7'>Invalid server response.</td></tr>";
      return;
    }

    if (!json.success || !Array.isArray(json.data)) {
      tbody.innerHTML = "<tr><td colspan='7'>Failed to load incidents.</td></tr>";
      return;
    }

    const incidents = json.data;

    if (incidents.length === 0) {
      tbody.innerHTML = "<tr><td colspan='7'>No incidents found.</td></tr>";
      return;
    }

    // Clear table
    tbody.innerHTML = "";

    // Render incidents
    incidents.forEach((inc) => {
      const row = document.createElement("tr");

      const dateOpenedFormatted = new Date(inc.dateOpened).toLocaleDateString();
      const dateClosedFormatted = inc.dateClosed
        ? new Date(inc.dateClosed).toLocaleDateString()
        : "-";

      row.innerHTML = `
        <td>${inc.incidentID}</td>
        <td>${inc.Customer?.firstName || ""} ${inc.Customer?.lastName || ""}</td>
        <td>${inc.Product?.productCode || ""}</td>
        <td>${inc.Technician ? `${inc.Technician.firstName} ${inc.Technician.lastName}` : "Unassigned"}</td>
        <td>${dateOpenedFormatted}</td>
        <td>${dateClosedFormatted}</td>
        <td>${inc.title || "-"}</td>
      `;

      tbody.appendChild(row);
    });
  } catch (err) {
    console.error("Unexpected error loading incidents:", err);
    tbody.innerHTML = "<tr><td colspan='7'>Unexpected error occurred.</td></tr>";
  } finally {
    hideLoading();
  }
}
