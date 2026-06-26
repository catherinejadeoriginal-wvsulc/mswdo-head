// MSWDO Portal - Seniors Client Controller
document.addEventListener('DOMContentLoaded', () => {

    const seniorSearch = document.getElementById('senior-search');
    const seniorPensionFilter = document.getElementById('senior-pension-filter');
    const seniorAssistanceFilter = document.getElementById('senior-assistance-filter');
    const seniorRows = document.querySelectorAll('.senior-row');

    // 1. Live Client-Side Filtering
    function filterSeniors() {
        const query = seniorSearch ? seniorSearch.value.toLowerCase().trim() : '';
        const pension = seniorPensionFilter ? seniorPensionFilter.value : 'All';
        const claim = seniorAssistanceFilter ? seniorAssistanceFilter.value : 'All';

        seniorRows.forEach(row => {
            const name = row.getAttribute('data-name') || '';
            const id = row.getAttribute('data-id') || '';
            const barangay = row.getAttribute('data-barangay') || '';
            const rowPension = row.getAttribute('data-pension') || '';
            const rowClaim = row.getAttribute('data-claim') || '';

            const matchesSearch = name.includes(query) || id.includes(query) || barangay.includes(query);
            const matchesPension = (pension === 'All') || (rowPension === pension);
            const matchesClaim = (claim === 'All') || (rowClaim === claim);

            if (matchesSearch && matchesPension && matchesClaim) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    if (seniorSearch) seniorSearch.addEventListener('input', filterSeniors);
    if (seniorPensionFilter) seniorPensionFilter.addEventListener('change', filterSeniors);
    if (seniorAssistanceFilter) seniorAssistanceFilter.addEventListener('change', filterSeniors);


    // 2. Add Senior Modal Toggles
    const addModal = document.getElementById('add-senior-modal');
    const addTrigger = document.getElementById('add-senior-trigger');
    const closeAddModal = document.getElementById('close-add-senior-modal');
    const cancelAddModal = document.getElementById('cancel-add-senior-modal');
    const saveNewSeniorBtn = document.getElementById('save-new-senior');
    const addForm = document.getElementById('add-senior-form');

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


    // 3. Edit Senior Modal Toggles
    const editModal = document.getElementById('edit-senior-modal');
    const closeEditModal = document.getElementById('close-edit-senior-modal');
    const cancelEditModal = document.getElementById('cancel-edit-senior-modal');
    const saveEditSeniorBtn = document.getElementById('save-edit-senior');
    const deleteSeniorBtn = document.getElementById('delete-senior-btn');

    const editTriggers = document.querySelectorAll('.edit-senior-trigger');

    editTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const age = btn.getAttribute('data-age');
            const gender = btn.getAttribute('data-gender');
            const barangay = btn.getAttribute('data-barangay');
            const pension = btn.getAttribute('data-pension');
            const claim = btn.getAttribute('data-claim');
            const status = btn.getAttribute('data-status');
            const regdate = btn.getAttribute('data-regdate');

            // Populate form nodes
            document.getElementById('edit-s-id').value = id;
            document.getElementById('edit-s-name').value = name;
            document.getElementById('edit-s-age').value = age;
            document.getElementById('edit-s-gender').value = gender;
            document.getElementById('edit-s-barangay').value = barangay;
            document.getElementById('edit-s-pension').value = pension;
            document.getElementById('edit-s-claim').value = claim;
            document.getElementById('edit-s-status').value = status;
            document.getElementById('edit-s-regdate').value = regdate;

            if (editModal) editModal.classList.remove('hidden');
        });
    });

    function hideEditModal() {
        if (editModal) editModal.classList.add('hidden');
    }

    if (closeEditModal) closeEditModal.addEventListener('click', hideEditModal);
    if (cancelEditModal) cancelEditModal.addEventListener('click', hideEditModal);


    // 4. API Endpoints Submissions

    // 4a. Add Senior
    if (saveNewSeniorBtn) {
        saveNewSeniorBtn.addEventListener('click', () => {
            const name = document.getElementById('add-s-name').value.trim();
            const age = parseInt(document.getElementById('add-s-age').value);
            const gender = document.getElementById('add-s-gender').value;
            const barangay = document.getElementById('add-s-barangay').value;
            const pensionStatus = document.getElementById('add-s-pension').value;
            const assistanceStatus = document.getElementById('add-s-claim').value;
            const status = document.getElementById('add-s-status').value;

            if (!name || isNaN(age) || age < 60) {
                window.showToast("Please provide valid senior resident name and age (min 60).", "danger");
                return;
            }

            fetch('php/seniors/add_senior.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, gender, barangay, pensionStatus, assistanceStatus, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Senior resident registered under OSCA successfully!", "success");
                    hideAddModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to enlist senior.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with senior registration server.", "danger");
            });
        });
    }

    // 4b. Update Senior
    if (saveEditSeniorBtn) {
        saveEditSeniorBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-s-id').value;
            const name = document.getElementById('edit-s-name').value.trim();
            const age = parseInt(document.getElementById('edit-s-age').value);
            const gender = document.getElementById('edit-s-gender').value;
            const barangay = document.getElementById('edit-s-barangay').value;
            const pensionStatus = document.getElementById('edit-s-pension').value;
            const assistanceStatus = document.getElementById('edit-s-claim').value;
            const status = document.getElementById('edit-s-status').value;

            if (!name || isNaN(age) || age < 60) {
                window.showToast("Please check name and age fields (senior citizen age must be 60+).", "danger");
                return;
            }

            fetch('php/seniors/update_senior.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, age, gender, barangay, pensionStatus, assistanceStatus, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Resident profile saved successfully!", "success");
                    hideEditModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to save profile changes.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error updating senior profile.", "danger");
            });
        });
    }

    // 4c. Delete Senior
    if (deleteSeniorBtn) {
        deleteSeniorBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-s-id').value;
            const name = document.getElementById('edit-s-name').value;

            if (confirm(`Are you absolutely sure you want to delete resident "${name}" from OSCA registries?`)) {
                fetch('php/seniors/delete_senior.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.showToast("Senior record removed.", "success");
                        hideEditModal();
                        setTimeout(() => location.reload(), 800);
                    } else {
                        window.showToast(data.message || "Unable to remove senior.", "danger");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.showToast("Error deleting senior record.", "danger");
                });
            }
        });
    }
});
