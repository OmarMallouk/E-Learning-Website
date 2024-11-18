<?php

require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = 'omarito';

$header = apache_request_headers();

// Check if an Authorization header is provided and handle it
if (isset($header['Authorization'])) {
    $authorizationHeader = $header['Authorization'];
    $headerValue = explode(' ', $authorizationHeader);

    if (isset($headerValue[1])) {
        $jwt = $headerValue[1];

        try {
            $decoded = JWT::decode($jwt, new Key($secret_key, 'HS256'));
            echo "Decoded JWT: ";
            print_r($decoded);
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    } else {
        echo "JWT token not found in the Authorization header.";
    }
} else {
    // Return a message or error indicating that no JWT is provided
    echo "No Authorization header provided. Please include a valid JWT token.";
}

// Optional: Only generate a new JWT if explicitly accessed by another endpoint or condition.
?>
