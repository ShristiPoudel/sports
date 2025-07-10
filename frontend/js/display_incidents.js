const INCIDENTS_API = "/api/incidents";
const TECH_API = "/api/technicians";
const CUST_API = "/api/customers";
const PROD_API = "/api/products";

// Elements
const tbody = document.querySelector("tbody");
const technicianSelect = document.getElementById("technician");
const customerSelect = document.getElementById("customer");
const productSelect = document.getElementById("product");
const statusSelect = document.getElementById("status");
const filterBtn = document.querySelector(".btn-primary");
const incidentDetailPanel = document.querySelector(".incident-details-panel");

let allIncidents = [];

// Load all data on start
loadDropdowns();
loadIncidents();

async function loadDropdowns() {
  await Promise.all([loadTechnicians(), loadCustomers(), loadProducts()]);
}

async function loadTechnicians() {
  const res = await fetch(TECH_API);
  const result = await res.json();
  const techs = result.data;

  techs.forEach(tech => {
    const opt = document.createElement("option");
    opt.value = tech.techID;
    opt.textContent = `${tech.firstName} ${tech.lastName}`;
    technicianSelect.appendChild(opt);
  });
}

async function loadCustomers() {
  const res = await fetch(CUST_API);
  const result = await res.json();
  const customers = result.data;

  customers.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.customerID;
    opt.textContent = `${c.firstName} ${c.lastName}`;
    customerSelect.appendChild(opt);
  });
}

async function loadProducts() {
  const res = await fetch(PROD_API);
  const result = await res.json();
  const products = result.data;

  products.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.productCode;
    opt.textContent = `${p.productCode} (${p.name})`;
    productSelect.appendChild(opt);
  });
}

async function loadIncidents() {
    const res = await fetch(INCIDENTS_API);
    const result = await res.json();
    const data = result.data;
  
    allIncidents = data;
    renderIncidents(data); //  render full list
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
      <td>${inc.title}</td>
    `;
    tbody.appendChild(row);
  });


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
  
    if (filtered.length > 0) {
      showIncidentDetails(filtered[0].incidentID);
    } else {
      incidentDetailPanel.innerHTML = "<p>No incident matches the selected filters.</p>";
    }
  });
  
  
function showIncidentDetails(id) {
  const inc = allIncidents.find(i => i.incidentID == id);
  if (!inc) return;

  incidentDetailPanel.innerHTML = `
    <h3>Incident #${inc.incidentID} Details</h3>
    <div class="incident-details">
      <div class="detail-row"><div class="detail-label">Customer:</div><div class="detail-value">${inc.Customer?.firstName} ${inc.Customer?.lastName} (${inc.Customer?.email})</div></div>
      <div class="detail-row"><div class="detail-label">Product:</div><div class="detail-value">${inc.Product?.productCode} (${inc.Product?.name})</div></div>
      <div class="detail-row"><div class="detail-label">Technician:</div><div class="detail-value">${inc.Technician ? `${inc.Technician.firstName} ${inc.Technician.lastName} (${inc.Technician.email})` : 'Unassigned'}</div></div>
      <div class="detail-row"><div class="detail-label">Date Opened:</div><div class="detail-value">${inc.dateOpened?.split("T")[0]}</div></div>
      <div class="detail-row"><div class="detail-label">Date Closed:</div><div class="detail-value">${inc.dateClosed?.split("T")[0] || "-"}</div></div>
      <div class="detail-row"><div class="detail-label">Title:</div><div class="detail-value">${inc.title}</div></div>
      <div class="detail-row full-width"><div class="detail-label">Description:</div><div class="detail-value description-box">${inc.description}</div></div>
    </div>
  `;
  incidentDetailPanel.scrollIntoView({ behavior: "smooth" });
}
