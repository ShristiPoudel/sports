import { authFetch } from "./utils/authFetch.js";

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

let allIncidents = [];

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([loadTechnicians(), loadCustomers(), loadProducts()]);
  await loadIncidents();
});

async function loadTechnicians() {
  const res = await authFetch(TECH_API);
  if (!res || !res.ok) {
    console.error("Failed to load technicians", res);
    return;
  }
  const json = await res.json();
  const data = json.data || [];
  data.forEach(tech => {
    const opt = document.createElement("option");
    opt.value = tech.techID;
    opt.textContent = `${tech.firstName} ${tech.lastName}`;
    technicianSelect.appendChild(opt);
  });
}

async function loadCustomers() {
  const res = await authFetch(CUST_API);
  if (!res || !res.ok) {
    console.error("Failed to load customers", res);
    return;
  }
  const json = await res.json();
  const data = json.data || [];
  data.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.customerID;
    opt.textContent = `${c.firstName} ${c.lastName}`;
    customerSelect.appendChild(opt);
  });
}

async function loadProducts() {
  const res = await authFetch(PROD_API);
  if (!res || !res.ok) {
    console.error("Failed to load products", res);
    return;
  }
  const json = await res.json();
  const data = json.data || [];
  data.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.productCode;
    opt.textContent = `${p.productCode} (${p.name})`;
    productSelect.appendChild(opt);
  });
}

async function loadIncidents() {
  const res = await authFetch(INCIDENTS_API);
  if (!res || !res.ok) {
    console.error("Failed to load incidents", res);
    tbody.innerHTML = "<tr><td colspan='7'>Failed to load incidents.</td></tr>";
    return;
  }
  const json = await res.json();
  const data = json.data || [];
  allIncidents = data;
  renderIncidents(data);
}

function renderIncidents(incidents) {
  tbody.innerHTML = "";

  if (!incidents.length) {
    tbody.innerHTML = "<tr><td colspan='7'>No incidents found.</td></tr>";
    return;
  }

  incidents.forEach(inc => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${inc.incidentID}</td>
      <td>${inc.Customer?.firstName || ""} ${inc.Customer?.lastName || ""}</td>
      <td>${inc.Product?.productCode || ""}</td>
      <td>${inc.Technician ? `${inc.Technician.firstName} ${inc.Technician.lastName}` : 'Unassigned'}</td>
      <td>${inc.dateOpened?.split("T")[0] || ""}</td>
      <td>${inc.dateClosed?.split("T")[0] || "-"}</td>
      <td>${inc.title || ""}</td>
    `;
    row.addEventListener("click", () => {
      showIncidentDetails(inc.incidentID);
    });
    tbody.appendChild(row);
  });
}

function showIncidentDetails(id) {
  const inc = allIncidents.find(i => i.incidentID == id);
  if (!inc) return;

  detailIncidentID.textContent = `#${inc.incidentID}`;
  detailCustomer.textContent = `${inc.Customer?.firstName || "-"} ${inc.Customer?.lastName || ""} (${inc.Customer?.email || "-"})`;
  detailProduct.textContent = `${inc.Product?.productCode || "-"} (${inc.Product?.name || "-"})`;
  detailTechnician.textContent = inc.Technician
    ? `${inc.Technician.firstName} ${inc.Technician.lastName} (${inc.Technician.email || "-"})`
    : "Unassigned";
  detailDateOpened.textContent = inc.dateOpened?.split("T")[0] || "-";
  detailDateClosed.textContent = inc.dateClosed?.split("T")[0] || "Still Open";
  detailTitle.textContent = inc.title || "-";
  detailDescription.textContent = inc.description || "-";

  document.querySelector(".incident-details-panel").scrollIntoView({ behavior: "smooth" });
}

filterBtn.addEventListener("click", () => {
  const techID = technicianSelect.value;
  const custID = customerSelect.value;
  const prodCode = productSelect.value;
  const status = statusSelect.value;

  const filtered = allIncidents.filter(inc => {
    return (
      (!techID || inc.techID == techID) &&
      (!custID || inc.customerID == custID) &&
      (!prodCode || inc.productCode == prodCode) &&
      (!status ||
        (status === "open" && !inc.dateClosed) ||
        (status === "closed" && inc.dateClosed))
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
});
