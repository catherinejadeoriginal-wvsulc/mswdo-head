// MSWDO Portal - Budget Client Controller
document.addEventListener('DOMContentLoaded', () => {

    // Helper to format currency
    function formatCurrency(value) {
        return '₱' + Number(value).toLocaleString('en-PH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    // 1. Budget Adjustment Modal Toggles
    const allocModal = document.getElementById('allocate-budget-modal');
    const closeAllocModal = document.getElementById('close-allocate-modal');
    const cancelAllocModal = document.getElementById('cancel-allocate-modal');
    const saveBudgetAllocBtn = document.getElementById('save-budget-alloc');

    const allocTriggers = document.querySelectorAll('.allocate-trigger');

    allocTriggers.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const alloc = parseFloat(btn.getAttribute('data-alloc'));

            document.getElementById('alloc-p-id').value = id;
            document.getElementById('alloc-p-name').value = name;
            document.getElementById('alloc-p-current').value = formatCurrency(alloc);
            document.getElementById('alloc-new-amount').value = alloc;
            document.getElementById('alloc-remarks').value = '';

            if (allocModal) allocModal.classList.remove('hidden');
        });
    });

    function hideAllocModal() {
        if (allocModal) allocModal.classList.add('hidden');
    }

    if (closeAllocModal) closeAllocModal.addEventListener('click', hideAllocModal);
    if (cancelAllocModal) cancelAllocModal.addEventListener('click', hideAllocModal);

    // 1a. POST Budget Adjustment
    if (saveBudgetAllocBtn) {
        saveBudgetAllocBtn.addEventListener('click', () => {
            const id = document.getElementById('alloc-p-id').value;
            const newAlloc = parseFloat(document.getElementById('alloc-new-amount').value);
            const source = document.getElementById('alloc-source').value.trim();
            const remarks = document.getElementById('alloc-remarks').value.trim();

            if (isNaN(newAlloc) || newAlloc <= 0 || !source || !remarks) {
                window.showToast("Please provide valid allocation amount and audit justification.", "danger");
                return;
            }

            fetch('php/budget/update_budget.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, allocatedBudget: newAlloc, source, remarks })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Annual budget allocation successfully adjusted!", "success");
                    hideAllocModal();
                    setTimeout(() => location.reload(), 800);
                } else {
                    window.showToast(data.message || "Failed to adjust budget.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with budget adjustment server.", "danger");
            });
        });
    }


    // 2. REALLOCATION SIMULATOR ENGINE (Fully relaxed to solve Requirement #3)
    const simSource = document.getElementById('sim-source');
    const simDest = document.getElementById('sim-dest');
    const simAmountInput = document.getElementById('sim-amount');
    const simulateBtn = document.getElementById('simulate-btn');
    const executeTransferBtn = document.getElementById('execute-transfer-btn');
    const resetSimBtn = document.getElementById('reset-sim-btn');
    
    const impactBox = document.getElementById('sim-impact-box');
    const impactSourceText = document.getElementById('sim-impact-source-text');
    const impactDestText = document.getElementById('sim-impact-dest-text');
    const errorPanel = document.getElementById('sim-error-panel');

    let programsCache = [];

    // Cache program balances locally to drive simulator offline
    function fetchProgramsCache() {
        fetch('php/program/fetch_programs.php')
            .then(r => r.json())
            .then(data => { programsCache = data; })
            .catch(err => console.error("Could not populate program caches", err));
    }
    fetchProgramsCache();

    if (simulateBtn) {
        simulateBtn.addEventListener('click', () => {
            const sourceId = simSource.value;
            const destId = simDest.value;
            const simAmount = parseFloat(simAmountInput.value);

            errorPanel.classList.add('hidden');
            impactBox.classList.add('hidden');

            if (sourceId === destId) {
                errorPanel.textContent = "Error: Source and Destination programs must be different.";
                errorPanel.classList.remove('hidden');
                return;
            }

            if (isNaN(simAmount)) {
                errorPanel.textContent = "Error: Please specify a valid simulation transfer amount.";
                errorPanel.classList.remove('hidden');
                return;
            }

            // Fetch programs from cache or DOM variables
            const sourceProg = programsCache.find(p => p.id === sourceId);
            const destProg = programsCache.find(p => p.id === destId);

            if (!sourceProg || !destProg) {
                errorPanel.textContent = "Error: Program data is compiling. Please try again.";
                errorPanel.classList.remove('hidden');
                return;
            }

            const sourceAlloc = parseFloat(sourceProg.allocatedBudget || sourceProg.allocated_budget || 0);
            const sourceUtil = parseFloat(sourceProg.utilizedBudget || sourceProg.utilized_budget || 0);
            const sourceRemaining = sourceAlloc - sourceUtil;

            const destAlloc = parseFloat(destProg.allocatedBudget || destProg.allocated_budget || 0);

            // Calculate new balances (variance)
            const newSourceAlloc = sourceAlloc - simAmount;
            const newDestAlloc = destAlloc + simAmount;

            // Display simulated results side-by-side
            impactSourceText.textContent = formatCurrency(newSourceAlloc);
            impactDestText.textContent = formatCurrency(newDestAlloc);

            // User requirement #3: "i can freely put any amount i want"
            // If the amount exceeds remaining, we display a helpful notice but STILL ALLOW them to proceed!
            if (simAmount > sourceRemaining) {
                errorPanel.innerHTML = `⚠️ <strong>Notice:</strong> Shifting ${formatCurrency(simAmount)} exceeds current source reserves (${formatCurrency(sourceRemaining)}). This will result in negative program reserves.`;
                errorPanel.classList.remove('hidden');
            }

            impactBox.classList.remove('hidden');
            simulateBtn.classList.add('hidden');
            executeTransferBtn.classList.remove('hidden');
        });
    }

    // Reset simulator
    if (resetSimBtn) {
        resetSimBtn.addEventListener('click', () => {
            simAmountInput.value = "200000";
            impactBox.classList.add('hidden');
            errorPanel.classList.add('hidden');
            simulateBtn.classList.remove('hidden');
            executeTransferBtn.classList.add('hidden');
        });
    }

    // Execute transfer submission
    if (executeTransferBtn) {
        executeTransferBtn.addEventListener('click', () => {
            const sourceId = simSource.value;
            const destId = simDest.value;
            const amount = parseFloat(simAmountInput.value);

            fetch('php/budget/transfer_budget.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sourceId, destId, amount })
            })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    window.showToast("Simulated fund reallocation successfully committed!", "success");
                    setTimeout(() => location.reload(), 1000);
                } else {
                    window.showToast(data.message || "Failed to execute fund reallocation.", "danger");
                }
            })
            .catch(err => {
                console.error(err);
                window.showToast("Error communicating with budget transfer server.", "danger");
            });
        });
    }
});
