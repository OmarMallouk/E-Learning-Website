<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Step 1: Verify the token and get the decoded user data
$decodedToken = verifyToken($secret_key);

// Step 2: Check if the token was decoded properly
if ($decodedToken === null) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized. No token provided.']);
    exit;
}

$student_id = $decodedToken['user_id'] ?? null;
$role = $decodedToken['role'] ?? null;

// Ensure the user is a student
if ($role !== 'student') {
    echo json_encode(['success' => false, 'error' => 'Access denied. Only students can submit assignments.']);
    exit;
}

// Step 3: Get the assignment_id from the POST request
$data = json_decode(file_get_contents("php://input"), true);
$assignment_id = $data['assignment_id'] ?? null;
$course_id = $data['course_id'] ?? null; // Optional, just to validate if needed

// Validate inputs
if (empty($assignment_id)) {
    echo json_encode(['success' => false, 'error' => 'Assignment ID is required.']);
    exit;
}

// Step 4: Check if the assignment exists for the given course (optional check)
$query = $conn->prepare("SELECT * FROM assignments WHERE assignment_id = ?");
$query->bind_param("i", $assignment_id);
$query->execute();
$result = $query->get_result();

if ($result->num_rows == 0) {
    echo json_encode(['success' => false, 'error' => 'Assignment not found.']);
    exit;
}

// Step 5: Handle the file upload
if (!isset($_FILES['attachment'])) {
    echo json_encode(['success' => false, 'error' => 'File attachment is required.']);
    exit;
}

$attachment = $_FILES['attachment'];
$upload_dir = 'uploads/'; // Folder where files will be saved
$file_name = basename($attachment['name']);
$file_path = $upload_dir . $file_name;

// Validate file size (max 10MB)
if ($attachment['size'] > 10485760) {
    echo json_encode(['success' => false, 'error' => 'File size exceeds the limit of 10MB.']);
    exit;
}

// Validate file type (e.g., allow only PDF, DOCX, and images)
$allowed_types = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
if (!in_array($attachment['type'], $allowed_types)) {
    echo json_encode(['success' => false, 'error' => 'Invalid file type. Only PDF, DOCX, and images are allowed.']);
    exit;
}

// Move the file to the upload directory
if (!move_uploaded_file($attachment['tmp_name'], $file_path)) {
    echo json_encode(['success' => false, 'error' => 'Failed to upload file.']);
    exit;
}

// Step 6: Insert the submission record into the database
$insertQuery = $conn->prepare("INSERT INTO assignment_submissions (assignment_id, student_id, file_path) VALUES (?, ?, ?)");
$insertQuery->bind_param("iis", $assignment_id, $student_id, $file_path);
if ($insertQuery->execute()) {
    echo json_encode(['success' => true, 'message' => 'Assignment submitted successfully.']);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to submit assignment.']);
}

// Close the database connections
$insertQuery->close();
$query->close();
$conn->close();
?>
