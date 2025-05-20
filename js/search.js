import { Campaign } from "./apiCalls.js";

export async function handleCampaignSearch() {
  const searchInput = document.getElementById("campaignSearchInput");
  const resultsContainer = document.getElementById("campaignsDropdown");

  let arr = [];
  searchInput.addEventListener("input", async function (e) {
    const searchTerm = e.target.value.trim();

    if (searchTerm.length >= 3) {
      try {
        const titles = await Campaign.getAllCampaigns();
        arr = titles.map((c) => c.title);
        const object = arr.filter((c) =>
          c.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const res = await Campaign.searchCampaigns(object);
        const filteredCampaigns = res.filter((campaign) =>
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayResults(filteredCampaigns);
      } catch (error) {
        console.error("Search failed:", error);
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
      }
    } else {
      resultsContainer.innerHTML = "";
      resultsContainer.classList.remove("show");
    }

    if (searchTerm.length < 3) {
      resultsContainer.innerHTML = "";
      resultsContainer.classList.add("show");
    }
  }); // end of search input
}

async function displayResults(campaigns) {
  const resultsContainer = document.getElementById("campaignsDropdown");
  resultsContainer.innerHTML =
    campaigns.length > 0
      ? campaigns
          .map(
            (c) => `
            <label class= "header-title">Campaigns:</label>
            <hr>
            <div class="dropdown-item " data-id="${c.id}">
              <p> ${c.title}</p>
            </div>
        `
          )
          .join("")
      : `<div class="not-found-search"> <p> No campaigns found..! </p> </div>`;
  resultsContainer.classList.add("show");

  document.querySelectorAll('.dropdown-item').forEach(campaign => {
    campaign.addEventListener('click', () => {
        const id = campaign.getAttribute('data-id');
        const campaignId = id;
        console.log(campaignId)
        sessionStorage.setItem('campaignId', campaignId);
        window.location.href = `../campaign.html `;
     
    });
});
  
}
