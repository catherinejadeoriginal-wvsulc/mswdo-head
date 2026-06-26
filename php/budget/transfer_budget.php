<?php
// MSWDO Portal - Process Reallocation Transfer Commit
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);

if (isset($input['sourceId']) && isset($input['destId']) && isset($input['amount'])) {
    $programs = get_db_data('programs');
    $history = get_db_data('allocationHistory');
    
    $sourceId = $input['sourceId'];
    $destId = $input['destId'];
    $amount = floatval($input['amount']);
    
    $sourceProg = null;
    $destProg = null;
    
    // Find programs
    foreach ($programs as &$p) {
        if ($p['id'] === $sourceId) {
            $sourceProg = &$p;
        }
        if ($p['id'] === $destId) {
            $destProg = &$p;
        }
    }
    
    if ($sourceProg && $destProg) {
        $prevSourceAlloc = floatval($sourceProg['allocatedBudget']);
        $prevDestAlloc = floatval($destProg['allocatedBudget']);
        
        // Subtract from source, add to dest (supports user requirement #3: putting any amount freely)
        $sourceProg['allocatedBudget'] = $prevSourceAlloc - $amount;
        $destProg['allocatedBudget'] = $prevDestAlloc + $amount;
        
        // Save programs
        save_db_data('programs', $programs);
        
        // Log Combined Audit Record
        $txnId = 'TXN-' . rand(100000, 999999);
        $remarks = "Reallocated " . number_format($amount, 2) . " from '" . $sourceProg['name'] . "' to '" . $destProg['name'] . "' via Head Reallocation Simulator.";
        
        $newTxn = [
            "id" => $txnId,
            "dateTime" => date('Y-m-d h:i A'),
            "programName" => $sourceProg['name'] . " ➔ " . $destProg['name'],
            "previousBudget" => $prevSourceAlloc,
            "newBudget" => floatval($sourceProg['allocatedBudget']),
            "amountChanged" => -$amount,
            "budgetSource" => 'Internal Social Fund Reallocation',
            "remarks" => $remarks,
            "modifiedBy" => isset($_SESSION['admin_name']) ? $_SESSION['admin_name'] : 'Catherine Jade',
            "actionType" => 'Transferred',
            "status" => 'Completed'
        ];
        
        array_unshift($history, $newTxn);
        save_db_data('allocationHistory', $history);
        
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Source or Destination program ID not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Required parameters not provided."]);
}
?>
