<?php
// MSWDO Portal - Master Reports & Civic AI View
$pageTitle = "Reports & Activity";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

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
?>

<div class="p-6 space-y-6" id="reports-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-file-spreadsheet text-blue-900 w-5 h-5"></i>
                Municipal Ledgers & Civic AI
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Filter municipal grants, export audited ledgers, and query the Civic AI Analyst on budget projections.
            </p>
        </div>
    </div>

    <!-- Subtab Navigation -->
    <div class="flex border-b border-slate-150 pb-px" style="margin-bottom: -1px;">
        <button id="tab-ledger-btn" class="px-6 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer border-blue-900 text-blue-900">
            <i class="lucide lucide-folder-open w-4 h-4"></i> Master Ledger & Reports
        </button>
        <button id="tab-ai-btn" class="px-6 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer border-transparent text-slate-400 hover:text-slate-600">
            <i class="lucide lucide-sparkles w-4 h-4 text-blue-500"></i> Civic AI Consultant
        </button>
    </div>

    <!-- Subtab 1: MASTER DISBURSEMENTS LEDGER -->
    <div id="subtab-ledger" class="space-y-6">
        <!-- Budget utilization progress indicators -->
        <div class="card p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div class="flex justify-between items-center mb-3">
                <div>
                    <h4 class="font-extrabold text-slate-800 text-xs tracking-tight">Municipal Budget Absorption Efficiency</h4>
                    <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Disbursed grants against the total annual municipal fund.</p>
                </div>
                <span class="font-mono font-bold text-blue-900 text-xs"><?php echo $utilizedPercent; ?>% absorbed</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden" style="display: flex;">
                <div class="bg-blue-900 h-full rounded-full transition-all" style="width: <?php echo $utilizedPercent; ?>%;"></div>
            </div>

            <div class="grid grid-cols-3 gap-6 mt-4 text-[11px] border-t border-slate-50 pt-3">
                <div>
                    <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Municipal Allocation</span>
                    <span class="font-mono font-bold text-slate-700">₱<?php echo number_format($totalBudget, 2); ?></span>
                </div>
                <div>
                    <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Spent/Disbursed</span>
                    <span class="font-mono font-bold text-emerald-600">₱<?php echo number_format($totalSpent, 2); ?></span>
                </div>
                <div>
                    <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sustainable reserves</span>
                    <span class="font-mono font-bold text-blue-900">₱<?php echo number_format($remainingBudget, 2); ?></span>
                </div>
            </div>
        </div>

        <!-- Master ledger table card -->
        <div class="table-card">
            <div class="table-header flex-col md:flex-row gap-4 items-stretch" style="padding: 20px;">
                <div class="flex justify-between items-center w-full">
                    <span class="table-title">Master Disbursements Registry</span>
                    <button class="btn btn-primary btn-sm flex items-center gap-1.5" id="export-csv-btn">
                        <i class="lucide lucide-download w-3.5 h-3.5"></i> Export Filtered Ledger
                    </button>
                </div>

                <!-- Ledger filters bar -->
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 w-full text-xs mt-3">
                    <div class="search-wrapper w-full" style="margin-right: 0;">
                        <i class="lucide lucide-search"></i>
                        <input type="text" id="ledger-search" placeholder="Search recipient or ID..." class="input-search w-full" style="padding-left: 32px; height: 36px;">
                    </div>

                    <select id="ledger-program-filter" class="form-input" style="height: 36px;">
                        <option value="All">All Programs</option>
                        <option value="Medical">Medical Assistance</option>
                        <option value="Burial">Burial Assistance</option>
                        <option value="Senior">Senior Citizens Pension</option>
                        <option value="PWD">PWD Assistance</option>
                        <option value="Solo">Solo Parent Allowance</option>
                        <option value="Educational">Educational Subsidy</option>
                    </select>

                    <select id="ledger-barangay-filter" class="form-input" style="height: 36px;">
                        <option value="All">All Barangays</option>
                        <option value="Poblacion I">Poblacion I</option>
                        <option value="San Isidro">San Isidro</option>
                        <option value="Maligaya">Maligaya</option>
                        <option value="Santa Rosa">Santa Rosa</option>
                        <option value="Bukidnon East">Bukidnon East</option>
                        <option value="Alang-alang">Alang-alang</option>
                        <option value="Batinguel">Batinguel</option>
                        <option value="Tacloban West">Tacloban West</option>
                    </select>

                    <select id="ledger-status-filter" class="form-input" style="height: 36px;">
                        <option value="All">All Statuses</option>
                        <option value="Disbursed">Disbursed</option>
                        <option value="Approved">Approved</option>
                        <option value="Under Review">Under Review</option>
                    </select>
                </div>
            </div>

            <!-- Table content -->
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Disbursement ID</th>
                            <th>Recipient Beneficiary</th>
                            <th>Welfare Scheme</th>
                            <th>Disbursed Amount</th>
                            <th>Barangay Area</th>
                            <th>Date Disbursed</th>
                            <th>Payout Status</th>
                        </tr>
                    </thead>
                    <tbody id="ledger-table-body">
                        <?php foreach ($disbursements as $d): 
                            $status = isset($d['status']) ? $d['status'] : 'Disbursed';
                            $badge = 'badge-success';
                            if ($status === 'Approved') $badge = 'badge-info';
                            if ($status === 'Under Review') $badge = 'badge-pending';
                        ?>
                            <tr class="ledger-row" 
                                data-id="<?php echo htmlspecialchars(strtolower($d['id'])); ?>"
                                data-recipient="<?php echo htmlspecialchars(strtolower($d['recipient'])); ?>"
                                data-program="<?php echo htmlspecialchars(strtolower($d['program'])); ?>"
                                data-barangay="<?php echo htmlspecialchars($d['barangay']); ?>"
                                data-status="<?php echo htmlspecialchars($status); ?>"
                                data-amount="<?php echo htmlspecialchars($d['amount']); ?>"
                                data-date="<?php echo htmlspecialchars($d['date']); ?>">
                                
                                <td class="font-mono font-bold text-blue-900"><?php echo htmlspecialchars($d['id']); ?></td>
                                <td class="font-bold text-slate-800"><?php echo htmlspecialchars($d['recipient']); ?></td>
                                <td class="font-semibold text-slate-600"><?php echo htmlspecialchars($d['program']); ?></td>
                                <td class="font-mono font-bold text-slate-700">₱<?php echo number_format($d['amount'], 2); ?></td>
                                <td class="font-bold text-slate-500"><?php echo htmlspecialchars($d['barangay']); ?></td>
                                <td class="font-medium text-slate-400"><?php echo htmlspecialchars($d['date']); ?></td>
                                <td><span class="badge <?php echo $badge; ?>"><?php echo $status; ?></span></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Subtab 2: CIVIC AI ASSISTANT CHAT SCREEN -->
    <div id="subtab-ai" class="space-y-6 hidden" style="height: calc(100vh - 240px); display: none;">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full" style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; height: 100%;">
            
            <!-- Left Chat Container -->
            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col" style="height: 520px; display: flex; flex-direction: column;">
                <!-- Chat header -->
                <div class="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex justify-between items-center shrink-0">
                    <div class="flex items-center gap-2.5">
                        <div class="p-2 bg-white/10 rounded-xl">
                            <i class="lucide lucide-sparkles text-blue-200 w-4 h-4 animate-pulse"></i>
                        </div>
                        <div>
                            <h4 class="font-bold text-xs tracking-tight">MSWDO Civic AI Consultant</h4>
                            <p class="text-blue-200 text-[9px] font-medium mt-0.5">Online • Real-time database analytics agent</p>
                        </div>
                    </div>
                    <button class="text-white/80 hover:text-white bg-white/10 px-2.5 py-1.5 rounded-lg text-[9px] font-bold cursor-pointer" id="reset-ai-chat">
                        <i class="lucide lucide-refresh-cw w-3 h-3 inline-block align-text-top mr-1"></i> Clear Chat
                    </button>
                </div>

                <!-- Chat Messages Logs -->
                <div class="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-medium" id="ai-chat-logs" style="background-color: #fafbfc;">
                    <!-- Message bubbles injected via JS -->
                </div>

                <!-- Chat Typing Indicator -->
                <div class="px-5 py-2 text-[10px] text-slate-400 font-semibold hidden shrink-0" id="ai-typing-indicator">
                    <i class="lucide lucide-sparkles w-3.5 h-3.5 inline-block align-text-top animate-spin mr-1.5 text-blue-500"></i> MSWDO Consultant is auditing ledgers...
                </div>

                <!-- Chat Input form -->
                <form id="ai-chat-form" class="p-4 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                    <input type="text" id="ai-chat-input" placeholder="Query: 'analyze budget' or 'draft burial assistance memo for Santos'..." class="form-input flex-1" style="height: 42px;">
                    <button type="submit" class="btn btn-primary w-12 h-[42px] p-0 flex items-center justify-center cursor-pointer" style="border-radius: var(--radius-lg);">
                        <i class="lucide lucide-send w-4 h-4"></i>
                    </button>
                </form>
            </div>

            <!-- Right Suggested Commands / Quick Actions Panel -->
            <div class="space-y-4 text-xs flex flex-col justify-start">
                <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <h5 class="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <i class="lucide lucide-bot text-blue-950 w-3.5 h-3.5"></i> Analyst Prompts Sandbox
                    </h5>
                    <p class="text-[11px] text-slate-400 font-medium leading-relaxed">
                        Tap any prompt card below to dispatch high-order municipal budget evaluations directly to our consultant.
                    </p>

                    <!-- Quick Prompt Cards -->
                    <div class="space-y-2 pt-2">
                        <div class="p-3 bg-blue-50/60 border border-blue-100 hover:bg-blue-50 rounded-xl cursor-pointer transition-all quick-prompt-btn" data-query="analyze budget">
                            <span class="block font-bold text-blue-900 mb-0.5">📊 Analyze Current Budget</span>
                            <span class="text-[9px] text-slate-400">Audits active subsidies & warns of high burn rate sectors.</span>
                        </div>

                        <div class="p-3 bg-amber-50/60 border border-amber-100 hover:bg-amber-50 rounded-xl cursor-pointer transition-all quick-prompt-btn" data-query="barangay requests">
                            <span class="block font-bold text-amber-900 mb-0.5">🗺️ Barangay Request Assessments</span>
                            <span class="text-[9px] text-slate-400">Maps pending volume backlogs & plots caseworker dispatches.</span>
                        </div>

                        <div class="p-3 bg-emerald-50/60 border border-emerald-100 hover:bg-emerald-50 rounded-xl cursor-pointer transition-all quick-prompt-btn" data-query="draft medical assistance memo for Dela Cruz">
                            <span class="block font-bold text-emerald-900 mb-0.5">✍️ Draft Recommendation Memo</span>
                            <span class="text-[9px] text-slate-400">Drafts official endorsement memos for specific residents.</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>

<script src="js/admin_reports.js"></script>

<?php
include_once "footer.php";
?>
