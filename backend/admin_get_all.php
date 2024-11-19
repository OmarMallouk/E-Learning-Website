<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php'; 
include 'verify.php';      

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);
checkAdminRole($decodedToken); 

$response = [
    'success' => true,
    'students' => [],
    'instructors' => [],
    'courses' => []
];

try {
    $studentQuery = "SELECT user_id, name, email, created_at, status FROM users WHERE role = 'student'";
    $studentResult = $conn->query($studentQuery);
    while ($row = $studentResult->fetch_assoc()) {
        $response['students'][] = $row;
    }

    $instructorQuery = "SELECT user_id, name, email, created_at, status FROM users WHERE role = 'instructor'";
    $instructorResult = $conn->query($instructorQuery);
    while ($row = $instructorResult->fetch_assoc()) {
        $response['instructors'][] = $row;
    }

    $courseQuery = "SELECT course_id, title, description, created_by, created_at, updated_at FROM courses";
    $courseResult = $conn->query($courseQuery);
    while ($row = $courseResult->fetch_assoc()) {
        $response['courses'][] = $row;
    }

    echo json_encode($response);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

$conn->close();
?>
