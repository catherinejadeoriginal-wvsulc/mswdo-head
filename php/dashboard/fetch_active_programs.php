<?php
// MSWDO Portal - Fetch Active Programs Count
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$programs = get_db_data('programs');
$active_count = 0;

foreach ($programs as $prog) {
    if (isset($prog['status']) && $prog['status'] === 'Active') {
        $active_count++;
    }
}

echo json_encode(["active_count" => $active_count]);
?>
