// MSWDO Portal - Master Reports & AI Client Controller
document.addEventListener('DOMContentLoaded', () => {

    // 1. Subtab Toggle Controls
    const tabLedgerBtn = document.getElementById('tab-ledger-btn');
    const tabAiBtn = document.getElementById('tab-ai-btn');
    
    const subtabLedger = document.getElementById('subtab-ledger');
    const subtabAi = document.getElementById('subtab-ai');

    if (tabLedgerBtn && tabAiBtn) {
        tabLedgerBtn.addEventListener('click', () => {
            tabLedgerBtn.className = "px-6 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer border-blue-900 text-blue-900";
            tabAiBtn.className = "px-6 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer border-transparent text-slate-400 hover:text-slate-600";
            
            subtabLedger.classList.remove('hidden');
            subtabLedger.style.display = 'block';
            subtabAi.classList.add('hidden');
            subtabAi.style.display = 'none';
        });

        tabAiBtn.addEventListener('click', () => {
            tabAiBtn.className = "px-6 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer border-blue-900 text-blue-900";
            tabLedgerBtn.className = "px-6 py-3 font-bold text-xs border-b-2 transition-all flex items-center gap-2 cursor-pointer border-transparent text-slate-400 hover:text-slate-600";
            
            subtabLedger.classList.add('hidden');
            subtabLedger.style.display = 'none';
            subtabAi.classList.remove('hidden');
            subtabAi.style.display = 'grid'; // Grid layout for two pane layout
            
            // Focus input upon tab open
            setTimeout(() => {
                const chatInput = document.getElementById('ai-chat-input');
                if (chatInput) chatInput.focus();
            }, 100);
        });
    }


    // 2. Multi-Parameter Disbursements Ledger Filtering
    const ledgerSearch = document.getElementById('ledger-search');
    const ledgerProgFilter = document.getElementById('ledger-program-filter');
    const ledgerBrgyFilter = document.getElementById('ledger-barangay-filter');
    const ledgerStatusFilter = document.getElementById('ledger-status-filter');
    const ledgerRows = document.querySelectorAll('.ledger-row');

    function filterLedger() {
        const query = ledgerSearch ? ledgerSearch.value.toLowerCase().trim() : '';
        const prog = ledgerProgFilter ? ledgerProgFilter.value.toLowerCase() : 'all';
        const brgy = ledgerBrgyFilter ? ledgerBrgyFilter.value : 'All';
        const status = ledgerStatusFilter ? ledgerStatusFilter.value : 'All';

        ledgerRows.forEach(row => {
            const recipient = row.getAttribute('data-recipient') || '';
            const id = row.getAttribute('data-id') || '';
            const program = row.getAttribute('data-program') || '';
            const barangay = row.getAttribute('data-barangay') || '';
            const rowStatus = row.getAttribute('data-status') || '';

            const matchesSearch = recipient.includes(query) || id.includes(query);
            const matchesProg = (prog === 'all') || program.includes(prog);
            const matchesBrgy = (brgy === 'All') || (barangay === brgy);
            const matchesStatus = (status === 'All') || (rowStatus === status);

            if (matchesSearch && matchesProg && matchesBrgy && matchesStatus) {
                row.classList.remove('hidden');
            } else {
                row.classList.add('hidden');
            }
        });
    }

    if (ledgerSearch) ledgerSearch.addEventListener('input', filterLedger);
    if (ledgerProgFilter) ledgerProgFilter.addEventListener('change', filterLedger);
    if (ledgerBrgyFilter) ledgerBrgyFilter.addEventListener('change', filterLedger);
    if (ledgerStatusFilter) ledgerStatusFilter.addEventListener('change', filterLedger);


    // 3. Audited CSV Export (Only exports visible/filtered columns!)
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', () => {
            const headers = ['Disbursement ID', 'Recipient', 'Welfare Program', 'Amount (PHP)', 'Barangay', 'Date Disbursed', 'Payout Status'];
            const rows = [];

            ledgerRows.forEach(row => {
                if (!row.classList.contains('hidden')) {
                    const id = row.getAttribute('data-id').toUpperCase();
                    const recipient = `"${row.cells[1].textContent.trim()}"`;
                    const program = `"${row.cells[2].textContent.trim()}"`;
                    const amount = row.getAttribute('data-amount');
                    const barangay = `"${row.getAttribute('data-barangay')}"`;
                    const date = row.getAttribute('data-date');
                    const status = row.getAttribute('data-status');

                    rows.push([id, recipient, program, amount, barangay, date, status]);
                }
            });

            if (rows.length === 0) {
                window.showToast("No records match active filters to export.", "danger");
                return;
            }

            const csvContent = "data:text/csv;charset=utf-8," 
                + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `MSWDO_Disbursements_Ledger_${new Date().toISOString().slice(0,10)}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.showToast(`CSV Export successful (${rows.length} rows compiled)`, "success");
        });
    }


    // 4. CIVIC AI CONSULTANT CHAT CONTROLLER
    const chatLogs = document.getElementById('ai-chat-logs');
    const chatForm = document.getElementById('ai-chat-form');
    const chatInput = document.getElementById('ai-chat-input');
    const typingIndicator = document.getElementById('ai-typing-indicator');
    const resetChatBtn = document.getElementById('reset-ai-chat');

    // Messages history store
    let messageHistory = [
        {
            sender: 'assistant',
            text: `👋 Hello Admin! I am the **MSWDO Civic AI Consultant**.\n\nI have scanned your local database of active programs, recent payouts, and pending barangay files. I can help you with:\n- 📊 **Budget Utilization Analysis** (identifying over/underspent sectors)\n- ✍️ **Memo Generation** (drafting recommendation letters for beneficiaries)\n- 🗺️ **Barangay Request Assessments**\n- 💡 **Policy and Allocation Proposals**\n\nAsk me a question or try typing **"analyze budget"** or **"draft medical assistance memo for Dela Cruz"** to see me work!`,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        }
    ];

    // Render message bubbles
    function renderChat() {
        if (!chatLogs) return;
        chatLogs.innerHTML = '';

        messageHistory.forEach(msg => {
            const bubble = document.createElement('div');
            const isUser = msg.sender === 'user';
            
            bubble.className = isUser 
                ? "flex justify-end items-start gap-3" 
                : "flex justify-start items-start gap-3";

            const iconClass = isUser 
                ? "p-2 bg-blue-100 text-blue-900 rounded-xl shrink-0"
                : "p-2 bg-slate-100 text-slate-700 rounded-xl shrink-0";

            const iconInner = isUser
                ? `<i class="lucide lucide-user w-4 h-4"></i>`
                : `<i class="lucide lucide-bot w-4 h-4 text-blue-900"></i>`;

            const bgClass = isUser 
                ? "bg-blue-900 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[80%] leading-relaxed shadow-sm font-semibold"
                : "bg-white text-slate-800 rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] leading-relaxed shadow-sm border border-slate-100";

            // Support simple markdown rendering for bold (**text**) and bullet points (* point)
            let formattedText = msg.text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)(<br>|$)/g, '• $1$2')
                .replace(/### (.*?)(<br>|$)/g, '<h5 class="font-extrabold text-blue-950 text-xs tracking-tight mt-2 mb-1">$1</h5>');

            bubble.innerHTML = isUser
                ? `
                    <div class="flex flex-col items-end">
                        <div class="${bgClass}">${formattedText}</div>
                        <span class="text-[8px] text-slate-400 font-bold mt-1 uppercase">${msg.time}</span>
                    </div>
                    <div class="${iconClass}">${iconInner}</div>
                `
                : `
                    <div class="${iconClass}">${iconInner}</div>
                    <div class="flex flex-col items-start">
                        <div class="${bgClass}">${formattedText}</div>
                        <span class="text-[8px] text-slate-400 font-bold mt-1 uppercase">${msg.time}</span>
                    </div>
                `;

            chatLogs.appendChild(bubble);
        });

        // Auto-scroll to bottom of logs
        chatLogs.scrollTop = chatLogs.scrollHeight;
        
        // Re-execute Lucide replacements
        if (window.lucide) window.lucide.createIcons();
    }

    renderChat();

    // Reset Chat
    if (resetChatBtn) {
        resetChatBtn.addEventListener('click', () => {
            messageHistory = [messageHistory[0]];
            renderChat();
            window.showToast("AI Consultant logs cleared.", "info");
        });
    }

    // Trigger AI inquiry
    function submitAIQuery(queryText) {
        if (!queryText.trim()) return;

        // User message
        messageHistory.push({
            sender: 'user',
            text: queryText,
            time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
        });
        renderChat();

        if (chatInput) chatInput.value = '';
        if (typingIndicator) typingIndicator.classList.remove('hidden');

        // Post request to local PHP server assistant
        fetch('php/reports/chat_ai.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryText })
        })
        .then(r => r.json())
        .then(data => {
            if (typingIndicator) typingIndicator.classList.add('hidden');
            
            messageHistory.push({
                sender: 'assistant',
                text: data.reply || "I am processing audits on municipal social allocations. Please try asking again.",
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            });
            renderChat();
        })
        .catch(err => {
            console.error("AI service failure", err);
            if (typingIndicator) typingIndicator.classList.add('hidden');
            
            messageHistory.push({
                sender: 'assistant',
                text: `❌ **Error:** Unable to connect to municipal AI server. Please make sure the service is running.`,
                time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            });
            renderChat();
        });
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (text) submitAIQuery(text);
        });
    }

    // Tap quick prompt sandbox triggers
    const quickPrompts = document.querySelectorAll('.quick-prompt-btn');
    quickPrompts.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.getAttribute('data-query');
            submitAIQuery(query);
        });
    });
});
