<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

try {
    $db = db_connect();
    $result = $db->query('SELECT id, user_id, title, description, lat, lng, severity, status, created_at FROM emergencies WHERE status IN ("open","in_progress") ORDER BY created_at DESC LIMIT 100');
    $rows = [];
    while ($row = $result->fetch_assoc()) { $rows[] = $row; }
    json_response(true, $rows);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


