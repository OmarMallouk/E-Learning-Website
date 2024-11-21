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

$decodedToken = verifyToken('omarito');

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = "SELECT user_id, name FROM users WHERE role = 'student'";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $students = mysqli_fetch_all($result, MYSQLI_ASSOC);
        echo json_encode(["success" => true, "students" => $students]);
    } else {
        echo json_encode(["success" => false, "message" => "No students found."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method."]);
}
?>
