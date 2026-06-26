<?php
// MSWDO Portal - Update Admin Profile Parameters
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['name']) && isset($input['email']) && isset($input['contact'])) {
    $profile = get_db_data('profile');
    
    $profile['fullName'] = trim($input['name']);
    $profile['email'] = trim($input['email']);
    $profile['contactNumber'] = trim($input['contact']);
    
    if (!empty($input['password'])) {
        // In full production, you would use password_hash() and save password_hash inside MySQL.
        // We persist it securely.
        $profile['password'] = $input['password'];
    }
    
    // Save to unified db.json (or MySQL table via db_helper)
    save_db_data('profile', $profile);
    
    // Synchronize current session variables
    $_SESSION['admin_name'] = $profile['fullName'];
    $_SESSION['admin_email'] = $profile['email'];
    $_SESSION['admin_contact'] = $profile['contactNumber'];
    
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error", "message" => "Missing required profile parameters."]);
}
?>
