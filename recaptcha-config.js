// reCAPTCHA v3 Configuration
// Only the site key (public key) should be in client-side code
// Secret key must be kept secure on server-side only!
const RECAPTCHA_CONFIG = {
    // Site key (public key) - safe to expose in client-side code
    SITE_KEY: '6LenW9krAAAAAPRyYWFr5YVcxOW9XmYQZfk_KSa0'
    // Note: SECRET_KEY removed for security - must be handled server-side
};

// Store the global site key for form handler access
window.recaptchaSiteKey = RECAPTCHA_CONFIG.SITE_KEY;

// Initialize reCAPTCHA v3 when page loads
window.addEventListener('load', function() {
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(function() {
            console.log('reCAPTCHA v3 ready');
        });
    }
});
