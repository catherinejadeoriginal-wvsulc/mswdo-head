<?php
// MSWDO Portal - Delete Senior Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    $seniorRecords = get_db_data('seniorRecords');
    $filtered = [];
    $found = false;
    
    foreach ($seniorRecords as $s) {
        if ($s['id'] === $input['id']) {
            $found = true;
        } else {
            $filtered[] = $s;
        }
    }
    
    if ($found) {
        save_db_data('seniorRecords', $filtered);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target resident ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required resident ID parameter not provided."]);
}
?>
