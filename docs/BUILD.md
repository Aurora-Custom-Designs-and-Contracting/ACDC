# Build Process Documentation

This document describes the automated build process for the Aurora Custom Designs and Contracting website.

## Overview

The build process transforms the source files into optimized, production-ready files with:
- **Minified CSS and JavaScript** for smaller file sizes
- **Minified HTML** with optimized asset references
- **Image optimization** (when images are present)
- **Production-ready assets** with caching headers

## Prerequisites

- Node.js 18+ installed
- npm package manager

## Quick Start

```bash
# Install dependencies
npm install

# Development server with file watching
npm run dev

# Build for production
npm run build

# Serve production build
npm run serve:dist
```

## Available Scripts

### Development
- `npm run dev` - Start development server on port 8000
- `npm run serve` - Basic Python HTTP server
- `npm run watch` - Watch files and rebuild automatically

### Building
- `npm run build` - Full production build
- `npm run clean` - Clean dist directory
- `npm run build:css` - Minify CSS only
- `npm run build:js` - Minify JavaScript only
- `npm run build:html` - Minify HTML only
- `npm run build:assets` - Copy and optimize assets

### Testing & Validation
- `npm run validate:html` - Validate HTML structure
- `npm run validate:css` - Lint CSS files
- `npm run validate:accessibility` - Check accessibility compliance
- `npm run test:lighthouse` - Run Lighthouse performance audit
- `npm run analyze` - Run all validation and tests

### Image Optimization
- `npm run optimize:images` - Optimize images (when present)

### Deployment
- `npm run deploy:prepare` - Build and run final tests before deployment

## Build Output

The build process creates a `dist/` directory with optimized files:

```
dist/
├── index.html (minified)
├── css/
│   └── style.min.css (minified)
├── js/
│   └── main.min.js (minified)
├── services/
│   ├── electrical.html
│   ├── generac.html
│   ├── span.html
│   ├── ev-chargers.html
│   ├── privacy-policy.html
│   └── terms-of-service.html
├── assets/ (if present)
├── robots.txt
├── .htaccess
└── [other assets]
```

## Optimization Features

### CSS Minification
- Removes comments and whitespace
- Combines duplicate rules
- Optimizes values and properties
- **Typical savings: 30-40%**

### JavaScript Minification
- Removes comments and whitespace
- Mangles variable names
- Dead code elimination
- **Typical savings: 40-60%**

### HTML Minification
- Removes comments and unnecessary whitespace
- Removes redundant attributes
- Minifies inline CSS and JavaScript
- **Typical savings: 20-30%**

### Asset Optimization
- Copies essential files (LICENSE, README, etc.)
- Creates production-ready robots.txt
- Generates .htaccess with compression and caching rules
- Sets up security headers

## Performance Results

### Before Optimization (Source)
- **HTML**: ~5.5KB per page
- **CSS**: ~12KB
- **JavaScript**: ~8KB
- **Total**: ~25KB+ per page load

### After Optimization (Built)
- **HTML**: ~4KB per page (-27%)
- **CSS**: ~8KB (-33%)
- **JavaScript**: ~4KB (-50%)
- **Total**: ~16KB per page load (**36% smaller**)

## CI/CD Integration

The build process includes GitHub Actions workflow:

### Automatic Testing
- Validates HTML structure
- Lints CSS for errors
- Runs Lighthouse performance audits
- Tests multiple Node.js versions

### Automatic Deployment
- Builds production files
- Deploys to GitHub Pages (or other platforms)
- Runs final performance checks

## Development Workflow

### Local Development
1. Run `npm run dev` to start development server
2. Edit source files in root directory
3. Files are served with live reload capability
4. View changes at http://localhost:8000

### Production Testing
1. Run `npm run build` to create production files
2. Run `npm run serve:dist` to test production build
3. Run `npm run analyze` to validate quality
4. Deploy dist/ directory to production server

## File Structure

### Source Files (Development)
```
/
├── index.html          # Main page
├── css/style.css       # Styles
├── js/main.js          # JavaScript
├── services/           # Service pages
├── package.json        # Build configuration
└── scripts/            # Build scripts
```

### Built Files (Production)
```
dist/
├── index.html          # Minified HTML
├── css/style.min.css   # Minified CSS
├── js/main.min.js      # Minified JS
├── services/           # Minified service pages
├── robots.txt          # SEO file
└── .htaccess          # Server configuration
```

## Customization

### Adding New Pages
1. Create HTML file in appropriate directory
2. Add to `scripts/minify-html.js` file list
3. Run build process

### Modifying Optimization
- Edit minification options in `scripts/minify-html.js`
- Adjust CSS/JS build commands in `package.json`
- Modify build pipeline in `.github/workflows/`

### Adding Images
1. Place images in `assets/`, `images/`, or `img/` directories
2. Run `npm run optimize:images`
3. Images will be optimized and copied to dist/

## Troubleshooting

### Common Issues

**Build fails with "command not found"**
- Ensure Node.js 18+ is installed
- Run `npm install` to install dependencies

**HTML validation errors**
- Check HTML structure in source files
- Run `npm run validate:html` for details

**CSS linting errors**
- Run `npm run validate:css` to see issues
- Fix CSS syntax in source files

**Lighthouse performance issues**
- Check network connectivity
- Ensure server is running before test
- Review optimization settings

### Getting Help

For build process issues:
1. Check the console output for error messages
2. Verify all dependencies are installed
3. Ensure file permissions are correct
4. Check that ports 8000-8001 are available

## Performance Monitoring

The build process includes several monitoring tools:

- **Lighthouse**: Web performance auditing
- **HTML Validator**: Markup validation
- **Stylelint**: CSS quality checking
- **Pa11y**: Accessibility testing

Run `npm run analyze` to execute all quality checks.

This build process ensures your website is optimized for:
- ⚡ **Fast loading times**
- 🔍 **Better SEO rankings**  
- ♿ **Accessibility compliance**
- 🛡️ **Security best practices**
- 📱 **Mobile performance**
