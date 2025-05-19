import { User } from '../js/apiCalls.js';
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
                document.getElementById('profileCampaigns').style.display = 'none';
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