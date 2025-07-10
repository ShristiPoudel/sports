const API_URL = "/api";

// DOM elements
const technicianSelect = document.getElementById("technician");
const getIncidentsBtn = document.querySelector(".technician-panel button");
const incidentsTableBody = document.querySelector(".incidents-panel tbody");
const updatePanel = document.querySelector(".update-panel");
const successPanel = document.querySelector(".success-panel");
const descriptionInput = document.getElementById("description");
const closeCheckbox = document.getElementById("closeIncident");
const updateBtn = updatePanel.querySelector(".btn-primary");
const cancelBtn = updatePanel.querySelector(".btn-secondary");

let selectedIncident = null;

// Load technicians on page load
document.addEventListener("DOMContentLoaded", () => {
  loadTechnicians();
});

async function loadTechnicians() {
  try {
    const res = await fetch(`${API_URL}/technicians`);
    const result = await res.json();

    if (!res.ok || !result.success) throw new Error(result.message);

    technicianSelect.innerHTML = '<option value="">-- Select a Technician --</option>';
    result.data.forEach((tech) => {
      const opt = document.createElement("option");
      opt.value = tech.techID;
      opt.textContent = `${tech.firstName} ${tech.lastName} (${tech.email})`;
      technicianSelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Failed to load technicians:", err);
    alert("Unable to load technicians.");
  }
}

// Handle "Get Incidents" button
getIncidentsBtn.addEventListener("click", async () => {
  const techID = technicianSelect.value;
  if (!techID) return alert("Please select a technician.");

  try {
    const res = await fetch(`${API_URL}/incidents`);
    const result = await res.json();

    if (!res.ok || !result.success) throw new Error(result.message);

    const incidents = result.data.filter((i) => i.techID == techID);
    renderIncidentsTable(incidents);
  } catch (err) {
    console.error("Error fetching incidents:", err);
    alert("Failed to fetch incidents.");
  }
});

function renderIncidentsTable(incidents) {
  incidentsTableBody.innerHTML = "";

  if (incidents.length === 0) {
    incidentsTableBody.innerHTML = "<tr><td colspan='6'>No incidents assigned to this technician.</td></tr>";
    return;
  }

  incidents.forEach((incident) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${incident.incidentID}</td>
      <td>${incident.Customer.firstName} ${incident.Customer.lastName}</td>
      <td>${incident.Product.productCode}</td>
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
  if (detailValues.length < 5) {
    console.error("Missing detail-value elements");
    return;
  }

  detailValues[0].textContent = incident.incidentID;
  detailValues[1].textContent = `${incident.Customer.firstName} ${incident.Customer.lastName} (${incident.Customer.email})`;
  detailValues[2].textContent = `${incident.Product.productCode} (${incident.Product.name} Version ${incident.Product.version})`;
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
    dateClosed: closeCheckbox.checked ? new Date() : null,
  };

  try {
    const res = await fetch(`${API_URL}/incidents/${selectedIncident.incidentID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message);

    updatePanel.classList.add("hidden");
    successPanel.querySelector(".alert p").textContent = `Incident #${selectedIncident.incidentID} updated successfully.`;
    successPanel.classList.remove("hidden");

    selectedIncident = null;
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
