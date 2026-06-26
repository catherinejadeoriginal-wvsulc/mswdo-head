<?php
// MSWDO Portal - Update Budget & Log History
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['id']) && isset($input['allocatedBudget'])) {
    $programs = get_db_data('programs');
    $history = get_db_data('allocationHistory');
    
    $prevAlloc = 0.00;
    $progName = '';
    $found = false;
    
    foreach ($programs as &$p) {
        if ($p['id'] === $input['id']) {
            $prevAlloc = floatval($p['allocatedBudget']);
            $p['allocatedBudget'] = floatval($input['allocatedBudget']);
            $progName = $p['name'];
            $found = true;
            break;
        }
    }
    
    if ($found) {
        // Save updated program budget
        save_db_data('programs', $programs);
        
        // Log Transaction in history
        $txnId = 'TXN-' . rand(100000, 999999);
        $newTxn = [
            "id" => $txnId,
            "dateTime" => date('Y-m-d h:i A'),
            "programName" => $progName,
            "previousBudget" => $prevAlloc,
            "newBudget" => floatval($input['allocatedBudget']),
            "amountChanged" => floatval($input['allocatedBudget']) - $prevAlloc,
            "budgetSource" => isset($input['source']) ? trim($input['source']) : 'LGU Social Fund Reallocation',
            "remarks" => isset($input['remarks']) ? trim($input['remarks']) : 'Allocated supplemental budget limits.',
            "modifiedBy" => isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Catherine Jade',
            "actionType" => 'Edited',
            "status" => 'Completed'
        ];
        
        array_unshift($history, $newTxn);
        save_db_data('allocationHistory', $history);
        
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Target program ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
