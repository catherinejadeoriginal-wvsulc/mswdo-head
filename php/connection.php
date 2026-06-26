<?php
// PHP Database Connection (PDO)
// Configured for local/production MySQL deployment

$host = 'localhost';
$db   = 'mswdo_db';
$user = 'root';
$pass = ''; // Enter password if required
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
     $conn = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
     // Handle database connection error gracefully
     // During development, you can uncomment the line below:
     // throw new \PDOException($e->getMessage(), (int)$e->getCode());
     
     // Output empty JSON or simple error if it is an API call
     header('Content-Type: application/json');
     echo json_encode(["status" => "error", "message" => "Database connection failed. Please check connection.php."]);
     exit;
}
?>
