<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$p = read_json_body();
require_fields($p, ['name', 'email', 'feedback']);

$name = trim($p['name']);
$email = strtolower(trim($p['email']));
$feedback = trim($p['feedback']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(false, null, 'Invalid email');
}

// Get user_id if user is logged in (optional)
$userId = null;
if (isset($p['user_id']) && !empty($p['user_id'])) {
    $userId = (int)$p['user_id'];
}

try {
    $db = db_connect();

    // Check if feedback table exists, if not create it
    $checkTable = $db->query("SHOW TABLES LIKE 'feedback'");
    if ($checkTable->num_rows == 0) {
        $db->query("CREATE TABLE IF NOT EXISTS feedback (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT DEFAULT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(190) NOT NULL,
            feedback TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        )");
    }

    $stmt = $db->prepare('INSERT INTO feedback (user_id, name, email, feedback) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('isss', $userId, $name, $email, $feedback);
    $stmt->execute();
    $id = $stmt->insert_id;

    if ($userId) {
        log_action($db, $userId, 'submit_feedback', 'feedback_id=' . $id);
    }

    json_response(true, ['id' => $id]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}
