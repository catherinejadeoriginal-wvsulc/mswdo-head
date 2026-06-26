<?php
// MSWDO Portal - Update PWD Record Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id']) && isset($input['name']) && isset($input['age']) && isset($input['disabilityType'])) {
    $pwdRecords = get_db_data('pwdRecords');
    $updated = false;
    
    foreach ($pwdRecords as &$p) {
        if ($p['id'] === $input['id']) {
            $p['name'] = trim($input['name']);
            $p['age'] = (int)$input['age'];
            $p['gender'] = trim($input['gender']);
            $p['barangay'] = trim($input['barangay']);
            $p['disabilityType'] = trim($input['disabilityType']);
            $p['assistanceStatus'] = trim($input['assistanceStatus']);
            $p['status'] = trim($input['status']);
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        save_db_data('pwdRecords', $pwdRecords);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target resident ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
