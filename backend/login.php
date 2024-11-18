<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php'; 

$data = json_decode(file_get_contents("php://input"), true);

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Username and password are required']);
    exit;
}

$sql = "SELECT * FROM users WHERE username = ?";
$query = $conn->prepare($sql);
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    echo json_encode(['success' => true, 'user_id' => $user['user_id']]);
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
}
$query->close();
$conn->close();
?>
