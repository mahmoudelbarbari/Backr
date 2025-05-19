import { User,Campaign,Pledge } from "./apiCalls.js"; 
import { checkUser } from "./main.js";

async function renderCampaignDetails() {
    try {
    const campaignId = sessionStorage.getItem("campaignId");
    if (!campaignId) {
        console.error("Campaign ID not found in local storage");
        return;
    }
    const campaignCreatorId = await User.getUserByCampaignId(campaignId);
    const campaignDetails = await Campaign.getCampaignById(campaignId);
    const campaignImage = document.getElementById("campaignImage");
    const campaignTitle = document.getElementById("campaignTitle");
    const campaignDescription = document.getElementById("campaignDescription");
    const campaignGoal = document.getElementById("campaignGoal");
    const campaignRaised = document.getElementById("campaignRaised");
    const campaignDeadline = document.getElementById("campaignDeadline");
    const campaignProgress = document.getElementById("campaignProgress");

    const campaignCreator = document.getElementById("campaignCreator");
    const campaignRewardsTitle = document.getElementById("campaignRewardTitle");
    const campaignRewardsDescription = document.getElementById("campaignRewardDescription");


    if (!campaignDetails) {
        console.error("Campaign details not found");
        return;
    }
    campaignImage.src = campaignDetails.image;
    campaignTitle.innerText = campaignDetails.title;
    campaignDescription.innerText = campaignDetails.description;
    campaignGoal.innerText = ` of $${campaignDetails.goal} Goal`;
    campaignRaised.innerText = ` $${campaignDetails.raised} Raised`;
    campaignDeadline.innerHTML = ` <i class="bi bi-clock-fill me-2"></i> ${campaignDetails.deadline}`;

    campaignProgress.value = campaignDetails.goal > 0
        ? Math.min(100, Math.round((campaignDetails.raised / campaignDetails.goal) * 100))
        : 0;;

    campaignCreator.innerText = `${campaignCreatorId.name}`;
    campaignRewardsTitle.innerText = `${campaignDetails.rewards[0].title}`;
    campaignRewardsDescription.innerText = `${campaignDetails.rewards[0].description}`;



    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
      
        paymentForm.addEventListener('submit', async (e) => {
            checkUser();
            const pledge = document.getElementById('pledgeAmount').value;
             let raisedAmount = parseFloat(campaignDetails.raised) || 0;
            raisedAmount += parseFloat(pledge);
            handlePayment(e);
            const currentUser = JSON.parse(localStorage.getItem('user'));
            try { 
                   
                await Campaign.updateCampaign(campaignId, {
                raised: raisedAmount
            });
            await Pledge.createPledge({

                campaignId: campaignId,
                userId: currentUser.id,
                amount: pledge,
                rewardId: campaignDetails.rewards[0].rewardId
                
                
            });

        } catch (error) {
                console.error("Error processing payment:", error);
            }
                
           
        })
    }
}catch (error) {
        console.error("Error rendering campaign details:", error);
    }

}
window.addEventListener("DOMContentLoaded",renderCampaignDetails);


function handleNavbarScroll() {
    const navbar = document.querySelector('.backr-navbar');
    const header = document.querySelector('.header');

    if (navbar && window.scrollY > header.offsetHeight) {
        navbar.classList.add('navbar--scrolled');
    } else if (navbar) {
        navbar.classList.remove('navbar--scrolled');
    }
}


function handlePayment(event) {
    event.preventDefault();

    const form = document.getElementById('paymentForm');
    const cardNumber = form.querySelector('.payment-modal__card-number').value;
    const expiryDate = form.querySelector('.payment-modal__expiry').value;
    const cvv = form.querySelector('.payment-modal__cvv').value;


    if (!cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return;
    }


    const submitButton = form.querySelector('.payment-modal__submit');
    submitButton.disabled = true;


    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('backProjectModal'));
        modal.hide();

        alert('Payment successful! You will receive a confirmation email shortly.');

        submitButton.disabled = false;
        form.reset();
    }, 1500);
}


document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('scroll', handleNavbarScroll);


    


    const campaignImage = document.querySelector('.campaign__image');

    if (campaignImage) {
        
        campaignImage.addEventListener('load', () => {
            campaignImage.classList.remove('campaign__image--loading');
        });
    }
}); 
 