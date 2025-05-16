function addScrolledClass() {
    const navbar = document.querySelector('.backr-navbar');
    if (navbar && window.scrollY > document.querySelector('.settings-header').offsetHeight) {
        navbar.classList.add('navbar--scrolled');
    } else {    
        navbar.classList.remove('navbar--scrolled');
    }
}

window.addEventListener('scroll', addScrolledClass); 