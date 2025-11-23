<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$p = read_json_body();
require_fields($p, ['user_id','emergency_id']);

$userId = (int)$p['user_id'];
$emergencyId = (int)$p['emergency_id'];

try {
    $db = db_connect();

    // Check emergency exists and open
    $stmt = $db->prepare('SELECT id, status FROM emergencies WHERE id = ? LIMIT 1');
    $stmt->bind_param('i', $emergencyId);
    $stmt->execute();
    $res = $stmt->get_result();
    $em = $res->fetch_assoc();
    if (!$em) json_response(false, null, 'Emergency not found');

    $stmt = $db->prepare('INSERT INTO volunteer_offers (emergency_id, user_id, status) VALUES (?, ?, "offered")');
    $stmt->bind_param('ii', $emergencyId, $userId);
    $stmt->execute();
    $offerId = $stmt->insert_id;

    log_action($db, $userId, 'offer_help', 'offer_id=' . $offerId);
    json_response(true, ['id' => $offerId]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


