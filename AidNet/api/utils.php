<?php
header('Content-Type: application/json');

function read_json_body(): array {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    return is_array($data) ? $data : [];
}

function json_response(bool $success, $data = null, string $error = null): void {
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'data' => $success ? $data : null,
        'error' => $success ? null : $error,
    ]);
    exit;
}

function require_fields(array $payload, array $fields): void {
    foreach ($fields as $f) {
        if (!isset($payload[$f]) || $payload[$f] === '') {
            json_response(false, null, 'Missing field: ' . $f);
        }
    }
}

function log_action(mysqli $db, int $userId, string $action, string $details = ''): void {
    $stmt = $db->prepare('INSERT INTO action_logs (user_id, action, details) VALUES (?, ?, ?)');
    $stmt->bind_param('iss', $userId, $action, $details);
    $stmt->execute();
}


