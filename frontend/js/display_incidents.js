import { authFetch } from "./utils/authFetch.js";

//API end points
const INCIDENTS_API = "/api/incidents";
const TECH_API = "/api/technicians";
const CUST_API = "/api/customers";
const PROD_API = "/api/products";

// DOM Elements
const tbody = document.getElementById("incidentsTableBody");
const technicianSelect = document.getElementById("technician");
const customerSelect = document.getElementById("customer");
const productSelect = document.getElementById("product");
const statusSelect = document.getElementById("status");
const filterBtn = document.getElementById("filterBtn");

const detailIncidentID = document.getElementById("detailIncidentID");
const detailCustomer = document.getElementById("detailCustomer");
const detailProduct = document.getElementById("detailProduct");
const detailTechnician = document.getElementById("detailTechnician");
const detailDateOpened = document.getElementById("detailDateOpened");
const detailDateClosed = document.getElementById("detailDateClosed");
const detailTitle = document.getElementById("detailTitle");
const detailDescription = document.getElementById("detailDescription");

const loadingIndicator = document.getElementById("loadingIndicator");

let allIncidents = [];

// Utility: loading controls
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

// Initial load
document.addEventListener("DOMContentLoaded", async () => {
  await loadTechnicians();
  await loadCustomers();
  await loadProducts();
  await loadIncidents();
});

// Load technicians
async function loadTechnicians() {
  showLoading("Loading technicians...");
  try {
    const response = await authFetch(TECH_API);
    await delay(500);
    if (!response.ok) throw new Error(`Technician API Error: ${response.status}`);
    const result = await response.json();
    const technicians = result.data || [];

    technicians.forEach(tech => {
      const option = document.createElement("option");
      option.value = tech.techID;
      option.textContent = `${tech.firstName} ${tech.lastName}`;
      technicianSelect.appendChild(option);
    });

    console.log("Technicians loaded:", technicians.length);
  } catch (error) {
    console.error("loadTechnicians error:", error);
  } finally {
    hideLoading();
  }
}

// Load customers
async function loadCustomers() {
  showLoading("Loading customers...");
  try {
    const response = await authFetch(CUST_API);
    await delay(500);
    if (!response.ok) throw new Error(`Customer API Error: ${response.status}`);
    const result = await response.json();
    const customers = result.data || [];

    customers.forEach(cust => {
      const option = document.createElement("option");
      option.value = cust.customerID;
      option.textContent = `${cust.firstName} ${cust.lastName}`;
      customerSelect.appendChild(option);
    });

    console.log("Customers loaded:", customers.length);
  } catch (error) {
    console.error("loadCustomers error:", error);
  } finally {
    hideLoading();
  }
}

// Load products
async function loadProducts() {
  showLoading("Loading products...");
  try {
    const response = await authFetch(PROD_API);
    await delay(500);
    if (!response.ok) throw new Error(`Product API Error: ${response.status}`);
    const result = await response.json();
    const products = result.data || [];

    products.forEach(prod => {
      const option = document.createElement("option");
      option.value = prod.productCode;
      option.textContent = `${prod.productCode} (${prod.name})`;
      productSelect.appendChild(option);
    });

    console.log("Products loaded:", products.length);
  } catch (error) {
    console.error("loadProducts error:", error);
  } finally {
    hideLoading();
  }
}

// Load incidents
async function loadIncidents() {
  showLoading("Loading incidents...");
  try {
    const response = await authFetch(INCIDENTS_API);
    await delay(500);
    if (!response.ok) throw new Error(`Incident API Error: ${response.status}`);
    const result = await response.json();
    allIncidents = result.data || [];

    renderIncidents(allIncidents);
    console.log("Incidents loaded:", allIncidents.length);
  } catch (error) {
    console.error("loadIncidents error:", error);
    tbody.innerHTML = "<tr><td colspan='7'>Failed to load incidents.</td></tr>";
  } finally {
    hideLoading();
  }
}

// Render incidents into table
function renderIncidents(incidents) {
  tbody.innerHTML = "";

  if (!incidents.length) {
    tbody.innerHTML = "<tr><td colspan='7'>No incidents found.</td></tr>";
    return;
  }

  incidents.forEach(incident => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${incident.incidentID}</td>
      <td>${incident.Customer?.firstName || ""} ${incident.Customer?.lastName || ""}</td>
      <td>${incident.Product?.productCode || ""}</td>
      <td>${incident.Technician ? `${incident.Technician.firstName} ${incident.Technician.lastName}` : 'Unassigned'}</td>
      <td>${incident.dateOpened?.split("T")[0] || ""}</td>
      <td>${incident.dateClosed?.split("T")[0] || "-"}</td>
      <td>${incident.title || ""}</td>
    `;
    row.addEventListener("click", () => {
      showIncidentDetails(incident.incidentID);
    });
    tbody.appendChild(row);
  });
}

// Show selected incident details
function showIncidentDetails(id) {
  const incident = allIncidents.find(i => i.incidentID == id);
  if (!incident) return;

  detailIncidentID.textContent = `#${incident.incidentID}`;
  detailCustomer.textContent = `${incident.Customer?.firstName || "-"} ${incident.Customer?.lastName || ""} (${incident.Customer?.email || "-"})`;
  detailProduct.textContent = `${incident.Product?.productCode || "-"} (${incident.Product?.name || "-"})`;
  detailTechnician.textContent = incident.Technician
    ? `${incident.Technician.firstName} ${incident.Technician.lastName} (${incident.Technician.email || "-"})`
    : "Unassigned";
  detailDateOpened.textContent = incident.dateOpened?.split("T")[0] || "-";
  detailDateClosed.textContent = incident.dateClosed?.split("T")[0] || "Still Open";
  detailTitle.textContent = incident.title || "-";
  detailDescription.textContent = incident.description || "-";

  document.querySelector(".incident-details-panel").scrollIntoView({ behavior: "smooth" });
}

// Filter incidents
filterBtn.addEventListener("click", async () => {
  showLoading("Filtering incidents...");
  await delay(500);

  const techID = technicianSelect.value;
  const custID = customerSelect.value;
  const prodCode = productSelect.value;
  const status = statusSelect.value;

  const filtered = allIncidents.filter(incident => {
    return (
      (!techID || incident.techID == techID) &&
      (!custID || incident.customerID == custID) &&
      (!prodCode || incident.productCode == prodCode) &&
      (!status ||
        (status === "open" && !incident.dateClosed) ||
        (status === "closed" && incident.dateClosed))
    );
  });

  renderIncidents(filtered);

  if (filtered.length > 0) {
    showIncidentDetails(filtered[0].incidentID);
  } else {
    detailIncidentID.textContent = "-";
    detailCustomer.textContent = "-";
    detailProduct.textContent = "-";
    detailTechnician.textContent = "-";
    detailDateOpened.textContent = "-";
    detailDateClosed.textContent = "-";
    detailTitle.textContent = "-";
    detailDescription.textContent = "No incident matches the selected filters.";
  }

  hideLoading();
});
