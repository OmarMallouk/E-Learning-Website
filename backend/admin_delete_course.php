<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);
checkAdminRole($decodedToken);

$data = json_decode(file_get_contents("php://input"), true);

$course_id = $data['course_id'] ?? 0;

if (empty($course_id)) {
    echo json_encode(['success' => false, 'error' => 'Course ID is required']);
    exit;
}

try {
    $conn->query("DELETE FROM course_instructors WHERE course_id = $course_id");

    $stmt = $conn->prepare("DELETE FROM courses WHERE course_id = ?");
    $stmt->bind_param("i", $course_id);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Course deleted successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
