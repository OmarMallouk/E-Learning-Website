<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);
checkAdminRole($decodedToken);

$data = json_decode(file_get_contents("php://input"), true);

$course_id = $data['course_id'] ?? 0;
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$instructors = $data['instructors'] ?? [];

if (empty($course_id) || empty($title)) {
    echo json_encode(['success' => false, 'error' => 'Course ID and title are required']);
    exit;
}

try {
    $stmt = $conn->prepare("UPDATE courses SET title = ?, description = ?, updated_at = NOW() WHERE course_id = ?");
    $stmt->bind_param("ssi", $title, $description, $course_id);
    $stmt->execute();

    $conn->query("DELETE FROM course_instructors WHERE course_id = $course_id"); 
    $instructorStmt = $conn->prepare("INSERT INTO course_instructors (course_id, instructor_id) VALUES (?, ?)");
    foreach ($instructors as $instructor_id) {
        $instructorStmt->bind_param("ii", $course_id, $instructor_id);
        $instructorStmt->execute();
    }

    echo json_encode(['success' => true, 'message' => 'Course updated successfully']);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
