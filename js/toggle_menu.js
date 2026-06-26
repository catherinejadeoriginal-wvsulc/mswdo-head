// MSWDO Portal - UI Navigation & Header Interaction Controller
document.addEventListener('DOMContentLoaded', () => {

    // 1. Sidebar Navigation Toggle Drawer
    const toggleNavBtn = document.getElementById('toggle-nav');
    const sidebar = document.getElementById('sidebar');
    
    if (toggleNavBtn && sidebar) {
        toggleNavBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('open');
            } else {
                sidebar.classList.toggle('collapsed');
                const isCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('mswdo_nav_collapsed', isCollapsed ? 'true' : 'false');
            }
        });

        // Retain collapsed state from local storage
        const savedCollapsed = localStorage.getItem('mswdo_nav_collapsed');
        if (savedCollapsed === 'true' && window.innerWidth > 768) {
            sidebar.classList.add('collapsed');
        }
    }

    // Responsive: auto close sidebar on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('open');
        }
    });

    // 2. Profile Menu Dropdown Toggler
    const profileTrigger = document.getElementById('profile-menu-trigger');
    const profileDropdown = document.getElementById('profile-dropdown');

    if (profileTrigger && profileDropdown) {
        profileTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('hidden');
            if (notifDropdown) notifDropdown.classList.add('hidden');
        });
    }

    // 3. Notifications Dropdown Toggler
    const notifTrigger = document.getElementById('notif-trigger');
    const notifDropdown = document.getElementById('notif-dropdown');

    if (notifTrigger && notifDropdown) {
        notifTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
            if (profileDropdown) profileDropdown.classList.add('hidden');
        });
    }

    // Dismiss dropdowns when clicking outside
    document.addEventListener('click', () => {
        if (profileDropdown) profileDropdown.classList.add('hidden');
        if (notifDropdown) notifDropdown.classList.add('hidden');
    });

    // Prevent dismiss inside dropdown clicks
    if (profileDropdown) profileDropdown.addEventListener('click', e => e.stopPropagation());
    if (notifDropdown) notifDropdown.addEventListener('click', e => e.stopPropagation());

    // 4. Live LGU clock updater (UTC+8 Philippine Standard Time)
    const clockElement = document.getElementById('lgu-clock');
    
    function updateLGUClock() {
        if (!clockElement) return;
        const now = new Date();
        // Shift to Manila standard timezone (+8) if running elsewhere, or just show local time formatted nicely
        const options = {
            timeZone: 'Asia/Manila',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const timeString = now.toLocaleTimeString('en-PH', options);
        clockElement.textContent = `PST LIVE: ${timeString}`;
    }

    if (clockElement) {
        updateLGUClock();
        setInterval(updateLGUClock, 1000);
    }
});

// Toast notification helper accessible globally
window.showToast = function(message, type = 'success') {
    const wrapper = document.getElementById('toast-wrapper');
    if (!wrapper) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconClass = 'lucide-check-circle-2';
    if (type === 'danger') iconClass = 'lucide-alert-octagon';
    if (type === 'warning') iconClass = 'lucide-alert-triangle';
    if (type === 'info') iconClass = 'lucide-info';

    toast.innerHTML = `
        <i class="lucide ${iconClass} w-5 h-5 text-${type === 'danger' ? 'red' : type === 'success' ? 'emerald' : type === 'warning' ? 'amber' : 'sky'}-500 shrink-0"></i>
        <div>${message}</div>
    `;

    wrapper.appendChild(toast);

    // Fade out after 4 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 4000);
};
