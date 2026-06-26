<?php
// MSWDO Portal - Fetch Monthly Spending vs Forecast
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$monthlyData = get_db_data('monthlyData');
echo json_encode($monthlyData);
?>
