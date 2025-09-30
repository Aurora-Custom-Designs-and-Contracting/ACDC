<?php
/**
 * Secure Contact Form Processor with reCAPTCHA Verification
 * Aurora Custom Designs and Contracting, LLC
 * 
 * This script securely processes contact form submissions with reCAPTCHA verification
 * and email delivery, preventing spam and ensuring data integrity.
 */

// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0); // Set to 0 in production

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// CORS headers (adjust origin for your domain)
header('Access-Control-Allow-Origin: https://auroracdc.com');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Load environment variables from .env.recaptcha
function loadEnv($file) {
    if (!file_exists($file)) {
        throw new Exception('Environment file not found: ' . $file);
    }
    
    $env = [];
    $lines = file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue; // Skip comments
        if (strpos($line, '=') === false) continue; // Skip invalid lines
        
        list($key, $value) = explode('=', $line, 2);
        $env[trim($key)] = trim($value);
    }
    
    return $env;
}

try {
    // Load reCAPTCHA configuration
    $env = loadEnv('.env.recaptcha');
    $recaptchaSecretKey = $env['RECAPTCHA_SECRET_KEY'] ?? '';
    
    if (empty($recaptchaSecretKey)) {
        throw new Exception('reCAPTCHA secret key not configured');
    }
    
    // Validate and sanitize input data
    $name = trim(strip_tags($_POST['name'] ?? ''));
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
    $message = trim(strip_tags($_POST['message'] ?? ''));
    $recaptchaResponse = trim(strip_tags($_POST['recaptchaResponse'] ?? ''));
    $agree = filter_input(INPUT_POST, 'agree', FILTER_VALIDATE_BOOLEAN);
    
    // Validation
    $errors = [];
    
    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name is required and must be at least 2 characters';
    }
    
    if (!$email) {
        $errors[] = 'Valid email address is required';
    }
    
    if (empty($message) || strlen($message) < 10) {
        $errors[] = 'Message is required and must be at least 10 characters';
    }
    
    if (!$agree) {
        $errors[] = 'You must agree to the Terms of Service';
    }
    
    if (empty($recaptchaResponse)) {
        $errors[] = 'reCAPTCHA verification is required';
    }
    
    // Return validation errors
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
        exit;
    }
    
    // Verify reCAPTCHA
    function verifyRecaptcha($secretKey, $response, $userIP) {
        $url = 'https://www.google.com/recaptcha/api/siteverify';
        $data = [
            'secret' => $secretKey,
            'response' => $response,
            'remoteip' => $userIP
        ];
        
        $options = [
            'http' => [
                'header' => "Content-type: application/x-www-form-urlencoded\r\n",
                'method' => 'POST',
                'content' => http_build_query($data),
                'timeout' => 10
            ]
        ];
        
        $context = stream_context_create($options);
        $result = @file_get_contents($url, false, $context);
        
        if ($result === false) {
            throw new Exception('Failed to verify reCAPTCHA - network error');
        }
        
        $resultJson = json_decode($result);
        
        if (!$resultJson) {
            throw new Exception('Failed to verify reCAPTCHA - invalid response');
        }
        
        return [
            'success' => $resultJson->success ?? false,
            'errors' => $resultJson->{'error-codes'} ?? [],
            'score' => $resultJson->score ?? null,
            'challenge_ts' => $resultJson->challenge_ts ?? null
        ];
    }
    
    // Get user IP address
    $userIP = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
    
    // Verify reCAPTCHA
    $recaptchaResult = verifyRecaptcha($recaptchaSecretKey, $recaptchaResponse, $userIP);
    
    if (!$recaptchaResult['success']) {
        $errorMessage = 'reCAPTCHA verification failed';
        if (!empty($recaptchaResult['errors'])) {
            $errorMessage .= ': ' . implode(', ', $recaptchaResult['errors']);
        }
        
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $errorMessage
        ]);
        exit;
    }
    
    // Prepare email content
    $to = 'info@AuroraCDC.com';
    $subject = 'New Contact Form Submission - Aurora CDC';
    
    $emailBody = "
New contact form submission from Aurora CDC website

Name: {$name}
Email: {$email}
IP Address: {$userIP}
Timestamp: " . date('Y-m-d H:i:s T') . "
reCAPTCHA Score: " . ($recaptchaResult['score'] ?? 'N/A') . "

Message:
{$message}

---
This message was sent via the secure contact form on auroracdc.com
reCAPTCHA verification: PASSED ✓
";
    
    // Email headers
    $headers = [
        'From: noreply@auroracdc.com',
        'Reply-To: ' . $email,
        'X-Mailer: Aurora CDC Contact Form',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Priority: 3',
        'X-Spam-Check: Passed reCAPTCHA verification'
    ];
    
    // Send email
    $emailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));
    
    if (!$emailSent) {
        throw new Exception('Failed to send email');
    }
    
    // Log successful submission (optional - create logs directory first)
    $logEntry = date('Y-m-d H:i:s') . " - Contact form submission from {$email} (IP: {$userIP}) - SUCCESS\n";
    @file_put_contents('logs/contact_form.log', $logEntry, FILE_APPEND | LOCK_EX);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
        'timestamp' => date('c')
    ]);
    
} catch (Exception $e) {
    // Log error
    $errorLog = date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . " (IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . ")\n";
    @file_put_contents('logs/contact_form_errors.log', $errorLog, FILE_APPEND | LOCK_EX);
    
    // Return generic error to user
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while processing your request. Please try again or contact us directly.',
        'error_id' => uniqid()
    ]);
}
?>
