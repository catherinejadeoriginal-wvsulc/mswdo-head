<?php
// MSWDO Portal - Focal Persons Management View
$pageTitle = "Focal Management";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$focalPersons = get_db_data('focalPersons');
$programs = get_db_data('programs');

// Create lookup map of program ID -> Program Name
$programMap = [];
foreach ($programs as $prog) {
    $programMap[$prog['id']] = $prog['name'];
}

// Summary Statistics
$total_focals = count($focalPersons);
$active_focals = 0;
$average_caseload = 0;
$total_caseload = 0;

foreach ($focalPersons as $f) {
    if (isset($f['status']) && $f['status'] === 'Active') {
        $active_focals++;
    }
    $total_caseload += isset($f['caseload']) ? intval($f['caseload']) : 0;
}
if ($total_focals > 0) {
    $average_caseload = round($total_caseload / $total_focals, 1);
}
?>

<div class="p-6 space-y-6" id="focal-view-root">
    <!-- Header Page Title -->
    <div class="flex justify-between items-center flex-wrap gap-4">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-users text-blue-900 w-5 h-5"></i>
                Focal Persons & Case Officers
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Supervise active social welfare officers, contact lifelines, and caseload allocations.
            </p>
        </div>
        <button class="btn btn-primary" id="add-focal-trigger">
            <i class="lucide lucide-plus w-4 h-4"></i> Register Case Officer
        </button>
    </div>

    <!-- Summary Metrics Badging -->
    <div class="card-container" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <div class="card card-primary flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total Case Personnel</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $total_focals; ?></p>
            </div>
            <div class="p-3.5 bg-blue-50 text-blue-900 rounded-xl">
                <i class="lucide lucide-users w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-success flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Active Duty</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $active_focals; ?></p>
            </div>
            <div class="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <i class="lucide lucide-user-check w-5 h-5"></i>
            </div>
        </div>
        <div class="card card-warning flex items-center justify-between">
            <div>
                <h3 class="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Average Caseload</h3>
                <p class="text-3xl font-extrabold font-mono text-slate-800"><?php echo $average_caseload; ?></p>
            </div>
            <div class="p-3.5 bg-amber-50 text-amber-600 rounded-xl">
                <i class="lucide lucide-briefcase w-5 h-5"></i>
            </div>
        </div>
    </div>

    <!-- Filtering Ribbon -->
    <div class="table-card" style="border-bottom: none; border-radius: var(--radius-xl) var(--radius-xl) 0 0; margin-bottom: 0;">
        <div class="table-header">
            <span class="table-title">Case Personnel Directory</span>
            <div class="table-actions">
                <div class="search-wrapper">
                    <i class="lucide lucide-search"></i>
                    <input type="text" id="focal-search" placeholder="Search officers, emails..." class="input-search" style="width: 250px;">
                </div>
                <select id="focal-status-filter" class="form-input" style="width: 140px; padding: 7px 12px;">
                    <option value="All">All Statuses</option>
                    <option value="Active">Active Only</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>
        </div>
    </div>

    <!-- Grid Directory -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="focal-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 20px;">
        <?php foreach ($focalPersons as $focal): 
            $progName = isset($programMap[$focal['assignedProgramId']]) ? $programMap[$focal['assignedProgramId']] : 'Unassigned Program';
            $status = isset($focal['status']) ? $focal['status'] : 'Active';
            
            // Badge color styling
            $badgeColor = 'badge-success';
            if ($status === 'On Leave') $badgeColor = 'badge-pending';
            if ($status === 'Suspended') $badgeColor = 'badge-danger';
        ?>
            <div class="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all focal-card" 
                 data-name="<?php echo htmlspecialchars(strtolower($focal['name'])); ?>"
                 data-email="<?php echo htmlspecialchars(strtolower($focal['email'])); ?>"
                 data-status="<?php echo htmlspecialchars($status); ?>">
                
                <div>
                    <!-- Name & Badge Header -->
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h4 class="font-bold text-slate-800 text-sm leading-tight mb-1"><?php echo htmlspecialchars($focal['name']); ?></h4>
                            <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider"><?php echo htmlspecialchars($focal['role']); ?></p>
                        </div>
                        <span class="badge <?php echo $badgeColor; ?>"><?php echo $status; ?></span>
                    </div>

                    <!-- Assigned Program Box -->
                    <div class="p-3 bg-slate-50 border border-slate-100 rounded-xl mb-4 text-[11px]">
                        <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Assigned Service</span>
                        <span class="font-extrabold text-blue-900"><?php echo htmlspecialchars($progName); ?></span>
                    </div>

                    <!-- Contact Details -->
                    <div class="space-y-2 text-slate-500 text-[11px] font-medium mb-4">
                        <div class="flex items-center gap-2">
                            <i class="lucide lucide-mail w-3.5 h-3.5 text-slate-400"></i>
                            <span><?php echo htmlspecialchars($focal['email']); ?></span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="lucide lucide-phone w-3.5 h-3.5 text-slate-400 font-mono"></i>
                            <span class="font-mono"><?php echo htmlspecialchars($focal['contactNumber']); ?></span>
                        </div>
                    </div>
                </div>

                <!-- Footer Summary (Caseload and Options Button) -->
                <div class="border-t border-slate-100 pt-3 flex justify-between items-center shrink-0">
                    <div>
                        <span class="block text-[8px] font-bold text-slate-400 uppercase tracking-wider">Active Caseload</span>
                        <span class="font-mono font-bold text-slate-800 text-xs"><?php echo intval($focal['caseload']); ?> residents</span>
                    </div>
                    <button class="btn btn-secondary btn-sm edit-focal-trigger"
                            data-id="<?php echo htmlspecialchars($focal['id']); ?>"
                            data-name="<?php echo htmlspecialchars($focal['name']); ?>"
                            data-role="<?php echo htmlspecialchars($focal['role']); ?>"
                            data-progid="<?php echo htmlspecialchars($focal['assignedProgramId']); ?>"
                            data-contact="<?php echo htmlspecialchars($focal['contactNumber']); ?>"
                            data-email="<?php echo htmlspecialchars($focal['email']); ?>"
                            data-status="<?php echo htmlspecialchars($status); ?>">
                        <i class="lucide lucide-settings w-3.5 h-3.5 text-slate-500"></i> Edit Profile
                    </button>
                </div>
            </div>
        <?php endforeach; ?>
    </div>
</div>

<!-- Add Focal Person Modal -->
<div class="modal-overlay hidden" id="add-focal-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-plus-circle text-blue-200"></i> Register Case Officer
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Enlist a new focal social welfare assistant</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-add-focal-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="add-focal-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <div class="space-y-1">
                <label class="form-label">Full Officer Name</label>
                <input type="text" id="add-f-name" name="name" required placeholder="e.g. Atty. Joseph Salvador" class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Designation / Role Title</label>
                <select id="add-f-role" name="role" class="form-input">
                    <option value="Social Welfare Officer I">Social Welfare Officer I</option>
                    <option value="Social Welfare Officer II">Social Welfare Officer II</option>
                    <option value="Social Welfare Officer III">Social Welfare Officer III</option>
                    <option value="PWD Focal Coordinator">PWD Focal Coordinator</option>
                    <option value="Senior Citizens Office Head">Senior Citizens Office Head</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="form-label">Assigned Welfare Program</label>
                <select id="add-f-progid" name="assignedProgramId" class="form-input">
                    <?php foreach ($programs as $prog): ?>
                        <option value="<?php echo htmlspecialchars($prog['id']); ?>"><?php echo htmlspecialchars($prog['name']); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="space-y-1">
                <label class="form-label">Contact Mobile Number</label>
                <input type="text" id="add-f-contact" name="contactNumber" required placeholder="e.g. 0917-000-1111" class="form-input font-mono">
            </div>

            <div class="space-y-1">
                <label class="form-label">Work Email Address</label>
                <input type="email" id="add-f-email" name="email" placeholder="e.g. joseph@mswdo.gov.ph (or auto generated)" class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Operational Status</label>
                <select id="add-f-status" name="status" class="form-input">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-add-focal-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-new-focal">Register Officer</button>
        </div>
    </div>
</div>

<!-- Edit Focal Person Modal (Addresses User Requirements: Scrollable, Dynamic) -->
<div class="modal-overlay hidden" id="edit-focal-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-settings text-blue-200"></i> Edit Officer Profile
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Modify focal details & programmatic assignments</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer" id="close-edit-focal-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="edit-focal-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs" style="max-height: 55vh;">
            <input type="hidden" id="edit-f-id">
            
            <div class="space-y-1">
                <label class="form-label">Full Officer Name</label>
                <input type="text" id="edit-f-name" name="name" required class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Designation / Role Title</label>
                <select id="edit-f-role" name="role" class="form-input">
                    <option value="Social Welfare Officer I">Social Welfare Officer I</option>
                    <option value="Social Welfare Officer II">Social Welfare Officer II</option>
                    <option value="Social Welfare Officer III">Social Welfare Officer III</option>
                    <option value="PWD Focal Coordinator">PWD Focal Coordinator</option>
                    <option value="Senior Citizens Office Head">Senior Citizens Office Head</option>
                </select>
            </div>

            <div class="space-y-1">
                <label class="form-label">Assigned Welfare Program</label>
                <select id="edit-f-progid" name="assignedProgramId" class="form-input">
                    <?php foreach ($programs as $prog): ?>
                        <option value="<?php echo htmlspecialchars($prog['id']); ?>"><?php echo htmlspecialchars($prog['name']); ?></option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="space-y-1">
                <label class="form-label">Contact Mobile Number</label>
                <input type="text" id="edit-f-contact" name="contactNumber" required class="form-input font-mono">
            </div>

            <div class="space-y-1">
                <label class="form-label">Work Email Address</label>
                <input type="email" id="edit-f-email" name="email" required class="form-input">
            </div>

            <div class="space-y-1">
                <label class="form-label">Operational Status</label>
                <select id="edit-f-status" name="status" class="form-input">
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Suspended">Suspended</option>
                </select>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-between items-center gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 bg-rose-50 border border-rose-100 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer" id="delete-focal-btn">Delete Officer</button>
            <div class="flex gap-2">
                <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-edit-focal-modal">Cancel</button>
                <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-edit-focal">Save Changes</button>
            </div>
        </div>
    </div>
</div>

<script src="js/admin_focal.js"></script>

<?php
include_once "footer.php";
?>
