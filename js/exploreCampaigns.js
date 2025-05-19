import { User, Campaign } from "../js/apiCalls.js";
import { checkUser } from "../js/main.js";

export async function renderApprovedCampaigns() {
    const rowContainer = document.getElementById("rowContainer");

    if (!rowContainer) {
        console.error("row container not found");
        return;
    }
    const ApprovedCampaigns = await Campaign.getApprovedCampaigns();
    if (!ApprovedCampaigns || ApprovedCampaigns.length === 0) {
        rowContainer.innerHTML = "<p>No approved campaigns available.</p>";
        return;
    }
    rowContainer.innerHTML = "";

    ApprovedCampaigns.forEach((campaign) => {
        const cardBody = document.createElement("div");
        cardBody.className =
            "col-12 col-sm-6 col-lg-4 d-flex justify-content-center";

        const progress =
            campaign.goal > 0
                ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100))
                : 0;

        cardBody.innerHTML = `
            <div class="card campaign-card" data-id="${campaign.id}">
            <span class="badge bg-light w-50 opacity-100  position-absolute  text-dark">${campaign.category}</span>
                <img src="${campaign.image}"   alt="${campaign.title}"   />

                <div class="card-body p-0">
                    <h5 class="card-title fw-bold text-dark">${campaign.title.toUpperCase()}</h5>
                    <p class="card-text text-dark"><strong>Raised :</strong> $${campaign.raised
            }</p>
                    <p class="card-text text-dark"><strong>Goal :</strong> $${campaign.goal
            }</p>
                    <p class="card-text text-dark"><strong>Deadline :</strong> ${campaign.deadline
            }</p>
                    <a href="#" class="arrow"><i class="bi bi-arrow-right"></i></a>
                    <progress class="progress" max="100" value="${progress}"></progress>
                </div>
            </div>
        `;

        rowContainer.appendChild(cardBody);
    });
    campaignNavigator()
}

async function exploreSearch() {
    const searchInput = document.getElementById("exploreSearchInput");
    const rowContainer = document.getElementById("rowContainer");

    let searchArr = [];
    searchInput.addEventListener("input", async function (e) {
        const searchTerm = e.target.value.trim();

        if (searchTerm.length >= 3) {
            try {
                const titles = await Campaign.getAllCampaigns();
                searchArr = titles.map((c) => c.title);
                const object = searchArr.filter((c) =>
                    c.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const res = await Campaign.searchCampaigns(object);
                const filteredCampaigns = res.filter((campaign) =>
                    campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
                );

                if (filteredCampaigns.length > 0) {
                    rowContainer.innerHTML = "";

                    filteredCampaigns.forEach((campaign) => {
                        const cardBody = document.createElement("div");
                        cardBody.className =
                            "col-12 col-sm-6 col-lg-4 d-flex justify-content-center";

                        const progress =
                            campaign.goal > 0
                                ? Math.min(
                                    100,
                                    Math.round((campaign.raised / campaign.goal) * 100)
                                )
                                : 0;

                        cardBody.innerHTML = `
                        <div class="card campaign-card">
                        <span class="badge bg-light w-50 opacity-100  position-absolute  text-dark">${campaign.category
                            }</span>
                            <img src="${campaign.image}"   alt="${campaign.title
                            }"   />
            
                            <div class="card-body p-0">
                                <h5 class="card-title fw-bold text-dark">${campaign.title.toUpperCase()}</h5>
                                <p class="card-text text-dark"><strong>Raised :</strong> $${campaign.raised
                            }</p>
                                <p class="card-text text-dark"><strong>Goal :</strong> $${campaign.goal
                            }</p>
                                <p class="card-text text-dark"><strong>Deadline :</strong> ${campaign.deadline
                            }</p>
                                <a href="#" class="arrow"><i class="bi bi-arrow-right"></i></a>
                                <progress class="progress" max="100" value="${progress}"></progress>
                            </div>
                        </div>
                    `;
                        rowContainer.appendChild(cardBody);
                    });
                }
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        } else {
            renderApprovedCampaigns();
        }
    });
}


window.addEventListener("DOMContentLoaded", renderApprovedCampaigns);
window.addEventListener("DOMContentLoaded", exploreSearch);
async function campaignNavigator() {
    document.querySelectorAll('.campaign-card').forEach(campaign => {
        console.log(campaign);
        campaign.style.cursor = 'pointer';
        campaign.style.transition = 'transform 0.2s';
        campaign.addEventListener('click', () => {
            const id = campaign.getAttribute('data-id');
            const campaignId = id;
            localStorage.setItem('campaignId', campaignId);
            window.location.href = `../campaign.html `;
         
        });
    });
}
// window.addEventListener("DOMContentLoaded", campaignNavigator);
