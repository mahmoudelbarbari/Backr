import { createCampaign } from "./createCampaign.js";
import { Campaign } from "./apiCalls.js";
import { checkUser } from "./main.js";

window.addEventListener("DOMContentLoaded", checkUser);
export async function checkCampaigner() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role === "backer" || user.isApproved === false) {
      window.location.href = "./unauthorized.html";
      throw new Error("User not authorized");
    }
  } catch (error) {
    console.error("Error checking user role:", error);
  }
}

function greetings() {
  const greetingMessage = document.getElementById("greetingMessage");
  const currentHour = new Date().getHours();
  const userName = JSON.parse(localStorage.getItem("user"))?.name || "User";
  let greeting = "Good Morning";
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  if (greetingMessage) {
    greetingMessage.textContent = `${greeting}, ${userName}`;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  checkCampaigner();
  greetings();
});

function setupCreateCampaignModal() {
  const createBtn = document.getElementById("createCampaignBtn");
  if (createBtn) {
    createBtn.addEventListener("click", function () {
      const modal = new bootstrap.Modal(
        document.getElementById("createCampaignModal")
      );
      modal.show();
    });
  }
}

async function loadCampaignerNavBar() {
  try {
    const response = await fetch("./components/campaignerNavBar.html");
    // checkCampaigner();
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);
    const dashboardNavBarContent = await response.text();
    document.getElementById("dashboard-nav-bar").innerHTML =
      dashboardNavBarContent;
  } catch (e) {
    console.error(`Error loading campaigner navBar: `, e);
  }
}
async function getCampaignsByUser() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const campaigns = await Campaign.getCampaignsByUser(currentUser.id);
  return campaigns;
}
async function displayCampaigns(campaigns) {
  const campaignerDashboardTable =
    document.getElementById("campaignsTableBody");
  if (!campaignerDashboardTable) {
    console.error("Campaigns table body not found!");
    return;
  }
  campaignerDashboardTable.innerHTML = "";
  campaigns.forEach((campaign) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="text-wrap">${campaign.title}</td>
      <td class="d-none d-md-table-cell">${new Date(
        campaign.deadline
      ).toLocaleDateString()}</td>
      <td>$${campaign.raised}</td>
      <td class="d-none d-lg-table-cell">$${campaign.goal}</td>
      <td class="d-none d-md-table-cell">${campaign.contributors || 0}</td>
      <td><span class="badge text-muted border ${
        campaign.isApproved ? "border-success" : "border-warning"
      }">${campaign.isApproved ? "Active" : "Pending"}</span></td>
      <td class="text-center" id="CampaignActionbtns">
        
      </td>
    `;
    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.innerHTML = `<i class="bi bi-trash"></i> `;

    actionBtn.className = "btn btn-outline-danger btn-sm me-1";

    actionBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
        await Campaign.deleteCampaign(campaign.id);
        displayCampaigns(campaigns);
      } catch (error) {
        console.error("Error deleting campaign:", error);
      }
    });
    campaignerDashboardTable.appendChild(row);
    row.querySelector("#CampaignActionbtns").appendChild(actionBtn);
  });
}

async function loadCampaignerDashboardTable() {
  try {
    const response = await fetch("./components/campaignerDashboardTable.html");
    if (!response.ok)
      throw new Error(`Something went wrong: ${response.status}`);
    const tableContent = await response.text();
    const tableContainer = document.getElementById("campaignsTabelContent");
    if (!tableContainer) {
      console.error("Table container not found!");
      return;
    }
    tableContainer.innerHTML = tableContent;
    setupCreateCampaignModal();
    createCampaign();

    const campaigns = await getCampaignsByUser();
    await displayCampaigns(campaigns);
  } catch (e) {
    console.error(`Error loading campaigner table: ${e}`);
  }
}

window.addEventListener("DOMContentLoaded", loadCampaignerNavBar);
window.addEventListener("DOMContentLoaded", loadCampaignerDashboardTable);
