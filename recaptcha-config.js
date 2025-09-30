// reCAPTCHA v2 Invisible Badge Configuration
// Only the site key (public key) should be in client-side code
// Secret key must be kept secure on server-side only!
const RECAPTCHA_CONFIG = {
    // Site key (public key) - safe to expose in client-side code
    SITE_KEY: '6LenW9krAAAAAPRyYWFr5YVcxOW9XmYQZfk_KSa0'
    // Note: SECRET_KEY removed for security - must be handled server-side
};

// Initialize reCAPTCHA when page loads
window.onload = function() {
    // Check if reCAPTCHA is already loaded
    if (typeof grecaptcha !== 'undefined') {
        initializeRecaptcha();
    } else {
        // If not loaded, wait for it
        window.addEventListener('grecaptchaLoaded', initializeRecaptcha);
    }
};

function initializeRecaptcha() {
    // Render reCAPTCHA widget
    if (document.getElementById('recaptcha-container')) {
        grecaptcha.render('recaptcha-container', {
            'sitekey': RECAPTCHA_CONFIG.SITE_KEY,
            'callback': onRecaptchaSuccess,
            'expired-callback': onRecaptchaExpired
        });
    }
}

// Callback function when reCAPTCHA is successfully completed
function onRecaptchaSuccess(token) {
    console.log('reCAPTCHA completed successfully');
    // Update the hidden input with the response token
    const recaptchaResponse = document.querySelector('input[name="recaptchaResponse"]');
    if (recaptchaResponse) {
        recaptchaResponse.value = token;
    }
    
    // Enable submit button if it was disabled
    const submitButton = document.querySelector('.u-btn-submit');
    if (submitButton) {
        submitButton.style.opacity = '1';
        submitButton.style.pointerEvents = 'auto';
    }
}

// Callback function when reCAPTCHA expires
function onRecaptchaExpired() {
    console.log('reCAPTCHA expired');
    // Clear the response token
    const recaptchaResponse = document.querySelector('input[name="recaptchaResponse"]');
    if (recaptchaResponse) {
        recaptchaResponse.value = '';
    }
    
    // Disable submit button
    const submitButton = document.querySelector('.u-btn-submit');
    if (submitButton) {
        submitButton.style.opacity = '0.5';
        submitButton.style.pointerEvents = 'none';
    }
}

// Validate form submission
function validateFormSubmission(event) {
    const recaptchaResponse = document.querySelector('input[name="recaptchaResponse"]');
    
    if (!recaptchaResponse || !recaptchaResponse.value) {
        event.preventDefault();
        alert('Please complete the reCAPTCHA verification.');
        return false;
    }
    
    return true;
}

// Add form submission validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.u-form form');
    if (form) {
        form.addEventListener('submit', validateFormSubmission);
    }
});
