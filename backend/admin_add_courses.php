<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); 
    exit();
}


include 'connection.php';
include 'verify.php';

$secret_key = 'omarito';

$decodedToken = verifyToken($secret_key);
checkAdminRole($decodedToken); 

$data = json_decode(file_get_contents("php://input"), true);
$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$created_by = $decodedToken['user_id']; 
$instructors = $data['instructors'] ?? []; 

if (empty($title)) {
    echo json_encode(['success' => false, 'error' => 'Course title is required']);
    exit;
}

$conn->begin_transaction();

try {
    $sql = "INSERT INTO courses (title, description, created_by, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssi", $title, $description, $created_by);

    if ($stmt->execute()) {
        $course_id = $conn->insert_id; 

        if (!empty($instructors)) {
            $instructor_stmt = $conn->prepare("INSERT INTO course_instructors (course_id, instructor_id) VALUES (?, ?)");

            foreach ($instructors as $instructor_id) {
                $instructor_stmt->bind_param("ii", $course_id, $instructor_id);
                $instructor_stmt->execute();
            }

            $instructor_stmt->close();
        }

        $conn->commit();
        echo json_encode(['success' => true, 'message' => 'Course and instructors added successfully', 'course_id' => $course_id]);
    } else {
        throw new Exception("Failed to add course");
    }

} catch (Exception $e) {
    // Rollback in case of error
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

// Clean
$stmt->close();
$conn->close();
?>
