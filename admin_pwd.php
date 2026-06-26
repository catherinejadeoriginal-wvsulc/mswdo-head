<?php
// MSWDO Portal - PWD Registry View
$pageTitle = "PWD Registry";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$pwdRecords = get_db_data('pwdRecords');

// Summary indicators
$total_pwds = count($pwdRecords);
$active_pwds = 0;
$claimed_pwds = 0;
$unclaimed_pwds = 0;

foreach ($pwdRecords as $p) {
    if (isset($p['status']) && $p['status'] === 'Active') {
        $active_pwds++;
    }
    if (isset($p['assistanceStatus'])) {
        if ($p['assistanceStatus'] === 'Claimed') {
            $claimed_pwds++;
        } else {
            $unclaimed_pwds++;
        }
    }
}
?>

<div class="p-6 space-y-6" id="pwd-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-accessibility text-blue-900 w-5 h-5"></i>
                PWD Registry Database
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Monitor registered Persons with Disabilities, track quarterly social subsidy payouts, and register indigent claims.
            </p>
        </div>
        <button class="btn btn-primary" id="add-pwd-trigger">
            <i class="lucide lucide-plus w-4 h-4"></i> Enlist PWD Record
        </button>
    </div>

    <!-- Count Summary Badges -->
    <div class="card-container" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <div class="card card-primary flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total PWD Roster</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $total_pwds; ?></p>
            </div>
            <div class="p-3.5 bg-blue-50 text-blue-900 rounded-xl">
                <i class="lucide lucide-accessibility w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-success flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Claimed Subsidies</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $claimed_pwds; ?></p>
            </div>
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <i class="lucide lucide-check-circle-2 w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-warning flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Unclaimed Reserves</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $unclaimed_pwds; ?></p>
            </div>
            <div class="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
                <i class="lucide lucide-clock w-5 h-5"></i>
            </div>
        </div>
    </div>

    <!-- Search / Filter bar -->
    <div class="table-card">
        <div class="table-header">
            <span class="table-title">PWD Registry Members</span>
            <div class="table-actions">
                <div class="search-wrapper">
                    <i class="lucide lucide-search"></i>
                    <input type="text" id="pwd-search" placeholder="Search by name, ID, barangay..." class="input-search" style="width: 250px;">
                </div>
                <select id="pwd-assistance-filter" class="form-input" style="width: 140px; padding: 7px 12px;">
                    <option value="All">All Claims</option>
                    <option value="Claimed">Claimed Only</option>
                    <option value="Unclaimed">Unclaimed Only</option>
                </select>
                <select id="pwd-status-filter" class="form-input" style="width: 120px; padding: 7px 12px;">
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
                        <th>Registry ID</th>
                        <th>Full Resident Name</th>
                        <th>Age / Gender</th>
                        <th>Barangay Area</th>
                        <th>Disability Classification</th>
                        <th>Subsidy Claim</th>
                        <th>Status</th>
                        <th style="text-align: center;">Actions</th>
                    </tr>
                </thead>
                <tbody id="pwd-table-body">
                    <?php if (empty($pwdRecords)): ?>
                        <tr><td colspan="8" class="text-center py-12 text-slate-400">No PWD records configured. Enlist a PWD member.</td></tr>
                    <?php else: ?>
                        <?php foreach ($pwdRecords as $p): 
                            $status = $p['status'] ?? 'Active';
                            $assistance = $p['assistanceStatus'] ?? 'Unclaimed';
                            
                            $statusBadge = ($status === 'Active') ? 'badge-success' : 'badge-danger';
                            $claimBadge = ($assistance === 'Claimed') ? 'badge-success' : 'badge-pending';
                        ?>
                            <tr class="pwd-row" 
                                data-name="<?php echo htmlspecialchars(strtolower($p['name'])); ?>"
                                data-id="<?php echo htmlspecialchars(strtolower($p['id'])); ?>"
                                data-barangay="<?php echo htmlspecialchars(strtolower($p['barangay'])); ?>"
                                data-status="<?php echo htmlspecialchars($status); ?>"
                                data-claim="<?php echo htmlspecialchars($assistance); ?>">
                                
                                <td class="font-mono font-bold text-blue-900"><?php echo htmlspecialchars($p['id']); ?></td>
                                <td class="font-bold text-slate-800"><?php echo htmlspecialchars($p['name']); ?></td>
                                <td class="font-medium text-slate-500"><?php echo intval($p['age']); ?> yrs / <?php echo htmlspecialchars($p['gender']); ?></td>
                                <td class="font-bold text-slate-500"><?php echo htmlspecialchars($p['barangay']); ?></td>
                                <td class="font-semibold text-slate-600"><?php echo htmlspecialchars($p['disabilityType']); ?></td>
                                <td><span class="badge <?php echo $claimBadge; ?>"><?php echo $assistance; ?></span></td>
                                <td><span class="badge <?php echo $statusBadge; ?>"><?php echo $status; ?></span></td>
                                <td style="text-align: center;">
                                    <button class="btn btn-secondary btn-icon edit-pwd-trigger"
                                            data-id="<?php echo htmlspecialchars($p['id']); ?>"
                                            data-name="<?php echo htmlspecialchars($p['name']); ?>"
                                            data-age="<?php echo htmlspecialchars($p['age']); ?>"
                                            data-gender="<?php echo htmlspecialchars($p['gender']); ?>"
                                            data-barangay="<?php echo htmlspecialchars($p['barangay']); ?>"
                                            data-disability="<?php echo htmlspecialchars($p['disabilityType']); ?>"
                                            data-claim="<?php echo htmlspecialchars($assistance); ?>"
                                            data-status="<?php echo htmlspecialchars($status); ?>"
                                            data-regdate="<?php echo htmlspecialchars($p['registrationDate'] ?? ''); ?>">
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

<!-- Add PWD Modal -->
<div class="modal-overlay hidden" id="add-pwd-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-plus-circle text-blue-200"></i> Enlist PWD Record
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Enlist a new Person with Disability into LGU registry</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-add-pwd-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="add-pwd-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div class="space-y-1">
                <label class="form-label">Full Resident Name</label>
                <input type="text" id="add-pwd-name" name="name" required placeholder="Lastname, Firstname Middlename" class="form-input">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Age</label>
                    <input type="number" id="add-pwd-age" name="age" required min="1" max="120" value="30" class="form-input font-mono">
                </div>
                <div class="space-y-1">
                    <label class="form-label">Gender</label>
                    <select id="add-pwd-gender" name="gender" class="form-input">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="form-label">Barangay Address</label>
                <select id="add-pwd-barangay" name="barangay" class="form-input">
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
                <label class="form-label">Disability Type</label>
                <select id="add-pwd-disability" name="disabilityType" class="form-input">
                    <option value="Visual Impairment">Visual Impairment</option>
                    <option value="Hearing Impairment">Hearing Impairment</option>
                    <option value="Speech and Language Impairment">Speech and Language Impairment</option>
                    <option value="Orthopedic Disability">Orthopedic Disability</option>
                    <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                    <option value="Psychosocial Disability">Psychosocial Disability</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Assistance Status</label>
                    <select id="add-pwd-claim" name="assistanceStatus" class="form-input">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="form-label">Operational Status</label>
                    <select id="add-pwd-status" name="status" class="form-input">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-add-pwd-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-new-pwd">Save Resident</button>
        </div>
    </div>
</div>

<!-- Edit PWD Modal (Addresses User Requirements: Scrollable, Dynamic) -->
<div class="modal-overlay hidden" id="edit-pwd-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-settings text-blue-200"></i> Edit PWD Record
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Modify resident demographic & claim statuses</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-edit-pwd-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="edit-pwd-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs" style="max-height: 55vh;">
            <input type="hidden" id="edit-pwd-id">
            
            <div class="space-y-1">
                <label class="form-label">Full Resident Name</label>
                <input type="text" id="edit-pwd-name" name="name" required class="form-input">
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Age</label>
                    <input type="number" id="edit-pwd-age" name="age" required min="1" max="120" class="form-input font-mono">
                </div>
                <div class="space-y-1">
                    <label class="form-label">Gender</label>
                    <select id="edit-pwd-gender" name="gender" class="form-input">
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <div class="space-y-1">
                <label class="form-label">Barangay Address</label>
                <select id="edit-pwd-barangay" name="barangay" class="form-input">
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
                <label class="form-label">Disability Type</label>
                <select id="edit-pwd-disability" name="disabilityType" class="form-input">
                    <option value="Visual Impairment">Visual Impairment</option>
                    <option value="Hearing Impairment">Hearing Impairment</option>
                    <option value="Speech and Language Impairment">Speech and Language Impairment</option>
                    <option value="Orthopedic Disability">Orthopedic Disability</option>
                    <option value="Autism Spectrum Disorder">Autism Spectrum Disorder</option>
                    <option value="Psychosocial Disability">Psychosocial Disability</option>
                </select>
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="form-label">Assistance Status</label>
                    <select id="edit-pwd-claim" name="assistanceStatus" class="form-input">
                        <option value="Unclaimed">Unclaimed</option>
                        <option value="Claimed">Claimed</option>
                    </select>
                </div>
                <div class="space-y-1">
                    <label class="form-label">Operational Status</label>
                    <select id="edit-pwd-status" name="status" class="form-input">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div class="space-y-1">
                <label class="form-label">Enlistment Registration Date</label>
                <input type="text" id="edit-pwd-regdate" readonly class="form-input bg-slate-50 font-mono text-slate-400">
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-between items-center gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer" id="delete-pwd-btn">Delete Resident</button>
            <div class="flex gap-2">
                <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-edit-pwd-modal">Cancel</button>
                <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-edit-pwd">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script src="js/admin_pwd.js"></script>

<?php
include_once "footer.php";
?>
