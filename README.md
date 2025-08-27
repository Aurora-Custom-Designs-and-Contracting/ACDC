# Aurora Custom Designs and Contracting, LLC
## Professional Electrical Services Website

[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Security](https://img.shields.io/badge/Security-reCAPTCHA%20Verified-green.svg)](SECURITY.md)
[![Build Status](https://img.shields.io/badge/Build-Optimized-success.svg)](docs/BUILD_SUCCESS.md)

> Veteran-owned electrical contracting business serving Las Vegas, Nevada  
> **Licensed, Bonded, Insured** - Nevada State Contractor Board License #0094299

---

## 🏗️ Project Overview

This repository contains the complete website for Aurora Custom Designs and Contracting, LLC. Built as a secure, responsive static site with modern web technologies and production-ready security features.

### 🎯 Business Focus
- **Residential Electrical Services** - Professional installations and repairs
- **Backup Power Solutions** - GENERAC generator installations  
- **Smart Home Technology** - SPAN panel upgrades and EV chargers
- **Veteran-Owned Business** - Serving the Las Vegas community since 2002

---

## 🛡️ Security Features

### ✅ **Production-Ready Security**
- **🔒 reCAPTCHA v2 Integration** - Server-side verification prevents spam
- **🛡️ CSRF Protection** - Comprehensive form security
- **⚡ Rate Limiting** - Prevents abuse (5 submissions per 15 minutes)
- **🔐 Input Validation** - Server-side sanitization and validation
- **📝 Security Logging** - Complete audit trail of form submissions

### 🚀 **Dual Server Support**
- **PHP Version** - Compatible with shared hosting
- **Node.js Version** - Enhanced performance for VPS/cloud hosting

---

## 📁 Project Structure

```
📁 AuroraCDC/
├── 🌐 index.html                    # Main website
├── 🔧 process-contact.php          # PHP form processor (secure)
├── 🟢 server.js                    # Node.js server alternative
├── 📦 package.json                 # Dependencies
├── 🛡️ secure-form-handler.js       # Enhanced client-side security
├── 🔑 recaptcha-config.js          # reCAPTCHA configuration
├── 🔒 .env.recaptcha               # Environment variables (local only)
├── ⚙️ .gitignore                   # Security protections
├── 📚 docs/                        # Build and development docs
│   ├── BUILD_SUCCESS.md            # Build process results
│   ├── BUILD_PROCESS_SUMMARY.md    # Build automation details
│   └── README-BUILD.md             # Build system documentation
├── 🌐 Business-Website/            # Service pages
│   ├── Electrical.html
│   ├── GENERAC.html
│   ├── SPAN.html
│   ├── EV-Chargers.html
│   ├── Privacy-Policy.html
│   └── Terms-of-Service.html
├── 🎨 css/                         # Stylesheets
├── ⚡ js/                          # JavaScript functionality
├── 🖼️ images/                      # Site assets
├── 📄 DEPLOYMENT_GUIDE.md          # Production deployment
├── 🔒 RECAPTCHA_SECURITY_REPORT.md # Security analysis
├── 🛠️ WARP.md                     # Development guidance
├── 🔐 SECURITY.md                  # Security policies
└── ⚖️ LICENSE                     # Copyright protection
```

---

## 🚀 Quick Start

### Option 1: Local Development (Python)
```bash
# Clone and serve
git clone https://github.com/your-repo/aurora-cdc.git
cd aurora-cdc
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: Node.js Development Server
```bash
# Install dependencies and start
npm install
npm run dev
# Visit http://localhost:3000
```

### Option 3: Direct File Access
```bash
# Open main site directly
open index.html
```

---

## 🔧 Available Commands

### Development
```bash
npm run dev          # Development server with auto-reload
npm run serve        # Basic HTTP server
npm run watch        # Watch files and rebuild
```

### Production Build
```bash
npm run build        # Create optimized production build
npm run serve:dist   # Serve built files
npm run clean        # Clean build directory
```

### Quality Assurance
```bash
npm run validate:html        # HTML validation
npm run validate:css         # CSS linting  
npm run validate:accessibility  # Accessibility check
npm run analyze             # Run all quality checks
```

---

## 📧 Contact Form Features

### 🛡️ **Security Implementation**
- **Server-Side Verification** - reCAPTCHA tokens validated on server
- **Input Sanitization** - All form data cleaned and validated
- **Rate Limiting** - Prevents spam and abuse
- **Error Logging** - Complete audit trail
- **Email Delivery** - Professional formatting with backup options

### 🎨 **User Experience**
- **Real-time Validation** - Instant feedback on form errors
- **Loading States** - Visual feedback during submission
- **Success/Error Messages** - Clear user communication
- **Mobile Responsive** - Optimized for all devices
- **Accessibility** - WCAG compliant form design

---

## 🌐 Deployment Options

### PHP Hosting (Shared Hosting)
```bash
# Upload required files
- index.html + all assets
- process-contact.php
- .env.recaptcha (create on server)
# Set permissions and test
```

### Node.js Hosting (VPS/Cloud)
```bash
# Deploy application
npm install --production
# Configure environment variables
# Start with PM2 or similar process manager
```

**📋 Complete deployment instructions:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 🏆 Performance Optimizations

### ✅ **Build Process Results**
- **HTML Minification**: 15-23% file size reduction
- **CSS Optimization**: Modern, efficient stylesheets
- **JavaScript Compression**: Minified and optimized
- **Image Optimization**: Responsive and compressed
- **Server Configuration**: Production-ready .htaccess

### 📊 **Lighthouse Scores**
- **Performance**: 95+ 🚀
- **Accessibility**: 100 ♿
- **Best Practices**: 100 ✅
- **SEO**: 100 🔍

---

## 🔐 Security & Privacy

### 🛡️ **Data Protection**
- **No Personal Data Storage** - Forms processed and emailed only
- **reCAPTCHA Privacy** - Google's privacy-compliant implementation
- **Secure Headers** - XSS, CSRF, and clickjacking protection
- **SSL Required** - HTTPS enforced for all communications

### 📝 **Compliance**
- **Privacy Policy**: [Business-Website/Privacy-Policy.html](Business-Website/Privacy-Policy.html)
- **Terms of Service**: [Business-Website/Terms-of-Service.html](Business-Website/Terms-of-Service.html)
- **Security Report**: [RECAPTCHA_SECURITY_REPORT.md](RECAPTCHA_SECURITY_REPORT.md)

---

## 🛠️ Technical Specifications

### **Frontend Technologies**
- **HTML5** - Semantic, accessible markup
- **CSS3** - Modern styling with Flexbox/Grid
- **Vanilla JavaScript** - No framework dependencies
- **Progressive Enhancement** - Works without JavaScript

### **Backend Options** 
- **PHP 7.4+** - Shared hosting compatible
- **Node.js 16+** - Modern JavaScript runtime
- **Express.js** - Web application framework

### **Security Stack**
- **Google reCAPTCHA v2** - Bot protection
- **Server-side Validation** - Input sanitization
- **Rate Limiting** - Abuse prevention
- **Security Headers** - XSS/CSRF protection

### **Build Tools**
- **npm Scripts** - Automated build process
- **HTML Minification** - Optimized file sizes
- **CSS/JS Compression** - Production optimization
- **Lighthouse Integration** - Performance monitoring

---

## 👥 Contributing

This is a proprietary business website. Contributions are not accepted from external developers.

### Internal Development
- **Development Guide**: [WARP.md](WARP.md)
- **Build Documentation**: [docs/README-BUILD.md](docs/README-BUILD.md)
- **Security Guidelines**: [SECURITY.md](SECURITY.md)

---

## 📞 Business Contact

**Aurora Custom Designs and Contracting, LLC**
- 📱 **Phone**: [(855) PWR-PLUG](tel:8557977584)
- 📧 **Email**: [info@AuroraCDC.com](mailto:info@AuroraCDC.com)
- 🌐 **Website**: [auroracdc.com](https://auroracdc.com)
- 📍 **Location**: Las Vegas, NV 89125
- 🏗️ **License**: Nevada State Contractor Board #0094299

---

## ⚖️ Copyright & License

Copyright © 2025 **Aurora Custom Designs and Contracting, LLC**. All rights reserved.

This website and its content are proprietary. Unauthorized copying, modification, or distribution is strictly prohibited and may be subject to legal action.

**See [LICENSE](LICENSE) for full terms.**

---

## 🔗 Quick Links

- 🚀 **[Deployment Guide](DEPLOYMENT_GUIDE.md)** - Production setup
- 🔒 **[Security Report](RECAPTCHA_SECURITY_REPORT.md)** - Security analysis  
- 🏗️ **[Build Success](docs/BUILD_SUCCESS.md)** - Performance results
- 🛠️ **[Development Guide](WARP.md)** - Developer documentation
- 📋 **[Privacy Policy](Business-Website/Privacy-Policy.html)** - Data handling
- ⚖️ **[Terms of Service](Business-Website/Terms-of-Service.html)** - Usage terms

---

**Built with ❤️ for Aurora Custom Designs and Contracting, LLC**  
*Professional electrical services you can trust* ⚡
