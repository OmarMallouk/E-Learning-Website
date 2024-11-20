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


$course_id = $_GET['course_id'] ?? 0;

if (empty($course_id)) {
    echo json_encode(['success' => false, 'error' => 'Course ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM assignments WHERE course_id = ?");
    $stmt->bind_param("i", $course_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $assignments = [];
    while ($row = $result->fetch_assoc()) {
        $assignments[] = $row;
    }

    if (count($assignments) > 0) {
        echo json_encode(['success' => true, 'assignments' => $assignments]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No assignments found for this course']);
    }

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$stmt->close();
$conn->close();
?>
