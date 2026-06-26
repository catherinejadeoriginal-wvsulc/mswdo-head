<?php
// MSWDO Portal - Delete Program Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id'])) {
    $programs = get_db_data('programs');
    $filtered = [];
    $found = false;
    
    foreach ($programs as $p) {
        if ($p['id'] === $input['id']) {
            $found = true;
        } else {
            $filtered[] = $p;
        }
    }
    
    if ($found) {
        save_db_data('programs', $filtered);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target program ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required program ID parameter not provided."]);
}
?>
