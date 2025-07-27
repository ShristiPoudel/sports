import { authFetch } from "./utils/authFetch.js";

const INCIDENTS_API = "/api/incidents";
const tbody = document.getElementById("incidentsTableBody");

loadIncidentList();

async function loadIncidentList() {
  const res = await authFetch(INCIDENTS_API);

  // Check if fetch failed or returned an error status
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

  // Check response structure
  if (!json.success || !Array.isArray(json.data)) {
    tbody.innerHTML = "<tr><td colspan='7'>Failed to load incidents.</td></tr>";
    return;
  }

  const incidents = json.data;

  // Handle no incidents
  if (incidents.length === 0) {
    tbody.innerHTML = "<tr><td colspan='7'>No incidents found.</td></tr>";
    return;
  }

  // Render each incident
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
}
