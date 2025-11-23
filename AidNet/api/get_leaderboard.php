<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/utils.php';

try {
    $db = db_connect();
    
    // Get top volunteers by points
    $sql = 'SELECT id, name, email, role, points, 
                   (SELECT COUNT(*) FROM volunteer_offers WHERE user_id = users.id AND status = "completed") as completed_offers,
                   (SELECT COUNT(*) FROM emergencies WHERE user_id = users.id) as emergencies_reported
            FROM users 
            WHERE role IN ("volunteer", "hospital", "ngo") AND points > 0
            ORDER BY points DESC, completed_offers DESC
            LIMIT 50';
    
    $result = $db->query($sql);
    $rows = [];
    while ($row = $result->fetch_assoc()) {
        // Don't expose full email for privacy
        $row['email'] = substr($row['email'], 0, 3) . '***';
        $rows[] = $row;
    }
    
    json_response(true, $rows);
} catch (Throwable $e) {
    json_response(false, null, 'Server error');
}
