<?php
// MSWDO Portal - Fetch Critical Barangay Request Backlogs
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$barangayRequests = get_db_data('barangayRequests');

// Sort descending by pendingRequests to bubble critical alerts to the top
usort($barangayRequests, function($a, $b) {
    return (int)$b['pendingRequests'] - (int)$a['pendingRequests'];
});

// Slice top 5 highest backlogs
echo json_encode(array_slice($barangayRequests, 0, 5));
?>
