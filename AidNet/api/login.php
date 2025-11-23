<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$payload = read_json_body();
require_fields($payload, ['email', 'password']);

$email = strtolower(trim($payload['email']));
$password = $payload['password'];

try {
    $db = db_connect();

    $stmt = $db->prepare('SELECT id, name, email, password_hash, role, points FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        json_response(false, null, 'Invalid credentials');
    }

    log_action($db, (int)$user['id'], 'login');

    unset($user['password_hash']);
    json_response(true, $user);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


