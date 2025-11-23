<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

$p = read_json_body();
require_fields($p, ['user_id']);

$userId = (int)$p['user_id'];
$blood = isset($p['blood_group']) ? strtoupper(trim($p['blood_group'])) : null;
$phone = isset($p['phone']) ? trim($p['phone']) : null;
$lat = isset($p['lat']) && $p['lat'] !== '' ? (float)$p['lat'] : null;
$lng = isset($p['lng']) && $p['lng'] !== '' ? (float)$p['lng'] : null;

$allowedGroups = ['A+','A-','B+','B-','AB+','AB-','O+','O-'];
if ($blood && !in_array($blood, $allowedGroups, true)) {
    json_response(false, null, 'Invalid blood group');
}

try {
    $db = db_connect();

    $fields = [];
    $types = '';
    $vals = [];

    if ($blood !== null) { $fields[] = 'blood_group = ?'; $types .= 's'; $vals[] = $blood; }
    if ($phone !== null) { $fields[] = 'phone = ?'; $types .= 's'; $vals[] = $phone; }
    if ($lat !== null)   { $fields[] = 'lat = ?'; $types .= 'd'; $vals[] = $lat; }
    if ($lng !== null)   { $fields[] = 'lng = ?'; $types .= 'd'; $vals[] = $lng; }
    $fields[] = 'last_seen = NOW()';

    if (empty($fields)) {
        json_response(false, null, 'No fields to update');
    }

    $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ? LIMIT 1';
    $stmt = $db->prepare($sql);
    $types .= 'i';
    $vals[] = $userId;

    // dynamic bind
    $stmt->bind_param($types, ...$vals);
    $stmt->execute();

    json_response(true, ['updated' => $stmt->affected_rows >= 0]);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}
