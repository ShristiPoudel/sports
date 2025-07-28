import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('profileDetails');
  const loadingIndicator = document.getElementById('loadingIndicator');

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  function showLoading(msg = 'Loading...') {
    if (loadingIndicator) {
      loadingIndicator.textContent = msg;
      loadingIndicator.classList.remove('hidden');
    }
  }

  function hideLoading() {
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
    }
  }

  showLoading('Loading profile information...');

  try {
    const res = await authFetch('/api/profile');
    await delay(500); // UX delay

    if (!res || !res.ok) throw new Error('Unable to fetch profile.');

    const responseData = await res.json();
    const profile = responseData.data;

    let html = `
      <div class="detail-row"><span class="detail-label">Username:</span><span class="detail-value">${profile.username}</span></div>
      <div class="detail-row"><span class="detail-label">Email:</span><span class="detail-value">${profile.email}</span></div>
      <div class="detail-row"><span class="detail-label">Role:</span><span class="detail-value">${profile.role}</span></div>
    `;

    if (profile.role === 'customer' && profile.customerID) {
      const customerRes = await authFetch(`/api/customers/${profile.customerID}`);
      await delay(500); // UX delay

      if (customerRes.ok) {
        const customerData = (await customerRes.json()).data;
        html += `
          <div class="detail-row"><span class="detail-label">First Name:</span><span class="detail-value">${customerData.firstName}</span></div>
          <div class="detail-row"><span class="detail-label">Last Name:</span><span class="detail-value">${customerData.lastName}</span></div>
          <div class="detail-row"><span class="detail-label">Phone:</span><span class="detail-value">${customerData.phone}</span></div>
          <div class="detail-row"><span class="detail-label">Address:</span><span class="detail-value">${customerData.address}</span></div>
          <div class="detail-row"><span class="detail-label">City:</span><span class="detail-value">${customerData.city}</span></div>
          <div class="detail-row"><span class="detail-label">State:</span><span class="detail-value">${customerData.state}</span></div>
          <div class="detail-row"><span class="detail-label">Postal Code:</span><span class="detail-value">${customerData.postalCode}</span></div>
          <div class="detail-row"><span class="detail-label">Country Code:</span><span class="detail-value">${customerData.countryCode}</span></div>
        `;
      } else {
        html += `<div class="detail-row error">Unable to fetch customer details.</div>`;
      }
    } else if (profile.role === 'technician' && profile.techID) {
      const technicianRes = await authFetch(`/api/technicians/${profile.techID}`);
      await delay(500); // UX delay

      if (technicianRes.ok) {
        const technicianData = (await technicianRes.json()).data;
        html += `
          <div class="detail-row"><span class="detail-label">First Name:</span><span class="detail-value">${technicianData.firstName}</span></div>
          <div class="detail-row"><span class="detail-label">Last Name:</span><span class="detail-value">${technicianData.lastName}</span></div>
          <div class="detail-row"><span class="detail-label">Phone:</span><span class="detail-value">${technicianData.phone}</span></div>
        `;
      } else {
        html += `<div class="detail-row error">Unable to fetch technician details.</div>`;
      }
    }

    container.innerHTML = html;
  } catch (err) {
    alert("Failed to load profile.");
    console.error(err);
  } finally {
    hideLoading();
  }
});
