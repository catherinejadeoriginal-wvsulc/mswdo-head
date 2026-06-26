// MSWDO Portal - Programs Client Controller
document.addEventListener('DOMContentLoaded', () => {

    const programSearch = document.getElementById('program-search');
    const programFilter = document.getElementById('program-filter');
    const programRows = document.querySelectorAll('.program-row');

    // 1. Search and Status Filtering
    function filterPrograms() {
        const query = programSearch ? programSearch.value.toLowerCase().trim() : '';
        const status = programFilter ? programFilter.value : 'All';

        programRows.forEach(row => {
            const name = row.getAttribute('data-name') || '';
            const desc = row.getAttribute('data-desc') || '';
            const rowStatus = row.getAttribute('data-status') || '';

            const matchesSearch = name.includes(query) || desc.includes(query);
            const matchesStatus = (status === 'All') || (rowStatus === status);

            if (matchesSearch && matchesStatus) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    if (programSearch) programSearch.addEventListener('input', filterPrograms);
    if (programFilter) programFilter.addEventListener('change', filterPrograms);


    // 2. Add Program Modal Toggles
    const addModal = document.getElementById('add-program-modal');
    const addTrigger = document.getElementById('add-program-trigger');
    const closeAddModal = document.getElementById('close-add-program-modal');
    const cancelAddModal = document.getElementById('cancel-add-program-modal');
    const saveNewProgramBtn = document.getElementById('save-new-program');
    const addForm = document.getElementById('add-program-form');

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


    // 3. Edit Program Modal Toggles (Addresses User Requirement #1 & #2: Scrollable, Dynamic)
    const editModal = document.getElementById('edit-program-modal');
    const closeEditModal = document.getElementById('close-edit-program-modal');
    const cancelEditModal = document.getElementById('cancel-edit-program-modal');
    const saveEditProgramBtn = document.getElementById('save-edit-program');
    const deleteProgramBtn = document.getElementById('delete-program-btn');
    const editForm = document.getElementById('edit-program-form');

    const editTriggers = document.querySelectorAll('.edit-program-trigger');

    editTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const desc = btn.getAttribute('data-desc');
            const alloc = btn.getAttribute('data-alloc');
            const util = btn.getAttribute('data-util');
            const status = btn.getAttribute('data-status');
            const benefic = btn.getAttribute('data-benefic');

            // Populate form nodes
            document.getElementById('edit-p-id').value = id;
            document.getElementById('edit-p-name').value = name;
            document.getElementById('edit-p-desc').value = desc;
            document.getElementById('edit-p-alloc').value = alloc;
            document.getElementById('edit-p-util').value = util;
            document.getElementById('edit-p-status').value = status;
            document.getElementById('edit-p-benefic').value = benefic;

            if (editModal) editModal.classList.remove('hidden');
        });
    });

    function hideEditModal() {
        if (editModal) editModal.classList.add('hidden');
    }

    if (closeEditModal) closeEditModal.addEventListener('click', hideEditModal);
    if (cancelEditModal) cancelEditModal.addEventListener('click', hideEditModal);


    // 4. API Form Submissions

    // 4a. Add new Program
    if (saveNewProgramBtn) {
        saveNewProgramBtn.addEventListener('click', () => {
            const name = document.getElementById('add-p-name').value.trim();
            const description = document.getElementById('add-p-desc').value.trim();
            const allocatedBudget = parseFloat(document.getElementById('add-p-alloc').value);
            const status = document.getElementById('add-p-status').value;

            if (!name || !description || isNaN(allocatedBudget) || allocatedBudget <= 0) {
                window.showToast("Please provide valid title, description and positive budget ceiling.", "danger");
                return;
            }

            fetch('php/program/add_program.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, allocatedBudget, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Welfare Program added successfully!", "success");
                    hideAddModal();
                    // Reload to update PHP table
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to create program.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with server endpoint.", "danger");
            });
        });
    }

    // 4b. Update Program
    if (saveEditProgramBtn) {
        saveEditProgramBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-p-id').value;
            const name = document.getElementById('edit-p-name').value.trim();
            const description = document.getElementById('edit-p-desc').value.trim();
            const allocatedBudget = parseFloat(document.getElementById('edit-p-alloc').value);
            const utilizedBudget = parseFloat(document.getElementById('edit-p-util').value);
            const status = document.getElementById('edit-p-status').value;
            const beneficiariesCount = parseInt(document.getElementById('edit-p-benefic').value);

            if (!name || !description || isNaN(allocatedBudget) || allocatedBudget < 0 || isNaN(utilizedBudget) || utilizedBudget < 0) {
                window.showToast("Please double check program fields and budgets.", "danger");
                return;
            }

            fetch('php/program/update_program.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, description, allocatedBudget, utilizedBudget, status, beneficiariesCount })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Program settings saved successfully!", "success");
                    hideEditModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to save program.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error updating program settings.", "danger");
            });
        });
    }

    // 4c. Delete Program
    if (deleteProgramBtn) {
        deleteProgramBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-p-id').value;
            const name = document.getElementById('edit-p-name').value;

            if (confirm(`Are you absolutely sure you want to delete "${name}"? This removes all active histories and associated allocations.`)) {
                fetch('php/program/delete_program.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.showToast("Program deleted from records.", "success");
                        hideEditModal();
                        setTimeout(() => location.reload(), 800);
                    } else {
                        window.showToast(data.message || "Unable to delete program.", "danger");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.showToast("Error deleting program.", "danger");
                });
            }
        });
    }
});
