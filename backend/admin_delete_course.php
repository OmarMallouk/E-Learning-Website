<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit();
}

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);
checkAdminRole($decodedToken);

$course_id = $_GET['id'] ?? 0;

if (empty($course_id)) {
    echo json_encode(['success' => false, 'error' => 'Course ID is required']);
    exit;
}

$course_id = filter_var($course_id, FILTER_SANITIZE_NUMBER_INT);

try {
    $conn->query("DELETE FROM course_instructors WHERE course_id = $course_id");

    $stmt = $conn->prepare("DELETE FROM courses WHERE course_id = ?");
    $stmt->bind_param("i", $course_id);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to delete course']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
