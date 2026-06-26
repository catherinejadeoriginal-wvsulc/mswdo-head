<?php
// MSWDO Portal - Update Focal Person Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id']) && isset($input['name']) && isset($input['role']) && isset($input['assignedProgramId'])) {
    $focals = get_db_data('focalPersons');
    $updated = false;
    
    foreach ($focals as &$f) {
        if ($f['id'] === $input['id']) {
            $f['name'] = trim($input['name']);
            $f['role'] = trim($input['role']);
            $f['assignedProgramId'] = trim($input['assignedProgramId']);
            $f['contactNumber'] = trim($input['contactNumber']);
            $f['email'] = trim($input['email']);
            $f['status'] = trim($input['status']);
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        save_db_data('focalPersons', $focals);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target Case Officer ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
