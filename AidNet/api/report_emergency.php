<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$p = read_json_body();
require_fields($p, ['user_id','title','description','lat','lng','severity']);

$userId = (int)$p['user_id'];
$title = trim($p['title']);
$description = trim($p['description']);
$lat = (float)$p['lat'];
$lng = (float)$p['lng'];
$severity = strtolower(trim($p['severity']));

$allowedSev = ['low','medium','high'];
if (!in_array($severity, $allowedSev, true)) {
    json_response(false, null, 'Invalid severity');
}

try {
    $db = db_connect();
    $stmt = $db->prepare('INSERT INTO emergencies (user_id, title, description, lat, lng, severity, status) VALUES (?, ?, ?, ?, ?, ?, "open")');
    $stmt->bind_param('issdds', $userId, $title, $description, $lat, $lng, $severity);
    $stmt->execute();
    $id = $stmt->insert_id;
    log_action($db, $userId, 'report_emergency', 'id=' . $id);
    json_response(true, ['id' => $id]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


