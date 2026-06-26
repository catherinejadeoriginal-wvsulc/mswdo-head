<?php
// MSWDO Portal - Add Focal Person Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['name']) && isset($input['role']) && isset($input['assignedProgramId'])) {
    $focals = get_db_data('focalPersons');
    
    // Auto increment id sequence
    $maxId = 0;
    foreach ($focals as $f) {
        if (preg_match('/foc-(\d+)/', $f['id'], $matches)) {
            $num = (int)$matches[1];
            if ($num > $maxId) $maxId = $num;
        }
    }
    $newId = 'foc-' . ($maxId + 1);
    
    $newFocal = [
        "id" => $newId,
        "name" => trim($input['name']),
        "role" => trim($input['role']),
        "assignedProgramId" => trim($input['assignedProgramId']),
        "contactNumber" => trim($input['contactNumber']),
        "email" => trim($input['email']),
        "status" => trim($input['status']),
        "caseload" => rand(10, 30) // Assign an active case backlog average for realism
    ];
    
    $focals[] = $newFocal;
    save_db_data('focalPersons', $focals);
    
    echo json_encode(["status" => "success", "focal" => $newFocal]);
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
