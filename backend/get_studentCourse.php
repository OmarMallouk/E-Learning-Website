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

$query = "SELECT courses.course_id, courses.title 
          FROM enrollments 
          JOIN courses ON enrollments.course_id = courses.course_id 
          WHERE enrollments.student_id = '$student_id'";

$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $courses = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo json_encode(["success" => true, "courses" => $courses]);
} else {
    echo json_encode(["success" => false, "message" => "No courses found."]);
}

?>
