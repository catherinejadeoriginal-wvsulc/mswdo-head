<?php
// MSWDO Portal - Update Solo Parent Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id']) && isset($input['name']) && isset($input['age']) && isset($input['childrenCount'])) {
    $soloParentRecords = get_db_data('soloParentRecords');
    $updated = false;
    
    foreach ($soloParentRecords as &$s) {
        if ($s['id'] === $input['id']) {
            $s['name'] = trim($input['name']);
            $s['age'] = (int)$input['age'];
            $s['gender'] = trim($input['gender']);
            $s['barangay'] = trim($input['barangay']);
            $s['childrenCount'] = (int)$input['childrenCount'];
            $s['assistanceStatus'] = trim($input['assistanceStatus']);
            $s['status'] = trim($input['status']);
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        save_db_data('soloParentRecords', $soloParentRecords);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target resident ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
