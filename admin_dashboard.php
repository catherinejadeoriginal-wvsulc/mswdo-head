<?php
// MSWDO Portal - Admin Dashboard
// Native PHP structure with modular includes

$pageTitle = "Admin Dashboard";
$extraCSS = "admin_dashboard.css";
include_once "header.php";
include_once "navigation.php";
?>

<div class="dashboard-con p-6 space-y-6">
    <!-- Quick Welcome & Dynamic Date Display -->
    <div class="flex justify-between items-center flex-wrap gap-4 mb-2">
        <div>
            <h2 class="text-xl font-extrabold tracking-tight font-heading text-slate-800 flex items-center gap-2">
                <i class="lucide lucide-layout-dashboard text-blue-900 w-5 h-5"></i>
                MSWDO Head Overview
            </h2>
            <p class="text-slate-400 text-xs font-semibold mt-1">
                Welcome back, <span class="text-blue-900" id="admin-display-name"><?php echo htmlspecialchars($_SESSION['admin_name']); ?></span>! Here is your municipal social care health status.
            </p>
        </div>
        <div class="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2">
            <i class="lucide lucide-calendar text-blue-900 w-4 h-4"></i>
            <span id="current-date-display">June 26, 2026</span>
        </div>
    </div>

    <!-- Metric Bento Grid -->
    <div class="card-container">
        <!-- Card 1: Active Programs -->
        <div class="card card-primary" id="card-active-programs">
            <h3>
                <span>Active Programs</span>
                <i class="lucide lucide-folder-open text-blue-600 w-4 h-4"></i>
            </h3>
            <p id="active_programs">--</p>
            <div class="trend text-emerald-600">
                <i class="lucide lucide-trending-up w-3 h-3"></i> +12% increase
            </div>
        </div>

        <!-- Card 2: Total Budget -->
        <div class="card card-success" id="card-total-budget">
            <h3>
                <span>Total Budget</span>
                <i class="lucide lucide-wallet text-emerald-600 w-4 h-4"></i>
            </h3>
            <p id="total_budget">₱ --</p>
            <div class="trend text-slate-400">Annual ceiling limit</div>
        </div>

        <!-- Card 3: Utilized Budget -->
        <div class="card card-warning" id="card-utilized">
            <h3>
                <span>Utilized Budget</span>
                <i class="lucide lucide-trending-up text-amber-600 w-4 h-4"></i>
            </h3>
            <p id="utilized">₱ --</p>
            <div class="trend text-amber-600 font-bold" id="utilization-rate">--% utilized</div>
        </div>

        <!-- Card 4: Remaining Budget -->
        <div class="card card-info" id="card-remaining">
            <h3>
                <span>Remaining Budget</span>
                <i class="lucide lucide-piggy-bank text-sky-600 w-4 h-4"></i>
            </h3>
            <p id="remaining">₱ --</p>
            <div class="trend text-sky-600 font-bold" id="remaining-rate">--% reserves</div>
        </div>
    </div>

    <!-- Data Visualization Charts -->
    <div class="charts">
        <div class="chart-box">
            <h3>
                <span>Program Distribution (₱ Allocation)</span>
                <i class="lucide lucide-pie-chart text-slate-400 w-4 h-4"></i>
            </h3>
            <div class="chart-container">
                <canvas id="pieChart"></canvas>
            </div>
        </div>

        <div class="chart-box">
            <h3>
                <span>Monthly Reports & Disbursements</span>
                <i class="lucide lucide-bar-chart-3 text-slate-400 w-4 h-4"></i>
            </h3>
            <div class="chart-container">
                <canvas id="barChart"></canvas>
            </div>
        </div>
    </div>

    <!-- Bottom Secondary Row: Critical Barangays & Recent Requests -->
    <div class="charts">
        <!-- Critical Barangay Requests List -->
        <div class="chart-box" style="min-height: 320px;">
            <h3>
                <span>Critical Barangay Assistance Backlog</span>
                <a href="admin_pwd.php" class="text-blue-900 hover:underline font-bold text-[10px] uppercase flex items-center gap-1">
                    Manage Registry <i class="lucide lucide-chevron-right w-3.5 h-3.5"></i>
                </a>
            </h3>
            <div class="table-container" style="flex: 1; overflow-y: auto;">
                <table class="w-full text-xs">
                    <thead>
                        <tr>
                            <th>Barangay Name</th>
                            <th>Backlog Count</th>
                            <th>Status Badge</th>
                        </tr>
                    </thead>
                    <tbody id="barangay-backlog-tbody">
                        <!-- Populated by JavaScript -->
                        <tr><td colspan="3" class="text-center py-8 text-slate-400">Loading barangay parameters...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Recent Disbursements Feed -->
        <div class="chart-box" style="min-height: 320px;">
            <h3>
                <span>Recent Disbursements Log</span>
                <a href="admin_reports.php" class="text-blue-900 hover:underline font-bold text-[10px] uppercase flex items-center gap-1">
                    Full History <i class="lucide lucide-chevron-right w-3.5 h-3.5"></i>
                </a>
            </h3>
            <div class="table-container" style="flex: 1; overflow-y: auto;">
                <table class="w-full text-xs">
                    <thead>
                        <tr>
                            <th>Beneficiary</th>
                            <th>Program Name</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="recent-disbursements-tbody">
                        <!-- Populated by JavaScript -->
                        <tr><td colspan="4" class="text-center py-8 text-slate-400">Loading transaction feed...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<script src="js/admin_dashboard.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', () => {
        // Run dashboard fetchers
        fetch_active();
        fetch_budget();
        fetch_pie();
        fetch_bar();
        fetch_backlogs_and_recent();
        
        // Populate Date
        const dateDisplay = document.getElementById('current-date-display');
        if (dateDisplay) {
            const now = new Date();
            dateDisplay.textContent = now.toLocaleDateString('en-PH', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            });
        }
    });
</script>

<?php
include_once "footer.php";
?>
