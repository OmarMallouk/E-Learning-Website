<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);

if ($decodedToken === null) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized. No token provided.']);
    exit;
}

$student_id = $decodedToken['user_id'] ?? null;
$role = $decodedToken['role'] ?? null;

if ($role !== 'student') {
    echo json_encode(['success' => false, 'error' => 'Access denied. Only students can view course streams.']);
    exit;
}

$course_id = $_GET['course_id'] ?? null;

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

$announcementsQuery = $conn->prepare("SELECT * FROM announcements WHERE course_id = ? ORDER BY created_at DESC");
$announcementsQuery->bind_param("i", $course_id);
$announcementsQuery->execute();
$announcementsResult = $announcementsQuery->get_result();

$announcements = [];
while ($announcement = $announcementsResult->fetch_assoc()) {
    $announcements[] = $announcement;
}

$assignmentsQuery = $conn->prepare("SELECT * FROM assignments WHERE course_id = ? ORDER BY due_date ASC");
$assignmentsQuery->bind_param("i", $course_id);
$assignmentsQuery->execute();
$assignmentsResult = $assignmentsQuery->get_result();

$assignments = [];
while ($assignment = $assignmentsResult->fetch_assoc()) {
    $assignments[] = $assignment;
}

$response = [
    'success' => true,
    'course_id' => $course_id,
    'announcements' => $announcements,
    'assignments' => $assignments
];

echo json_encode($response);

$announcementsQuery->close();
$assignmentsQuery->close();
$query->close();
$conn->close();
?>
