<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

try {
    $db = db_connect();
    $sql = 'SELECT f.id, f.user_id, f.title, f.description, f.target_amount, COALESCE(SUM(d.amount),0) as raised, f.created_at
            FROM fundraisers f
            LEFT JOIN donations d ON d.fundraiser_id = f.id
            GROUP BY f.id
            ORDER BY f.created_at DESC
            LIMIT 100';
    $res = $db->query($sql);
    $rows = [];
    while ($row = $res->fetch_assoc()) { $rows[] = $row; }
    json_response(true, $rows);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}


