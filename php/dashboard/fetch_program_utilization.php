<?php
// MSWDO Portal - Fetch Program Allocation Breakdown
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$programs = get_db_data('programs');
$response = [];

foreach ($programs as $prog) {
    $response[] = [
        "Program_Name" => isset($prog['name']) ? $prog['name'] : 'Unknown Program',
        "Total_Utilized" => isset($prog['utilizedBudget']) ? floatval($prog['utilizedBudget']) : 0
    ];
}

echo json_encode($response);
?>
