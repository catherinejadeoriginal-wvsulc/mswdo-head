<?php
// MSWDO Portal - Fetch Admin Profile Parameters
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$profile = get_db_data('profile');
echo json_encode($profile);
?>
