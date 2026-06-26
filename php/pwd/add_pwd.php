<?php
// MSWDO Portal - Add PWD Record Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['name']) && isset($input['age']) && isset($input['disabilityType'])) {
    $pwdRecords = get_db_data('pwdRecords');
    
    // Generate PWD registry ID
    $maxId = 0;
    foreach ($pwdRecords as $p) {
        if (preg_match('/PWD-(\d+)/i', $p['id'], $matches)) {
            $num = (int)$matches[1];
            if ($num > $maxId) $maxId = $num;
        }
    }
    $newId = 'PWD-' . str_pad(($maxId + 1), 3, '0', STR_PAD_LEFT);
    
    $newPWD = [
        "id" => $newId,
        "name" => trim($input['name']),
        "age" => (int)$input['age'],
        "gender" => trim($input['gender']),
        "barangay" => trim($input['barangay']),
        "disabilityType" => trim($input['disabilityType']),
        "assistanceStatus" => trim($input['assistanceStatus']),
        "status" => trim($input['status']),
        "registrationDate" => date('Y-m-d')
    ];
    
    $pwdRecords[] = $newPWD;
    save_db_data('pwdRecords', $pwdRecords);
    
    echo json_encode(["status" => "success", "pwd" => $newPWD]);
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
