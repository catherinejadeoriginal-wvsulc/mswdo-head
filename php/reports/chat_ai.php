<?php
// MSWDO Portal - Civic AI Chat Analyst Controller
header('Content-Type: application/json');
include_once dirname(__DIR__) . '/db_helper.php';

$input = json_decode(file_get_contents('php://input'), true);
$query = isset($input['query']) ? trim(strtolower($input['query'])) : '';

if (empty($query)) {
    echo json_encode(["status" => "error", "message" => "Empty prompt provided."]);
    exit;
}

// Read live database metrics to make the AI responses completely dynamic!
$programs = get_db_data('programs');
$disbursements = get_db_data('disbursements');
$barangayRequests = get_db_data('barangayRequests');

$totalBudget = 25000000;
$totalSpent = 0;
foreach ($programs as $p) {
    $totalSpent += isset($p['utilizedBudget']) ? floatval($p['utilizedBudget']) : 0;
}
$remainingBudget = $totalBudget - $totalSpent;
$utilizedPercent = round(($totalSpent / $totalBudget) * 100, 1);

$reply = "";

// Scenario 1: Budget Analysis Audit
if (strpos($query, 'analyze') !== false && (strpos($query, 'budget') !== false || strpos($query, 'payout') !== false)) {
    $programBullets = "";
    foreach ($programs as $p) {
        $pName = $p['name'];
        $pAlloc = isset($p['allocatedBudget']) ? floatval($p['allocatedBudget']) : 1;
        $pUtil = isset($p['utilizedBudget']) ? floatval($p['utilizedBudget']) : 0;
        $pPct = round(($pUtil / $pAlloc) * 100, 1);
        $programBullets .= "*   **" . $pName . ":** ₱" . number_format($pUtil) . " spent of ₱" . number_format($pAlloc) . " (**" . $pPct . "%**)\n";
    }

    $reply = "### 📊 Contextual Budget utilization Report\n\nBased on the latest entries in your local MSWDO databases, here is my automated program efficiency audit:\n\n*   **Total Municipal Budget Allocation:** ₱" . number_format($totalBudget) . "\n*   **Total Amount Disbursed/Spent:** ₱" . number_format($totalSpent) . " (**" . $utilizedPercent . "%** utilized)\n*   **Remaining Sustainable Reserve:** ₱" . number_format($remainingBudget) . "\n\n#### 📈 Program-by-Program Breakdown:\n" . $programBullets . "\n" . '
#### 💡 Actionable Insights & Policy Recommendations:
1.  ⚠️ **High Burn Rate in Medical Subsidies:** Medical assistance is currently absorbing a disproportionate amount of social funds. To prevent mid-quarter deficits, I advise limiting non-urgent claims or re-allocating ₱450,000 from underutilized program reserves.
2.  🌱 **Solo Parents Program Lag:** Our Solo Parents incentive schemes are experiencing slow utilization. This correlates with delays in physical ID booklet distribution. I recommend initiating a weekend registration caravan in Maligaya and San Isidro to clear verification backlogs.
3.  🛡️ **Emergency Reserves:** The remaining buffer is fully healthy and adequate to cushion any sudden disaster or calamity-relief disbursements in the coming months.';
}
// Scenario 2: Recommendation Memo drafting
elseif (strpos($query, 'memo') !== false || strpos($query, 'letter') !== false || strpos($query, 'draft') !== false) {
    // Determine target recipient
    $recipient = "Juan Dela Cruz";
    $program = "Educational Assistance";
    $amount = "₱5,000.00";
    $barangay = "Poblacion I";

    if (strpos($query, 'maria') !== false || strpos($query, 'santos') !== false) {
        $recipient = "Maria Santos";
        $program = "Senior Social Pension";
        $amount = "₱3,000.00";
        $barangay = "San Isidro";
    } elseif (strpos($query, 'bautista') !== false || strpos($query, 'jose') !== false) {
        $recipient = "Jose Bautista";
        $program = "Medical Assistance / Chemotherapy";
        $amount = "₱12,500.00";
        $barangay = "Maligaya";
    }

    $reply = "### 📄 Recommendation Memo Draft\n\n**OFFICE OF THE MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT**\n*LGU Municipal Admin Center*\n\n**MEMORANDUM**\n\n**TO:** Municipal Treasurer / Disbursement Officer\n**FROM:** MSWDO Officer-in-Charge\n**DATE:** " . date('F d, Y') . "\n**SUBJECT:** Social Welfare Grant Endorsement under " . $program . "\n\n---\n\nThis is to formally recommend and endorse the releasing of financial assistance to:\n\n*   **Beneficiary Name:** **" . $recipient . "**\n*   **Approved Grant Category:** " . $program . "\n*   **Allocated Amount:** **" . $amount . "**\n*   **Barangay Residence:** " . $barangay . "\n\n**Justification:**\nUpon detailed casework review, physical validation, and submission of the certified municipal indigency certificate, the applicant is verified as fully qualified for this financial release. This amount shall be charged against the **Active Welfare Subsidy Fund**.\n\nApproved by:\n\n**MSWDO ADMIN**\n*Social Welfare Officer III*";
}
// Scenario 3: Barangay request mapping
elseif (strpos($query, 'barangay') !== false || strpos($query, 'request') !== false || strpos($query, 'map') !== false) {
    $brgyBullets = "";
    $criticalCount = 0;
    foreach ($barangayRequests as $b) {
        $bName = $b['name'];
        $bPend = isset($b['pendingRequests']) ? intval($b['pendingRequests']) : 0;
        $bStat = isset($b['status']) ? $b['status'] : 'NORMAL';
        if ($bStat === 'CRITICAL') $criticalCount++;
        $brgyBullets .= "*   **" . $bName . ":** " . $bPend . " requests (" . $bStat . " status)\n";
    }

    $reply = "### 🗺️ Barangay Request Volume Assessment\n\nI have compiled the current unresolved caseworker requests across our sectors. We currently have **" . $criticalCount . " critical zones** needing officer dispatch:\n\n" . $brgyBullets . "\n" . '
#### 🎯 Caseworker Deployment Strategy:
1.  **Poblacion I Priority Desk:** Poblacion I exhibits the highest overall backlog. I recommend assigning 2 field social workers to Poblacion I starting tomorrow morning to process senior citizen medical claims directly in the barangay hall.
2.  **San Isidro & Bukidnon East:** Schedule direct mobile payout caravans on Fridays. This allows the LGU to distribute pre-approved cash card incentives directly, bypassing administrative bottlenecks in the MSWDO main office.';
}
// Fallback general chat
else {
    $reply = "### 💡 MSWDO Policy Consultant Response\n\nThank you for reaching out. I have analyzed our live database and compiled these stats for your oversight:\n\n*   **Total Active Welfare Budget surplus:** ₱" . number_format($remainingBudget) . " (" . $utilizedPercent . "% spent)\n*   **Total Registered Residents:** " . count(get_db_data('pwdRecords')) . " PWDs, " . count(get_db_data('seniorRecords')) . " Senior Citizens, and " . count(get_db_data('soloParentRecords')) . " Solo Parents.\n\nHere are some of the actions I am configured to run:\n- 📈 **\"analyze budget\"** (Run program-by-program audit)\n- 🗺️ **\"barangay requests\"** (Assess casework backlogs)\n- ✍️ **\"draft memo for Maria Santos\"** (Draft recommended payout letters)";
}

echo json_encode(["status" => "success", "reply" => $reply]);
?>
