<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

// Verify the token and get decoded user data
$decodedToken = verifyToken($secret_key);

// Check if token decoded
if ($decodedToken === null) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized. No token provided.']);
    exit;
}

$student_id = $decodedToken['user_id'] ?? null;
$role = $decodedToken['role'] ?? null;

if ($role !== 'student') {
    echo json_encode(['success' => false, 'error' => 'Access denied. Only students can enroll in courses.']);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$course_id = $data['course_id'] ?? null;

if (empty($course_id)) {
    echo json_encode(['success' => false, 'error' => 'Course ID is required.']);
    exit;
}

$query = $conn->prepare("SELECT * FROM courses WHERE course_id = ?");
$query->bind_param("i", $course_id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows == 0) {
    echo json_encode(['success' => false, 'error' => 'Course not found.']);
    exit;
}

try {
    $enrollment_date = date('Y-m-d H:i:s'); 
    $stmt = $conn->prepare("INSERT INTO enrollments (course_id, student_id, enrollment_date) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $course_id, $student_id, $enrollment_date);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Enrollment successful.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to enroll.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
