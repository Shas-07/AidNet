<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// DB config - change if your credentials differ
$host = "localhost";
$user = "root";
$pass = "";
$dbname = "aidnet";

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "DB connection failed"]);
    exit;
}

if (!isset($_GET['bank_name'])) {
    echo json_encode([]); // return empty array if missing param
    $conn->close();
    exit;
}

$bank_name = trim($_GET['bank_name']);

// Try to match rows using LIKE with wildcards to be tolerant of small name differences
$like = "%{$bank_name}%";

// Prepare statement
$stmt = $conn->prepare("SELECT blood_group, units FROM blood_stock WHERE bank_name LIKE ? COLLATE utf8mb4_general_ci");
if (!$stmt) {
    echo json_encode([]); // fail gracefully
    $conn->close();
    exit;
}
$stmt->bind_param("s", $like);
$stmt->execute();
$result = $stmt->get_result();

$stock = [];
while ($row = $result->fetch_assoc()) {
    // normalize keys
    $stock[] = [
        "blood_group" => $row['blood_group'],
        "units" => (int)$row['units']
    ];
}

echo json_encode($stock);

$stmt->close();
$conn->close();
?>
