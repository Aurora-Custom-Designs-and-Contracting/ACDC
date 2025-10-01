# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Aurora Custom Designs and Contracting is a production-ready business website for a veteran-owned electrical contracting company in Las Vegas, Nevada. The project combines a modern static frontend with secure backend processing capabilities, featuring sophisticated contact form handling with reCAPTCHA protection and comprehensive security measures.

## Architecture Overview

### Dual Server Architecture
This project supports two deployment environments:

**1. PHP Backend (Shared Hosting)**
- `process-contact.php` - Secure contact form processor
- Compatible with shared hosting providers
- Uses standard PHP mail() function with SMTP fallback

**2. Node.js Backend (VPS/Cloud Hosting)** 
- `server.js` - Express.js server with enhanced security
- Advanced middleware stack (helmet, rate limiting, CORS)
- Nodemailer for robust email delivery

### Frontend Architecture
- **Pure HTML/CSS/JS** - No framework dependencies
- **Progressive Enhancement** - Functions without JavaScript
- **Responsive Design** - Mobile-first approach
- **Security-First** - Client-side validation with server-side verification

### Security Stack
- **Google reCAPTCHA v2** - Bot protection and spam prevention
- **Input Sanitization** - Both client and server-side validation  
- **Rate Limiting** - 5 submissions per 15 minutes per IP
- **Security Headers** - XSS, CSRF, clickjacking protection
- **Audit Logging** - Complete submission tracking

## Development Commands

### Local Development

**Start Development Server:**
```bash
# Option 1: Node.js development server (recommended)
npm install
npm run dev
# Visit http://localhost:3000

# Option 2: Python simple server
python3 -m http.server 8000
# Visit http://localhost:8000

# Option 3: Direct file access
open index.html
```

**Environment Setup:**
```bash
# Copy reCAPTCHA configuration template
cp .env.recaptcha.example .env.recaptcha
# Edit with your reCAPTCHA keys (keep secret key secure!)
```

### Testing and Validation

**Form Testing:**
```bash
# Test PHP backend
curl -X POST http://localhost:8000/process-contact.php \
  -d "name=Test&email=test@example.com&message=Test message&recaptchaResponse=test&agree=on"

# Test Node.js backend  
npm start
# Server runs on port 3000 with /process-contact endpoint
```

**Performance Testing:**
```bash
# Run Lighthouse audit
npm run validate:accessibility
npm run analyze

# Performance monitoring
npm run serve:dist
npx lighthouse http://localhost:8000 --view
```

**Code Validation:**
```bash
# HTML validation
npm run validate:html

# CSS linting
npm run validate:css

# Security check
npm run test:security
```

### Production Build

**Build for Production:**
```bash
# Complete optimized build
npm run build

# Individual build steps
npm run build:css    # Minify CSS
npm run build:js     # Minify JavaScript  
npm run build:html   # Optimize HTML
npm run clean        # Clean build directory

# Serve production build
npm run serve:dist
```

## Key Components

### Contact Form System
- **Frontend**: `secure-form-handler.js` - Enhanced client-side processing
- **reCAPTCHA**: `recaptcha-config.js` - Integration configuration
- **PHP Backend**: `process-contact.php` - Secure server processing
- **Node.js Backend**: `server.js` - Advanced Express.js server

### Core Files
- `index.html` - Main business page with service overview
- `index.css` - Comprehensive styling (corporate blue #003366 theme)
- `Pepper.js` - Framework utilities and interactions
- `Business-Website/` - Service-specific landing pages

### Security Configuration
- `.env.recaptcha` - reCAPTCHA keys (never commit to git)
- `.gitignore` - Excludes sensitive files
- `SECURITY.md` - Security policies and procedures

## Development Workflow

### Working with Contact Forms
1. **Client-Side Changes**: Edit `secure-form-handler.js` for form behavior
2. **reCAPTCHA Config**: Modify `recaptcha-config.js` for verification settings
3. **Server Logic**: Update `process-contact.php` or `server.js` for backend changes
4. **Testing**: Always test both PHP and Node.js endpoints

### Service Pages Management  
Service pages are located in `Business-Website/`:
- `Electrical.html` - Residential electrical services
- `GENERAC.html` - Backup generator installations
- `SPAN.html` - Smart electrical panels
- `EV-Chargers.html` - Electric vehicle charging stations
- `MrCOOL.html` - HVAC solutions

### Styling Guidelines
- **Primary Brand Color**: `#003366` (corporate blue)
- **Typography**: Professional, readable fonts with good contrast
- **Layout**: Clean, business-focused design with clear CTAs
- **Responsive**: Mobile-first approach with desktop enhancements

## Deployment Considerations

### Environment Variables
Required for production:
```bash
# reCAPTCHA (required)
RECAPTCHA_SITE_KEY=your_public_key_here
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Email configuration (Node.js only)
EMAIL_USER=your_email@gmail.com  
EMAIL_PASS=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

### Server Requirements
**PHP Hosting:**
- PHP 7.4+ 
- cURL support
- Mail function enabled
- File write permissions for logs/

**Node.js Hosting:**
- Node.js 16+
- Process manager (PM2 recommended)
- Environment variable support
- SSL certificate for production

### Security Checklist
- [ ] reCAPTCHA keys properly configured
- [ ] HTTPS enforced in production
- [ ] Rate limiting configured
- [ ] Error logging enabled
- [ ] Security headers implemented
- [ ] Input validation active on all endpoints

## Business Context

**Aurora Custom Designs and Contracting, LLC**
- Nevada State Contractor License #0094299
- Phone: (855) PWR-PLUG / (855) 797-7584
- Email: info@AuroraCDC.com
- Location: Las Vegas, NV 89125
- Established: 2002

**Services:**
- Residential electrical installations and repairs
- GENERAC backup generator systems  
- SPAN smart electrical panels
- EV charger installations
- Smart home technology integration

This is a production business website requiring high reliability, security, and professional presentation to generate leads and establish customer trust.