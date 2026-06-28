</div> <!--main-content-->
</div> <!--content-wrapper-->

<!-- Global Edit Profile Modal -->
<div class="modal-overlay hidden" id="profile-modal">
    <div class="modal-card max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        <div class="bg-blue-900 p-5 text-white flex justify-between items-center shrink-0">
            <div>
                <h3 class="font-extrabold text-sm flex items-center gap-2">
                    <i class="lucide lucide-user-cog text-blue-200"></i> Edit LGU MSWDO Profile
                </h3>
                <p class="text-blue-100 text-[10px] mt-0.5">Update administrator credentials & details</p>
            </div>
            <button class="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg cursor-pointer transition" id="close-profile-modal">
                <i class="lucide lucide-x w-4 h-4"></i>
            </button>
        </div>
        
        <form id="profile-edit-form" class="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            <!-- Profile Avatar Preview -->
            <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img src="<?php echo htmlspecialchars($_SESSION['admin_pic']); ?>" alt="Profile avatar" class="w-12 h-12 rounded-full border-2 border-blue-100 object-cover" id="modal-profile-pic">
                <div>
                    <h5 class="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider">Administrator Picture</h5>
                    <p class="text-[10px] text-slate-400 mt-0.5 font-medium">Synced via LGU Identity Access Manager</p>
                </div>
            </div>

            <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Admin Name</label>
                <input type="text" id="p-name" name="name" value="<?php echo htmlspecialchars($_SESSION['admin_name']); ?>" required class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500">
            </div>

            <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Work Email Address</label>
                <input type="email" id="p-email" name="email" value="<?php echo htmlspecialchars($_SESSION['admin_email']); ?>" required class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500">
            </div>

            <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact Hot-Line</label>
                <input type="text" id="p-contact" name="contact" value="<?php echo htmlspecialchars($_SESSION['admin_contact']); ?>" required class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500 font-mono">
            </div>

            <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portal Role / Designation</label>
                <input type="text" id="p-role" name="role" value="<?php echo htmlspecialchars($_SESSION['admin_role']); ?>" readonly class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-400 font-mono">
            </div>
            
            <div class="space-y-1">
                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Change Access Password</label>
                <input type="password" id="p-password" name="password" placeholder="••••••••" class="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500">
                <span class="text-[9px] text-slate-400 font-medium">Leave blank to retain current secure portal password.</span>
            </div>
        </form>

        <div class="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0 text-xs">
            <button type="button" class="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" id="cancel-profile-modal">Cancel</button>
            <button type="button" class="px-5 py-2 bg-blue-900 hover:bg-blue-950 text-white rounded-lg cursor-pointer" id="save-profile-btn">Save Changes</button>
        </div>
    </div>
</div>

<!-- Dynamic Toast Notifications Wrapper -->
<div class="toast-wrapper fixed bottom-5 right-5 z-50 flex flex-col gap-2" id="toast-wrapper"></div>

<!-- Global Scripts -->
<script src="js/chart_offline_fallback.js"></script>
<script src="js/toggle_menu.js"></script>
<script src="js/profile_modal.js"></script>
<script src="js/lucide_offline.js"></script>
</body>
</html>
