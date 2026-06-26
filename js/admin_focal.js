// MSWDO Portal - Focal Client Controller
document.addEventListener('DOMContentLoaded', () => {

    const focalSearch = document.getElementById('focal-search');
    const focalStatusFilter = document.getElementById('focal-status-filter');
    const focalCards = document.querySelectorAll('.focal-card');

    // 1. Directory Search and Status Filtering
    function filterFocals() {
        const query = focalSearch ? focalSearch.value.toLowerCase().trim() : '';
        const status = focalStatusFilter ? focalStatusFilter.value : 'All';

        focalCards.forEach(card => {
            const name = card.getAttribute('data-name') || '';
            const email = card.getAttribute('data-email') || '';
            const cardStatus = card.getAttribute('data-status') || '';

            const matchesSearch = name.includes(query) || email.includes(query);
            const matchesStatus = (status === 'All') || (cardStatus === status);

            if (matchesSearch && matchesStatus) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (focalSearch) focalSearch.addEventListener('input', filterFocals);
    if (focalStatusFilter) focalStatusFilter.addEventListener('change', filterFocals);


    // 2. Add Focal Modal Toggles
    const addModal = document.getElementById('add-focal-modal');
    const addTrigger = document.getElementById('add-focal-trigger');
    const closeAddModal = document.getElementById('close-add-focal-modal');
    const cancelAddModal = document.getElementById('cancel-add-focal-modal');
    const saveNewFocalBtn = document.getElementById('save-new-focal');
    const addForm = document.getElementById('add-focal-form');

    if (addTrigger && addModal) {
        addTrigger.addEventListener('click', () => {
            addForm.reset();
            addModal.classList.remove('hidden');
        });
    }

    function hideAddModal() {
        if (addModal) addModal.classList.add('hidden');
    }

    if (closeAddModal) closeAddModal.addEventListener('click', hideAddModal);
    if (cancelAddModal) cancelAddModal.addEventListener('click', hideAddModal);


    // 3. Edit Focal Modal Toggles
    const editModal = document.getElementById('edit-focal-modal');
    const closeEditModal = document.getElementById('close-edit-focal-modal');
    const cancelEditModal = document.getElementById('cancel-edit-focal-modal');
    const saveEditFocalBtn = document.getElementById('save-edit-focal');
    const deleteFocalBtn = document.getElementById('delete-focal-btn');
    const editForm = document.getElementById('edit-focal-form');

    const editTriggers = document.querySelectorAll('.edit-focal-trigger');

    editTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const role = btn.getAttribute('data-role');
            const progid = btn.getAttribute('data-progid');
            const contact = btn.getAttribute('data-contact');
            const email = btn.getAttribute('data-email');
            const status = btn.getAttribute('data-status');

            // Populate form nodes
            document.getElementById('edit-f-id').value = id;
            document.getElementById('edit-f-name').value = name;
            document.getElementById('edit-f-role').value = role;
            document.getElementById('edit-f-progid').value = progid;
            document.getElementById('edit-f-contact').value = contact;
            document.getElementById('edit-f-email').value = email;
            document.getElementById('edit-f-status').value = status;

            if (editModal) editModal.classList.remove('hidden');
        });
    });

    function hideEditModal() {
        if (editModal) editModal.classList.add('hidden');
    }

    if (closeEditModal) closeEditModal.addEventListener('click', hideEditModal);
    if (cancelEditModal) cancelEditModal.addEventListener('click', hideEditModal);


    // 4. API Form Submissions

    // 4a. Add new Case Officer
    if (saveNewFocalBtn) {
        saveNewFocalBtn.addEventListener('click', () => {
            const name = document.getElementById('add-f-name').value.trim();
            const role = document.getElementById('add-f-role').value;
            const assignedProgramId = document.getElementById('add-f-progid').value;
            const contactNumber = document.getElementById('add-f-contact').value.trim();
            let email = document.getElementById('add-f-email').value.trim();
            const status = document.getElementById('add-f-status').value;

            if (!name || !contactNumber) {
                window.showToast("Please provide officer name and mobile contact.", "danger");
                return;
            }

            // Auto-generate standard work email if blank
            if (!email) {
                email = `${name.toLowerCase().replace(/[^a-z]/g, '')}@mswdo.gov.ph`;
            }

            fetch('php/focal/add_focal.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, role, assignedProgramId, contactNumber, email, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Case Officer registered successfully!", "success");
                    hideAddModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to register officer.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with server endpoint.", "danger");
            });
        });
    }

    // 4b. Update Case Officer Profile
    if (saveEditFocalBtn) {
        saveEditFocalBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-f-id').value;
            const name = document.getElementById('edit-f-name').value.trim();
            const role = document.getElementById('edit-f-role').value;
            const assignedProgramId = document.getElementById('edit-f-progid').value;
            const contactNumber = document.getElementById('edit-f-contact').value.trim();
            const email = document.getElementById('edit-f-email').value.trim();
            const status = document.getElementById('edit-f-status').value;

            if (!name || !contactNumber || !email) {
                window.showToast("Please fill in all officer profile parameters.", "danger");
                return;
            }

            fetch('php/focal/update_focal.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, role, assignedProgramId, contactNumber, email, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Officer profile updated successfully!", "success");
                    hideEditModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to save officer profile.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error updating officer parameters.", "danger");
            });
        });
    }

    // 4c. Delete Case Officer
    if (deleteFocalBtn) {
        deleteFocalBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-f-id').value;
            const name = document.getElementById('edit-f-name').value;

            if (confirm(`Are you absolutely sure you want to remove Case Officer "${name}"? This will set their assigned programs to unassigned status.`)) {
                fetch('php/focal/delete_focal.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.showToast("Officer removed from municipal records.", "success");
                        hideEditModal();
                        setTimeout(() => location.reload(), 800);
                    } else {
                        window.showToast(data.message || "Unable to remove officer.", "danger");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.showToast("Error removing officer from roster.", "danger");
                });
            }
        });
    }
});
