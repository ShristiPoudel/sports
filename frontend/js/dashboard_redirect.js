document.addEventListener("DOMContentLoaded", () => {
  const role = localStorage.getItem('userRole');

  if (!role) {
    // No role found, redirect to login
    window.location.href = 'login_users.html';
    return;
  }

  // Hide all menu sections initially
  const sections = document.querySelectorAll('.menu-section');
  sections.forEach(section => section.style.display = 'none');

  // Show the Profile section for all roles
  document.querySelector('.menu-section:nth-of-type(4)').style.display = 'block';

  // Show section based on role
  switch(role) {
    case 'admin':
      document.querySelector('.menu-section:nth-of-type(1)').style.display = 'block';

      // ❌ Hide "Update Data" link for admin
      const updateDataItem = document.querySelector('#update-data-item');
      if (updateDataItem) updateDataItem.style.display = 'none';
      break;

    case 'technician':
      document.querySelector('.menu-section:nth-of-type(2)').style.display = 'block';
      break;

    case 'customer':
      document.querySelector('.menu-section:nth-of-type(3)').style.display = 'block';
      break;

    default:
      window.location.href = 'login_users.html';
  }
});
