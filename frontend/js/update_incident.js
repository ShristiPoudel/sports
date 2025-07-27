import { authFetch } from './utils/authFetch.js';

const API_URL = "/api";

const incidentsTableBody = document.querySelector(".incidents-panel tbody");
const updatePanel = document.querySelector(".update-panel");
const successPanel = document.querySelector(".success-panel");
const descriptionInput = document.getElementById("description");
const closeCheckbox = document.getElementById("closeIncident");
const updateBtn = updatePanel.querySelector(".btn-primary");
const cancelBtn = updatePanel.querySelector(".btn-secondary");

let selectedIncident = null;

// Load incidents for the logged-in technician on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTechnicianIncidents();
});

async function loadTechnicianIncidents() {
  try {
    const res = await authFetch(`${API_URL}/incidents/assigned`);
    const result = await res.json();

    if (!res.ok || !result.success) throw new Error(result.message);

    const incidents = result.data;
    renderIncidentsTable(incidents);
  } catch (err) {
    console.error("Error fetching assigned incidents:", err);
    alert("Unable to load your assigned incidents.");
  }
}

function renderIncidentsTable(incidents) {
  incidentsTableBody.innerHTML = "";

  if (incidents.length === 0) {
    incidentsTableBody.innerHTML = "<tr><td colspan='6'>You have no assigned incidents.</td></tr>";
    return;
  }

  incidents.forEach((incident) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${incident.incidentID}</td>
      <td>${incident.Customer ? incident.Customer.firstName + ' ' + incident.Customer.lastName : 'N/A'}</td>
      <td>${incident.Product ? incident.Product.productCode : 'N/A'}</td>
      <td>${new Date(incident.dateOpened).toLocaleDateString()}</td>
      <td>${incident.title}</td>
      <td><button class="btn btn-primary" data-id="${incident.incidentID}">Select</button></td>
    `;
    row.querySelector("button").addEventListener("click", () => {
      loadIncidentForEdit(incident);
    });
    incidentsTableBody.appendChild(row);
  });
}

function loadIncidentForEdit(incident) {
  selectedIncident = incident;

  const detailValues = updatePanel.querySelectorAll(".detail-value");
  detailValues[0].textContent = incident.incidentID;
  detailValues[1].textContent = incident.Customer ? `${incident.Customer.firstName} ${incident.Customer.lastName}` : "N/A";
  detailValues[2].textContent = incident.Product ? `${incident.Product.productCode} (${incident.Product.name})` : "N/A";
  detailValues[3].textContent = new Date(incident.dateOpened).toLocaleDateString();
  detailValues[4].textContent = incident.title;

  descriptionInput.value = incident.description || "";
  closeCheckbox.checked = false;

  updatePanel.classList.remove("hidden");
  successPanel.classList.add("hidden");
  updatePanel.scrollIntoView({ behavior: "smooth" });
}

// Handle update
updateBtn.addEventListener("click", async () => {
  if (!selectedIncident) return alert("No incident selected");

  const description = descriptionInput.value.trim();
  if (!description) return alert("Description is required.");

  const body = {
    description,
    dateClosed: closeCheckbox.checked ? new Date().toISOString() : null,
  };

  try {
    const res = await authFetch(`${API_URL}/incidents/${selectedIncident.incidentID}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message);

    updatePanel.classList.add("hidden");
    successPanel.querySelector(".alert p").textContent = `Incident ${selectedIncident.incidentID} updated successfully.`;
    successPanel.classList.remove("hidden");

    // Reset and reload list from server
    selectedIncident = null;
    await loadTechnicianIncidents();  
  } catch (err) {
    console.error("Error updating incident:", err);
    alert("Failed to update incident.");
  }
});

// Handle cancel
cancelBtn.addEventListener("click", () => {
  updatePanel.classList.add("hidden");
  successPanel.classList.add("hidden");
  selectedIncident = null;
});
