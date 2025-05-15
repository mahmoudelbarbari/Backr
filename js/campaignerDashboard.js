function setupCreateCampaignModal() {
  const createBtn = document.getElementById('createCampaignBtn');
  if (createBtn) {
    createBtn.addEventListener('click', function() {
      const modal = new bootstrap.Modal(document.getElementById('createCampaignModal'));
      modal.show();
    });
  }
  const form = document.getElementById('createCampaignForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      bootstrap.Modal.getInstance(document.getElementById('createCampaignModal')).hide();
      this.reset();
    });
  }



 

window.setupCreateCampaignModal = setupCreateCampaignModal;   
}
async function loadCampaignerNavBar() {
  try {
    const response = await fetch('./components/campaignerNavBar.html');
    if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
    const dashboardNavBarContent = await response.text();
    document.getElementById('dashboard-nav-bar').innerHTML = dashboardNavBarContent;
  } catch (e) {
    console.error(`Error loading campaigner navBar: `, e);
  }
}
async function loadCampaignerDashboardTable() {
  try {
    const response = await fetch('./components/campaignerDashboardTable.html');
    if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
    const tableContent = await response.text();
    document.getElementById('campaignsTabelContent').innerHTML = tableContent;
    window.setupCreateCampaignModal();
  } catch (e) {
    console.error(`Error loading campaigner table: ${e}`);
  }
}
window.addEventListener('DOMContentLoaded', loadCampaignerNavBar);
window.addEventListener('DOMContentLoaded', loadCampaignerDashboardTable)