<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit();
}


include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $instructor_id = $decodedToken['user_id']; 

    $query = "SELECT c.course_id, c.title 
          FROM courses c
          INNER JOIN course_instructors ci ON c.course_id = ci.course_id
          WHERE ci.instructor_id = '$instructor_id'";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $courses = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["success" => true, "courses" => $courses]);
    } else {
        echo json_encode(["success" => false, "message" => "No courses found for this instructor."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
