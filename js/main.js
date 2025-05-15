async function loadModal() {
    try {
        const response = await fetch('../components/auth.html');
        if (!response.ok) {
            throw new Error(` error! status: ${response.status}`);
        }
        const modalContent = await response.text();
        document.getElementById('loginContainer').innerHTML = modalContent;
        

        const modalElement = document.getElementById('authModal');
        if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    } catch (error) {
        console.error('Error loading modal:', error);
    }
}

async function loadNavbar() {
    try {

        const response = await fetch('../components/navbar.html');
        if (!response.ok) throw new Error(` error! status: ${response.status}`);
        const navbarContent = await response.text();
        document.getElementById('navbarContainer').innerHTML = navbarContent;

        

        
        const signBtn = document.getElementById('signBtn');
        if (signBtn) {
            signBtn.addEventListener('click', loadModal);
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

async function loadFooter() {
    try {
        const response = await fetch('../components/footer.html');
        if (!response.ok) throw new Error(` error! status: ${response.status}`);
        const footerContent = await response.text();
        document.getElementById('footerContainer').innerHTML = footerContent;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

async function dashboardNavBar() {
    try{
        const response = await fetch('../components/dashBoadrNavBar.html');
        if(!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const dashboardNavBarContent = await response.text();
        document.getElementById('dashboard-nav-bar').innerHTML = dashboardNavBarContent;
    } catch(e){
        console.error(`Error loading dashboard navBar: `, e);
    }
}



async function campaignDashboardTable() {
    try {
        const response = await fetch('../components/dashboardTable.html');
        if(!response.ok) throw new Error(`Something went wrong: ${response.status}`);
        const tableContent = await response.text();
        document.getElementById("campaignsTabelContent").innerHTML = tableContent
    } catch(e){
        console.error(`Error loading campaign tabel: ${e}`);
    }
}
window.addEventListener('DOMContentLoaded', loadNavbar);

window.addEventListener('DOMContentLoaded', dashboardNavBar);

window.addEventListener('DOMContentLoaded', campaignDashboardTable);

window.addEventListener('DOMContentLoaded', loadFooter);


window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.backr-navbar');
    const scroll = document.querySelector('.scroll-section');
    if (!navbar || !scroll) return;
    const scrollBottom = scroll.offsetTop + scroll.offsetHeight;
    if (window.scrollY > scrollBottom - navbar.offsetHeight) {
        navbar.classList.add('navbar--scrolled');
    } else {
        navbar.classList.remove('navbar--scrolled');
    }
}); 