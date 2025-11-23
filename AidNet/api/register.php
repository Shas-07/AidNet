<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$payload = read_json_body();
require_fields($payload, ['name', 'email', 'password', 'role']);

$name = trim($payload['name']);
$email = strtolower(trim($payload['email']));
$password = $payload['password'];
$role = strtolower(trim($payload['role']));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, null, 'Invalid email');
}

$allowedRoles = ['patient','volunteer','hospital','ngo','admin'];
if (!in_array($role, $allowedRoles, true)) {
    json_response(false, null, 'Invalid role');
}

$hash = password_hash($password, PASSWORD_DEFAULT);

try {
    $db = db_connect();

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows > 0) {
        json_response(false, null, 'Email already registered');
    }
    $stmt->close();

    $points = 0;
    $stmt = $db->prepare('INSERT INTO users (name, email, password_hash, role, points) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssi', $name, $email, $hash, $role, $points);
    $stmt->execute();
    $userId = $stmt->insert_id;

    log_action($db, $userId, 'register', 'role=' . $role);

    json_response(true, ['id' => $userId]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


