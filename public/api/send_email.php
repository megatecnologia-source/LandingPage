<?php
/**
 * PHP Native Email Sender for Hostinger
 */

header('Content-Type: application/json');

// Permitir apenas o seu domínio
$allowed_origins = [
    'https://tuntum.megatecnologias.com',
    'https://www.tuntum.megatecnologias.com',
    'http://tuntum.megatecnologias.com',
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

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS')
    exit;

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados inválidos']);
    exit;
}

// CONFIGURAÇÃO DO E-MAIL
$to = "gomesdocarmo@gmail.com";
$subject = "🚀 NOVA PROPOSTA ACEITA - SGA TUNTUM";

$message = "Uma nova proposta foi aprovada pelo site.\n\n";
$message .= "--- DADOS DO CLIENTE ---\n";
foreach ($data as $key => $value) {
    if ($key === '_subject' || is_array($value))
        continue;
    $label = ucfirst($key);
    $message .= "$label: $value\n";
}
$message .= "\nData: " . date('d/m/Y H:i:s');

$headers = "From: contato@tuntum.megatecnologias.com\r\n";
$headers .= "Reply-To: " . $data['email'] . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'E-mail enviado com sucesso!']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Falha ao enviar e-mail pelo servidor Hostinger.']);
}
?>