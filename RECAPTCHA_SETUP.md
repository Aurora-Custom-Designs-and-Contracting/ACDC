# reCAPTCHA Setup Instructions

This website now includes Google reCAPTCHA v2 integration to protect the contact form from spam and bots.

## Files Added

- `recaptcha-config.js` - JavaScript configuration for reCAPTCHA initialization and form validation
- `.env.recaptcha` - Environment file for storing reCAPTCHA keys securely
- `RECAPTCHA_SETUP.md` - This instruction file

## Setup Steps

### 1. Get reCAPTCHA Keys
1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)
2. Sign in with your Google account
3. Click "Create" to add a new site
4. Choose "reCAPTCHA v2" and select "I'm not a robot" Checkbox
5. Add your domains:
   - `auroracdc.com` (your live domain)
   - `localhost` (for local testing)
6. Accept the terms and click "Submit"
7. Copy your Site Key and Secret Key

### 2. Configure Your Keys
1. Open the `recaptcha-config.js` file
2. Replace `YOUR_SITE_KEY_HERE` with your actual Site Key
3. The Secret Key should be stored securely on your server (not in client-side code)

### 3. Testing
For testing purposes, you can use Google's test keys:
- **Site Key**: `6LenW9krAAAAAPRyYWFr5YVcxOW9XmYQZfk_KSa0`
- **Secret Key**: `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`

**Note**: Test keys will always pass validation, so make sure to use your real keys in production.

### 4. Server-Side Verification (Important!)
The current implementation handles client-side validation, but for security, you must also verify the reCAPTCHA response on your server. Your form processing endpoint should:

1. Receive the `recaptchaResponse` value from the form
2. Make a POST request to `https://www.google.com/recaptcha/api/siteverify`
3. Include your Secret Key and the response token
4. Verify the response is valid before processing the form

Example server-side verification (PHP):
```php
$secret = 'YOUR_SECRET_KEY';
$response = $_POST['recaptchaResponse'];
$remoteip = $_SERVER['REMOTE_ADDR'];

$url = 'https://www.google.com/recaptcha/api/siteverify';
$data = [
    'secret' => $secret,
    'response' => $response,
    'remoteip' => $remoteip
];

$options = [
    'http' => [
        'header' => "Content-type: application/x-www-form-urlencoded\r\n",
        'method' => 'POST',
        'content' => http_build_query($data)
    ]
];

$context = stream_context_create($options);
$result = file_get_contents($url, false, $context);
$resultJson = json_decode($result);

if ($resultJson->success) {
    // reCAPTCHA verified, process the form
} else {
    // reCAPTCHA failed, reject the submission
}
```

## Security Notes

- Never expose your Secret Key in client-side code
- Always verify reCAPTCHA responses on the server-side
- The `.env.recaptcha` file should not be committed to version control
- Consider adding `.env.recaptcha` to your `.gitignore` file

## Features Included

✅ reCAPTCHA widget integration in contact form  
✅ Client-side form validation  
✅ Visual feedback for users  
✅ Responsive design (scaled for mobile)  
✅ Automatic token refresh on expiration  
✅ Form submission prevention without verification  

## Troubleshooting

**reCAPTCHA not showing**: Check that your Site Key is correct and your domain is registered in the reCAPTCHA console.

**Form not submitting**: Ensure the reCAPTCHA is completed and the response token is being captured.

**Console errors**: Check the browser developer console for JavaScript errors and verify all script files are loading correctly.

## Support

For issues with reCAPTCHA integration, check the [Google reCAPTCHA documentation](https://developers.google.com/recaptcha/docs/display) or contact your web developer.
