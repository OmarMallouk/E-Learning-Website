<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

include 'connection.php'; // Include your DB connection
include 'verify.php';       // Include the JWT verification functions

$secret_key = 'omarito';

// Verify token and ensure user is admin
$decodedToken = verifyToken($secret_key);
checkAdminRole($decodedToken); // Only allow admins to proceed

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$created_by = $decodedToken['user_id']; // Assuming admin's user_id from token
$instructors = $data['instructors'] ?? []; // Array of instructor IDs

// Validate input
if (empty($title)) {
    echo json_encode(['success' => false, 'error' => 'Course title is required']);
    exit;
}

// Start a transaction
$conn->begin_transaction();

try {
    // Step 1: Insert course into the courses table
    $sql = "INSERT INTO courses (title, description, created_by, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $title, $description, $created_by);

    if ($stmt->execute()) {
        $course_id = $conn->insert_id; // Get the newly created course ID

        // Step 2: Insert entries in course_instructors for each instructor
        if (!empty($instructors)) {
            $instructor_stmt = $conn->prepare("INSERT INTO course_instructors (course_id, instructor_id) VALUES (?, ?)");

            foreach ($instructors as $instructor_id) {
                $instructor_stmt->bind_param("ii", $course_id, $instructor_id);
                $instructor_stmt->execute();
            }

            $instructor_stmt->close();
        }

        // Commit the transaction
        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Course and instructors added successfully', 'course_id' => $course_id]);
    } else {
        throw new Exception("Failed to add course");
    }

} catch (Exception $e) {
    // Rollback the transaction in case of error
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Clean up
$stmt->close();
$conn->close();
?>
