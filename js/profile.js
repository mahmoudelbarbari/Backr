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
    if(sessionStorage.getItem('user') === null){
        window.location.href = './unauthorized.html';
        throw new Error('User not found');
    }

        const user = JSON.parse(sessionStorage.getItem('user'));
        if (user) {
            const createCampaign = document.getElementById('createCampaignBtn')
            const adminDashboardBtn = document.getElementById('adminDashboardBtn')
            const accountRole = document.getElementById('accountRole')
            const accountRoleDescription = document.getElementById('accountRoleDescription')
            const noneBacker = document.getElementById('noneBacker')
            const myPledges = document.getElementById('myPledges')
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
        }
    } catch (error) {
        console.error('Error in checkUser:', error);
        window.location.href = './unauthorized.html';
    }
}

window.addEventListener('load', checkUser);
