<?php
// MSWDO Portal - Solo Parents Registry View
$pageTitle = "Solo Parents";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$soloParentRecords = get_db_data('soloParentRecords');

// Summary statistics
$total_solos = count($soloParentRecords);
$active_solos = 0;
$claimed_solos = 0;
$unclaimed_solos = 0;

foreach ($soloParentRecords as $s) {
    if (isset($s['status']) && $s['status'] === 'Active') {
        $active_solos++;
    }
    if (isset($s['assistanceStatus'])) {
        if ($s['assistanceStatus'] === 'Claimed') {
            $claimed_solos++;
        } else {
            $unclaimed_solos++;
        }
    }
}
?>

<div class="p-6 space-y-6" id="soloparents-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-heart-handshake text-blue-900 w-5 h-5"></i>
                Solo Parents Registry
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Monitor registered single providers, track active dependent counts, and verify monthly support payouts.
            </p>
        </div>
        <button class="btn btn-primary" id="add-solo-trigger">
            <i class="lucide lucide-plus w-4 h-4"></i> Enlist Solo Parent
        </button>
    </div>

    <!-- Summary Statistics Badging -->
    <div class="card-container" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <div class="card card-primary flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Solo Parents</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $total_solos; ?></p>
            </div>
            <div class="p-3.5 bg-blue-50 text-blue-900 rounded-xl">
                <i class="lucide lucide-heart-handshake w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-success flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Claimed Cash Cards</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $claimed_solos; ?></p>
            </div>
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <i class="lucide lucide-check-circle-2 w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-warning flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Unclaimed Support</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $unclaimed_solos; ?></p>
            </div>
            <div class="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
                <i class="lucide lucide-clock w-5 h-5"></i>
            </div>
        </div>
    </div>

    <!-- Search / Filter ribbon -->
    <div class="table-card">
        <div class="table-header">
            <span class="table-title">Single Provider Database</span>
            <div class="table-actions">
                <div class="search-wrapper">
                    <i class="lucide lucide-search"></i>
                    <input type="text" id="solo-search" placeholder="Search by name, SP ID, barangay..." class="input-search" style="width: 250px;">
                </div>
                <select id="solo-assistance-filter" class="form-input" style="width: 140px; padding: 7px 12px;">
                    <option value="All">All Claims</option>
                    <option value="Claimed">Claimed Only</option>
                    <option value="Unclaimed">Unclaimed Only</option>
                </select>
                <select id="solo-status-filter" class="form-input" style="width: 120px; padding: 7px 12px;">
                    <option value="All">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
        </div>

        <!-- Data Grid -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Solo Parent ID</th>
                        <th>Full Resident Name</th>
                        <th>Age / Gender</th>
                        <th>Barangay Area</th>
                        <th>No. of Dependents</th>
                        <th>Subsidy Claim</th>
                        <th>Status</th>
                        <th style="text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody id="solo-table-body">
                    <?php if (empty($soloParentRecords)): ?>
                        <tr><td colspan="8" class="text-center py-12 text-slate-400">No solo parents registered. Enlist a member.</td></tr>
                    <?php else: ?>
                        <?php foreach ($soloParentRecords as $s): 
                            $status = $s['status'] ?? 'Active';
                            $assistance = $s['assistanceStatus'] ?? 'Unclaimed';
                            
                            $statusBadge = ($status === 'Active') ? 'badge-success' : 'badge-danger';
                            $claimBadge = ($assistance === 'Claimed') ? 'badge-success' : 'badge-pending';
                            $children = isset($s['childrenCount']) ? intval($s['childrenCount']) : 1;
                        ?>
                            <tr class="solo-row" 
                                data-name="<?php echo htmlspecialchars(strtolower($s['name'])); ?>"
                                data-id="<?php echo htmlspecialchars(strtolower($s['id'])); ?>"
                                data-barangay="<?php echo htmlspecialchars(strtolower($s['barangay'])); ?>"
                                data-claim="<?php echo htmlspecialchars($assistance); ?>"
                                data-status="<?php echo htmlspecialchars($status); ?>">
                                
                                <td class="font-mono font-bold text-blue-900"><?php echo htmlspecialchars($s['id']); ?></td>
                                <td class="font-bold text-slate-800"><?php echo htmlspecialchars($s['name']); ?></td>
                                <td class="font-medium text-slate-500"><?php echo intval($s['age']); ?> yrs / <?php echo htmlspecialchars($s['gender']); ?></td>
                                <td class="font-bold text-slate-500"><?php echo htmlspecialchars($s['barangay']); ?></td>
                                <td class="font-bold text-slate-600 text-center font-mono"><?php echo $children; ?> child<?php echo ($children > 1) ? 'ren' : ''; ?></td>
                                <td><span class="badge <?php echo $claimBadge; ?>"><?php echo $assistance; ?></span></td>
                                <td><span class="badge <?php echo $statusBadge; ?>"><?php echo $status; ?></span></td>
                                <td style="text-align: center;">
                                    <button class="btn btn-secondary btn-icon edit-solo-trigger"
                                            data-id="<?php echo htmlspecialchars($s['id']); ?>"
                                            data-name="<?php echo htmlspecialchars($s['name']); ?>"
                                            data-age="<?php echo htmlspecialchars($s['age']); ?>"
                                            data-gender="<?php echo htmlspecialchars($s['gender']); ?>"
                                            data-barangay="<?php echo htmlspecialchars($s['barangay']); ?>"
                                            data-children="<?php echo htmlspecialchars($children); ?>"
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

<!-- Add Solo Parent Modal -->
<div class="modal-overlay hidden" id="add-solo-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-plus-circle text-blue-200"></i> Register Solo Parent
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Enlist a single provider into LGU registry support</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-add-solo-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="add-solo-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div class="space-y-1">
                <label class="form-label">Full Resident Name</label>
                <input type="text" id="add-sp-name" name="name" required placeholder="Lastname, Firstname Middlename" class="form-input">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Age</label>
                    <input type="number" id="add-sp-age" name="age" required min="15" max="100" value="32" class="form-input font-mono">
                </div>
                <div class="space-y-1">
                    <label class="form-label">Gender</label>
                    <select id="add-sp-gender" name="gender" class="form-input">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="form-label">Barangay Address</label>
                <select id="add-sp-barangay" name="barangay" class="form-input">
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
                <label class="form-label">Number of Dependent Children</label>
                <input type="number" id="add-sp-children" name="childrenCount" required min="1" max="25" value="2" class="form-input font-mono font-bold">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Assistance Status</label>
                    <select id="add-sp-claim" name="assistanceStatus" class="form-input">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="form-label">Operational Status</label>
                    <select id="add-sp-status" name="status" class="form-input">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-add-solo-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-new-solo">Save Resident</button>
        </div>
    </div>
</div>

<!-- Edit Solo Parent Modal (Addresses User Requirements: Scrollable, Dynamic) -->
<div class="modal-overlay hidden" id="edit-solo-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-settings text-blue-200"></i> Edit Solo Parent Record
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Modify provider details & dependent support values</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-edit-solo-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="edit-solo-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs" style="max-height: 55vh;">
            <input type="hidden" id="edit-sp-id">
            
            <div class="space-y-1">
                <label class="form-label">Full Resident Name</label>
                <input type="text" id="edit-sp-name" name="name" required class="form-input">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Age</label>
                    <input type="number" id="edit-sp-age" name="age" required min="15" max="100" class="form-input font-mono">
                </div>
                <div class="space-y-1">
                    <label class="form-label">Gender</label>
                    <select id="edit-sp-gender" name="gender" class="form-input">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="form-label">Barangay Address</label>
                <select id="edit-sp-barangay" name="barangay" class="form-input">
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
                <label class="form-label">Number of Dependent Children</label>
                <input type="number" id="edit-sp-children" name="childrenCount" required min="1" max="25" class="form-input font-mono font-bold">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Assistance status</label>
                    <select id="edit-sp-claim" name="assistanceStatus" class="form-input">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="form-label">Operational Status</label>
                    <select id="edit-sp-status" name="status" class="form-input">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="space-y-1">
                <label class="form-label">Enlistment Registration Date</label>
                <input type="text" id="edit-sp-regdate" readonly class="form-input bg-slate-50 font-mono text-slate-400">
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-between items-center gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer" id="delete-solo-btn">Delete Resident</button>
            <div class="flex gap-2">
                <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-edit-solo-modal">Cancel</button>
                <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-edit-solo">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script src="js/admin_soloparents.js"></script>

<?php
include_once "footer.php";
?>
