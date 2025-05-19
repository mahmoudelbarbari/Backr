import { Campaign } from "./apiCalls.js";

export async function handleCampaignSearch() {
  const searchInput = document.getElementById("campaignSearchInput");
  const resultsContainer = document.getElementById("campaignsDropdown");

    if (!searchInput || !resultsContainer) {
    console.error("Search elements not found");
    return;
  }
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
      resultsContainer.classList("show");
    }
  }); // end of search input

}

function displayResults(campaigns) {
  const resultsContainer = document.getElementById("campaignsDropdown");
  resultsContainer.innerHTML =
    campaigns.length > 0
      ? campaigns
          .map(
            (c) => `
            <label class= "header-title">Campaigns:</label>
            <hr>
            <div class="dropdown-item">
                <p>${c.title}</p>
            </div>
        `
          )
          .join("")
      : `<div class="not-found-search"> <p> No campaigns found..! </p> </div>`;
  resultsContainer.classList.add("show");
}
