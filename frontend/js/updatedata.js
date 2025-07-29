import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const role = localStorage.getItem('userRole');
  const userID = localStorage.getItem('userID');

  if (!role) {
    window.location.href = 'login_users.html';
    return;
  }

  // Delay utility
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Sections
  const customerSection = document.getElementById('customer-section');
  const technicianSection = document.getElementById('technician-section');
  const loadingIndicator = document.getElementById('loadingIndicator');
  const submitLoading = document.getElementById('submitLoading');
  const updateBtn = document.querySelector('.btn-primary');
  const cancelBtn = document.querySelector('.btn-secondary');

  // Customer Inputs
  const custFirstName = document.getElementById('custFirstName');
  const custLastName = document.getElementById('custLastName');
  const addressInput = document.getElementById('address');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const postalCodeInput = document.getElementById('postalCode');
  const countryInput = document.getElementById('country');
  const countryCodeInput = document.getElementById('countryCode');
  const custPhone = document.getElementById('custPhone');

  // Technician Inputs
  const techFirstName = document.getElementById('techFirstName');
  const techLastName = document.getElementById('techLastName');
  const techPhone = document.getElementById('techPhone');

  let customerID = null;
  let techID = null;

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
  function disableSubmit() {
    if (updateBtn) updateBtn.disabled = true;
  }
  function enableSubmit() {
    if (updateBtn) updateBtn.disabled = false;
  }

  showLoading("Loading profile information...");

  // Load country list
  try {
    const countryRes = await authFetch('/api/countries');
    await delay(300); 

    if (!countryRes.ok) throw new Error('Failed to fetch countries');

    const countries = await countryRes.json();
    countries.data.forEach(country => {
      const option = document.createElement('option');
      option.value = country.countryCode;
      option.textContent = country.countryName;
      countryInput.appendChild(option);
    });
  } catch (err) {
    console.error('Error loading countries:', err);
    alert('Unable to load country list.');
  }

  // Load role-specific data
  try {
    if (role === 'customer') {
      customerSection.style.display = 'block';

      const res = await authFetch('/api/customers/me');
      await delay(500); // Simulated delay for UX

      if (!res.ok) throw new Error('Failed to fetch customer data');

      const { data: customer } = await res.json();

      customerID = customer.customerID;
      custFirstName.value = customer.firstName || '';
      custLastName.value = customer.lastName || '';
      addressInput.value = customer.address || '';
      cityInput.value = customer.city || '';
      stateInput.value = customer.state || '';
      postalCodeInput.value = customer.postalCode || '';
      countryInput.value = customer.countryCode || '';
      custPhone.value = customer.phone || '';
      countryCodeInput.value = customer.countryCode || '';
    } else if (role === 'technician') {
      technicianSection.style.display = 'block';

      const res = await authFetch('/api/technicians/me');
      await delay(500); 

      if (!res.ok) throw new Error('Failed to fetch technician data');

      const { data: tech } = await res.json();

      techID = tech.techID;
      techFirstName.value = tech.firstName || '';
      techLastName.value = tech.lastName || '';
      techPhone.value = tech.phone || '';
    } else {
      alert('Unauthorized role.');
      window.location.href = 'index.html';
      return;
    }
  } catch (err) {
    console.error('Error fetching profile:', err);
    alert('Failed to load your profile.');
  } finally {
    hideLoading();
  }

  // Handle update
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    disableSubmit();
    showSubmitLoading();

    try {
      await delay(500); // Simulated delay before submitting

      if (role === 'customer') {
        if (!customerID) throw new Error("Missing customer ID.");

        const updatedCustomer = {
          firstName: custFirstName.value.trim(),
          lastName: custLastName.value.trim(),
          address: addressInput.value.trim(),
          city: cityInput.value.trim(),
          state: stateInput.value.trim(),
          postalCode: postalCodeInput.value.trim(),
          countryCode: countryInput.value.trim(),
          phone: custPhone.value.trim(),
        };

        const res = await authFetch(`/api/customers/update/${customerID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCustomer),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          alert('Customer profile updated successfully.');
        } else {
          alert(result.message || 'Failed to update customer profile.');
        }

      } else if (role === 'technician') {
        if (!techID) throw new Error("Missing technician ID.");

        const updatedTech = {
          firstName: techFirstName.value.trim(),
          lastName: techLastName.value.trim(),
          phone: techPhone.value.trim(),
        };

        const res = await authFetch(`/api/technicians/update/${techID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedTech),
        });

        const result = await res.json();
        if (res.ok && result.success) {
          alert('Technician profile updated successfully.');
        } else {
          alert(result.message || 'Failed to update technician profile.');
        }
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Something went wrong while updating.');
    } finally {
      hideSubmitLoading();
      enableSubmit();
    }
  });

  // Cancel
  cancelBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
