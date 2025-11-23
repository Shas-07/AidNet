<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$p = read_json_body();
require_fields($p, ['user_id','title','description','target_amount']);

$userId = (int)$p['user_id'];
$title = trim($p['title']);
$description = trim($p['description']);
$target = (int)$p['target_amount'];
if ($target < 1) json_response(false, null, 'Invalid target amount');

try {
    $db = db_connect();
    $stmt = $db->prepare('INSERT INTO fundraisers (user_id, title, description, target_amount) VALUES (?, ?, ?, ?)');
    $stmt->bind_param('issi', $userId, $title, $description, $target);
    $stmt->execute();
    $id = $stmt->insert_id;
    log_action($db, $userId, 'create_fundraiser', 'id=' . $id);
    json_response(true, ['id' => $id]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


