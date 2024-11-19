<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);

if (is_array($decodedToken)) {
    $role = $decodedToken['role'] ?? null;
    $user_id = $decodedToken['user_id'] ?? null;
} else {
    // if its an object
    $role = $decodedToken->role ?? null;
    $user_id = $decodedToken->user_id ?? null;
}

if ($role !== 'instructor') {
    echo json_encode(['success' => false, 'error' => 'Access denied. Only instructors can post announcements.']);
    exit;
}

error_log(print_r($decodedToken, true));

$data = json_decode(file_get_contents("php://input"), true);

error_log(print_r($data, true));

$course_id = $data['course_id'] ?? 0;
$content = $data['content'] ?? '';

if (empty($course_id) || empty($content)) {
    echo json_encode(['success' => false, 'error' => 'Course ID and content are required']);
    exit;
}

try {
    $stmt = $conn->prepare("INSERT INTO announcements (course_id, instructor_id, content, created_at) VALUES (?, ?, ?, NOW())");
    $stmt->bind_param("iis", $course_id, $user_id, $content);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Announcement posted successfully']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database query failed']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
