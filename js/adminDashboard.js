import { User, Campaign } from "./apiCalls.js";

const userData = document.getElementById("usersTableData");
const campaignsData = document.getElementById("campaignsTableData");
let allUsers = [];
let allCampaigns = [];

const displayUsers = (users) => {
  userData.innerHTML = "";
  users.forEach((user) => {
    const userRowTr = document.createElement("tr");
    const userIdTd = document.createElement("td");
    const userNameTd = document.createElement("td");
    const userEmailTd = document.createElement("td");
    const userRoleTd = document.createElement("td");
    const userStatusTd = document.createElement("td");
    const userActionsTd = document.createElement("td");

    userIdTd.textContent = user.id;
    userNameTd.textContent = user.name;
    userEmailTd.textContent = user.email;
    userRoleTd.textContent = user.role;
    userStatusTd.textContent = user.isActive ? "Active" : "Inactive";

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    if (user.role === "admin") {
      actionBtn.textContent = "Admin";
      actionBtn.className =
        "btn btn-outline-secondary btn-sm me-1 btn--disabled";
    } else {
      actionBtn.innerHTML = user.isActive
        ? `<i class="bi bi-person-x"></i>`
        : `<i class="bi bi-person-check"></i>`;
      actionBtn.className = user.isActive
        ? "btn btn-outline-danger btn-sm me-1"
        : "btn btn-outline-success btn-sm";

      actionBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        await User.updateUser(user.id, { isActive: !user.isActive });
      }); // end of actionBtn event listener
    }
    userActionsTd.appendChild(actionBtn);

    userRowTr.appendChild(userIdTd);
    userRowTr.appendChild(userNameTd);
    userRowTr.appendChild(userEmailTd);
    userRowTr.appendChild(userRoleTd);
    userRowTr.appendChild(userStatusTd);
    userRowTr.appendChild(userActionsTd);

    userData.appendChild(userRowTr);
  });
};

const displayCampaigns = (campaigns) => {
  campaignsData.innerHTML = "";
  campaigns.forEach((campaign) => {
    const campaignRowTr = document.createElement("tr");
    const campaignIdTd = document.createElement("td");
    const campaignTitleTd = document.createElement("td");
    const campaignDeadlineTd = document.createElement("td");
    const campaignRaisedTd = document.createElement("td");
    const campaignGoalTd = document.createElement("td");
    const campaignCategory = document.createElement("td");
    const campaignActionsTd = document.createElement("td");

    campaignIdTd.textContent = campaign.creatorId;
    campaignTitleTd.textContent = campaign.title;
    campaignDeadlineTd.textContent = new Date(
      campaign.deadline
    ).toLocaleDateString();
    campaignRaisedTd.textContent = `$${campaign.raised.toFixed(2)}`;
    campaignGoalTd.textContent = `$${campaign.goal.toFixed(2)}`;
    campaignCategory.textContent = campaign.category;

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.innerHTML = campaign.isApproved
      ? `<i class="bi bi-person-x"></i>`
      : `<i class="bi bi-person-check"></i>`;
    actionBtn.className = campaign.isApproved
      ? "btn btn-outline-danger btn-sm me-1"
      : "btn btn-outline-success btn-sm";

    actionBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      await Campaign.updateCampaign(campaign.id, {
        isApproved: !campaign.isApproved,
      });
    }); // end of actionBtn event listener

    campaignActionsTd.appendChild(actionBtn);

    campaignRowTr.appendChild(campaignIdTd);
    campaignRowTr.appendChild(campaignTitleTd);
    campaignRowTr.appendChild(campaignDeadlineTd);
    campaignRowTr.appendChild(campaignRaisedTd);
    campaignRowTr.appendChild(campaignGoalTd);
    campaignRowTr.appendChild(campaignCategory);
    campaignRowTr.appendChild(campaignActionsTd);

    campaignsData.appendChild(campaignRowTr);
  }); // end of campaigns.forEach
};

document.addEventListener('DOMContentLoaded', async () => {
    const campaignsData = document.getElementById('campaignsTableData');
    
    if (!campaignsData) {
        console.error('Campaigns table not found!');
        return;
    }

    async function fetchAndDisplayCampaigns() {
        allCampaigns = await Campaign.getAllCampaigns();
        displayCampaigns(allCampaigns);
    }

    await fetchAndDisplayCampaigns();
});

 async function fetchAndDisplayUsers() {
  try {
    allUsers = await User.getAllUsers();
    displayUsers(allUsers);
  } catch (error) {
    console.error("Fetch error:", error);
    userData.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
  }
}

window.addEventListener("DOMContentLoaded", fetchAndDisplayUsers);
