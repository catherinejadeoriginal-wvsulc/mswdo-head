// MSWDO Portal - PWD Client Controller
document.addEventListener('DOMContentLoaded', () => {

    const pwdSearch = document.getElementById('pwd-search');
    const pwdAssistanceFilter = document.getElementById('pwd-assistance-filter');
    const pwdStatusFilter = document.getElementById('pwd-status-filter');
    const pwdRows = document.querySelectorAll('.pwd-row');

    // 1. Live Client-Side Filtering
    function filterPWDs() {
        const query = pwdSearch ? pwdSearch.value.toLowerCase().trim() : '';
        const claim = pwdAssistanceFilter ? pwdAssistanceFilter.value : 'All';
        const status = pwdStatusFilter ? pwdStatusFilter.value : 'All';

        pwdRows.forEach(row => {
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

    if (pwdSearch) pwdSearch.addEventListener('input', filterPWDs);
    if (pwdAssistanceFilter) pwdAssistanceFilter.addEventListener('change', filterPWDs);
    if (pwdStatusFilter) pwdStatusFilter.addEventListener('change', filterPWDs);


    // 2. Add PWD Modal Toggles
    const addModal = document.getElementById('add-pwd-modal');
    const addTrigger = document.getElementById('add-pwd-trigger');
    const closeAddModal = document.getElementById('close-add-pwd-modal');
    const cancelAddModal = document.getElementById('cancel-add-pwd-modal');
    const saveNewPWDBtn = document.getElementById('save-new-pwd');
    const addForm = document.getElementById('add-pwd-form');

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


    // 3. Edit PWD Modal Toggles
    const editModal = document.getElementById('edit-pwd-modal');
    const closeEditModal = document.getElementById('close-edit-pwd-modal');
    const cancelEditModal = document.getElementById('cancel-edit-pwd-modal');
    const saveEditPWDBtn = document.getElementById('save-edit-pwd');
    const deletePWDBtn = document.getElementById('delete-pwd-btn');

    const editTriggers = document.querySelectorAll('.edit-pwd-trigger');

    editTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const age = btn.getAttribute('data-age');
            const gender = btn.getAttribute('data-gender');
            const barangay = btn.getAttribute('data-barangay');
            const disability = btn.getAttribute('data-disability');
            const claim = btn.getAttribute('data-claim');
            const status = btn.getAttribute('data-status');
            const regdate = btn.getAttribute('data-regdate');

            // Populate form nodes
            document.getElementById('edit-pwd-id').value = id;
            document.getElementById('edit-pwd-name').value = name;
            document.getElementById('edit-pwd-age').value = age;
            document.getElementById('edit-pwd-gender').value = gender;
            document.getElementById('edit-pwd-barangay').value = barangay;
            document.getElementById('edit-pwd-disability').value = disability;
            document.getElementById('edit-pwd-claim').value = claim;
            document.getElementById('edit-pwd-status').value = status;
            document.getElementById('edit-pwd-regdate').value = regdate;

            if (editModal) editModal.classList.remove('hidden');
        });
    });

    function hideEditModal() {
        if (editModal) editModal.classList.add('hidden');
    }

    if (closeEditModal) closeEditModal.addEventListener('click', hideEditModal);
    if (cancelEditModal) cancelEditModal.addEventListener('click', hideEditModal);


    // 4. API Endpoints Submissions

    // 4a. Add PWD
    if (saveNewPWDBtn) {
        saveNewPWDBtn.addEventListener('click', () => {
            const name = document.getElementById('add-pwd-name').value.trim();
            const age = parseInt(document.getElementById('add-pwd-age').value);
            const gender = document.getElementById('add-pwd-gender').value;
            const barangay = document.getElementById('add-pwd-barangay').value;
            const disabilityType = document.getElementById('add-pwd-disability').value;
            const assistanceStatus = document.getElementById('add-pwd-claim').value;
            const status = document.getElementById('add-pwd-status').value;

            if (!name || isNaN(age) || age <= 0) {
                window.showToast("Please provide valid resident name and age parameters.", "danger");
                return;
            }

            fetch('php/pwd/add_pwd.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, age, gender, barangay, disabilityType, assistanceStatus, status })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("PWD resident enlisted successfully!", "success");
                    hideAddModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to enlist PWD.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with PWD registration server.", "danger");
            });
        });
    }

    // 4b. Update PWD
    if (saveEditPWDBtn) {
        saveEditPWDBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-pwd-id').value;
            const name = document.getElementById('edit-pwd-name').value.trim();
            const age = parseInt(document.getElementById('edit-pwd-age').value);
            const gender = document.getElementById('edit-pwd-gender').value;
            const barangay = document.getElementById('edit-pwd-barangay').value;
            const disabilityType = document.getElementById('edit-pwd-disability').value;
            const assistanceStatus = document.getElementById('edit-pwd-claim').value;
            const status = document.getElementById('edit-pwd-status').value;

            if (!name || isNaN(age) || age <= 0) {
                window.showToast("Please fill in all resident parameters properly.", "danger");
                return;
            }

            fetch('php/pwd/update_pwd.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, name, age, gender, barangay, disabilityType, assistanceStatus, status })
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

    // 4c. Delete PWD
    if (deletePWDBtn) {
        deletePWDBtn.addEventListener('click', () => {
            const id = document.getElementById('edit-pwd-id').value;
            const name = document.getElementById('edit-pwd-name').value;

            if (confirm(`Are you absolutely sure you want to delete resident "${name}" from PWD registries? This is irreversible.`)) {
                fetch('php/pwd/delete_pwd.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.status === 'success') {
                        window.showToast("Resident removed from registry.", "success");
                        hideEditModal();
                        setTimeout(() => location.reload(), 800);
                    } else {
                        window.showToast(data.message || "Unable to delete resident.", "danger");
                    }
                })
                .catch(err => {
                    console.error(err);
                    window.showToast("Error deleting resident from register.", "danger");
                });
            }
        });
    }
});
