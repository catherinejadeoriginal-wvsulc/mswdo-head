<?php
// MSWDO Portal - Senior Citizens Registry View
$pageTitle = "Senior Citizens";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$seniorRecords = get_db_data('seniorRecords');

// Summary statistics
$total_seniors = count($seniorRecords);
$active_seniors = 0;
$claimed_seniors = 0;
$unclaimed_seniors = 0;

foreach ($seniorRecords as $s) {
    if (isset($s['status']) && $s['status'] === 'Active') {
        $active_seniors++;
    }
    if (isset($s['assistanceStatus'])) {
        if ($s['assistanceStatus'] === 'Claimed') {
            $claimed_seniors++;
        } else {
            $unclaimed_seniors++;
        }
    }
}
?>

<div class="p-6 space-y-6" id="seniors-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-user-check text-blue-900 w-5 h-5"></i>
                Senior Citizens Registry (OSCA)
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Supervise registered elder citizens, track monthly pension payouts, and update social welfare claims.
            </p>
        </div>
        <button class="btn btn-primary" id="add-senior-trigger">
            <i class="lucide lucide-plus w-4 h-4"></i> Enlist Senior Record
        </button>
    </div>

    <!-- Summary Statistics Badging -->
    <div class="card-container" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <div class="card card-primary flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Senior Citizens</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $total_seniors; ?></p>
            </div>
            <div class="p-3.5 bg-blue-50 text-blue-900 rounded-xl">
                <i class="lucide lucide-accessibility w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-success flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Claimed Pensions</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $claimed_seniors; ?></p>
            </div>
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <i class="lucide lucide-check-circle-2 w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-warning flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Unclaimed Allowances</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $unclaimed_seniors; ?></p>
            </div>
            <div class="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
                <i class="lucide lucide-clock w-5 h-5"></i>
            </div>
        </div>
    </div>

    <!-- Search / Filter ribbon -->
    <div class="table-card">
        <div class="table-header">
            <span class="table-title">Elder Citizen Database</span>
            <div class="table-actions">
                <div class="search-wrapper">
                    <i class="lucide lucide-search"></i>
                    <input type="text" id="senior-search" placeholder="Search by name, OSCA ID, barangay..." class="input-search" style="width: 250px;">
                </div>
                <select id="senior-pension-filter" class="form-input" style="width: 140px; padding: 7px 12px;">
                    <option value="All">All Pensions</option>
                    <option value="Pensioner">Pensioners Only</option>
                    <option value="Non-Pensioner">Non-Pensioners</option>
                </select>
                <select id="senior-assistance-filter" class="form-input" style="width: 130px; padding: 7px 12px;">
                    <option value="All">All Claims</option>
                    <option value="Claimed">Claimed Only</option>
                    <option value="Unclaimed">Unclaimed Only</option>
                </select>
            </div>
        </div>

        <!-- Data Grid -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>OSCA ID</th>
                        <th>Full Resident Name</th>
                        <th>Age / Gender</th>
                        <th>Barangay Area</th>
                        <th>Pensioner Status</th>
                        <th>Subsidy Claim</th>
                        <th>Status</th>
                        <th style="text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody id="senior-table-body">
                    <?php if (empty($seniorRecords)): ?>
                        <tr><td colspan="8" class="text-center py-12 text-slate-400">No senior citizens registered. Enlist an OSCA member.</td></tr>
                    <?php else: ?>
                        <?php foreach ($seniorRecords as $s): 
                            $status = $s['status'] ?? 'Active';
                            $pension = $s['pensionStatus'] ?? 'Pensioner';
                            $assistance = $s['assistanceStatus'] ?? 'Unclaimed';
                            
                            $statusBadge = ($status === 'Active') ? 'badge-success' : 'badge-danger';
                            $claimBadge = ($assistance === 'Claimed') ? 'badge-success' : 'badge-pending';
                            $pensionBadge = ($pension === 'Pensioner') ? 'badge-info' : 'badge-neutral';
                        ?>
                            <tr class="senior-row" 
                                data-name="<?php echo htmlspecialchars(strtolower($s['name'])); ?>"
                                data-id="<?php echo htmlspecialchars(strtolower($s['id'])); ?>"
                                data-barangay="<?php echo htmlspecialchars(strtolower($s['barangay'])); ?>"
                                data-pension="<?php echo htmlspecialchars($pension); ?>"
                                data-claim="<?php echo htmlspecialchars($assistance); ?>"
                                data-status="<?php echo htmlspecialchars($status); ?>">
                                
                                <td class="font-mono font-bold text-blue-900"><?php echo htmlspecialchars($s['id']); ?></td>
                                <td class="font-bold text-slate-800"><?php echo htmlspecialchars($s['name']); ?></td>
                                <td class="font-medium text-slate-500"><?php echo intval($s['age']); ?> yrs / <?php echo htmlspecialchars($s['gender']); ?></td>
                                <td class="font-bold text-slate-500"><?php echo htmlspecialchars($s['barangay']); ?></td>
                                <td><span class="badge <?php echo $pensionBadge; ?>"><?php echo $pension; ?></span></td>
                                <td><span class="badge <?php echo $claimBadge; ?>"><?php echo $assistance; ?></span></td>
                                <td><span class="badge <?php echo $statusBadge; ?>"><?php echo $status; ?></span></td>
                                <td style="text-align: center;">
                                    <button class="btn btn-secondary btn-icon edit-senior-trigger"
                                            data-id="<?php echo htmlspecialchars($s['id']); ?>"
                                            data-name="<?php echo htmlspecialchars($s['name']); ?>"
                                            data-age="<?php echo htmlspecialchars($s['age']); ?>"
                                            data-gender="<?php echo htmlspecialchars($s['gender']); ?>"
                                            data-barangay="<?php echo htmlspecialchars($s['barangay']); ?>"
                                            data-pension="<?php echo htmlspecialchars($pension); ?>"
                                            data-claim="<?php echo htmlspecialchars($assistance); ?>"
                                            data-status="<?php echo htmlspecialchars($status); ?>"
                                            data-regdate="<?php echo htmlspecialchars($s['registrationDate'] ?? ''); ?>">
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

<!-- Add Senior Modal -->
<div class="modal-overlay hidden" id="add-senior-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-plus-circle text-blue-200"></i> Enlist OSCA Senior Citizen
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Enlist a new elder resident under the OSCA registry</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-add-senior-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="add-senior-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div class="space-y-1">
                <label class="form-label">Full Resident Name</label>
                <input type="text" id="add-s-name" name="name" required placeholder="Lastname, Firstname Middlename" class="form-input">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Age</label>
                    <input type="number" id="add-s-age" name="age" required min="60" max="130" value="65" class="form-input font-mono">
                </div>
                <div class="space-y-1">
                    <label class="form-label">Gender</label>
                    <select id="add-s-gender" name="gender" class="form-input">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="form-label">Barangay Address</label>
                <select id="add-s-barangay" name="barangay" class="form-input">
                    <option value="Poblacion I">Poblacion I</option>
                    <option value="San Isidro">San Isidro</option>
                    <option value="Maligaya">Maligaya</option>
                    <option value="Santa Rosa">Santa Rosa</option>
                    <option value="Bukidnon East">Bukidnon East</option>
                    <option value="Alang-alang">Alang-alang</option>
                    <option value="Batinguel">Batinguel</option>
                    <option value="Tacloban West">Tacloban West</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="form-label">Pension Classification Status</label>
                <select id="add-s-pension" name="pensionStatus" class="form-input">
                    <option value="Pensioner">Pensioner (LGU Social Pension)</option>
                    <option value="Non-Pensioner">Non-Pensioner (No active pensions)</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Assistance status</label>
                    <select id="add-s-claim" name="assistanceStatus" class="form-input">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="form-label">Operational Status</label>
                    <select id="add-s-status" name="status" class="form-input">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-add-senior-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-new-senior">Save Resident</button>
        </div>
    </div>
</div>

<!-- Edit Senior Modal (Addresses User Requirements: Scrollable, Dynamic) -->
<div class="modal-overlay hidden" id="edit-senior-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-settings text-blue-200"></i> Edit Elder Citizen Record
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Modify senior parameters & assistance categories</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-edit-senior-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="edit-senior-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs" style="max-height: 55vh;">
            <input type="hidden" id="edit-s-id">
            
            <div class="space-y-1">
                <label class="form-label">Full Resident Name</label>
                <input type="text" id="edit-s-name" name="name" required class="form-input">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Age</label>
                    <input type="number" id="edit-s-age" name="age" required min="60" max="130" class="form-input font-mono">
                </div>
                <div class="space-y-1">
                    <label class="form-label">Gender</label>
                    <select id="edit-s-gender" name="gender" class="form-input">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="form-label">Barangay Address</label>
                <select id="edit-s-barangay" name="barangay" class="form-input">
                    <option value="Poblacion I">Poblacion I</option>
                    <option value="San Isidro">San Isidro</option>
                    <option value="Maligaya">Maligaya</option>
                    <option value="Santa Rosa">Santa Rosa</option>
                    <option value="Bukidnon East">Bukidnon East</option>
                    <option value="Alang-alang">Alang-alang</option>
                    <option value="Batinguel">Batinguel</option>
                    <option value="Tacloban West">Tacloban West</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="form-label">Pension Classification Status</label>
                <select id="edit-s-pension" name="pensionStatus" class="form-input">
                    <option value="Pensioner">Pensioner (LGU Social Pension)</option>
                    <option value="Non-Pensioner">Non-Pensioner (No active pensions)</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Assistance status</label>
                    <select id="edit-s-claim" name="assistanceStatus" class="form-input">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="form-label">Operational Status</label>
                    <select id="edit-s-status" name="status" class="form-input">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="space-y-1">
                <label class="form-label">Enlistment Registration Date</label>
                <input type="text" id="edit-s-regdate" readonly class="form-input bg-slate-50 font-mono text-slate-400">
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-between items-center gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer" id="delete-senior-btn">Delete Resident</button>
            <div class="flex gap-2">
                <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-edit-senior-modal">Cancel</button>
                <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-edit-senior">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script src="js/admin_seniors.js"></script>

<?php
include_once "footer.php";
?>
