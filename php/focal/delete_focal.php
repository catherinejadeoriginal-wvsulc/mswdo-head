<?php
// MSWDO Portal - Delete Focal Person Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    $focals = get_db_data('focalPersons');
    $filtered = [];
    $found = false;
    
    foreach ($focals as $f) {
        if ($f['id'] === $input['id']) {
            $found = true;
        } else {
            $filtered[] = $f;
        }
    }
    
    if ($found) {
        save_db_data('focalPersons', $filtered);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target Case Officer ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required officer ID parameter not provided."]);
}
?>
