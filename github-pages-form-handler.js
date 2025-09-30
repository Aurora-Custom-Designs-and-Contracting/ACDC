/**
 * GitHub Pages Compatible Contact Form Handler
 * Uses Formspree for server-side processing with reCAPTCHA protection
 * Aurora Custom Designs and Contracting, LLC
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.error('Contact form not found');
        return;
    }

    // Initialize reCAPTCHA v2 Invisible Badge
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.ready(function() {
            console.log('reCAPTCHA v2 Invisible Badge ready for GitHub Pages deployment');
        });
    }

    // Form submission handler for Formspree
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('.u-btn-submit, [type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : 'Submit';
        
        // Show loading state
        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }

        try {
            // Get reCAPTCHA token
            let recaptchaToken = '';
            if (typeof grecaptcha !== 'undefined') {
                recaptchaToken = await grecaptcha.execute(window.recaptchaSiteKey, {action: 'submit'});
            }

            // Prepare form data
            const formData = new FormData(form);
            if (recaptchaToken) {
                formData.append('g-recaptcha-response', recaptchaToken);
            }

            // Submit to Formspree (you'll need to replace with your Formspree endpoint)
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showMessage('✅ Thank you! Your message has been sent successfully. We\'ll get back to you soon.', 'success');
                form.reset();
            } else {
                const data = await response.json();
                if (data.errors) {
                    const errorMessages = data.errors.map(error => error.message).join(', ');
                    showMessage('❌ Error: ' + errorMessages, 'error');
                } else {
                    showMessage('❌ There was a problem sending your message. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showMessage('❌ There was a network error. Please check your connection and try again.', 'error');
        } finally {
            // Restore button state
            if (submitButton) {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        }
    });

    // Message display function
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message form-message-${type}`;
        messageDiv.style.cssText = `
            padding: 15px;
            margin: 15px 0;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
            ${type === 'success' ? 
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;
        messageDiv.textContent = message;

        // Insert message after form
        form.parentNode.insertBefore(messageDiv, form.nextSibling);

        // Auto-remove success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    // Form validation
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        clearFieldError(e);
        
        if (!value) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Minimum length validation
        if (field.name === 'message' && value.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters');
            return false;
        }
        
        if (field.name === 'name' && value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters');
            return false;
        }
        
        return true;
    }

    function showFieldError(field, message) {
        field.style.borderColor = '#dc3545';
        
        // Create or update error message
        let errorDiv = field.parentNode.querySelector('.field-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.cssText = 'color: #dc3545; font-size: 14px; margin-top: 5px;';
            field.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    function clearFieldError(e) {
        const field = e.target;
        field.style.borderColor = '';
        
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }
});

// Instructions for Formspree integration
console.log(`
🚀 GitHub Pages Deployment Instructions:

1. Sign up for Formspree at https://formspree.io
2. Create a new form and get your form endpoint
3. Update your HTML form action to: action="https://formspree.io/f/YOUR_FORM_ID"
4. Replace this script with secure-form-handler.js in your HTML
5. Enable GitHub Pages in your repository settings

Your reCAPTCHA integration will work client-side for spam protection!
`);
