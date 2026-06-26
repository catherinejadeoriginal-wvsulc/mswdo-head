<?php
// MSWDO Portal - Add Solo Parent Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['name']) && isset($input['age']) && isset($input['childrenCount'])) {
    $soloParentRecords = get_db_data('soloParentRecords');
    
    // Generate SP ID sequence
    $maxId = 0;
    foreach ($soloParentRecords as $s) {
        if (preg_match('/SP-(\d+)/i', $s['id'], $matches)) {
            $num = (int)$matches[1];
            if ($num > $maxId) $maxId = $num;
        }
    }
    $newId = 'SP-' . ($maxId + 1);
    
    $newSolo = [
        "id" => $newId,
        "name" => trim($input['name']),
        "age" => (int)$input['age'],
        "gender" => trim($input['gender']),
        "barangay" => trim($input['barangay']),
        "childrenCount" => (int)$input['childrenCount'],
        "assistanceStatus" => trim($input['assistanceStatus']),
        "status" => trim($input['status']),
        "registrationDate" => date('Y-m-d')
    ];
    
    $soloParentRecords[] = $newSolo;
    save_db_data('soloParentRecords', $soloParentRecords);
    
    echo json_encode(["status" => "success", "solo" => $newSolo]);
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
