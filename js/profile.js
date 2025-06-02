import { User,Campaign,Pledge } from '../js/apiCalls.js';
let noCampaigns = document.getElementById('noCampaigns')
function addScrolledClass() {
    const navbar = document.querySelector('.backr-navbar');
    if (navbar && window.scrollY > document.querySelector('.settings-header').offsetHeight) {
        navbar.classList.add('navbar--scrolled');
    } else {
        navbar.classList.remove('navbar--scrolled');
    }
}

window.addEventListener('scroll', addScrolledClass);


  async function checkUser() {
    try {
    if(localStorage.getItem('user') === null){
        window.location.href = './unauthorized.html';
        throw new Error('User not found');
    }

        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            const createCampaign = document.getElementById('createCampaignBtn')
            const adminDashboardBtn = document.getElementById('adminDashboardBtn')
            const accountRole = document.getElementById('accountRole')
            const accountRoleDescription = document.getElementById('accountRoleDescription')
            const noneBacker = document.getElementById('noneBacker')
            const myPledges = document.getElementById('myPledges')
            const userFname = document.getElementById('userFName')
            const userEmail = document.getElementById('userEmail')
            
            

            if (user.role === 'campaigner') {
                createCampaign.style.display = 'block';
                accountRole.textContent = 'Campaigner';
                accountRoleDescription.textContent = 'You can create campaigns and track your progress';
                adminDashboardBtn.style.display = 'none';
                myPledges.style.display = 'none';
     
            } else if (user.role === 'admin') {
                adminDashboardBtn.style.display = 'block';
                createCampaign.style.display = 'none';
                accountRole.textContent = 'Admin';
                accountRoleDescription.textContent = 'You can manage the platform and users';
                myPledges.style.display = 'none';
            } else { 
                accountRole.textContent = 'Backer';
                accountRoleDescription.textContent = 'You can pledge to campaigns and track your contributions';
                noneBacker.style.display = 'none';
               noCampaigns.style.display = 'none';
                myPledges.style.display = 'block';
            
            }
            userFname.value = `${user.name}`
            userEmail.value = `${user.email}`
        }
    } catch (error) {
        console.error('Error in checkUser:', error);
        window.location.href = './unauthorized.html';
    }
}


window.addEventListener('DOMContentLoaded', checkUser);
async function updateEmailFname() {
    let user = JSON.parse(localStorage.getItem('user'));
    const profile = document.getElementById('profile');
    const userFname = document.getElementById('userFName');
    const userEmail = document.getElementById('userEmail');
    const updateBtn = document.getElementById('updateBtn');
const errorMessage = document.createElement('p');
    const successMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    successMessage.className = 'success-message';

    updateBtn.addEventListener('click', async (e) => {
        e.preventDefault();


        if (userFname.value === '' || userEmail.value === '') {
            errorMessage.textContent = 'Please fill in all fields';
            return;
        }
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (regexEmail.test(userEmail.value) === false) {
            errorMessage.textContent = 'Invalid email address';
            return;
        }
        if (userFname.value.length < 3) {
            errorMessage.textContent = 'Name must be at least 3 characters long';
            return;
        }
        if (userFname.value === user.name && userEmail.value === user.email) {
            errorMessage.textContent = 'No changes made';
            return;
        }

        try {
          
await User.updateUser(user.id, {
            name: userFname.value,
            email: userEmail.value
        });
user = await User.getUsersById(user.id);
           localStorage.removeItem('user');
localStorage.setItem("user", JSON.stringify(user));
            successMessage.textContent = 'Profile updated successfully';
        } catch (error) {
            errorMessage.textContent = 'Error updating profile';
        }
    });
    profile.appendChild(errorMessage);
    profile.appendChild(successMessage);
}
window.addEventListener('DOMContentLoaded', updateEmailFname);
async function updatenewPassword(){

    let user = JSON.parse(localStorage.getItem('user'));
    const securitySettings = document.getElementById('securitySettings');
    const currentPassword = document.getElementById('currentPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmNewPassword = document.getElementById('confirmNewPassword');
    const updatePasswordbtn = document.getElementById('updatePasswordbtn');
    const errorMessage = document.createElement('p');
    const successMessage = document.createElement('p');
    errorMessage.className = 'error-message';
    successMessage.className = 'success-message';

    updatePasswordbtn.addEventListener('click', async (e) => {
        e.preventDefault();

     
        if (!currentPassword.value || !newPassword.value || !confirmNewPassword.value) {
            errorMessage.textContent = 'Please fill in all fields';
            return;
        }


        if (currentPassword.value !== user.password) {
            errorMessage.textContent = 'Current password is incorrect';
            return;
        }

   
        const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
        if (!regexPassword.test(newPassword.value)) {
            errorMessage.textContent = 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, and one number';
            return;
        }

        if (newPassword.value === currentPassword.value) {
            errorMessage.textContent = 'New password cannot be the same as current password';
            return;
        }

    

  
        if (newPassword.value !== confirmNewPassword.value) {
            errorMessage.textContent = 'Passwords do not match';
            return;
        }

        try {
            await User.updateUser(user.id, {
                password: newPassword.value
            });
            user = await User.getUsersById(user.id);
           localStorage.removeItem('user');
localStorage.setItem("user", JSON.stringify(user));
            successMessage.textContent = 'Password updated successfully';
        } catch (error) {
            errorMessage.textContent = 'Error updating password';
        }
    });
    securitySettings.appendChild(errorMessage);
    securitySettings.appendChild(successMessage);

}
window.addEventListener('DOMContentLoaded', updatenewPassword);


async function getMyPledges() {
    const user = JSON.parse(localStorage.getItem('user'));
    const pledgesList = document.getElementById('pledgesList');

    try {
        const pledges = await Pledge.getPledgesByUser(user.id);
        // console.log(pledges);

        for (const pledge of pledges) {
            const pledgedCampaign = await Campaign.getCampaignById(pledge.campaignId);
            const campaignCreator = await User.getUserByCampaignId(pledgedCampaign.id);

            pledgesList.innerHTML += `
                <div class="card mb-3 border-0 shadow-sm">
                    <div class="card-body">
                        <div class="row align-items-center">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center">
                                    <img src="${pledgedCampaign.image}" alt="Campaign" 
                                        class="rounded pledged-campaign-img" style="width: 80px; height: 80px; object-fit: cover;">
                                    <div class="ms-3">
                                        <h6 class="mb-1 pledged-campaign-title">${pledgedCampaign.title}</h6>
                                        <p class="text-muted mb-0 pledged-campaign-creator">${campaignCreator.name}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-md-center mt-3 mt-md-0">
                                    <div class="text-muted mb-1">Pledged Amount</div>
                                    <div class="fw-bold">$${pledge.amount}</div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="text-md-end mt-3 mt-md-0">
                                    <div class="text-muted mb-1">Reward</div>
                                    <div class="fw-bold">${pledgedCampaign.rewards[0].title}</div>
                                    <small class="text-muted">${pledgedCampaign.rewards[0].description }</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error fetching pledges:');
    }
}

window.addEventListener('DOMContentLoaded', getMyPledges);

async function getCampaignsByUser() {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    // console.log(currentUser);
    const campaignsList = document.getElementById('campaignsList');
   
    try {     
        console.log("from inside try",currentUser)  
        if (currentUser.isApproved == false || currentUser.role == 'backer') {
            noCampaigns.style.display = 'none';
            return;
        }
    const campaigns = await Campaign.getCampaignsByUser(currentUser.id);
    if (!campaigns ||  campaigns.length === 0 ) {
       if (currentUser.isApproved == true){
      noCampaigns.style.display = 'block';
       }
  
        return;
    }else
        noCampaigns.style.display = 'none';
    
    // console.log(campaigns);
    for (const campaign of campaigns) {
        console.log(campaign);
        campaignsList.innerHTML += `<div class="card mb-3 border-0 shadow-sm">
                                            <div class="card-body">
                                                <div class="row align-items-center">
                                                    <div class="col-md-6">
                                                        <div class="d-flex align-items-center">
                                                            <img src="${campaign.image}" alt="Campaign" 
                                                                class="rounded pledged-campaign-img" style="width: 80px; height: 80px; object-fit: cover;">
                                                            <div class="ms-3">
                                                                <h6 class="mb-1 pledged-campaign-title">${campaign.title}</h6>
                                                                <p class="text-muted mb-0 pledged-campaign-creator">${campaign.category}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="text-md-center mt-3 mt-md-0">
                                                            <div class="text-muted mb-1">Raised</div>
                                                            <div class="fw-bold">$${campaign.raised}</div>
                                                        </div>
                                                    </div>
                                                    <div class="col-md-3">
                                                        <div class="text-md-end mt-3 mt-md-0">
                                                            <div class="text-muted mb-1">Goal</div>
                                                            <div class="fw-bold">$${campaign.goal}</div>
                                                            <small class="text-muted">${campaign.deadline}</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`
}
    } catch (error) {
        console.error('Error fetching campaigns:', error);
    }
}
window.addEventListener('DOMContentLoaded', getCampaignsByUser);
