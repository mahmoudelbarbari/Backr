import { User, Campaign, Pledge } from "./apiCalls.js";
import { checkUser } from "./main.js";

async function checkAdmin() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user.role !== "admin") {
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

const userData = document.getElementById("usersTableData");
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
    const ApprovedCampaignerTd = document.createElement("td");
    const userActionsTd = document.createElement("td");

    userIdTd.textContent = user.id;
    userNameTd.textContent = user.name;
    userEmailTd.textContent = user.email;
    userRoleTd.textContent = user.role;
    userStatusTd.textContent = user.isActive ? "Active" : "Banned";
    ApprovedCampaignerTd.textContent = user.isApproved ? "Approved" : "Pending";

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    if (user.role === "admin") {
      actionBtn.textContent = "Admin";
      actionBtn.className =
        "btn btn-outline-secondary btn-sm me-1 btn--disabled";
    } else {
      actionBtn.innerHTML = user.isActive
        ? `Ban <i class="bi bi-person-x"></i>`
        : `Unban <i class="bi bi-person-check"></i>`;
      actionBtn.className = user.isActive
        ? "w-25 btn btn-outline-danger btn-sm me-1"
        : "w-25 btn btn-outline-success btn-sm me-1";

      actionBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if(currentUser == null) {
          window.location.href = "./unauthorized.html";
          throw new Error("User not authorized"); // Replace with your actual error handling logic
        }
        await User.updateUser(user.id, { isActive: !user.isActive });
      });
    }
    const ApproveBtn = document.createElement("button");
    ApproveBtn.type = "button";
    ApproveBtn.innerHTML = user.isApproved
      ? `Decline Campaigner <i class="bi bi-calendar-x"></i>`
      : `Approve Campaigner <i class="bi bi-calendar2-check"></i>`;
    ApproveBtn.className = user.isApproved
      ? " w-50 btn btn-outline-danger btn-sm me-1"
      : " w-50 btn btn-outline-success btn-sm me-1";
    ApproveBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      await User.updateUser(user.id, { isApproved: !user.isApproved });
    });
    userActionsTd.appendChild(actionBtn);
    userActionsTd.appendChild(ApproveBtn);

    userRowTr.appendChild(userIdTd);
    userRowTr.appendChild(userNameTd);
    userRowTr.appendChild(userEmailTd);
    userRowTr.appendChild(userRoleTd);
    userRowTr.appendChild(userStatusTd);
    userRowTr.appendChild(ApprovedCampaignerTd);
    userRowTr.appendChild(userActionsTd);

    userData.appendChild(userRowTr);
  });
};

const displayCampaigns = (campaigns) => {
  const campaignsData = document.getElementById("campaignsTableBody");
  if (!campaignsData) {
    console.error("Campaigns table not found!");
    return;
  }

  try {
    campaignsData.innerHTML = "";
    campaigns.forEach(async (campaign) => {
      const campaignRowTr = document.createElement("tr");
      const campaignCreatorTd = document.createElement("td");
      const campaignTitleTd = document.createElement("td");
      const campaignDeadlineTd = document.createElement("td");
      const campaignRaisedTd = document.createElement("td");
      const campaignGoalTd = document.createElement("td");
      const campaignStatusTd = document.createElement("td");
      const campaignCategoryTd = document.createElement("td");
      const campaignActionsTd = document.createElement("td");

      const creatorName = await User.getUsersById(campaign.creatorId);

      campaignCreatorTd.textContent = creatorName.name;
      campaignTitleTd.textContent = campaign.title;
      campaignDeadlineTd.textContent = new Date(
        campaign.deadline
      ).toLocaleDateString();

      const raisedAmount = parseFloat(campaign.raised) || 0;
      const goalAmount = parseFloat(campaign.goal) || 0;

      campaignRaisedTd.textContent = `$${raisedAmount.toFixed(2)}`;
      campaignGoalTd.textContent = `$${goalAmount.toFixed(2)}`;
      campaignStatusTd.textContent = campaign.isApproved
        ? "Approved"
        : "Pending";
      campaignStatusTd.className = campaign.isApproved
        ? "text-success"
        : "text-warning ";

      const actionBtn = document.createElement("button");
      actionBtn.type = "button";
      actionBtn.innerHTML = campaign.isApproved
        ? `Decline <i class="bi bi-person-x"></i>`
        : `Accept <i class="bi bi-person-check"></i>`;
      actionBtn.className = campaign.isApproved
        ? "btn btn-outline-danger btn-sm me-1"
        : "btn btn-outline-success btn-sm me-1";

      actionBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if(currentUser == null) {
          window.location.href = "./unauthorized.html";
          throw new Error("User not authorized"); // Replace with your actual error handling logic
        }
        try {
          await Campaign.updateCampaign(campaign.id, {
            isApproved: !campaign.isApproved,
          });

          fetchAndDisplayCampaigns();
        } catch (error) {
          console.error("Error updating campaign:", error);
          alert("Failed to update campaign status");
        }
      });
      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.innerHTML = `Delete<i class="bi bi-trash"></i> `;

      deleteBtn.className = "btn btn-outline-danger btn-sm me-1";

      deleteBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          await Campaign.deleteCampaign(campaign.id);
          fetchAndDisplayCampaigns();
        } catch (error) {
          console.error("Error deleting campaign:", error);
        }
      });
      campaignCategoryTd.textContent = campaign.category.toUpperCase();
      campaignActionsTd.appendChild(actionBtn);
      campaignActionsTd.appendChild(deleteBtn);

      campaignRowTr.appendChild(campaignCreatorTd);
      campaignRowTr.appendChild(campaignTitleTd);
      campaignRowTr.appendChild(campaignDeadlineTd);
      campaignRowTr.appendChild(campaignRaisedTd);
      campaignRowTr.appendChild(campaignGoalTd);
      campaignRowTr.appendChild(campaignStatusTd);
      campaignRowTr.appendChild(campaignCategoryTd);
      campaignRowTr.appendChild(campaignActionsTd);

      campaignsData.appendChild(campaignRowTr);
    });
  } catch (error) {
    console.error("Error displaying campaigns:", error);
    campaignsData.innerHTML = `<tr><td colspan="7">Error displaying campaigns: ${error.message}</td></tr>`;
  }
};

async function fetchAndDisplayUsers() {
  try {
    allUsers = await User.getAllUsers();
    displayUsers(allUsers);
  } catch (error) {
    console.error("Fetch error:", error);
    userData.innerHTML = `<tr><td colspan="6">${error.message}</td></tr>`;
  }
}

async function fetchAndDisplayCampaigns() {
  try {
    allCampaigns = await Campaign.getAllCampaigns();
    displayCampaigns(allCampaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    const campaignsData = document.getElementById("campaignsTableBody");
    if (campaignsData) {
      campaignsData.innerHTML = `<tr><td colspan="7">Error fetching campaigns: ${error.message}</td></tr>`;
    }
  }
}

async function loadCampaignsTable() {
  try {
    const response = await fetch("./components/dashboardTable.html");
    if (!response.ok)
      throw new Error(`Failed to load campaigns table: ${response.status}`);
    const tableContent = await response.text();
    document.getElementById("campaignsTabelContent").innerHTML = tableContent;

    await fetchAndDisplayCampaigns();
    await fetchAndDisplayPledges();
  } catch (error) {
    console.error("Error loading campaigns table:", error);
    document.getElementById(
      "campaignsTabelContent"
    ).innerHTML = `<div class="alert alert-danger">Failed to load campaigns table: ${error.message}</div>`;
  }
}

const loadPledgesTable = async (pledges) => {
  const pledgeTable = document.getElementById("pledgesTableData");
  if (!pledgeTable) {
    console.error("Pledge table not found!");
    return;
  }

  pledgeTable.innerHTML = "";

  for (const pledge of pledges) {
    try {
      const pledgeRowTr = document.createElement("tr");

      const pledgeIdTd = document.createElement("td");
      const userNameTd = document.createElement("td");
      const campaignTitleTd = document.createElement("td");
      const pledgeAmountTd = document.createElement("td");
      const rewardIdTd = document.createElement("td");

      let creatorName = "Unknown User";
      try {
        const user = await User.getUsersById(pledge.userId);
        if (user && user.name) {
          creatorName = user.name;
        }
      } catch (e) {
        console.warn(`User not found for ID ${pledge.userId}`);
      }

      // Safely get campaign data
      let campaignTitle = "Unknown Campaign";
      try {
        const campaign = await Campaign.getCampaignById(pledge.campaignId);
        if (campaign && campaign.title) {
          campaignTitle = campaign.title;
        }
      } catch (e) {
        console.warn(`Campaign not found for ID ${pledge.campaignId}`);
      }

      // Populate cells
      userNameTd.textContent = creatorName;
      pledgeIdTd.textContent = pledge.id;
      pledgeAmountTd.textContent = pledge.amount;
      campaignTitleTd.textContent = campaignTitle;
      rewardIdTd.textContent = pledge.rewardId;

      // Append cells to row
      pledgeRowTr.appendChild(pledgeIdTd);
      pledgeRowTr.appendChild(userNameTd);
      pledgeRowTr.appendChild(campaignTitleTd);
      pledgeRowTr.appendChild(pledgeAmountTd);
      pledgeRowTr.appendChild(rewardIdTd);

      // Append row to table
      pledgeTable.appendChild(pledgeRowTr);

    } catch (error) {
      console.error("Error processing pledge:", pledge, error);
      // Optionally create a row with error info
    }
  }
};


async function fetchAndDisplayPledges() {
  try {
    const allPledges = await Pledge.getAllPledges();
    await loadPledgesTable(allPledges);
  } catch (error) {
    console.error("Error fetching pledges:", error);
  }
}


window.addEventListener("DOMContentLoaded", async () => {
  checkUser(); // From main.js
  checkAdmin();
  greetings();
  await loadCampaignsTable();
  await fetchAndDisplayUsers();
  await fetchAndDisplayPledges();
});
