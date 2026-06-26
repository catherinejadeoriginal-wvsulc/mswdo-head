<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Default session values for demo/offline use if not logged in
if (!isset($_SESSION['admin_id'])) {
    $_SESSION['admin_id'] = 1;
    $_SESSION['admin_name'] = 'Catherine Jade';
    $_SESSION['admin_role'] = 'Social Welfare Officer III / Administrator';
    $_SESSION['admin_email'] = 'catherine.jade@mswdo.gov.ph';
    $_SESSION['admin_contact'] = '0917-234-5678';
    $_SESSION['admin_pic'] = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjgw3zekIdHW14ZhlK-2eoMxUnbcYPjqLpUbNEiTtdqGJvUBmzL2ZEAx34HGvQP8bh-vSrazKIsTA5PMRK-4p7fNKlobG4qD-FMS8mUX8ALFlgBLopDchkz6PhvShaz1XA2Kj5EuLhzgaGJu5llBHMmmHkivosHkxTT0WEIwkKVvcaff01e8RwQTlhLnIQRTMPHFqyO-CDcXdHLMcPw5Kgci_PzxLSB6glDI-oNYb_f06u1kBl92au4EfKrOmAdqp_qlmcHEsT93o';
}

$title = isset($pageTitle) ? $pageTitle : "MSWDO Head Portal";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($title); ?> - MSWDO Portal</title>
    
    <!-- Google Fonts: Inter for general UI, Space Grotesk for Headings, JetBrains Mono for monetary values -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Chart.js for data visualization (Grouped bars, pie distributions) -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Lucide Icons loaded via CDN (using a custom replacement engine or script, or just directly using standard SVG icons) -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide-static@0.344.0/font/lucide.min.css">
    
    <!-- Main Style Sheets -->
    <link rel="stylesheet" href="css/design.css">
    <?php if (isset($extraCSS)): ?>
        <link rel="stylesheet" href="css/<?php echo htmlspecialchars($extraCSS); ?>">
    <?php endif; ?>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">
    <div class="app-container">
        
        <!-- Top Navigation Header -->
        <header class="header flex justify-between items-center" id="header">
            <div class="logo-area flex items-center gap-3">
                <div class="logo-wrapper">
                    <!-- High-quality emblem branding -->
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC2b3hFz2wXoY00PjJvL6L-B9x_9R8-HnZgH9DNY-C1IeDozS7Y7n8YjS4U_YmQnU_E9p-B9-oP4eCgR0-E0uF-hK5g" alt="LGU Logo" class="logo">
                </div>
                <div>
                    <h1 class="logo-label font-bold text-sm leading-none tracking-tight">MUNICIPAL SOCIAL WELFARE & DEVELOPMENT</h1>
                    <span class="logo-subtext font-bold text-[9px] uppercase tracking-wider text-blue-200">Head Administrator Portal</span>
                </div>
            </div>

            <!-- Header Center Section: LGU Clock & Location Badge -->
            <div class="header-center hidden md:flex items-center gap-3 bg-blue-900/40 px-3.5 py-1.5 rounded-full border border-blue-800/40">
                <i class="lucide lucide-clock w-3.5 h-3.5 text-blue-300"></i>
                <div class="text-[10px] font-bold text-blue-100 font-mono tracking-wider" id="lgu-clock">
                    UTC+8 --:--:--
                </div>
                <div class="px-2 py-0.5 rounded-full text-[8px] font-extrabold bg-blue-500 text-white tracking-widest uppercase">LGU-Live</div>
            </div>

            <div class="header-right flex items-center gap-4">
                <!-- Notifications Widget -->
                <div class="notification-widget relative">
                    <button class="notification-trigger" id="notif-trigger">
                        <i class="lucide lucide-bell w-4 h-4 text-white"></i>
                        <span class="notification-badge"></span>
                    </button>
                    <!-- Notifications Dropdown Overlay -->
                    <div class="notification-dropdown dropdown-menu hidden" id="notif-dropdown">
                        <h4 class="dropdown-header">System Notifications</h4>
                        <div class="dropdown-items">
                            <div class="dropdown-item unread">
                                <span class="dot bg-amber-500"></span>
                                <div class="notif-content">
                                    <p><strong>Transfer Simulation:</strong> Educational assistance transferred ₱200K successfully.</p>
                                    <span class="time">Just now</span>
                                </div>
                            </div>
                            <div class="dropdown-item">
                                <span class="dot bg-slate-400"></span>
                                <div class="notif-content">
                                    <p><strong>Focal Personnel:</strong> Engr. Robert Santos changed status to "On Leave".</p>
                                    <span class="time">2 hours ago</span>
                                </div>
                            </div>
                            <div class="dropdown-item">
                                <span class="dot bg-slate-400"></span>
                                <div class="notif-content">
                                    <p><strong>Budget Alert:</strong> Solo Parents Cash Incentive utilizes 20% of limit.</p>
                                    <span class="time">Yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- User Profile Summary Dropdown -->
                <div class="profile-widget relative">
                    <div class="profile-name flex items-center gap-2.5 cursor-pointer" id="profile-menu-trigger">
                        <div class="profile-text text-right hidden sm:block">
                            <p class="name font-black text-xs text-white" id="profile-full-name"><?php echo htmlspecialchars($_SESSION['admin_name']); ?></p>
                            <p class="position text-blue-200 text-[10px] font-semibold flex items-center gap-1 justify-end">
                                MSWDO Head <i class="lucide lucide-chevron-down w-3 h-3 text-blue-300"></i>
                            </p>
                        </div>
                        <img src="<?php echo htmlspecialchars($_SESSION['admin_pic']); ?>" alt="Profile Picture" class="profile-avatar border border-blue-400 rounded-full w-8 h-8 object-cover" id="header-profile-pic">
                    </div>
                    
                    <!-- Profile Context Dropdown Menu -->
                    <div class="profile-dropdown dropdown-menu hidden" id="profile-dropdown">
                        <div class="profile-dropdown-header">
                            <h4 class="font-bold text-slate-800 text-xs"><?php echo htmlspecialchars($_SESSION['admin_name']); ?></h4>
                            <p class="text-[9px] text-slate-400 font-medium"><?php echo htmlspecialchars($_SESSION['admin_email']); ?></p>
                        </div>
                        <ul class="dropdown-list">
                            <li><a href="#" id="edit-profile-btn" class="dropdown-link"><i class="lucide lucide-user-cog w-3.5 h-3.5"></i> Edit Profile</a></li>
                            <li><a href="admin_reports.php" class="dropdown-link"><i class="lucide lucide-file-text w-3.5 h-3.5"></i> Activity Audit</a></li>
                            <li class="border-t border-slate-100"><a href="#" id="logout-btn" class="dropdown-link text-rose-500 hover:bg-rose-50"><i class="lucide lucide-log-out w-3.5 h-3.5"></i> Logout System</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </header> <!--header-->

        <div class="content-wrapper flex">
