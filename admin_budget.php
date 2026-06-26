<?php
// MSWDO Portal - Budget & Allocation View
$pageTitle = "Budget Management";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$programs = get_db_data('programs');

$totalBudgetLimit = 25000000; // ₱25M total ceiling
$totalAllocated = 0;
$totalUtilized = 0;

foreach ($programs as $p) {
    $totalAllocated += isset($p['allocatedBudget']) ? floatval($p['allocatedBudget']) : 0;
    $totalUtilized += isset($p['utilizedBudget']) ? floatval($p['utilizedBudget']) : 0;
}

$unallocatedPool = $totalBudgetLimit - $totalAllocated;
$totalRemaining = $totalBudgetLimit - $totalUtilized;
?>

<div class="p-6 space-y-6" id="budget-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-piggy-bank text-blue-900 w-5 h-5"></i>
                Municipal Budget & Allocations
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Distribute annual LGU subsidies, simulate transfers, and review transaction ledgers.
            </p>
        </div>
    </div>

    <!-- Summary Metrics Badging -->
    <div class="card-container" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); mb-6">
        <div class="card card-primary">
            <h3><span>Total Budget Limit</span><i class="lucide lucide-wallet text-blue-900 w-4 h-4"></i></h3>
            <p>₱<?php echo number_format($totalBudgetLimit, 2); ?></p>
            <div class="trend text-slate-400">Fixed annual LGU ceiling</div>
        </div>
        <div class="card card-success">
            <h3><span>Allocated Pool</span><i class="lucide lucide-folder-open text-emerald-600 w-4 h-4"></i></h3>
            <p>₱<?php echo number_format($totalAllocated, 2); ?></p>
            <div class="trend text-emerald-600 font-bold"><?php echo round(($totalAllocated/$totalBudgetLimit)*100, 1); ?>% allocated</div>
        </div>
        <div class="card card-warning">
            <h3><span>Unallocated Pool</span><i class="lucide lucide-piggy-bank text-amber-600 w-4 h-4"></i></h3>
            <p>₱<?php echo number_format($unallocatedPool, 2); ?></p>
            <div class="trend text-amber-600 font-bold">Available to distribute</div>
        </div>
        <div class="card card-info">
            <h3><span>Utilized Budget</span><i class="lucide lucide-trending-up text-sky-600 w-4 h-4"></i></h3>
            <p>₱<?php echo number_format($totalUtilized, 2); ?></p>
            <div class="trend text-sky-600 font-bold"><?php echo round(($totalUtilized/$totalBudgetLimit)*100, 1); ?>% total utilization</div>
        </div>
    </div>

    <!-- Content Sections (Left: Programs List, Right: Transfer Simulator) -->
    <div class="charts" style="display: grid; grid-template-columns: 3fr 2fr; gap: 24px;">
        <!-- Left Pane: Program Budgets -->
        <div class="chart-box" style="min-height: 480px; padding: 0; overflow: hidden;">
            <div class="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/60">
                <h3 class="font-bold text-xs tracking-wide uppercase text-slate-700 flex items-center gap-2">
                    <i class="lucide lucide-building w-4 h-4 text-blue-900"></i> Program Subsidies
                </h3>
            </div>
            <div class="table-container" style="overflow-y: auto; height: 420px;">
                <table class="w-full text-xs">
                    <thead>
                        <tr>
                            <th>Program Name</th>
                            <th>Allocated Budget</th>
                            <th>Utilized</th>
                            <th>Remaining</th>
                            <th style="text-align: center;">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($programs as $prog): 
                            $alloc = isset($prog['allocatedBudget']) ? floatval($prog['allocatedBudget']) : 0;
                            $util = isset($prog['utilizedBudget']) ? floatval($prog['utilizedBudget']) : 0;
                            $rem = $alloc - $util;
                        ?>
                            <tr>
                                <td class="font-bold text-slate-800" style="padding: 12px 20px;">
                                    <?php echo htmlspecialchars($prog['name']); ?>
                                </td>
                                <td class="font-mono font-bold text-slate-700">₱<?php echo number_format($alloc, 0); ?></td>
                                <td class="font-mono font-bold text-slate-500">₱<?php echo number_format($util, 0); ?></td>
                                <td class="font-mono font-bold text-blue-900">₱<?php echo number_format($rem, 0); ?></td>
                                <td style="text-align: center; padding: 12px 20px;">
                                    <button class="btn btn-secondary btn-sm allocate-trigger" 
                                            data-id="<?php echo htmlspecialchars($prog['id']); ?>"
                                            data-name="<?php echo htmlspecialchars($prog['name']); ?>"
                                            data-alloc="<?php echo htmlspecialchars($alloc); ?>">
                                        Adjust
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Right Pane: Realtime Transfer Simulator -->
        <div class="chart-box" style="min-height: 480px; display: flex; flex-col: column;">
            <h3 class="border-b border-slate-100 pb-3" style="margin-bottom: 12px;">
                <span class="flex items-center gap-2">
                    <i class="lucide lucide-arrow-right-left text-blue-900 w-4 h-4"></i> Reallocation Simulator
                </span>
                <span class="px-2 py-0.5 rounded text-[8px] font-extrabold bg-blue-100 text-blue-900 uppercase tracking-wider">Dynamic Sandbox</span>
            </h3>

            <div class="space-y-4 text-xs flex-1">
                <p class="text-slate-400 font-medium text-[11px] mb-2 leading-relaxed">
                    Safely simulate shifting budget reserves between separate social assistances. Review outcomes instantly prior to committing adjustments.
                </p>

                <!-- Source Program Select -->
                <div class="form-group">
                    <label class="form-label">Transfer From (Source)</label>
                    <select id="sim-source" class="form-input">
                        <?php foreach ($programs as $prog): ?>
                            <option value="<?php echo htmlspecialchars($prog['id']); ?>">
                                <?php echo htmlspecialchars($prog['name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- Destination Program Select -->
                <div class="form-group">
                    <label class="form-label">Transfer To (Destination)</label>
                    <select id="sim-dest" class="form-input">
                        <?php foreach ($programs as $index => $prog): ?>
                            <option value="<?php echo htmlspecialchars($prog['id']); ?>" <?php echo ($index == 1) ? 'selected' : ''; ?>>
                                <?php echo htmlspecialchars($prog['name']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </div>

                <!-- Simulation Amount (Fixed input validation error #3: user can put any amount freely) -->
                <div class="form-group">
                    <label class="form-label">Simulation Transfer Amount (₱)</label>
                    <input type="number" id="sim-amount" value="200000" class="form-input font-mono font-bold" placeholder="Input any transfer amount...">
                    <span class="text-[9px] text-slate-400 font-medium mt-1 block">Specify any amount. Press Simulate to test.</span>
                </div>

                <!-- Simulation Impact Box (Disclosed upon clicking simulate) -->
                <div id="sim-impact-box" class="p-4 bg-slate-50 border border-slate-100 rounded-xl hidden space-y-3">
                    <h5 class="font-extrabold text-[10px] uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                        <i class="lucide lucide-sparkles text-amber-500 w-3.5 h-3.5"></i> Simulated Allocation impact
                    </h5>
                    
                    <div class="grid grid-cols-2 gap-4 text-[10px]">
                        <div>
                            <span class="block font-bold text-slate-400 uppercase">Source New Balance</span>
                            <span class="font-mono font-bold text-rose-600 block text-xs mt-0.5" id="sim-impact-source-text">₱ --</span>
                        </div>
                        <div>
                            <span class="block font-bold text-slate-400 uppercase">Destination New Balance</span>
                            <span class="font-mono font-bold text-emerald-600 block text-xs mt-0.5" id="sim-impact-dest-text">₱ --</span>
                        </div>
                    </div>
                </div>

                <!-- Error panel -->
                <div id="sim-error-panel" class="p-3 bg-rose-50 border border-rose-100 rounded-lg hidden text-rose-600 text-[10px] font-bold"></div>
            </div>

            <!-- Simulator Actions Footer -->
            <div class="border-t border-slate-150 pt-4 flex gap-3 shrink-0" id="sim-actions-footer">
                <button class="btn btn-secondary flex-1" id="reset-sim-btn">Reset</button>
                <button class="btn btn-primary flex-1" id="simulate-btn">Simulate Transfer</button>
                <button class="btn btn-success flex-1 hidden" id="execute-transfer-btn">Confirm Transfer</button>
            </div>
        </div>
    </div>
</div>

<!-- Allocate/Adjust Budget Modal (Addresses User Requirements: Scrollable, Dynamic) -->
<div class="modal-overlay hidden" id="allocate-budget-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-piggy-bank text-blue-200"></i> Adjust Program Budget
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Adjust allocated annual ceilings</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-allocate-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="allocate-budget-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs" style="max-height: 55vh;">
            <input type="hidden" id="alloc-p-id">
            
            <div class="space-y-1">
                <label class="form-label">Program Name</label>
                <input type="text" id="alloc-p-name" class="form-input bg-slate-50 font-bold" readonly>
            </div>

            <div class="space-y-1">
                <label class="form-label">Current Allocated Ceiling (₱)</label>
                <input type="text" id="alloc-p-current" class="form-input bg-slate-50 font-mono" readonly>
            </div>

            <div class="space-y-1">
                <label class="form-label">Specify New Allocated Budget (₱)</label>
                <input type="number" id="alloc-new-amount" name="allocatedBudget" required min="1000" class="form-input font-mono font-bold">
            </div>

            <div class="space-y-1">
                <label class="form-label">Adjustment Source / Authority</label>
                <input type="text" id="alloc-source" name="source" required value="Municipal Resolution No. 24" class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Remarks / Audit Justification</label>
                <textarea id="alloc-remarks" name="remarks" required class="form-input" placeholder="Justify reallocation reasons for public audit transparency..." style="min-height: 80px;"></textarea>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-allocate-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-budget-alloc">Save Allocation</button>
        </div>
    </div>
</div>

<script src="js/admin_budget.js"></script>

<?php
include_once "footer.php";
?>
