import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const loadingIndicator = document.getElementById('loadingIndicator');
  const showLoading = (msg = 'Loading...') => {
    loadingIndicator.textContent = msg;
    loadingIndicator.classList.remove('hidden');
  };
  const hideLoading = () => loadingIndicator.classList.add('hidden');

  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  };

  showLoading("Loading profile...");

  try {
    const res = await authFetch('/api/profile');
    await delay(500);
    if (!res.ok) throw new Error('Profile fetch failed');

    const { data: profile } = await res.json();

    setText('username', profile.username);
    setText('email', profile.email);
    setText('role', profile.role);

    if (profile.role === 'customer' && profile.customerID) {
      const customerRes = await authFetch(`/api/customers/${profile.customerID}`);
      await delay(500);
      if (customerRes.ok) {
        const { data } = await customerRes.json();
        document.getElementById('customerFields').classList.remove('hidden');
        setText('firstName', data.firstName);
        setText('lastName', data.lastName);
        setText('phone', data.phone);
        setText('address', data.address);
        setText('city', data.city);
        setText('state', data.state);
        setText('postalCode', data.postalCode);
        setText('countryCode', data.countryCode);
      }
    } else if (profile.role === 'technician' && profile.techID) {
      const techRes = await authFetch(`/api/technicians/${profile.techID}`);
      await delay(500);
      if (techRes.ok) {
        const { data } = await techRes.json();
        document.getElementById('technicianFields').classList.remove('hidden');
        setText('techFirstName', data.firstName);
        setText('techLastName', data.lastName);
        setText('techPhone', data.phone);
      }
    }
  } catch (err) {
    console.error(err);
    alert("Failed to load profile.");
  } finally {
    hideLoading();
  }
});
