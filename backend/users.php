<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Ensure JSON output

include 'connection.php';
include 'verify.php';

class User {
    private $name;
    private $email;
    private $password;
    private $role;
    private $conn;

    public function __construct($name, $email, $password, $role, $conn) {
        $this->name = $name;
        $this->email = $email;
        $this->password = password_hash($password, PASSWORD_BCRYPT);
        $this->role = $role;
        $this->conn = $conn;
    }

    public static function check_password($password) {
        $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{12,}$/';
        return preg_match($pattern, $password) ? true : false;
    }

    public static function validate_email($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) ? true : false;
    }


    public function checkIfExists() {
        $sql = "SELECT * FROM users WHERE email = ? OR name = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $this->email, $this->name);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows > 0; 
    }

    public function save() {
        if ($this->checkIfExists()) {
            return false;
        }

        $sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssss", $this->name, $this->email, $this->password, $this->role);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function displayInfo() {
        return ["name" => $this->name, "email" => $this->email, "role" => $this->role];
    }
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        if (isset($data['name'], $data['email'], $data['password'], $data['role'])) {
            $user = new User($data['name'], $data['email'], $data['password'], $data['role'], $conn);
            if ($user->save()) {
                echo json_encode(["success" => true, "message" => "User registered successfully", "user" => $user->displayInfo()]);
            } else {
                echo json_encode(["error" => "Failed to save user to the database."]);
            }
            break;
        }

        if (isset($data['password']) && !isset($data['name']) && !isset($data['email'])) {
            $isValidPassword = User::check_password($data['password']);
            echo json_encode(["password_valid" => $isValidPassword]);
            break;
        }

        if (isset($data['email']) && !isset($data['name']) && !isset($data['password'])) {
            $isValidEmail = User::validate_email($data['email']);
            echo json_encode(["email_valid" => $isValidEmail]);
            break;
        }

        echo json_encode(["error" => "Invalid input data"]);
        break;

    default:
        echo json_encode(["error" => "Method not allowed"]);
        break;
}

$conn->close();
