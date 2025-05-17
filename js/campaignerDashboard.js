import { createCampaign } from './createCampaign.js';
import { Campaign } from './apiCalls.js'; 

function setupCreateCampaignModal() {
  const createBtn = document.getElementById('createCampaignBtn');
  if (createBtn) {
    createBtn.addEventListener('click', function() {
      const modal = new bootstrap.Modal(document.getElementById('createCampaignModal'));
      modal.show();

    });
  }
  

 
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
async function getCampaignsByUser() {
  const currentUser = JSON.parse(sessionStorage.getItem('user'));
  const campaigns = await Campaign.getCampaignsByUser(currentUser.id);
  return campaigns;
} 
async function displayCampaigns(campaigns) {
  const campaignerDashboardTable = document.getElementById('campaignsTableBody');
  if (!campaignerDashboardTable) {
    console.error('Campaigns table body not found!');
    return;
  }
  campaignerDashboardTable.innerHTML = '';
  campaigns.forEach(campaign => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="text-wrap">${campaign.title}</td>
      <td class="d-none d-md-table-cell">${new Date(campaign.deadline).toLocaleDateString()}</td>
      <td>$${campaign.raised.toFixed(2)}</td>
      <td class="d-none d-lg-table-cell">$${campaign.goal.toFixed(2)}</td>
      <td class="d-none d-md-table-cell">${campaign.contributors || 0}</td>
      <td><span class="badge text-muted border ${campaign.isApproved ? 'border-success' : 'border-warning'}">${campaign.isApproved ? 'Active' : 'Pending'}</span></td>
      <td class="text-center">
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-success"><i class="bi bi-eye"></i></button>
          <button class="btn btn-sm btn-outline-primary" onclick="editCampaign(${campaign.id})"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteCampaign(${campaign.id})"><i class="bi bi-trash"></i></button>
        </div>
      </td>
    `;
    campaignerDashboardTable.appendChild(row);
  });
}

async function loadCampaignerDashboardTable() {
  try {
    const response = await fetch('./components/campaignerDashboardTable.html');
    if (!response.ok) throw new Error(`Something went wrong: ${response.status}`);
    const tableContent = await response.text();
    const tableContainer = document.getElementById('campaignsTabelContent');
    if (!tableContainer) {
      console.error('Table container not found!');
      return;
    }
    tableContainer.innerHTML = tableContent;
    setupCreateCampaignModal();
    createCampaign();
    
    // After the table structure is loaded, fetch and display campaigns
    const campaigns = await getCampaignsByUser();
    await displayCampaigns(campaigns);
  } catch (e) {
    console.error(`Error loading campaigner table: ${e}`);
  }
}

window.addEventListener('DOMContentLoaded', loadCampaignerNavBar);
window.addEventListener('DOMContentLoaded', loadCampaignerDashboardTable);
