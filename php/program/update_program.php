<?php
// MSWDO Portal - Update Program Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id']) && isset($input['name']) && isset($input['description']) && isset($input['allocatedBudget'])) {
    $programs = get_db_data('programs');
    $updated = false;
    
    foreach ($programs as &$p) {
        if ($p['id'] === $input['id']) {
            $p['name'] = trim($input['name']);
            $p['description'] = trim($input['description']);
            $p['allocatedBudget'] = floatval($input['allocatedBudget']);
            $p['utilizedBudget'] = floatval($input['utilizedBudget']);
            $p['status'] = trim($input['status']);
            $p['beneficiariesCount'] = (int)$input['beneficiariesCount'];
            $updated = true;
            break;
        }
    }
    
    if ($updated) {
        save_db_data('programs', $programs);
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target program ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
