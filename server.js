/**
 * Secure Contact Form Server with reCAPTCHA Verification
 * Aurora Custom Designs and Contracting, LLC
 * 
 * Node.js/Express server for processing contact form submissions
 * with reCAPTCHA verification and email delivery.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.recaptcha' });

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            scriptSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            connectSrc: ["'self'", "https://www.google.com"]
        }
    }
}));

// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:8000',
        'http://localhost:3000',
        'https://auroracdc.com',
        'https://www.auroracdc.com'
    ],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
};
app.use(cors(corsOptions));

// Rate limiting
const contactFormLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many form submissions. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static('.', {
    dotfiles: 'deny',
    index: ['index.html']
}));

// Email transporter configuration
const createEmailTransporter = () => {
    // Configure based on your email provider
    // Example for Gmail (you'll need to set up app-specific password)
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
        }
    });
    
    // Alternative SMTP configuration
    /*
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.your-provider.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    */
};

// Logging function
const logMessage = async (message, isError = false) => {
    const timestamp = new Date().toISOString();
    const logFile = isError ? 'logs/contact_form_errors.log' : 'logs/contact_form.log';
    const logEntry = `${timestamp} - ${message}\n`;
    
    try {
        // Ensure logs directory exists
        await fs.mkdir('logs', { recursive: true });
        await fs.appendFile(logFile, logEntry);
    } catch (error) {
        console.error('Failed to write log:', error);
    }
};

// reCAPTCHA verification function
const verifyRecaptcha = async (response, userIP) => {
    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY;
        if (!secretKey) {
            throw new Error('reCAPTCHA secret key not configured');
        }
        
        const verificationResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', {
            secret: secretKey,
            response: response,
            remoteip: userIP
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        return verificationResponse.data;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        throw new Error('Failed to verify reCAPTCHA');
    }
};

// Validation middleware
const validateContactForm = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .escape()
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Valid email address is required'),
    
    body('message')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .escape()
        .withMessage('Message must be between 10 and 2000 characters'),
    
    body('recaptchaResponse')
        .notEmpty()
        .withMessage('reCAPTCHA verification is required'),
    
    body('agree')
        .equals('on')
        .withMessage('You must agree to the Terms of Service')
];

// Contact form route
app.post('/process-contact', contactFormLimiter, validateContactForm, async (req, res) => {
    try {
        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array().map(err => err.msg)
            });
        }
        
        const { name, email, message, recaptchaResponse } = req.body;
        const userIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
        
        // Verify reCAPTCHA
        const recaptchaResult = await verifyRecaptcha(recaptchaResponse, userIP);
        
        if (!recaptchaResult.success) {
            await logMessage(`reCAPTCHA verification failed for ${email} (IP: ${userIP}): ${JSON.stringify(recaptchaResult['error-codes'])}`, true);
            
            return res.status(400).json({
                success: false,
                message: 'reCAPTCHA verification failed. Please try again.'
            });
        }
        
        // Prepare email content
        const emailContent = {
            from: 'noreply@auroracdc.com',
            to: 'info@AuroraCDC.com',
            replyTo: email,
            subject: 'New Contact Form Submission - Aurora CDC',
            text: `
New contact form submission from Aurora CDC website

Name: ${name}
Email: ${email}
IP Address: ${userIP}
Timestamp: ${new Date().toLocaleString()}
reCAPTCHA Score: ${recaptchaResult.score || 'N/A'}

Message:
${message}

---
This message was sent via the secure contact form on auroracdc.com
reCAPTCHA verification: PASSED ✓
            `,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>IP Address:</strong> ${userIP}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>reCAPTCHA Score:</strong> ${recaptchaResult.score || 'N/A'}</p>
                
                <h3>Message:</h3>
                <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007acc;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
                
                <hr>
                <p><small>This message was sent via the secure contact form on auroracdc.com<br>
                reCAPTCHA verification: <span style="color: green;">PASSED ✓</span></small></p>
            `
        };
        
        // Send email
        const transporter = createEmailTransporter();
        await transporter.sendMail(emailContent);
        
        // Log successful submission
        await logMessage(`Contact form submission from ${email} (IP: ${userIP}) - SUCCESS`);
        
        // Success response
        res.status(200).json({
            success: true,
            message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        
        // Log error
        await logMessage(`Error processing contact form: ${error.message} (IP: ${req.ip})`, true);
        
        // Generic error response
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request. Please try again or contact us directly.',
            error_id: Date.now().toString(36) + Math.random().toString(36).substr(2)
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Aurora CDC Contact Form Server'
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Aurora CDC Contact Form Server running on port ${PORT}`);
    console.log(`📧 Email configured: ${!!process.env.EMAIL_USER}`);
    console.log(`🔐 reCAPTCHA configured: ${!!process.env.RECAPTCHA_SECRET_KEY}`);
    console.log(`🌐 CORS origins: ${corsOptions.origin.join(', ')}`);
});

module.exports = app;
