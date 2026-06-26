<?php
$current_page = basename($_SERVER['PHP_SELF']);
?>
<!-- Navigation Sidebar -->
<nav class="navigation shrink-0" id="sidebar">
    <div class="sidebar-header flex justify-between items-center px-4 py-3 border-b border-blue-950/60 bg-blue-950">
        <span class="text-[9px] uppercase font-black tracking-widest text-slate-400">Main Operations</span>
        <button id="toggle-nav" class="toggle-nav-btn hover:bg-blue-900 rounded-lg p-1.5 transition">
            <i class="lucide lucide-menu w-4 h-4 text-blue-200"></i>
        </button>
    </div>
    <ul class="sidebar-menu">
        <li class="<?php echo ($current_page === 'admin_dashboard.php') ? 'active' : ''; ?>">
            <a href="admin_dashboard.php">
                <i class="lucide lucide-layout-dashboard"></i>
                <span class="menu-label">Dashboard</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_program.php') ? 'active' : ''; ?>">
            <a href="admin_program.php">
                <i class="lucide lucide-folder-open"></i>
                <span class="menu-label">Program Management</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_focal.php') ? 'active' : ''; ?>">
            <a href="admin_focal.php">
                <i class="lucide lucide-users"></i>
                <span class="menu-label">Focal Management</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_budget.php') ? 'active' : ''; ?>">
            <a href="admin_budget.php">
                <i class="lucide lucide-piggy-bank"></i>
                <span class="menu-label">Budget Management</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_allocation_history.php') ? 'active' : ''; ?>">
            <a href="admin_allocation_history.php">
                <i class="lucide lucide-history"></i>
                <span class="menu-label">Allocation History</span>
            </a>
        </li>
        
        <!-- Separator -->
        <li class="menu-divider">
            <span class="divider-text uppercase font-bold text-[8px] tracking-wider text-blue-900/40">Resident Registries</span>
        </li>

        <li class="<?php echo ($current_page === 'admin_pwd.php') ? 'active' : ''; ?>">
            <a href="admin_pwd.php">
                <i class="lucide lucide-accessibility"></i>
                <span class="menu-label">PWD Registry</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_seniors.php') ? 'active' : ''; ?>">
            <a href="admin_seniors.php">
                <i class="lucide lucide-award"></i>
                <span class="menu-label">Senior Citizens</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_soloparents.php') ? 'active' : ''; ?>">
            <a href="admin_soloparents.php">
                <i class="lucide lucide-heart"></i>
                <span class="menu-label">Solo Parents</span>
            </a>
        </li>
        
        <!-- Separator -->
        <li class="menu-divider">
            <span class="divider-text uppercase font-bold text-[8px] tracking-wider text-blue-900/40">Analytics & Reports</span>
        </li>

        <li class="<?php echo ($current_page === 'admin_reports.php') ? 'active' : ''; ?>">
            <a href="admin_reports.php">
                <i class="lucide lucide-file-text"></i>
                <span class="menu-label">Reports & Activity</span>
            </a>
        </li>
        <li class="<?php echo ($current_page === 'admin_analytics.php') ? 'active' : ''; ?>">
            <a href="admin_analytics.php">
                <i class="lucide lucide-trending-up"></i>
                <span class="menu-label">Simulation Sandbox</span>
            </a>
        </li>
    </ul>
</nav> <!--navigation-->

<div class="main-content flex-1 flex flex-col min-h-screen relative" id="main-content">
