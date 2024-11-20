<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit();
}



include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);


$data = json_decode(file_get_contents("php://input"), true);

$course_id = $data['course_id'] ?? 0;
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$due_date = $data['due_date'] ?? '';

if (empty($course_id) || empty($title) || empty($description) || empty($due_date)) {
    echo json_encode(['success' => false, 'error' => 'All fields (course_id, title, description, due_date) are required']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO assignments (course_id, title, description, due_date, created_at) VALUES (?, ?, ?, ?, NOW())");
    $stmt->bind_param("isss", $course_id, $title, $description, $due_date);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Assignment posted successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
