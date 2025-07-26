import { authFetch } from './utils/authFetch.js';

document.addEventListener('DOMContentLoaded', async () => {
  const role = localStorage.getItem('userRole');
  const userID = localStorage.getItem('userID');

  if (!role) {
    window.location.href = 'login_users.html';
    return;
  }

  // Sections
  const customerSection = document.getElementById('customer-section');
  const technicianSection = document.getElementById('technician-section');

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

  const updateBtn = document.querySelector('.btn-primary');
  const cancelBtn = document.querySelector('.btn-secondary');

  let customerID = null;
  let techID = null;

  // Load country list for customers
  try {
    const countryRes = await authFetch('/api/countries');
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

  // Load data based on role
  if (role === 'customer') {
    customerSection.style.display = 'block';

    try {
      const res = await authFetch('/api/customers/me');
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
    } catch (err) {
      console.error('Error fetching customer profile:', err);
      alert('Unable to load customer information.');
    }

  } else if (role === 'technician') {
    technicianSection.style.display = 'block';

    try {
      const res = await authFetch('/api/technicians/me');
      if (!res.ok) throw new Error('Failed to fetch technician data');

      const { data: tech } = await res.json();

      techID = tech.techID;
      techFirstName.value = tech.firstName || '';
      techLastName.value = tech.lastName || '';
      techPhone.value = tech.phone || '';
    } catch (err) {
      console.error('Error fetching technician profile:', err);
      alert('Unable to load technician information.');
    }

  } else {
    alert('Unauthorized role. Only customers and technicians can update data.');
    window.location.href = 'index.html';
    return;
  }

  // Handle update
  updateBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if (role === 'customer') {
      if (!customerID) return alert("Missing customer ID.");

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

      try {
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
      } catch (err) {
        console.error('Error updating customer:', err);
        alert('Something went wrong while updating the profile.');
      }

    } else if (role === 'technician') {
      if (!techID) return alert("Missing technician ID.");

      const updatedTech = {
        firstName: techFirstName.value.trim(),
        lastName: techLastName.value.trim(),
        phone: techPhone.value.trim(),
      };

      try {
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
      } catch (err) {
        console.error('Error updating technician:', err);
        alert('Something went wrong while updating the technician profile.');
      }
    }
  });

  // Handle cancel
  cancelBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
});
