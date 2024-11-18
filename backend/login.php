<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php'; 
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = 'omarito';

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
    $role = $user['role'];
    $payload = [
        'iss' => 'elearning',
        'iat' => time(),
        'exp' => time() + (60 * 60), // 1 hour 
        'user_id' => $user['user_id'],
        'role' => $role
    ];

    $jwt = JWT::encode($payload, $secret_key, 'HS256');
    if ($role === 'instructor') {
        echo json_encode(['success' => true, 'token' => $jwt, 'message' => 'Instructor access granted']);
    } elseif ($role === 'user') {
        echo json_encode(['success' => true, 'token' => $jwt, 'message' => 'User access granted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Unauthorized role']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid username or password']);
}

$query->close();
$conn->close();
?>