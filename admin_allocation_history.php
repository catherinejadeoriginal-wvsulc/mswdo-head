<?php
// MSWDO Portal - Allocation History Ledger
$pageTitle = "Allocation History";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$history = get_db_data('allocationHistory');
?>

<div class="p-6 space-y-6" id="history-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-history text-blue-900 w-5 h-5"></i>
                Allocation History & Audit Logs
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                View public ledger records of budget adjust resolutions, supplemental allocations, and fund transfers.
            </p>
        </div>
    </div>

    <!-- Search and filter ribbon -->
    <div class="table-card">
        <div class="table-header">
            <span class="table-title">Audit Ledger Log Entries (<?php echo count($history); ?> total)</span>
            <div class="table-actions">
                <div class="search-wrapper">
                    <i class="lucide lucide-search"></i>
                    <input type="text" id="history-search" placeholder="Search by program, author, remarks..." class="input-search" style="width: 250px;">
                </div>
                <select id="history-action-filter" class="form-input" style="width: 140px; padding: 7px 12px;">
                    <option value="All">All Actions</option>
                    <option value="Allocated">Allocations</option>
                    <option value="Edited">Edits / Adjusts</option>
                    <option value="Transferred">Transfers</option>
                </select>
            </div>
        </div>

        <!-- Dynamic Data Grid -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 12%;">Date / Time</th>
                        <th style="width: 15%;">Transaction ID</th>
                        <th style="width: 23%;">Welfare Scheme(s)</th>
                        <th style="width: 15%;">Previous Budget</th>
                        <th style="width: 15%;">New Budget</th>
                        <th style="width: 15%;">Variance</th>
                        <th style="width: 15%;">Adjuster Authority</th>
                    </tr>
                </thead>
                <tbody id="history-table-body">
                    <?php if (empty($history)): ?>
                        <tr><td colspan="7" class="text-center py-12 text-slate-400">No budget transaction records found.</td></tr>
                    <?php else: ?>
                        <?php foreach ($history as $record): 
                            $prev = isset($record['previousBudget']) ? floatval($record['previousBudget']) : 0;
                            $new = isset($record['newBudget']) ? floatval($record['newBudget']) : 0;
                            $diff = isset($record['amountChanged']) ? floatval($record['amountChanged']) : ($new - $prev);
                            
                            $actionType = isset($record['actionType']) ? $record['actionType'] : 'Allocated';
                            
                            // Badge configuration
                            $badgeStyle = 'badge-success';
                            if ($actionType === 'Edited') $badgeStyle = 'badge-info';
                            if ($actionType === 'Transferred') $badgeStyle = 'badge-pending';
                            
                            $diffSign = ($diff > 0) ? '+₱' . number_format($diff, 2) : '-₱' . number_format(abs($diff), 2);
                            $diffColor = ($diff > 0) ? 'text-emerald-600' : (($diff < 0) ? 'text-rose-600' : 'text-slate-500');
                            if ($diff == 0) $diffSign = '₱0.00';
                        ?>
                            <tr class="history-row" 
                                data-prog="<?php echo htmlspecialchars(strtolower($record['programName'])); ?>" 
                                data-remarks="<?php echo htmlspecialchars(strtolower($record['remarks'] ?? '')); ?>"
                                data-by="<?php echo htmlspecialchars(strtolower($record['modifiedBy'] ?? '')); ?>"
                                data-action="<?php echo htmlspecialchars($actionType); ?>">
                                
                                <td class="font-bold text-slate-500 text-[10px]"><?php echo htmlspecialchars($record['dateTime']); ?></td>
                                <td class="font-mono font-bold text-blue-900"><?php echo htmlspecialchars($record['id']); ?></td>
                                <td>
                                    <div class="font-bold text-slate-800 mb-0.5"><?php echo htmlspecialchars($record['programName']); ?></div>
                                    <span class="badge <?php echo $badgeStyle; ?> btn-sm" style="font-size: 8px; padding: 2px 6px;"><?php echo $actionType; ?></span>
                                    <p class="text-[9px] text-slate-400 mt-1 italic font-medium">"<?php echo htmlspecialchars($record['remarks'] ?? ''); ?>"</p>
                                </td>
                                <td class="font-mono text-slate-500">₱<?php echo number_format($prev, 2); ?></td>
                                <td class="font-mono text-slate-700 font-semibold">₱<?php echo number_format($new, 2); ?></td>
                                <td class="font-mono font-bold <?php echo $diffColor; ?>"><?php echo $diffSign; ?></td>
                                <td>
                                    <div class="font-bold text-slate-800 text-[10px]"><?php echo htmlspecialchars($record['modifiedBy'] ?? 'System Head'); ?></div>
                                    <div class="text-[9px] text-slate-400"><?php echo htmlspecialchars($record['budgetSource'] ?? 'Council Mandate'); ?></div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const searchInput = document.getElementById('history-search');
        const actionFilter = document.getElementById('history-action-filter');
        const rows = document.querySelectorAll('.history-row');

        function filterLedger() {
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const action = actionFilter ? actionFilter.value : 'All';

            rows.forEach(row => {
                const prog = row.getAttribute('data-prog') || '';
                const remarks = row.getAttribute('data-remarks') || '';
                const author = row.getAttribute('data-by') || '';
                const rowAction = row.getAttribute('data-action') || '';

                const matchesSearch = prog.includes(query) || remarks.includes(query) || author.includes(query);
                const matchesAction = (action === 'All') || (rowAction === action);

                if (matchesSearch && matchesAction) {
                    row.classList.remove('hidden');
                } else {
                    row.classList.add('hidden');
                }
            });
        }

        if (searchInput) searchInput.addEventListener('input', filterLedger);
        if (actionFilter) actionFilter.addEventListener('change', filterLedger);
    });
</script>

<?php
include_once "footer.php";
?>
