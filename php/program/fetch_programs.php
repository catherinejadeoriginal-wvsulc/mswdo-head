<?php
// MSWDO Portal - Fetch Raw Programs JSON API
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$programs = get_db_data('programs');
echo json_encode($programs);
?>
