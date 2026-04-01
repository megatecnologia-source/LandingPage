<?php
/**
 * Simple PHP Proxy for Telegram Notifications
 * To be hosted on Hostinger.
 */

// --- CONFIGURATION ---
// Tentativa de carregar via Variáveis de Ambiente (Configuração Hpanel)
$botToken = getenv('TELEGRAM_BOT_TOKEN');
$chatId = getenv('TELEGRAM_CHAT_ID');

// Fallback: Carregar de arquivo local protegido (Não rastreado pelo Git)
if (!$botToken && file_exists(__DIR__ . '/config.php')) {
    include_once __DIR__ . '/config.php';
    // No config.php você deve definir: $botToken e $chatId
}
// --- END CONFIGURATION ---

// Set headers for JSON and CORS if needed (though usually same-origin)
header('Content-Type: application/json');

// --- SEGURANÇA REFINADA ---
// Lista de origens permitidas
$allowed_origins = [
    'https://tuntum.megatecnologias.com',
    'https://www.tuntum.megatecnologias.com',
    'http://tuntum.megatecnologias.com',
    'http://localhost:5173' // Para testes locais se houver proxy
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    // Se não houver origin, permitimos o domínio principal como fallback
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

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

if (empty($botToken) || empty($chatId)) {
    // Still send success to frontend to avoid revealing error, but log it internally if possible
    http_response_code(500);
    echo json_encode(['error' => 'Telegram configuration missing on server.']);
    exit;
}

$message = "🚀 *Nova Lead (SGA Tuntum)*\n\n";
foreach ($data as $key => $value) {
    if ($key === '_subject')
        continue;
    $label = ucfirst($key);
    $message .= "*$label*: $value\n";
}
$message .= "\n📅 _" . date('d/m/Y H:i:s') . "_";

$url = "https://api.telegram.org/bot$botToken/sendMessage";
$postData = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Sometimes needed on shared hosting

$result = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    echo json_encode(['success' => true]);
} else {
    http_response_code($httpCode);
    echo json_encode(['error' => 'Failed to send telegram notification', 'response' => json_decode($result, true)]);
}
?>