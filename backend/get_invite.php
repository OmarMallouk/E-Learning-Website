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

$student_id = $decodedToken['user_id'];

$query = "SELECT invitations.invite_id, courses.title AS course_title, courses.course_id 
          FROM invitations 
          JOIN courses ON invitations.course_id = courses.course_id 
          WHERE invitations.student_id = '$student_id' AND invitations.status = 'pending'";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $invitations = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo json_encode(["success" => true, "invitations" => $invitations]);
} else {
    echo json_encode(["success" => false, "message" => "No invitations found."]);
}

?>
