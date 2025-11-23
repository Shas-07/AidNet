<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$p = read_json_body();
require_fields($p, ['user_id','fundraiser_id','amount']);

$userId = (int)$p['user_id'];
$fundraiserId = (int)$p['fundraiser_id'];
$amount = (int)$p['amount'];
if ($amount < 1) json_response(false, null, 'Invalid amount');

try {
    $db = db_connect();

    $stmt = $db->prepare('INSERT INTO donations (fundraiser_id, user_id, amount) VALUES (?, ?, ?)');
    $stmt->bind_param('iii', $fundraiserId, $userId, $amount);
    $stmt->execute();
    $id = $stmt->insert_id;

    log_action($db, $userId, 'donate', 'donation_id=' . $id);
    json_response(true, ['id' => $id]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


