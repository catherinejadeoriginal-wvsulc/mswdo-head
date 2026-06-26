<?php
// MSWDO Portal - Delete PWD Record Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    $pwdRecords = get_db_data('pwdRecords');
    $filtered = [];
    $found = false;
    
    foreach ($pwdRecords as $p) {
        if ($p['id'] === $input['id']) {
            $found = true;
        } else {
            $filtered[] = $p;
        }
    }
    
    if ($found) {
        save_db_data('pwdRecords', $filtered);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target resident ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required resident ID parameter not provided."]);
}
?>
