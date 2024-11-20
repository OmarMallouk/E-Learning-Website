<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'connection.php'; 
require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = 'omarito';

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$password = $data['password'] ?? '';

if (empty($name) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'name and password are required']);
    exit;
}

$sql = "SELECT * FROM users WHERE name = ?";
$query = $conn->prepare($sql);
$query->bind_param("s", $name);
$query->execute();
$result = $query->get_result();
$user = $result->fetch_assoc();

if ($user && password_verify($password, $user['password'])) {
    $role = trim($user['role']); // Remove whitespace
    error_log("User role: $role"); 

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
    } elseif ($role === 'student') {
        echo json_encode(['success' => true, 'token' => $jwt, 'message' => 'Student access granted']);
    } elseif ($role === 'admin') {
        echo json_encode(['success' => true, 'token' => $jwt, 'message' => 'Admin access granted']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Unauthorized role']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid name or password']);
}

$query->close();
$conn->close();
?>
