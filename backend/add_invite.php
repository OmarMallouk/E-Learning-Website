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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $instructor_id = $data['instructor_id'];
    $student_id = $data['student_id'];
    $course_id = $data['course_id'];
    
    $query = "INSERT INTO invitations (instructor_id, student_id, course_id, status) VALUES ('$instructor_id', '$student_id', '$course_id', 'pending')";

    if (mysqli_query($conn, $query)) {
        echo json_encode(["success" => true, "message" => "Invitation sent successfully!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error sending invitation"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
