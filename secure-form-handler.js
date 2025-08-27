/**
 * Secure Form Handler for Aurora CDC Contact Form
 * Handles form submission with reCAPTCHA verification and proper error handling
 */

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        ENDPOINTS: {
            PHP: 'process-contact.php',
            NODE: '/process-contact'
        },
        MESSAGES: {
            SUCCESS: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
            ERROR: 'An error occurred while processing your request. Please try again or contact us directly.',
            RECAPTCHA_REQUIRED: 'Please complete the reCAPTCHA verification.',
            VALIDATION_FAILED: 'Please check your form inputs and try again.',
            RATE_LIMITED: 'Too many submissions. Please wait before trying again.'
        },
        TIMEOUTS: {
            SUBMIT: 30000, // 30 seconds
            RETRY: 3000    // 3 seconds
        }
    };

    let isSubmitting = false;
    let currentEndpoint = CONFIG.ENDPOINTS.PHP; // Default to PHP

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', initializeSecureFormHandler);

    function initializeSecureFormHandler() {
        const form = document.getElementById('contact-form');
        if (!form) {
            console.warn('Contact form not found');
            return;
        }

        // Override form submission
        form.addEventListener('submit', handleSecureSubmission);
        
        // Add visual feedback elements
        addStatusElements(form);
        
        // Detect server environment
        detectServerEnvironment();
        
        console.log('Secure form handler initialized');
    }

    function addStatusElements(form) {
        // Create status container if it doesn't exist
        let statusContainer = form.querySelector('.form-status');
        if (!statusContainer) {
            statusContainer = document.createElement('div');
            statusContainer.className = 'form-status';
            statusContainer.style.cssText = `
                margin-top: 15px;
                padding: 10px;
                border-radius: 4px;
                display: none;
                font-size: 14px;
                line-height: 1.4;
            `;
            
            const submitGroup = form.querySelector('.u-form-submit');
            if (submitGroup) {
                submitGroup.parentNode.insertBefore(statusContainer, submitGroup);
            } else {
                form.appendChild(statusContainer);
            }
        }

        // Create loading spinner
        let spinner = form.querySelector('.form-spinner');
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.className = 'form-spinner';
            spinner.innerHTML = '⌛ Sending...';
            spinner.style.cssText = `
                display: none;
                text-align: center;
                color: #666;
                font-size: 14px;
                margin: 10px 0;
            `;
            statusContainer.parentNode.insertBefore(spinner, statusContainer);
        }
    }

    function detectServerEnvironment() {
        // Try to detect if we're running with Node.js server
        fetch('/health', { 
            method: 'GET',
            timeout: 2000 
        })
        .then(response => response.json())
        .then(data => {
            if (data.service && data.service.includes('Aurora CDC')) {
                currentEndpoint = CONFIG.ENDPOINTS.NODE;
                console.log('Detected Node.js server environment');
            }
        })
        .catch(() => {
            // Default to PHP if health check fails
            console.log('Using PHP server environment');
        });
    }

    async function handleSecureSubmission(event) {
        event.preventDefault();
        
        if (isSubmitting) {
            return;
        }

        const form = event.target;
        const formData = new FormData(form);
        
        // Show loading state
        setSubmissionState(form, 'loading');
        
        try {
            // Validate form
            const validation = validateForm(formData);
            if (!validation.isValid) {
                throw new Error(validation.message);
            }

            // Submit form
            const response = await submitFormSecurely(formData);
            
            if (response.success) {
                handleSubmissionSuccess(form, response.message);
            } else {
                throw new Error(response.message || CONFIG.MESSAGES.ERROR);
            }
            
        } catch (error) {
            handleSubmissionError(form, error.message);
        } finally {
            setSubmissionState(form, 'idle');
        }
    }

    function validateForm(formData) {
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const message = formData.get('message')?.trim();
        const recaptchaResponse = formData.get('recaptchaResponse')?.trim();
        const agree = formData.get('agree');

        if (!name || name.length < 2) {
            return { isValid: false, message: 'Name must be at least 2 characters long.' };
        }

        if (!email || !isValidEmail(email)) {
            return { isValid: false, message: 'Please enter a valid email address.' };
        }

        if (!message || message.length < 10) {
            return { isValid: false, message: 'Message must be at least 10 characters long.' };
        }

        if (!agree) {
            return { isValid: false, message: 'You must agree to the Terms of Service.' };
        }

        if (!recaptchaResponse) {
            return { isValid: false, message: CONFIG.MESSAGES.RECAPTCHA_REQUIRED };
        }

        return { isValid: true };
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function submitFormSecurely(formData) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUTS.SUBMIT);

        try {
            const response = await fetch(currentEndpoint, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            clearTimeout(timeoutId);

            let responseData;
            const contentType = response.headers.get('content-type');
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                // Handle non-JSON responses (like from PHP)
                const text = await response.text();
                try {
                    responseData = JSON.parse(text);
                } catch {
                    if (response.ok) {
                        responseData = { success: true, message: CONFIG.MESSAGES.SUCCESS };
                    } else {
                        responseData = { success: false, message: text || CONFIG.MESSAGES.ERROR };
                    }
                }
            }

            // Handle rate limiting
            if (response.status === 429) {
                responseData.message = CONFIG.MESSAGES.RATE_LIMITED;
            }

            return responseData;
            
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error('Request timed out. Please try again.');
            }
            
            throw new Error('Network error. Please check your connection and try again.');
        }
    }

    function setSubmissionState(form, state) {
        const submitButton = form.querySelector('.u-btn-submit');
        const spinner = form.querySelector('.form-spinner');
        const statusContainer = form.querySelector('.form-status');

        switch (state) {
            case 'loading':
                isSubmitting = true;
                if (submitButton) {
                    submitButton.style.opacity = '0.6';
                    submitButton.style.pointerEvents = 'none';
                }
                if (spinner) {
                    spinner.style.display = 'block';
                }
                if (statusContainer) {
                    statusContainer.style.display = 'none';
                }
                break;
                
            case 'idle':
                isSubmitting = false;
                if (submitButton) {
                    submitButton.style.opacity = '1';
                    submitButton.style.pointerEvents = 'auto';
                }
                if (spinner) {
                    spinner.style.display = 'none';
                }
                break;
        }
    }

    function handleSubmissionSuccess(form, message) {
        const statusContainer = form.querySelector('.form-status');
        if (statusContainer) {
            statusContainer.innerHTML = `✅ ${message || CONFIG.MESSAGES.SUCCESS}`;
            statusContainer.style.cssText += 'display: block; background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;';
        }

        // Reset form
        form.reset();
        
        // Reset reCAPTCHA
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.reset();
        }
        
        // Clear reCAPTCHA response
        const recaptchaInput = form.querySelector('input[name="recaptchaResponse"]');
        if (recaptchaInput) {
            recaptchaInput.value = '';
        }

        // Scroll to status message
        statusContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Log success
        console.log('Form submitted successfully');
    }

    function handleSubmissionError(form, errorMessage) {
        const statusContainer = form.querySelector('.form-status');
        if (statusContainer) {
            statusContainer.innerHTML = `❌ ${errorMessage}`;
            statusContainer.style.cssText += 'display: block; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
        }

        // Scroll to error message
        statusContainer?.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Log error
        console.error('Form submission error:', errorMessage);
    }

    // Enhance reCAPTCHA callbacks
    window.onRecaptchaSuccess = function(token) {
        console.log('reCAPTCHA completed successfully');
        
        // Update the hidden input
        const recaptchaInput = document.querySelector('input[name="recaptchaResponse"]');
        if (recaptchaInput) {
            recaptchaInput.value = token;
        }
        
        // Enable submit button
        const submitButton = document.querySelector('.u-btn-submit');
        if (submitButton) {
            submitButton.style.opacity = '1';
            submitButton.style.pointerEvents = 'auto';
        }
    };

    window.onRecaptchaExpired = function() {
        console.log('reCAPTCHA expired');
        
        // Clear the response token
        const recaptchaInput = document.querySelector('input[name="recaptchaResponse"]');
        if (recaptchaInput) {
            recaptchaInput.value = '';
        }
        
        // Disable submit button
        const submitButton = document.querySelector('.u-btn-submit');
        if (submitButton) {
            submitButton.style.opacity = '0.5';
            submitButton.style.pointerEvents = 'none';
        }
    };

})();
