import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector("#assigned-incidents-table tbody");

    try {
        const response = await authFetch("/api/incidents/assigned");

        if (!response.ok) {
            throw new Error("Failed to fetch assigned incidents");
        }

        const result = await response.json();
       
        const incidents = result.data;
        console.log(incidents); 

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
    } catch (error) {
        console.error("Error fetching incidents:", error);
    }
});
