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

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $invite_id = $data['invite_id'];
    $status = $data['status'];

    $updateQuery = "UPDATE invitations SET status = 'declined' WHERE invite_id = '$invite_id'";

    if (mysqli_query($conn, $updateQuery)) {
        echo json_encode(["success" => true, "message" => "Invitation declined."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error declining invitation."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>