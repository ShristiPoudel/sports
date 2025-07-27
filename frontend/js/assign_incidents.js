import { authFetch } from './utils/authFetch.js';

//API end points
const INCIDENTS_API = "/api/incidents";
const TECHNICIANS_API = "/api/technicians";

// DOM Elements
const tbody = document.querySelector("tbody");
const assignmentPanel = document.querySelector(".assignment-panel");
const technicianSelect = document.getElementById("technician");
const assignBtn = document.getElementById("assignBtn");
const cancelBtn = document.getElementById("cancelBtn");

// Incident detail fields
const incID = document.getElementById("incID");
const incCustomer = document.getElementById("incCustomer");
const incProduct = document.getElementById("incProduct");
const incDate = document.getElementById("incDate");
const incTitle = document.getElementById("incTitle");
const incDescription = document.getElementById("incDescription");

// loading states
const loadingIndicator = document.getElementById("loadingIndicator");

let currentIncidentID = null;

function showLoading() {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
}

function hideLoading() {
    if (loadingIndicator) loadingIndicator.classList.add("hidden");
}

//loading unsigned incidents
async function loadIncidents() {
    showLoading();
    try {
        // Simulate 5-second loading delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const res = await authFetch(INCIDENTS_API);
        if (!res) return;
        const data = await res.json();

        console.log("Fetched incidents data:", data);

        if (!data.success) throw new Error(data.message);

        const incidents = data.data || [];
        const unassigned = incidents.filter(inc => inc.techID === null);
        renderIncidents(unassigned);
    } catch (err) {
        console.error("Error loading incidents:", err);
        alert("Failed to load incidents: " + err.message);
    } finally {
        hideLoading();
    }
}


function renderIncidents(incidents) {
    tbody.innerHTML = "";

    if (incidents.length === 0) {
        tbody.innerHTML = "<tr><td colspan='6'>No unassigned incidents available.</td></tr>";
        return;
    }

    incidents.forEach(inc => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${inc.incidentID}</td>
            <td>${inc.Customer ? `${inc.Customer.firstName} ${inc.Customer.lastName}` : 'N/A'}</td>
            <td>${inc.Product ? inc.Product.productCode : 'N/A'}</td>
            <td>${inc.dateOpened ? new Date(inc.dateOpened).toISOString().split('T')[0] : 'N/A'}</td>
            <td>${inc.title}</td>
            <td><button class="btn btn-primary select-btn" data-id="${inc.incidentID}">Select</button></td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll(".select-btn").forEach(btn => {
        btn.addEventListener("click", handleSelect);
    });
}

//loading all technicians to assign incident to any of them
async function loadTechnicians() {
    showLoading();
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const res = await authFetch(TECHNICIANS_API);
        if (!res) return;
        const data = await res.json();

        console.log("Fetched technicians data:", data);

        if (!data.success) throw new Error(data.message);

        technicianSelect.innerHTML = '<option value="">-- Select a Technician --</option>';

        data.data.forEach(tech => {
            const opt = document.createElement("option");
            opt.value = tech.techID;
            opt.textContent = `${tech.firstName} ${tech.lastName}${tech.User?.email ? ` (${tech.User.email})` : ''}`;
            technicianSelect.appendChild(opt);
        });
    } catch (err) {
        console.error("Error loading technicians:", err);
        alert("Failed to load technicians: " + err.message);
    } finally {
        hideLoading();
    }
}

async function handleSelect(e) {
    const id = e.target.dataset.id;
    showLoading();
    try {
        const res = await authFetch(`${INCIDENTS_API}/${id}`);
        if (!res) return;
        const data = await res.json();

        console.log("Fetched single incident:", data);

        if (!data.success) throw new Error(data.message);

        const inc = data.data;
        currentIncidentID = inc.incidentID;
        incID.textContent = inc.incidentID;
        incCustomer.textContent = inc.Customer ? `${inc.Customer.firstName} ${inc.Customer.lastName}` : 'N/A';
        incProduct.textContent = inc.Product ? `${inc.Product.productCode} (${inc.Product.name})` : 'N/A';
        incDate.textContent = inc.dateOpened ? new Date(inc.dateOpened).toISOString().split('T')[0] : 'N/A';
        incTitle.textContent = inc.title;
        incDescription.textContent = inc.description;

        assignmentPanel.classList.remove("hidden");
        window.scrollTo({ top: assignmentPanel.offsetTop, behavior: "smooth" });
    } catch (err) {
        console.error("Error loading incident:", err);
        alert("Failed to load incident details: " + err.message);
    } finally {
        hideLoading();
    }
}

//handling assign incident
assignBtn.addEventListener("click", async () => {
    const techID = technicianSelect.value;
    if (!techID) {
        alert("Please select a technician before assigning.");
        return;
    }

    showLoading();
    try {
        const res = await authFetch(`${INCIDENTS_API}/${currentIncidentID}/assign`, {
            method: "PUT",
            body: JSON.stringify({ techID: parseInt(techID) }),
        });
        if (!res) return;
        const data = await res.json();

        console.log("Assign incident response:", data);

        if (!data.success) throw new Error(data.message);

        alert("Incident assigned successfully.");
        assignmentPanel.classList.add("hidden");
        technicianSelect.value = "";
        currentIncidentID = null;

        // Refresh incident list after assigned
        await loadIncidents();
    } catch (err) {
        console.error("Error assigning incident:", err);
        alert("Failed to assign incident: " + err.message);
    } finally {
        hideLoading();
    }
});

 // Handle canceling assignment
cancelBtn.addEventListener("click", () => {
    assignmentPanel.classList.add("hidden");
    technicianSelect.value = "";
    currentIncidentID = null;
});

 // On page load, verify admin and initialize data
document.addEventListener("DOMContentLoaded", () => {
    const userID = localStorage.getItem("userID");
    const role = localStorage.getItem("userRole");

    if (!userID || role !== "admin") {
        window.location.href = "login_users.html";
        return;
    }

    // Load initial data
    loadIncidents();
    loadTechnicians();
});
