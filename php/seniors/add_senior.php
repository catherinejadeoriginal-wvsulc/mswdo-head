<?php
// MSWDO Portal - Add Senior Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['name']) && isset($input['age']) && isset($input['pensionStatus'])) {
    $seniorRecords = get_db_data('seniorRecords');
    
    // Generate OSCA ID sequence
    $maxId = 0;
    foreach ($seniorRecords as $s) {
        if (preg_match('/OSCA-(\d+)/i', $s['id'], $matches)) {
            $num = (int)$matches[1];
            if ($num > $maxId) $maxId = $num;
        }
    }
    $newId = 'OSCA-' . ($maxId + 1);
    
    $newSenior = [
        "id" => $newId,
        "name" => trim($input['name']),
        "age" => (int)$input['age'],
        "gender" => trim($input['gender']),
        "barangay" => trim($input['barangay']),
        "pensionStatus" => trim($input['pensionStatus']),
        "assistanceStatus" => trim($input['assistanceStatus']),
        "status" => trim($input['status']),
        "registrationDate" => date('Y-m-d')
    ];
    
    $seniorRecords[] = $newSenior;
    save_db_data('seniorRecords', $seniorRecords);
    
    echo json_encode(["status" => "success", "senior" => $newSenior]);
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
