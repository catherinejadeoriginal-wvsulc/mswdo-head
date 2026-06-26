<?php
// MSWDO Portal - Unified Database Access layer
// Dynamically bridges MySQL PDO queries and offline flat-file JSON persistence

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

include_once __DIR__ . '/connection.php';

$json_db_path = dirname(__DIR__) . '/src/data/db.json';

// Read all records for a particular key
function get_db_data($key) {
    global $conn, $json_db_path;
    
    // 1. Attempt MySQL Query
    if (isset($conn)) {
        try {
            if ($key === 'programs') {
                $stmt = $conn->query("SELECT id, name, description, allocated_budget AS allocatedBudget, utilized_budget AS utilizedBudget, status, beneficiaries_count AS beneficiariesCount FROM tb_program");
                return $stmt->fetchAll();
            }
            if ($key === 'disbursements') {
                $stmt = $conn->query("SELECT id, recipient, program_name AS program, amount, disbursement_date AS date, status, barangay FROM tb_disbursement ORDER BY disbursement_date DESC");
                return $stmt->fetchAll();
            }
            if ($key === 'pwdRecords') {
                $stmt = $conn->query("SELECT id, name, age, gender, barangay, disability_type AS disabilityType, status, assistance_status AS assistanceStatus, registration_date AS registrationDate FROM tb_pwd_record ORDER BY name ASC");
                return $stmt->fetchAll();
            }
            if ($key === 'seniorRecords') {
                $stmt = $conn->query("SELECT id, name, age, gender, barangay, pension_status AS pensionStatus, last_claim_date AS lastClaimDate, contact_number AS contactNumber, registration_date AS registrationDate FROM tb_senior_record ORDER BY name ASC");
                return $stmt->fetchAll();
            }
            if ($key === 'soloParentRecords') {
                $stmt = $conn->query("SELECT id, name, age, gender, children_count AS childrenCount, monthly_income AS monthlyIncome, barangay, card_status AS cardStatus, employment_status AS employmentStatus, registration_date AS registrationDate FROM tb_solo_parent_record ORDER BY name ASC");
                return $stmt->fetchAll();
            }
            if ($key === 'focalPersons') {
                $stmt = $conn->query("SELECT id, name, role, assigned_program_id AS assignedProgramId, contact_number AS contactNumber, email, status, caseload FROM tb_focal_person");
                return $stmt->fetchAll();
            }
            if ($key === 'allocationHistory') {
                $stmt = $conn->query("SELECT id, date_time AS dateTime, program_name AS programName, previous_budget AS previousBudget, new_budget AS newBudget, amount_changed AS amountChanged, budget_source AS budgetSource, remarks, modified_by AS modifiedBy, action_type AS actionType, status FROM tb_allocation_history ORDER BY date_time DESC");
                return $stmt->fetchAll();
            }
            if ($key === 'profile') {
                $stmt = $conn->query("SELECT full_name AS fullName, email, contact_number AS contactNumber, role, profile_pic AS profilePic FROM tb_admin_profile WHERE id = 1");
                return $stmt->fetch();
            }
        } catch (\PDOException $e) {
            // Log & Fall through to JSON on MySQL failure
        }
    }

    // 2. Fallback to Local JSON Database
    if (file_exists($json_db_path)) {
        $raw = file_get_contents($json_db_path);
        $data = json_decode($raw, true);
        return isset($data[$key]) ? $data[$key] : [];
    }
    
    return [];
}

// Write a full dataset for a key back to JSON
function save_db_data($key, $new_records) {
    global $json_db_path;
    
    if (file_exists($json_db_path)) {
        $raw = file_get_contents($json_db_path);
        $data = json_decode($raw, true);
        $data[$key] = $new_records;
        file_put_contents($json_db_path, json_encode($data, JSON_PRETTY_PRINT));
        return true;
    }
    return false;
}
?>
