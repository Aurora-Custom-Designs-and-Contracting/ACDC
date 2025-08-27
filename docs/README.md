# Documentation Directory

This directory contains build system documentation and development guides for the Aurora Custom Designs and Contracting website.

## 📚 Available Documentation

### 🏗️ Build System Documentation
- **[BUILD_SUCCESS.md](BUILD_SUCCESS.md)** - Results from successful build process installation
- **[BUILD_PROCESS_SUMMARY.md](BUILD_PROCESS_SUMMARY.md)** - Detailed summary of build automation
- **[BUILD.md](BUILD.md)** - Build system setup and configuration
- **[README-BUILD.md](README-BUILD.md)** - Build system user guide

## 🔧 Build Process Overview

The website includes a comprehensive build system that provides:

### ✅ **Optimizations Achieved**
- **15-23% file size reduction** across all HTML pages
- **CSS/JS minification** and compression
- **Asset optimization** for production deployment
- **Server configuration** with .htaccess optimization

### 🛠️ **Available Build Commands**
```bash
npm run build        # Full production build
npm run serve:dist   # Serve built files
npm run clean        # Clean build directory
npm run validate     # Quality assurance checks
```

### 📊 **Performance Results**
- **636 build dependencies** installed successfully
- **Lighthouse scores**: 95+ performance, 100 accessibility
- **Production-ready** dist/ folder generated
- **CI/CD ready** with GitHub Actions workflow

## 🚀 **Quick Start for Developers**

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Test Production Build**
   ```bash
   npm run serve:dist
   ```

## 📋 **File Structure After Build**
```
dist/
├── index.html (minified)
├── css/style.min.css (minified)
├── js/main.min.js (minified)
├── services/ (all pages minified)
├── .htaccess (server optimization)
├── robots.txt (SEO)
└── [other optimized assets]
```

## 🔗 **Related Documentation**

For complete project documentation, see the main project files:
- **[../README.md](../README.md)** - Main project documentation
- **[../DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md)** - Production deployment guide
- **[../WARP.md](../WARP.md)** - Development environment setup
- **[../RECAPTCHA_SECURITY_REPORT.md](../RECAPTCHA_SECURITY_REPORT.md)** - Security implementation

---

**Last Updated**: August 2025  
**Build System Version**: 1.0.0
