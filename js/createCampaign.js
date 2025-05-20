import { Campaign,imageToBase64 } from './apiCalls.js';

export function createCampaign() {
    const createCampaignForm = document.getElementById('createCampaignForm');
    const createCampaignBtn = document.getElementById('createCampaignBtn');

    if (!createCampaignForm) {
        console.error('Create campaign form not found');
        return;
    }
    createCampaignForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!currentUser) {
            console.error('No user logged in');
            window.location.href = 'unauthorized.html';
            return;
        }
        const campaignTitle = document.getElementById('campaignTitle');
        const campaignDescription = document.getElementById('campaignDescription');
        const campaignRaised = '0';
        const campaignDeadline = document.getElementById('campaignDeadline');
        const campaignGoal = document.getElementById('campaignGoal');
        const campaignImage = document.getElementById('campaignImage');
        const CampaignCategory = document.getElementById('campaignCategory');
        const campaignRewardsTitle = document.getElementById('campaignRewardsTitle');
        const campaignRewardsDescription = document.getElementById('campaignRewardsDescription');
        
const creatorId = currentUser.id;

    const title = campaignTitle.value;
    const description = campaignDescription.value;
    const raised = campaignRaised;
    const goal = campaignGoal.value;
    const deadline = campaignDeadline.value;
    const image = campaignImage.files[0];
    const category = CampaignCategory.value;
    const rewards = [
        {
            
            title: campaignRewardsTitle.value,
            description: campaignRewardsDescription.value,
            rewardIdientifier: Date.now().toString(),
            
        }
    ]
    try {

  const imageBase64 = await imageToBase64(image);

  const campaignData = {
    title,
    description,
    goal,
    raised,
    deadline,
    image: imageBase64, 
    creatorId,
    isApproved: false,
    category ,
    rewards
  };

  const res = await Campaign.createCampaign(campaignData);

  if (res.id) {
    console.log('Campaign created successfully');
    alert('Campaign created successfully');
  } else {
    console.error('Failed to create campaign');
  }

} catch (error) {
  console.error('Error creating campaign:', error);
}
   
})
}