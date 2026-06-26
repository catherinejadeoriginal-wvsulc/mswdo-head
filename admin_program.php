<?php
// MSWDO Portal - Program Management View
$pageTitle = "Program Management";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$programs = get_db_data('programs');

// Count summary statistics
$total_programs = count($programs);
$active_programs = 0;
$total_beneficiaries = 0;

foreach ($programs as $p) {
    if (isset($p['status']) && $p['status'] === 'Active') {
        $active_programs++;
    }
    $total_beneficiaries += isset($p['beneficiariesCount']) ? intval($p['beneficiariesCount']) : 0;
}
?>

<div class="p-6 space-y-6" id="programs-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-folder-open text-blue-900 w-5 h-5"></i>
                Welfare Program Management
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Configure Municipal social assistance allocations and operational statuses.
            </p>
        </div>
        <button class="btn btn-primary" id="add-program-trigger">
            <i class="lucide lucide-plus w-4 h-4"></i> Add Welfare Program
        </button>
    </div>

    <!-- Summary Count badging -->
    <div class="card-container" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <div class="card card-primary flex items-center justify-between" style="border-left-width: 5px;">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Subsidies</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $total_programs; ?></p>
            </div>
            <div class="p-3.5 bg-blue-50 text-blue-900 rounded-xl">
                <i class="lucide lucide-folder-open w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-success flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Active Schemes</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $active_programs; ?></p>
            </div>
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <i class="lucide lucide-check-circle-2 w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-info flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Registered Beneficiaries</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo number_format($total_beneficiaries); ?></p>
            </div>
            <div class="p-3.5 bg-sky-50 text-sky-600 rounded-xl">
                <i class="lucide lucide-users w-5 h-5"></i>
            </div>
        </div>
    </div>

    <!-- Search and filter ribbon -->
    <div class="table-card">
        <div class="table-header">
            <span class="table-title">Municipal Program Catalogs</span>
            <div class="table-actions">
                <div class="search-wrapper">
                    <i class="lucide lucide-search"></i>
                    <input type="text" id="program-search" placeholder="Search by name, description..." class="input-search">
                </div>
                <select id="program-filter" class="form-input" style="width: 140px; padding: 7px 12px;">
                    <option value="All">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="Inactive">Inactive Only</option>
                </select>
            </div>
        </div>

        <!-- Dynamic Data Grid -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th style="width: 30%;">Program Details</th>
                        <th style="width: 15%;">Allocated Budget</th>
                        <th style="width: 15%;">Utilized Budget</th>
                        <th style="width: 15%;">Remaining</th>
                        <th style="width: 10%;">Beneficiaries</th>
                        <th style="width: 10%;">Status</th>
                        <th style="width: 5%; text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody id="programs-table-body">
                    <?php if (empty($programs)): ?>
                        <tr><td colspan="7" class="text-center py-12 text-slate-400">No programs configured. Click Add Program to create one.</td></tr>
                    <?php else: ?>
                        <?php foreach ($programs as $prog): 
                            $alloc = isset($prog['allocatedBudget']) ? floatval($prog['allocatedBudget']) : 0;
                            $util = isset($prog['utilizedBudget']) ? floatval($prog['utilizedBudget']) : 0;
                            $rem = $alloc - $util;
                            $status = isset($prog['status']) ? $prog['status'] : 'Active';
                            $badge = ($status === 'Active') ? 'badge-success' : 'badge-danger';
                            $benefic = isset($prog['beneficiariesCount']) ? intval($prog['beneficiariesCount']) : 0;
                        ?>
                            <tr class="program-row" data-name="<?php echo htmlspecialchars(strtolower($prog['name'])); ?>" data-desc="<?php echo htmlspecialchars(strtolower($prog['description'])); ?>" data-status="<?php echo htmlspecialchars($status); ?>">
                                <td>
                                    <div class="font-extrabold text-slate-800 text-xs tracking-tight mb-1"><?php echo htmlspecialchars($prog['name']); ?></div>
                                    <div class="text-[10px] text-slate-400 line-clamp-2 max-w-sm"><?php echo htmlspecialchars($prog['description']); ?></div>
                                </td>
                                <td class="font-mono font-bold text-slate-700">₱<?php echo number_format($alloc, 2); ?></td>
                                <td class="font-mono font-bold text-slate-500">₱<?php echo number_format($util, 2); ?></td>
                                <td class="font-mono font-bold text-blue-900">₱<?php echo number_format($rem, 2); ?></td>
                                <td class="font-mono font-bold text-slate-600 text-center"><?php echo number_format($benefic); ?></td>
                                <td><span class="badge <?php echo $badge; ?>"><?php echo $status; ?></span></td>
                                <td style="text-align: center;">
                                    <button class="btn btn-secondary btn-icon edit-program-trigger" 
                                            data-id="<?php echo htmlspecialchars($prog['id']); ?>"
                                            data-name="<?php echo htmlspecialchars($prog['name']); ?>"
                                            data-desc="<?php echo htmlspecialchars($prog['description']); ?>"
                                            data-alloc="<?php echo htmlspecialchars($alloc); ?>"
                                            data-util="<?php echo htmlspecialchars($util); ?>"
                                            data-status="<?php echo htmlspecialchars($status); ?>"
                                            data-benefic="<?php echo htmlspecialchars($benefic); ?>">
                                        <i class="lucide lucide-settings w-3.5 h-3.5 text-slate-500"></i>
                                    </button>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Program Modal -->
<div class="modal-overlay hidden" id="add-program-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-plus-circle text-blue-200"></i> Add Welfare Program
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Introduce a new social assistance scheme</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-add-program-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="add-program-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div class="space-y-1">
                <label class="form-label">Program Title</label>
                <input type="text" id="add-p-name" name="name" required placeholder="e.g. AICS - Medical Assistance" class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Program Description / Scope</label>
                <textarea id="add-p-desc" name="description" required placeholder="Describe assistance scopes, guidelines, and qualifications..." class="form-input" style="min-height: 100px;"></textarea>
            </div>

            <div class="space-y-1">
                <label class="form-label">Annual Allocated Budget (₱)</label>
                <input type="number" id="add-p-alloc" name="allocatedBudget" required min="1000" value="100000" class="form-input font-mono">
            </div>

            <div class="space-y-1">
                <label class="form-label">Program Operational Status</label>
                <select id="add-p-status" name="status" class="form-input">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-add-program-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-new-program">Save Program</button>
        </div>
    </div>
</div>

<!-- Scrollable & Fixed Edit Program / Allocation Modal -->
<div class="modal-overlay hidden" id="edit-program-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-settings text-blue-200"></i> Edit Program & Allocations
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Modify parameters & adjust operational values</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-edit-program-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <!-- Form contains overflow scrollable class to fully address User Requirement #2 -->
        <form id="edit-program-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs" style="max-height: 55vh;">
            <input type="hidden" id="edit-p-id">
            
            <div class="space-y-1">
                <label class="form-label">Program Title</label>
                <input type="text" id="edit-p-name" name="name" required class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Program Description / Scope</label>
                <textarea id="edit-p-desc" name="description" required class="form-input" style="min-height: 80px;"></textarea>
            </div>

            <div class="space-y-1">
                <label class="form-label">Annual Allocated Budget (₱)</label>
                <input type="number" id="edit-p-alloc" name="allocatedBudget" required min="1000" class="form-input font-mono">
            </div>

            <div class="space-y-1">
                <label class="form-label">Utilized Budget (₱)</label>
                <input type="number" id="edit-p-util" name="utilizedBudget" required min="0" class="form-input font-mono">
                <span class="text-[9px] text-slate-400 font-medium">Accumulated expenses disbursed.</span>
            </div>

            <div class="space-y-1">
                <label class="form-label">Total Registered Beneficiaries</label>
                <input type="number" id="edit-p-benefic" name="beneficiariesCount" required min="0" class="form-input font-mono">
            </div>

            <div class="space-y-1">
                <label class="form-label">Program Operational Status</label>
                <select id="edit-p-status" name="status" class="form-input">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-between items-center gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer" id="delete-program-btn">Delete Program</button>
            <div class="flex gap-2">
                <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-edit-program-modal">Cancel</button>
                <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-edit-program">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script src="js/admin_program.js"></script>

<?php
include_once "footer.php";
?>
