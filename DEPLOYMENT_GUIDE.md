# 🚀 Production Deployment Guide
## Aurora CDC Secure Contact Form with reCAPTCHA

This guide will help you deploy your secure contact form with server-side reCAPTCHA verification.

## 📋 Overview

You now have two server options:
1. **PHP Version** (Recommended for shared hosting)
2. **Node.js Version** (Better performance, requires VPS/dedicated server)

## 🔧 Pre-Deployment Checklist

### ✅ Security Status
- [x] reCAPTCHA secret key removed from client-side code
- [x] Environment files protected with .gitignore
- [x] Secure form submission implemented
- [x] Rate limiting and validation added

### ✅ Files Created
```
📁 AuroraCDC/
├── 🔒 .env.recaptcha (local only - not in git)
├── 📄 .env.recaptcha.example
├── ⚙️ .gitignore
├── 🌐 index.html (updated form)
├── 🔧 process-contact.php
├── 🟢 server.js (Node.js alternative)
├── 📦 package.json
├── 🛡️ secure-form-handler.js
└── 📚 Documentation files
```

---

## 🌐 Option 1: PHP Deployment (Shared Hosting)

### Step 1: Upload Files
Upload these files to your web hosting:
```bash
# Required files for PHP deployment:
- index.html
- process-contact.php
- recaptcha-config.js
- secure-form-handler.js
- .env.recaptcha
- (all your existing CSS, JS, and image files)
```

### Step 2: Configure Environment
1. Create `.env.recaptcha` on your server:
```bash
RECAPTCHA_SITE_KEY=6LdM47QrAAAAAJNMMFVqCpZYwICljrO_PasxiiBY
RECAPTCHA_SECRET_KEY=6LdM47QrAAAAAMtkHWnzUWRZrXjJueAACr_XwYjG
```

### Step 3: Set Permissions
```bash
# Set proper file permissions
chmod 644 *.php *.html *.js *.css
chmod 600 .env.recaptcha
chmod 755 logs/ (create this directory)
```

### Step 4: Test Form
1. Visit your website
2. Fill out the contact form
3. Complete reCAPTCHA
4. Submit and verify you receive the email

---

## 🟢 Option 2: Node.js Deployment (VPS/Cloud)

### Step 1: Server Setup
```bash
# Install Node.js (version 16+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 2: Deploy Application
```bash
# Upload files to your server
scp -r /path/to/AuroraCDC user@your-server:/var/www/aurora-cdc

# Navigate to project directory
cd /var/www/aurora-cdc

# Install dependencies
npm install

# Create environment file
cp .env.recaptcha.example .env.recaptcha
# Edit .env.recaptcha with your actual keys
```

### Step 3: Configure Environment Variables
```bash
# Add to .env.recaptcha:
RECAPTCHA_SITE_KEY=6LdM47QrAAAAAJNMMFVqCpZYwICljrO_PasxiiBY
RECAPTCHA_SECRET_KEY=6LdM47QrAAAAAMtkHWnzUWRZrXjJueAACr_XwYjG

# Email configuration (choose one):
# Gmail:
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Or SMTP:
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password

# Server settings:
PORT=3000
```

### Step 4: Start Application
```bash
# Development mode
npm run dev

# Production mode
npm start

# Or with PM2 (recommended for production)
npm install -g pm2
pm2 start server.js --name "aurora-contact-form"
pm2 startup
pm2 save
```

### Step 5: Setup Reverse Proxy (Nginx)
```nginx
# /etc/nginx/sites-available/auroracdc.com
server {
    listen 80;
    server_name auroracdc.com www.auroracdc.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 SSL Certificate Setup

### For Both Deployments:
```bash
# Using Certbot (Let's Encrypt)
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d auroracdc.com -d www.auroracdc.com
sudo certbot renew --dry-run
```

---

## 📧 Email Configuration

### Gmail Setup:
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use app password in EMAIL_PASS

### SMTP Setup:
Ask your hosting provider for SMTP settings or use services like:
- SendGrid
- Mailgun  
- AWS SES

---

## 🧪 Testing Your Deployment

### Test Checklist:
```bash
# 1. Basic form loading
curl -I https://auroracdc.com

# 2. reCAPTCHA widget appears
# Visit site and check console for errors

# 3. Form submission (PHP)
curl -X POST https://auroracdc.com/process-contact.php \
  -d "name=Test User" \
  -d "email=test@example.com" \
  -d "message=Test message" \
  -d "agree=on" \
  -d "recaptchaResponse=test-token"

# 4. Health check (Node.js)
curl https://auroracdc.com/health
```

### Expected Results:
- ✅ Form loads without JavaScript errors
- ✅ reCAPTCHA widget appears and functions
- ✅ Form validation works (try submitting empty form)
- ✅ Success message appears after valid submission
- ✅ Email is received at info@AuroraCDC.com

---

## 🚨 Troubleshooting

### Common Issues:

**reCAPTCHA not loading:**
```bash
# Check site key is correct
grep SITE_KEY recaptcha-config.js
# Verify domain is registered in Google reCAPTCHA console
```

**Form not submitting:**
```bash
# Check browser console for errors
# Verify PHP file permissions
# Check server error logs
tail -f /var/log/apache2/error.log  # Apache
tail -f /var/log/nginx/error.log    # Nginx
```

**Emails not sending:**
```bash
# Test PHP mail function
php -r "mail('test@example.com', 'Test', 'Test message');"

# Check email credentials
# Verify SMTP settings with your provider
```

### Debug Mode:
For PHP, temporarily enable errors:
```php
// Add to top of process-contact.php for debugging only
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

---

## 🔄 Updates & Maintenance

### Regular Tasks:
1. **Monitor logs** for errors and spam attempts
2. **Update dependencies** (Node.js packages)
3. **Check reCAPTCHA** effectiveness
4. **Backup** `.env.recaptcha` file
5. **Test form** monthly

### Log Locations:
- PHP: `logs/contact_form.log` and `logs/contact_form_errors.log`
- Node.js: PM2 logs via `pm2 logs`

---

## 📞 Support

If you need help with deployment:

1. **Check logs first** - most issues are logged
2. **Test with curl** to isolate client vs server issues
3. **Use browser dev tools** to check JavaScript errors
4. **Verify reCAPTCHA setup** in Google Console

### Quick Commands:
```bash
# View recent logs
tail -20 logs/contact_form.log

# Test form endpoint
curl -X POST localhost:3000/process-contact --data-raw '{}'

# Check server status
systemctl status nginx  # or apache2
pm2 status              # for Node.js
```

---

## ✅ Production Checklist

Before going live:
- [ ] SSL certificate installed and working
- [ ] reCAPTCHA keys are production keys (not test keys)
- [ ] Email delivery tested and working
- [ ] Form submission tested from actual website
- [ ] Error handling tested (try invalid inputs)
- [ ] Rate limiting tested (try multiple rapid submissions)
- [ ] Mobile responsiveness verified
- [ ] Browser compatibility tested
- [ ] Analytics/monitoring set up

**Your contact form is now secure and production-ready! 🎉**
