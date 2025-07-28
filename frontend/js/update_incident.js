import { authFetch } from './utils/authFetch.js';

const API_URL = "/api";

// DOM Elements
const incidentsTableBody = document.querySelector(".incidents-panel tbody");
const updatePanel = document.querySelector(".update-panel");
const successPanel = document.querySelector(".success-panel");
const descriptionInput = document.getElementById("description");
const closeCheckbox = document.getElementById("closeIncident");
const updateBtn = updatePanel.querySelector(".btn-primary");
const cancelBtn = updatePanel.querySelector(".btn-secondary");
const loadingIndicator = document.getElementById("loadingIndicator");
const submitLoading = document.getElementById("submitLoading");

let selectedIncident = null;

// Utility functions
function showLoading(msg = "Loading...") {
  if (loadingIndicator) {
    loadingIndicator.textContent = msg;
    loadingIndicator.classList.remove("hidden");
  }
}
function hideLoading() {
  if (loadingIndicator) loadingIndicator.classList.add("hidden");
}
function showSubmitLoading() {
  if (submitLoading) submitLoading.classList.remove("hidden");
}
function hideSubmitLoading() {
  if (submitLoading) submitLoading.classList.add("hidden");
}

// Load incidents for technician
document.addEventListener("DOMContentLoaded", () => {
  loadTechnicianIncidents();
});

async function loadTechnicianIncidents() {
  showLoading("Loading your incidents...");
  try {
    const res = await authFetch(`${API_URL}/incidents/assigned`);
    const result = await res.json();

    await new Promise(resolve => setTimeout(resolve, 400)); // Optional delay

    if (!res.ok || !result.success) throw new Error(result.message);

    renderIncidentsTable(result.data);
  } catch (err) {
    console.error("Error fetching assigned incidents:", err);
    alert("Unable to load your assigned incidents.");
    incidentsTableBody.innerHTML = "<tr><td colspan='6'>Failed to load incidents.</td></tr>";
  } finally {
    hideLoading();
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

// Update incident handler
updateBtn.addEventListener("click", async () => {
  if (!selectedIncident) return alert("No incident selected");

  const description = descriptionInput.value.trim();
  if (!description) return alert("Description is required.");

  const body = {
    description,
    dateClosed: closeCheckbox.checked ? new Date().toISOString() : null,
  };

  updateBtn.disabled = true;
  showSubmitLoading();

  try {
    const res = await authFetch(`${API_URL}/incidents/${selectedIncident.incidentID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message);

    updatePanel.classList.add("hidden");
    successPanel.querySelector(".alert p").textContent = `Incident ${selectedIncident.incidentID} updated successfully.`;
    successPanel.classList.remove("hidden");

    selectedIncident = null;
    await loadTechnicianIncidents();
  } catch (err) {
    console.error("Error updating incident:", err);
    alert("Failed to update incident.");
  } finally {
    updateBtn.disabled = false;
    hideSubmitLoading();
  }
});

// Cancel update
cancelBtn.addEventListener("click", () => {
  updatePanel.classList.add("hidden");
  successPanel.classList.add("hidden");
  selectedIncident = null;
});
