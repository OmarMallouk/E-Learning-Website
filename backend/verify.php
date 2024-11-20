<?php
include 'connection.php';
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;


$secret_key = 'omarito'; 

function verifyToken($secret_key) {
    $headers = apache_request_headers();
    if (!isset($headers['Authorization'])) {
        echo json_encode(['success' => false, 'error' => 'Token not provided']);
        http_response_code(401); 
        exit;
    }

    // Extract the token from the Authorization header
    $token = str_replace('Bearer ', '', $headers['Authorization']);

    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        return (array) $decoded; 
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => 'Invalid token']);
        http_response_code(403); // Forbidden
        exit;
    }
}

// Function to check if the user's role is 'admin'
function checkAdminRole($decodedToken) {
    if ($decodedToken['role'] !== 'admin') {
        echo json_encode(['success' => false, 'error' => 'Access denied: Admins only']);
        http_response_code(403); 
        exit;
    }
}
?>
