<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit();
}


include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);

if (is_array($decodedToken)) {
    $role = $decodedToken['role'] ?? null;
} else {
    $role = $decodedToken->role ?? null;
}

if (!in_array($role, ['instructor', 'student'])) {
    echo json_encode(['success' => false, 'error' => 'Access denied.']);
    exit;
}

$course_id = $_GET['course_id'] ?? 0;

if (empty($course_id)) {
    echo json_encode(['success' => false, 'error' => 'Course ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM announcements WHERE course_id = ? ORDER BY created_at DESC");
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $announcements = [];
    while ($row = $result->fetch_assoc()) {
        $announcements[] = $row;
    }

    echo json_encode(['success' => true, 'announcements' => $announcements]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
