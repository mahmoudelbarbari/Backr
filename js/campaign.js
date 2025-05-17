

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


    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }


    const campaignImage = document.querySelector('.campaign__image');

    if (campaignImage) {
        
        campaignImage.addEventListener('load', () => {
            campaignImage.classList.remove('campaign__image--loading');
        });
    }
}); 