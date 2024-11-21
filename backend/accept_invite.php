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

if (!isset($decodedToken['user_id'])) {
    echo json_encode(["success" => false, "message" => "Invalid token."]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $invite_id = $data['invite_id'];
    $status = $data['status'];
    $course_id = $data['course_id'];

    if ($status == 'accepted') {
        $updateQuery = "UPDATE invitations SET status = 'accepted' WHERE invite_id = '$invite_id'";
        if (mysqli_query($conn, $updateQuery)) {
            $student_id = $decodedToken['user_id'];
            
            $insertQuery = "INSERT INTO enrollments (student_id, course_id) VALUES ('$student_id', '$course_id')";
            if (mysqli_query($conn, $insertQuery)) {
                echo json_encode(["success" => true, "message" => "Invitation accepted and enrolled in the course."]);
            } else {
                echo json_encode(["success" => false, "message" => "Error enrolling in the course."]);
            }
        } else {
            echo json_encode(["success" => false, "message" => "Error accepting invitation."]);
        }
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
