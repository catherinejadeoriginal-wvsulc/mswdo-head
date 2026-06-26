<?php
// MSWDO Portal - Add Program Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['name']) && isset($input['description']) && isset($input['allocatedBudget'])) {
    $programs = get_db_data('programs');
    
    // Auto increment id sequence
    $maxId = 0;
    foreach ($programs as $p) {
        if (preg_match('/prog-(\d+)/', $p['id'], $matches)) {
            $num = (int)$matches[1];
            if ($num > $maxId) $maxId = $num;
        }
    }
    $newId = 'prog-' . ($maxId + 1);
    
    $newProg = [
        "id" => $newId,
        "name" => trim($input['name']),
        "description" => trim($input['description']),
        "allocatedBudget" => floatval($input['allocatedBudget']),
        "utilizedBudget" => 0.00,
        "status" => trim($input['status']),
        "beneficiariesCount" => 0
    ];
    
    $programs[] = $newProg;
    save_db_data('programs', $programs);
    
    echo json_encode(["status" => "success", "program" => $newProg]);
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
