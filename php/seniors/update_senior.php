<?php
// MSWDO Portal - Update Senior Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id']) && isset($input['name']) && isset($input['age']) && isset($input['pensionStatus'])) {
    $seniorRecords = get_db_data('seniorRecords');
    $updated = false;
    
    foreach ($seniorRecords as &$s) {
        if ($s['id'] === $input['id']) {
            $s['name'] = trim($input['name']);
            $s['age'] = (int)$input['age'];
            $s['gender'] = trim($input['gender']);
            $s['barangay'] = trim($input['barangay']);
            $s['pensionStatus'] = trim($input['pensionStatus']);
            $s['assistanceStatus'] = trim($input['assistanceStatus']);
            $s['status'] = trim($input['status']);
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        save_db_data('seniorRecords', $seniorRecords);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target resident ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
