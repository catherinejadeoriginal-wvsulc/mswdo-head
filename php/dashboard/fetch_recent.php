<?php
// MSWDO Portal - Fetch Recent Disbursements Feed
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$disbursements = get_db_data('disbursements');

// Slice top 4 recent disbursements
echo json_encode(array_slice($disbursements, 0, 4));
?>
