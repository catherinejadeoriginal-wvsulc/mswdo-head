<?php
// MSWDO Portal - Fetch Budget Totals
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$programs = get_db_data('programs');

$total_allocated = 25000000; // ₱25M total budget cap
$total_utilized = 0;

foreach ($programs as $prog) {
    $total_utilized += isset($prog['utilizedBudget']) ? floatval($prog['utilizedBudget']) : 0;
}

$total_remaining = $total_allocated - $total_utilized;

echo json_encode([
    "Total_Allocated" => $total_allocated,
    "Total_Utilized" => $total_utilized,
    "Total_Remaining" => $total_remaining
]);
?>
