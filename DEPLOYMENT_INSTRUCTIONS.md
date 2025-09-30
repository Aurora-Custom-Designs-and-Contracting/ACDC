# Deployment Instructions - Secure reCAPTCHA Implementation

## Overview
Your website now has a complete secure reCAPTCHA implementation with server-side verification. This guide will help you deploy the solution to your production hosting environment.

## Current Setup Status ✅
- [x] Client-side reCAPTCHA v2 Invisible Badge configured with site key only
- [x] Secret keys secured in `.env.recaptcha` (not committed to git)
- [x] `.gitignore` configured to protect sensitive files
- [x] PHP server-side processor (`process-contact.php`) created
- [x] Node.js server alternative (`server.js`) created
- [x] Enhanced form handler (`secure-form-handler.js`) implemented
- [x] Contact form updated to use secure endpoints

## Deployment Options

### Option 1: PHP Deployment (Recommended for most shared hosting)

**Requirements:**
- PHP 7.4 or higher
- `curl` extension enabled
- Email functionality (mail() or SMTP)

**Steps:**
1. Upload these files to your web server:
   ```
   process-contact.php
   .env.recaptcha (create on server - see below)
   secure-form-handler.js
   recaptcha-config.js
   index.html (updated version)
   ```

2. Create `.env.recaptcha` file on your server:
   ```
   RECAPTCHA_SECRET_KEY=6LenW9krAAAAAPRyYWFr5YVcxOW9XmYQZfk_KSa0_secret_key
   ADMIN_EMAIL=your-email@domain.com
   FROM_EMAIL=noreply@yourdomain.com
   ```

3. Set proper file permissions:
   ```bash
   chmod 644 process-contact.php
   chmod 600 .env.recaptcha
   ```

4. Test the contact form on your live site

### Option 2: Node.js Deployment

**Requirements:**
- Node.js 14+ environment
- npm or yarn package manager

**Steps:**
1. Upload project files and install dependencies:
   ```bash
   npm install express helmet express-rate-limit express-validator nodemailer dotenv
   ```

2. Create `.env` file:
   ```
   RECAPTCHA_SECRET_KEY=6LenW9krAAAAAPRyYWFr5YVcxOW9XmYQZfk_KSa0_secret_key
   ADMIN_EMAIL=your-email@domain.com
   FROM_EMAIL=noreply@yourdomain.com
   SMTP_HOST=your-smtp-server.com
   SMTP_PORT=587
   SMTP_USER=your-smtp-username
   SMTP_PASS=your-smtp-password
   PORT=3000
   ```

3. Start the server:
   ```bash
   node server.js
   ```

4. For production, use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "aurora-contact-server"
   ```

## Important Security Notes

### Environment Variables
- **Never commit** `.env` files to git
- Store secret keys securely on your server
- Use different keys for development/production if needed

### File Permissions
- `.env` files should be readable only by your web server process
- PHP files should have standard web permissions (644)

### Testing Checklist
Before going live, verify:
- [ ] Contact form loads without errors
- [ ] reCAPTCHA widget appears and functions
- [ ] Form submission works with valid data
- [ ] Form rejects submissions without reCAPTCHA
- [ ] Email notifications are received
- [ ] Error handling works properly
- [ ] Rate limiting prevents spam (Node.js version)

## Troubleshooting

### Common Issues

**reCAPTCHA not loading:**
- Check that your domain is registered with Google reCAPTCHA
- Verify the site key in `recaptcha-config.js` is correct
- Ensure your domain matches reCAPTCHA settings (including www/non-www)

**Form submissions failing:**
- Check server error logs
- Verify `.env` file exists and has correct permissions
- Test reCAPTCHA secret key with Google's API
- Check email server configuration

**Email not sending (PHP):**
- Verify your server supports mail() function
- Check spam folders
- Consider using SMTP instead of mail() for better delivery

**SMTP issues (Node.js):**
- Verify SMTP credentials in `.env` file
- Check firewall settings for SMTP ports
- Test SMTP connection separately

### Log Files
- PHP errors: Check your hosting provider's error logs
- Node.js: Check console output or PM2 logs (`pm2 logs`)

## Hosting Provider Specific Notes

### Shared Hosting (cPanel, etc.)
- Upload PHP files to `public_html` or equivalent
- Place `.env.recaptcha` outside web-accessible directory if possible
- Use File Manager or FTP for uploads

### VPS/Dedicated Servers
- Consider using Node.js option for better performance
- Set up proper firewall rules
- Configure reverse proxy (nginx/Apache) if using Node.js

### Cloud Platforms (AWS, Google Cloud, etc.)
- Use environment variables instead of `.env` files
- Set up proper security groups/firewall rules
- Consider using managed email services (SES, SendGrid)

## Support
If you encounter issues:
1. Check server error logs first
2. Verify all files are uploaded correctly
3. Test reCAPTCHA keys with Google's verification tool
4. Ensure your domain is properly configured in reCAPTCHA settings

## Security Maintenance
- Regularly update server software
- Monitor form submissions for abuse
- Review and rotate keys periodically
- Keep backups of working configurations

---

Your reCAPTCHA implementation is now production-ready with proper server-side verification, security best practices, and protection against spam and abuse.
