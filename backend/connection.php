<?php
$servername = "localhost";
$username = "root"; // or your database username
$password = ""; // your database password
$dbname = "elearning_db"; // the name of your database

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
