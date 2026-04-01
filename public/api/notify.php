<?php
/**
 * PHP Proxy for Telegram Notifications
 * Secure implementation with SSL verification, JSON payload, HTML parsing, and rate limiting
 */

// Load configuration from environment variables (hPanel)
$botToken = getenv('TELEGRAM_BOT_TOKEN');
$chatId = getenv('TELEGRAM_CHAT_ID');

// Fallback: Load from local protected file (not tracked by Git)
if ((empty($botToken) || empty($chatId)) && file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
}

// Headers
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
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Honeypot check
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!empty($data['bot-field'])) {
    echo json_encode(['success' => true]);
    exit;
}

// Rate limiting via PHP session
session_start();

$ip = $_SERVER['REMOTE_ADDR'];
$sessionKey = 'telegram_attempts_' . md5($ip);
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

// Validate configuration
if (empty($botToken) || empty($chatId)) {
    error_log('[notify.php] ERRO: Credenciais do Telegram não configuradas.');
    http_response_code(500);
    echo json_encode(['error' => 'Configuração interna ausente.']);
    exit;
}

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Build message with HTML formatting (more robust than Markdown)
$message = "🚀 <b>Nova Lead (SGA Tuntum)</b>\n\n";

foreach ($data as $key => $value) {
    if ($key === '_subject' || $key === 'bot-field') {
        continue;
    }
    $label = ucfirst($key);
    $message .= "<b>$label:</b> " . sanitize($value) . "\n";
}

$message .= "\n📅 <i>" . date('d/m/Y H:i:s') . "</i>";

// Limit message to 4000 characters (Telegram API limit is 4096)
if (strlen($message) > 4000) {
    $message = substr($message, 0, 3997) . "...";
}

// Telegram API call
$url = "https://api.telegram.org/bot$botToken/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'HTML'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

// Secure SSL/TLS
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    error_log('[notify.php] cURL error: ' . $curlError);
}

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true]);
} else {
    error_log('[notify.php] Telegram API error. HTTP: ' . $httpCode . ', Response: ' . $result);
    http_response_code($httpCode);
    echo json_encode(['error' => 'Failed to send telegram notification']);
}