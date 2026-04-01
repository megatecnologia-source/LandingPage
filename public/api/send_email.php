<?php
/**
 * PHP Native Email Sender for Hostinger
 * Secure implementation with sanitization, honeypot, and rate limiting
 */

header('Content-Type: application/json');

// CORS
$allowed_origins = [
    'https://tuntum.megatecnologias.com',
    'https://www.tuntum.megatecnologias.com',
    'http://localhost:5173'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://tuntum.megatecnologias.com');
}

header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Honeypot check - return success silently if bot fills this field
if (!empty($_POST['bot-field']) || !empty($_GET['bot-field'])) {
    echo json_encode(['success' => true, 'message' => 'Form submitted successfully.']);
    exit;
}

// Rate limiting via PHP session
session_start();

$ip = $_SERVER['REMOTE_ADDR'];
$sessionKey = 'email_attempts_' . md5($ip);
$maxAttempts = 3;
$windowSeconds = 600; // 10 minutes

if (!isset($_SESSION[$sessionKey])) {
    $_SESSION[$sessionKey] = ['count' => 0, 'first' => time()];
}

if (time() - $_SESSION[$sessionKey]['first'] > $windowSeconds) {
    $_SESSION[$sessionKey] = ['count' => 0, 'first' => time()];
}

if ($_SESSION[$sessionKey]['count'] >= $maxAttempts) {
    http_response_code(429);
    echo json_encode(['error' => 'Muitas tentativas. Aguarde alguns minutos.']);
    exit;
}

$_SESSION[$sessionKey]['count']++;

// Sanitize function
function sanitize(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

// Parse JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit;
}

// Validate user email - prevents Header Injection
$userEmail = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$userEmail) {
    http_response_code(400);
    echo json_encode(['error' => 'E-mail inválido.']);
    exit;
}

// Sanitize all fields
$sanitizedData = [];
foreach ($data as $key => $value) {
    if ($key === '_subject' || is_array($value)) {
        continue;
    }
    $sanitizedData[$key] = sanitize($value);
}

// Build email
$to = "gomesdocarmo@gmail.com";
$subject = "🚀 NOVA PROPOSTA ACEITA - SGA TUNTUM";

$message = "Uma nova proposta foi aprovada pelo site.\n\n";
$message .= "--- DADOS DO CLIENTE ---\n";
foreach ($sanitizedData as $key => $value) {
    $label = ucfirst($key);
    $message .= "$label: $value\n";
}
$message .= "\nData: " . date('d/m/Y H:i:s');

// Headers with proper UTF-8 and MIME
$headers  = "From: SGA Tuntum <noreply@tuntum.megatecnologias.com>\r\n";
$headers .= "Reply-To: " . $userEmail . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'E-mail enviado com sucesso!']);
} else {
    error_log('[send_email.php] mail() returned false. Check PHP error logs.');
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao enviar e-mail pelo servidor Hostinger.']);
}