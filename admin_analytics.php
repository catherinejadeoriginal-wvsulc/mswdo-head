<?php
// MSWDO Portal - Analytics & AI Decision Sandbox
$pageTitle = "Simulation Sandbox";
include_once "header.php";
include_once "navigation.php";
include_once "php/db_helper.php";

$programs = get_db_data('programs');
$disbursements = get_db_data('disbursements');
$barangayRequests = get_db_data('barangayRequests');

// Fetch counts for demographics
$pwdCount = count(get_db_data('pwdRecords'));
$seniorCount = count(get_db_data('seniorRecords'));
$soloCount = count(get_db_data('soloParentRecords'));
?>

<div class="p-6 space-y-6" id="analytics-view-root">
    
    <!-- Top Gradient Header Panel -->
    <div class="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="analytics-header">
        <div class="space-y-1">
            <div class="flex items-center gap-2">
                <i class="lucide lucide-sparkles text-yellow-300 w-5 h-5 animate-pulse"></i>
                <h2 class="text-xl font-extrabold tracking-tight">AI Decision Support & Analytics</h2>
            </div>
            <p class="text-blue-100 text-xs font-semibold max-w-xl">
                Real-time spatial requests, budget utilization models, and automated resource recommendation engines.
            </p>
        </div>
        
        <!-- Tab Navigation Controls inside Header -->
        <div class="flex bg-blue-950/60 p-1 rounded-xl text-[11px] font-bold gap-1 self-stretch md:self-auto border border-blue-900/40" id="analysis-tabs">
            <button id="btn-decision" class="px-4 py-2 rounded-lg transition-all cursor-pointer bg-white text-blue-950 shadow-sm">
                💡 Decision Panel
            </button>
            <button id="btn-spatial" class="px-4 py-2 rounded-lg transition-all cursor-pointer text-blue-100 hover:bg-blue-900/50">
                🗺️ Spatial Requests
            </button>
            <button id="btn-demographics" class="px-4 py-2 rounded-lg transition-all cursor-pointer text-blue-100 hover:bg-blue-900/50">
                📈 Demographic Trends
            </button>
        </div>
    </div>

    <!-- TAB 1: DECISION PANEL -->
    <div id="panel-decision" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Side: Active Recommendations -->
        <div class="lg:col-span-2 space-y-4">
            <h3 class="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <i class="lucide lucide-bot text-blue-900 w-4 h-4"></i> MSWDO Prescriptive Proposals
            </h3>

            <!-- Recommendation Card 1 -->
            <div class="card p-5 bg-white border border-slate-100 shadow-sm relative overflow-hidden space-y-3 rec-card" id="rec-1">
                <div class="flex justify-between items-start gap-3">
                    <span class="badge badge-danger">HIGH PRIORITY</span>
                    <span class="text-[9px] font-mono font-bold text-slate-400">PROP ID: RE-091</span>
                </div>
                <div>
                    <h4 class="font-extrabold text-slate-800 text-sm">Emergency Medical Fund Re-allocation</h4>
                    <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Medical assistance utilization is currently exceeding projections (80%+ burn rate). Reallocate ₱500,000 from the unspent **Solo Parents Cash Incentive** surplus to support urgent chemotherapeutic claims.
                    </p>
                </div>
                <div class="bg-emerald-50/60 border border-emerald-100/50 p-3 rounded-xl text-[10px] text-slate-400">
                    <strong class="text-emerald-700 block mb-0.5">Estimated Civic Impact:</strong>
                    Reduces medical assistance verification cycles from 14 business days down to 48 hours for 85 cancer patients.
                </div>
                <div class="flex justify-end gap-2 pt-1.5 border-t border-slate-50">
                    <button class="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg font-bold text-[10px] dismiss-rec cursor-pointer" data-target="rec-1">Dismiss</button>
                    <button class="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-bold text-[10px] apply-rec cursor-pointer" 
                            data-type="reallocation" 
                            data-source="prog-6" 
                            data-dest="prog-2" 
                            data-amount="500000" 
                            data-target="rec-1">
                        Apply Proposal
                    </button>
                </div>
            </div>

            <!-- Recommendation Card 2 -->
            <div class="card p-5 bg-white border border-slate-100 shadow-sm relative overflow-hidden space-y-3 rec-card" id="rec-2">
                <div class="flex justify-between items-start gap-3">
                    <span class="badge badge-danger">HIGH PRIORITY</span>
                    <span class="text-[9px] font-mono font-bold text-slate-400">PROP ID: RE-092</span>
                </div>
                <div>
                    <h4 class="font-extrabold text-slate-800 text-sm">Outreach Mobile Hub Deployment</h4>
                    <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Severe pending request volume backlogs detected in Poblacion I. Deploy a temporary MSWDO Outreach Assistance Caravan to release pre-approved senior citizen medical funds directly on-site.
                    </p>
                </div>
                <div class="bg-emerald-50/60 border border-emerald-100/50 p-3 rounded-xl text-[10px] text-slate-400">
                    <strong class="text-emerald-700 block mb-0.5">Estimated Civic Impact:</strong>
                    Clears up to 120 critical backlogs directly within the sector and decreases main office walk-in congestion by 25%.
                </div>
                <div class="flex justify-end gap-2 pt-1.5 border-t border-slate-50">
                    <button class="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg font-bold text-[10px] dismiss-rec cursor-pointer" data-target="rec-2">Dismiss</button>
                    <button class="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-bold text-[10px] apply-rec cursor-pointer" 
                            data-type="deployment" 
                            data-barangay="Poblacion I" 
                            data-target="rec-2">
                        Apply Proposal
                    </button>
                </div>
            </div>

            <!-- Recommendation Card 3 -->
            <div class="card p-5 bg-white border border-slate-100 shadow-sm relative overflow-hidden space-y-3 rec-card" id="rec-3">
                <div class="flex justify-between items-start gap-3">
                    <span class="badge badge-pending">MEDIUM PRIORITY</span>
                    <span class="text-[9px] font-mono font-bold text-slate-400">PROP ID: RE-093</span>
                </div>
                <div>
                    <h4 class="font-extrabold text-slate-800 text-sm">Educational Grants Surplus Shift</h4>
                    <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        The Educational Assistance scheme shows a projected ₱1.3M surplus. Shift ₱300,000 to the PWD Quarterly Financial Assistance program to purchase specialized custom wheelchair equipment.
                    </p>
                </div>
                <div class="bg-emerald-50/60 border border-emerald-100/50 p-3 rounded-xl text-[10px] text-slate-400">
                    <strong class="text-emerald-700 block mb-0.5">Estimated Civic Impact:</strong>
                    Fulfills 30 pending wheelchair equipment orders for PWD students in secondary and tertiary academies.
                </div>
                <div class="flex justify-end gap-2 pt-1.5 border-t border-slate-50">
                    <button class="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-lg font-bold text-[10px] dismiss-rec cursor-pointer" data-target="rec-3">Dismiss</button>
                    <button class="px-4 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg font-bold text-[10px] apply-rec cursor-pointer" 
                            data-type="reallocation" 
                            data-source="prog-1" 
                            data-dest="prog-4" 
                            data-amount="300000" 
                            data-target="rec-3">
                        Apply Proposal
                    </button>
                </div>
            </div>

            <div class="hidden text-center py-12 text-slate-400 bg-white border border-slate-100 rounded-2xl" id="no-recs-placeholder">
                <i class="lucide lucide-check-circle-2 text-emerald-500 w-10 h-10 mx-auto mb-2.5"></i>
                <p class="text-xs font-bold text-slate-700">All Prescriptive Proposals Applied or Resolved!</p>
                <p class="text-[10px] text-slate-400 mt-1">Excellent, budget parameters and outreach queues are currently balanced.</p>
            </div>
        </div>

        <!-- Right Side: Impact Logs -->
        <div class="space-y-4">
            <h3 class="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <i class="lucide lucide-activity text-blue-900 w-4 h-4"></i> System Audit Log
            </h3>
            
            <div class="bg-slate-900 text-slate-300 p-5 rounded-2xl space-y-4 shadow-sm" style="font-family: var(--font-mono); min-height: 400px; display: flex; flex-direction: column;">
                <div class="flex items-center gap-1.5 border-b border-slate-800 pb-3 shrink-0">
                    <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span class="text-[10px] text-white font-bold tracking-tight">ANALYSIS CONSOLE FEED</span>
                </div>

                <div class="flex-1 text-[10px] space-y-3 overflow-y-auto" id="sandbox-logs">
                    <p class="text-slate-500 font-bold">[08:00:00 UTC] Initializing sandboxed optimization nodes...</p>
                    <p class="text-slate-500 font-bold">[08:00:03 UTC] Scanning programs databases: found <?php echo count($programs); ?> schemes.</p>
                    <p class="text-slate-500 font-bold">[08:00:05 UTC] Scan complete. Core surplus levels healthy: ₱<?php echo number_format($remainingBudget); ?> available.</p>
                    <p class="text-slate-400 font-bold">[08:00:10 UTC] Ready. Waiting for administrative dispatch triggers.</p>
                </div>
                
                <div class="text-[9px] text-slate-500 border-t border-slate-800 pt-3 shrink-0 flex justify-between">
                    <span>MODE: ACTIVE ANALYST</span>
                    <span>SESSION SECURE</span>
                </div>
            </div>
        </div>
    </div>

    <!-- TAB 2: SPATIAL REQUESTS -->
    <div id="panel-spatial" class="grid grid-cols-1 lg:grid-cols-3 gap-6 hidden" style="display: none;">
        <!-- Left Side: Interactive Map Grid of Barangays -->
        <div class="lg:col-span-2 space-y-4">
            <h3 class="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <i class="lucide lucide-map-pin text-blue-900 w-4 h-4"></i> Sector Spatial Grid Map
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="barangay-map-grid">
                <?php foreach ($barangayRequests as $b): 
                    $severity = $b['status'];
                    $pending = intval($b['pendingRequests']);
                    $border = 'border-slate-100 hover:border-slate-200';
                    $bg = 'bg-white';
                    
                    if ($severity === 'CRITICAL') {
                        $border = 'border-rose-100 hover:border-rose-200';
                        $bg = 'bg-rose-50/20';
                    } elseif ($severity === 'MODERATE') {
                        $border = 'border-amber-100 hover:border-amber-200';
                        $bg = 'bg-amber-50/20';
                    }
                ?>
                    <div class="card p-4 rounded-xl border <?php echo $border; ?> <?php echo $bg; ?> shadow-sm cursor-pointer transition-all brgy-card" 
                         data-id="<?php echo htmlspecialchars($b['id']); ?>"
                         data-name="<?php echo htmlspecialchars($b['name']); ?>"
                         data-pending="<?php echo $pending; ?>"
                         data-severity="<?php echo htmlspecialchars($severity); ?>"
                         data-cases="<?php echo htmlspecialchars(json_encode($b['cases'] ?? [])); ?>">
                        
                        <div class="flex justify-between items-start mb-2">
                            <span class="font-extrabold text-xs text-slate-800"><?php echo htmlspecialchars($b['name']); ?></span>
                            <?php if ($severity === 'CRITICAL'): ?>
                                <span class="px-1.5 py-0.5 bg-rose-100 text-rose-600 rounded text-[8px] font-bold">CRITICAL</span>
                            <?php elseif ($severity === 'MODERATE'): ?>
                                <span class="px-1.5 py-0.5 bg-amber-100 text-amber-600 rounded text-[8px] font-bold">MODERATE</span>
                            <?php else: ?>
                                <span class="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold">STABLE</span>
                            <?php endif; ?>
                        </div>
                        
                        <div class="flex items-baseline gap-1 mt-3">
                            <span class="text-2xl font-extrabold font-mono text-slate-800"><?php echo $pending; ?></span>
                            <span class="text-[9px] font-bold text-slate-400">pending queues</span>
                        </div>
                        <p class="text-[9px] text-slate-400 font-semibold mt-1">Click to analyze case types</p>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

        <!-- Right Side: Details on Focused Barangay -->
        <div class="space-y-4">
            <h3 class="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <i class="lucide lucide-compass text-blue-900 w-4 h-4"></i> Sector Breakdown Analysis
            </h3>

            <div class="card p-5 bg-white border border-slate-100 shadow-sm space-y-4" id="barangay-detail-card">
                <!-- Initial State -->
                <div id="brgy-detail-empty" class="text-center py-12 text-slate-400">
                    <i class="lucide lucide-map-pin text-slate-300 w-10 h-10 mx-auto mb-2.5"></i>
                    <p class="text-xs font-bold text-slate-700">No Sector Focused</p>
                    <p class="text-[10px] text-slate-400 mt-1">Tap any barangay card on the spatial map to view its active case breakdowns and officer logs.</p>
                </div>

                <!-- Focused State (Hidden by default) -->
                <div id="brgy-detail-active" class="hidden space-y-4">
                    <div class="flex justify-between items-center border-b border-slate-50 pb-3">
                        <div>
                            <h4 class="font-extrabold text-slate-800 text-sm" id="focused-brgy-name">Poblacion I</h4>
                            <p class="text-[10px] text-slate-400 mt-0.5 font-semibold">Live backlog assessment</p>
                        </div>
                        <span id="focused-brgy-severity" class="badge">CRITICAL</span>
                    </div>

                    <!-- Breakdown Numbers -->
                    <div class="space-y-2 text-xs">
                        <span class="block text-[8px] font-extrabold text-slate-400 uppercase tracking-wider">Unresolved Claim Categories:</span>
                        
                        <div class="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                            <span class="font-bold text-slate-700">Elderly Medical Grants</span>
                            <span class="font-mono font-bold text-slate-800 text-center" id="focused-count-medical">12</span>
                        </div>
                        <div class="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                            <span class="font-bold text-slate-700">Severe Disability Subsidies</span>
                            <span class="font-mono font-bold text-slate-800 text-center" id="focused-count-pwd">8</span>
                        </div>
                        <div class="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
                            <span class="font-bold text-slate-700">Educational Relief Backlogs</span>
                            <span class="font-mono font-bold text-slate-800 text-center" id="focused-count-educational">4</span>
                        </div>
                    </div>

                    <div class="bg-blue-50/60 border border-blue-100 p-4 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                        <strong class="text-blue-900 block mb-0.5 flex items-center gap-1.5">
                            <i class="lucide lucide-bot w-3.5 h-3.5"></i> Caseworker Guidance:
                        </strong>
                        Deploying mobile verification hubs in this sector would immediately resolve critical backlogs, shortening disbursement queues by up to 14 working days.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- TAB 3: DEMOGRAPHIC TRENDS -->
    <div id="panel-demographics" class="grid grid-cols-1 lg:grid-cols-3 gap-6 hidden" style="display: none;">
        <!-- Left Side: Demographic Breakdown Charts -->
        <div class="lg:col-span-2 space-y-4">
            <h3 class="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <i class="lucide lucide-trending-up text-blue-900 w-4 h-4"></i> LGU Registry Distribution Metrics
            </h3>

            <!-- Demographic Chart Card -->
            <div class="card p-5 bg-white border border-slate-100 shadow-sm">
                <div style="height: 350px;">
                    <canvas id="demographicsChart"></canvas>
                </div>
            </div>
        </div>

        <!-- Right Side: Registry Totals summary card -->
        <div class="space-y-4">
            <h3 class="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-2 mb-1">
                <i class="lucide lucide-users text-blue-900 w-4 h-4"></i> Master Registry Summary
            </h3>

            <div class="card p-5 bg-white border border-slate-100 shadow-sm space-y-4">
                <div class="flex justify-between items-center p-3 border-l-4 border-blue-900 bg-slate-50 rounded-r-xl">
                    <div>
                        <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Senior Citizens</span>
                        <strong class="text-sm text-slate-800 font-heading">OSCA Members</strong>
                    </div>
                    <span class="text-2xl font-extrabold font-mono text-slate-800"><?php echo $seniorCount; ?></span>
                </div>

                <div class="flex justify-between items-center p-3 border-l-4 border-emerald-500 bg-slate-50 rounded-r-xl">
                    <div>
                        <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Persons with Disabilities</span>
                        <strong class="text-sm text-slate-800 font-heading">PWD Registry</strong>
                    </div>
                    <span class="text-2xl font-extrabold font-mono text-slate-800"><?php echo $pwdCount; ?></span>
                </div>

                <div class="flex justify-between items-center p-3 border-l-4 border-purple-500 bg-slate-50 rounded-r-xl">
                    <div>
                        <span class="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Solo Parents</span>
                        <strong class="text-sm text-slate-800 font-heading">Single Providers</strong>
                    </div>
                    <span class="text-2xl font-extrabold font-mono text-slate-800"><?php echo $soloCount; ?></span>
                </div>

                <div class="bg-amber-50/60 border border-amber-100 p-4 rounded-xl text-[10px] text-slate-400 leading-relaxed">
                    <strong class="text-amber-800 block mb-0.5 flex items-center gap-1.5">
                        <i class="lucide lucide-alert-circle w-3.5 h-3.5"></i> Social Security Note:
                    </strong>
                    These registries sync automatically with barangay demographic files. Ensure regular focal person assessments to remove duplicate listings.
                </div>
            </div>
        </div>
    </div>

</div>

<script src="js/admin_analytics.js"></script>

<?php
include_once "footer.php";
?>
