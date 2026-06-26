// MSWDO Portal - Profile Controller
document.addEventListener('DOMContentLoaded', () => {
    
    const profileModal = document.getElementById('profile-modal');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const closeProfileBtn = document.getElementById('close-profile-modal');
    const cancelProfileBtn = document.getElementById('cancel-profile-modal');
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const profileForm = document.getElementById('profile-edit-form');

    // UI elements to update
    const profileHeaderName = document.getElementById('profile-full-name');
    const headerProfilePic = document.getElementById('header-profile-pic');
    const modalProfilePic = document.getElementById('modal-profile-pic');

    // 1. Show Modal
    if (editProfileBtn && profileModal) {
        editProfileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Populate form fields from state
            fetch('php/profile/fetch_profile.php')
                .then(r => r.json())
                .then(data => {
                    document.getElementById('p-name').value = data.fullName;
                    document.getElementById('p-email').value = data.email;
                    document.getElementById('p-contact').value = data.contactNumber;
                    document.getElementById('p-role').value = data.role;
                    document.getElementById('p-password').value = '';
                    
                    profileModal.classList.remove('hidden');
                })
                .catch(err => {
                    console.error("Failed to load profile", err);
                    profileModal.classList.remove('hidden');
                });
        });
    }

    // 2. Hide Modal Helpers
    function hideProfileModal() {
        if (profileModal) profileModal.classList.add('hidden');
    }

    if (closeProfileBtn) closeProfileBtn.addEventListener('click', hideProfileModal);
    if (cancelProfileBtn) cancelProfileBtn.addEventListener('click', hideProfileModal);

    // Escape Key listener
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideProfileModal();
    });

    // 3. Save Form Action
    if (saveProfileBtn && profileForm) {
        saveProfileBtn.addEventListener('click', () => {
            const name = document.getElementById('p-name').value.trim();
            const email = document.getElementById('p-email').value.trim();
            const contact = document.getElementById('p-contact').value.trim();
            const password = document.getElementById('p-password').value;

            if (!name || !email || !contact) {
                window.showToast("Please fill in all required profile fields.", "danger");
                return;
            }

            // POST updates to server API to save persistently in db.json & update Express session
            fetch('php/profile/update_profile.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, contact, password })
            })
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success') {
                    // Update client-side UI
                    if (profileHeaderName) profileHeaderName.textContent = name;
                    
                    window.showToast("Administrator profile successfully updated!", "success");
                    hideProfileModal();

                    // Optional: trigger custom welcome name updates if they exist on the page
                    const welcomeName = document.getElementById('admin-name');
                    if (welcomeName) {
                        welcomeName.textContent = name;
                    }
                } else {
                    window.showToast(res.message || "Failed to update profile.", "danger");
                }
            })
            .catch(err => {
                console.error("Failed to update profile", err);
                window.showToast("An error occurred. Saved locally but unable to sync with server.", "warning");
                hideProfileModal();
            });
        });
    }

    // 4. Logout Mechanism
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to sign out of the MSWDO Head Portal?")) {
                window.showToast("Signing out...", "info");
                setTimeout(() => {
                    location.href = 'admin_dashboard.php?logout=true';
                }, 1000);
            }
        });
    }
});
