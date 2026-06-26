// MSWDO Portal - Solo Parents Client Controller
document.addEventListener('DOMContentLoaded', () => {

    const soloSearch = document.getElementById('solo-search');
    const soloAssistanceFilter = document.getElementById('solo-assistance-filter');
    const soloStatusFilter = document.getElementById('solo-status-filter');
    const soloRows = document.querySelectorAll('.solo-row');

    // 1. Live Client-Side Filtering
    function filterSolos() {
        const query = soloSearch ? soloSearch.value.toLowerCase().trim() : '';
        const claim = soloAssistanceFilter ? soloAssistanceFilter.value : 'All';
        const status = soloStatusFilter ? soloStatusFilter.value : 'All';

        soloRows.forEach(row => {
            const name = row.getAttribute('data-name') || '';
            const id = row.getAttribute('data-id') || '';
            const barangay = row.getAttribute('data-barangay') || '';
            const rowClaim = row.getAttribute('data-claim') || '';
            const rowStatus = row.getAttribute('data-status') || '';

            const matchesSearch = name.includes(query) || id.includes(query) || barangay.includes(query);
            const matchesClaim = (claim === 'All') || (rowClaim === claim);
            const matchesStatus = (status === 'All') || (rowStatus === status);

            if (matchesSearch && matchesClaim && matchesStatus) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    if (soloSearch) soloSearch.addEventListener('input', filterSolos);
    if (soloAssistanceFilter) soloAssistanceFilter.addEventListener('change', filterSolos);
    if (soloStatusFilter) soloStatusFilter.addEventListener('change', filterSolos);


    // 2. Add Solo Modal Toggles
    const addModal = document.getElementById('add-solo-modal');
    const addTrigger = document.getElementById('add-solo-trigger');
    const closeAddModal = document.getElementById('close-add-solo-modal');
    const cancelAddModal = document.getElementById('cancel-add-solo-modal');
    const saveNewSoloBtn = document.getElementById('save-new-solo');
    const addForm = document.getElementById('add-solo-form');

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


    // 3. Edit Solo Modal Toggles
    const editModal = document.getElementById('edit-solo-modal');
    const closeEditModal = document.getElementById('close-edit-solo-modal');
    const cancelEditModal = document.getElementById('cancel-edit-solo-modal');
    const saveEditSoloBtn = document.getElementById('save-edit-solo');
    const deleteSoloBtn = document.getElementById('delete-solo-btn');

    const editTriggers = document.querySelectorAll('.edit-solo-trigger');

    editTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const age = btn.getAttribute('data-age');
            const gender = btn.getAttribute('data-gender');
            const barangay = btn.getAttribute('data-barangay');
            const children = btn.getAttribute('data-children');
            const claim = btn.getAttribute('data-claim');
            const status = btn.getAttribute('data-status');
            const regdate = btn.getAttribute('data-regdate');

            // Populate form nodes
            document.getElementById('edit-sp-id').value = id;
            document.getElementById('edit-sp-name').value = name;
            document.getElementById('edit-sp-age').value = age;
            document.getElementById('edit-sp-gender').value = gender;
            document.getElementById('edit-sp-barangay').value = barangay;
            document.getElementById('edit-sp-children').value = children;
            document.getElementById('edit-sp-claim').value = claim;
            document.getElementById('edit-sp-status').value = status;
            document.getElementById('edit-sp-regdate').value = regdate;

            if (editModal) editModal.classList.remove('hidden');
        });
    });

    function hideEditModal() {
        if (editModal) editModal.classList.add('hidden');
    }

    if (closeEditModal) closeEditModal.addEventListener('click', hideEditModal);
    if (cancelEditModal) cancelEditModal.addEventListener('click', hideEditModal);


    // 4. API Endpoints Submissions

    // 4a. Add Solo Parent
    if (saveNewSoloBtn) {
        saveNewSoloBtn.addEventListener('click', () => {
            const name = document.getElementById('add-sp-name').value.trim();
            const age = parseInt(document.getElementById('add-sp-age').value);
            const gender = document.getElementById('add-sp-gender').value;
            const barangay = document.getElementById('add-sp-barangay').value;
            const childrenCount = parseInt(document.getElementById('add-sp-children').value);
            const assistanceStatus = document.getElementById('add-sp-claim').value;
            const status = document.getElementById('add-sp-status').value;

            if (!name || isNaN(age) || age <= 0 || isNaN(childrenCount) || childrenCount < 1) {
                window.showToast("Please provide valid single parent name, age and dependent counts.", "danger");
                return;
            }

            fetch('php/soloparents/add_solo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, gender, barangay, childrenCount, assistanceStatus, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Single provider registered successfully!", "success");
                    hideAddModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to enlist parent.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with solo parent registration server.", "danger");
            });
        });
    }

    // 4b. Update Solo Parent Profile
    if (saveEditSoloBtn) {
        saveEditSoloBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-sp-id').value;
            const name = document.getElementById('edit-sp-name').value.trim();
            const age = parseInt(document.getElementById('edit-sp-age').value);
            const gender = document.getElementById('edit-sp-gender').value;
            const barangay = document.getElementById('edit-sp-barangay').value;
            const childrenCount = parseInt(document.getElementById('edit-sp-children').value);
            const assistanceStatus = document.getElementById('edit-sp-claim').value;
            const status = document.getElementById('edit-sp-status').value;

            if (!name || isNaN(age) || age <= 0 || isNaN(childrenCount) || childrenCount < 1) {
                window.showToast("Please verify all parent demographic parameters.", "danger");
                return;
            }

            fetch('php/soloparents/update_solo.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, age, gender, barangay, childrenCount, assistanceStatus, status })
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
                window.showToast("Error updating resident profile.", "danger");
            });
        });
    }

    // 4c. Delete Solo Parent
    if (deleteSoloBtn) {
        deleteSoloBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-sp-id').value;
            const name = document.getElementById('edit-sp-name').value;

            if (confirm(`Are you absolutely sure you want to delete resident "${name}" from single provider registries?`)) {
                fetch('php/soloparents/delete_solo.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.showToast("Resident record removed.", "success");
                        hideEditModal();
                        setTimeout(() => location.reload(), 800);
                    } else {
                        window.showToast(data.message || "Unable to remove resident.", "danger");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.showToast("Error deleting resident from registries.", "danger");
                });
            }
        });
    }
});
