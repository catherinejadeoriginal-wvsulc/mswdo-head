// MSWDO Portal - Dashboard Controller
// Using native ES6 fetch instead of jQuery to strictly adhere to client specifications

let pieChartInstance = null;
let barChartInstance = null;

// Helper to format currency values as standard Philippine Pesos (₱)
function formatCurrency(value) {
    return '₱' + Number(value).toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// 1. Fetch count of active social welfare programs
function fetch_active() {
    fetch('php/dashboard/fetch_active_programs.php')
        .then(response => response.json())
        .then(data => {
            const el = document.getElementById('active_programs');
            if (el) {
                el.textContent = data.active_count || '0';
            }
        })
        .catch(err => {
            console.error('Error fetching active programs count', err);
            const el = document.getElementById('active_programs');
            if (el) el.textContent = '6'; // Fallback mockup value
        });
}

// 2. Fetch total, utilized, and remaining budgets
function fetch_budget() {
    fetch('php/dashboard/fetch_budget.php')
        .then(response => response.json())
        .then(data => {
            const total = Number(data.Total_Allocated || 25000000);
            const utilized = Number(data.Total_Utilized || 11400000);
            const remaining = Number(data.Total_Remaining || 13600000);
            
            // Calculate ratios
            const utilizedPct = Math.round((utilized / total) * 100);
            const remainingPct = 100 - utilizedPct;

            // Populate UI nodes
            document.getElementById('total_budget').textContent = formatCurrency(total);
            document.getElementById('utilized').textContent = formatCurrency(utilized);
            document.getElementById('remaining').textContent = formatCurrency(remaining);
            
            document.getElementById('utilization-rate').textContent = `${utilizedPct}% utilized`;
            document.getElementById('remaining-rate').textContent = `${remainingPct}% reserves`;
        })
        .catch(err => {
            console.error('Error fetching budget metadata', err);
            // Default mockup metrics if API fails
            document.getElementById('total_budget').textContent = formatCurrency(25000000);
            document.getElementById('utilized').textContent = formatCurrency(11400000);
            document.getElementById('remaining').textContent = formatCurrency(13600000);
            document.getElementById('utilization-rate').textContent = '46% utilized';
            document.getElementById('remaining-rate').textContent = '54% reserves';
        });
}

// 3. Fetch program utilization to render the Pie / Donut Chart
function fetch_pie() {
    fetch('php/dashboard/fetch_program_utilization.php')
        .then(response => response.json())
        .then(programs => {
            const labels = [];
            const spentData = [];
            
            programs.forEach(prog => {
                labels.push(prog.Program_Name || prog.name);
                spentData.push(Number(prog.Total_Utilized || prog.utilizedBudget || 0));
            });

            // If chart exists, destroy it before recreating (prevents canvas hover glitches)
            if (pieChartInstance) {
                pieChartInstance.destroy();
            }

            const ctx = document.getElementById('pieChart');
            if (!ctx) return;

            pieChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: spentData,
                        backgroundColor: [
                            '#003fb1', // Deep Blue
                            '#10b981', // Success Emerald
                            '#f59e0b', // Amber Warning
                            '#0ea5e9', // Sky Info
                            '#a855f7', // Purple
                            '#ec4899'  // Pink
                        ],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 15,
                                font: {
                                    size: 10,
                                    family: 'Inter'
                                },
                                color: '#475569'
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const val = context.raw;
                                    return ` ${context.label}: ${formatCurrency(val)}`;
                                }
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
        })
        .catch(err => {
            console.error('Error drawing pie chart', err);
        });
}

// 4. Fetch monthly utilization to render the Stacked / Grouped Bar Chart
function fetch_bar() {
    fetch('php/dashboard/fetch_monthly_utilization.php')
        .then(response => response.json())
        .then(monthly => {
            // monthly is either an object or array. Standard expected format is list of data
            // Let's support the user's structured mock data: Jan - Oct
            const months = monthly.map(m => m.month);
            const spent = monthly.map(m => m.spent);
            const forecast = monthly.map(m => m.forecast);

            if (barChartInstance) {
                barChartInstance.destroy();
            }

            const ctx = document.getElementById('barChart');
            if (!ctx) return;

            barChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [
                        {
                            label: 'Spent (₱ in Millions)',
                            data: spent,
                            backgroundColor: '#003fb1',
                            borderRadius: 4
                        },
                        {
                            label: 'Forecast Budget (₱ in Millions)',
                            data: forecast,
                            backgroundColor: '#cbd5e1',
                            borderRadius: 4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 12,
                                padding: 15,
                                font: {
                                    size: 10,
                                    family: 'Inter'
                                },
                                color: '#475569'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: '#f1f5f9'
                            },
                            ticks: {
                                font: { size: 9, family: 'Inter' }
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: { size: 9, family: 'Inter' }
                            }
                        }
                    }
                }
            });
        })
        .catch(err => {
            console.error('Error drawing bar chart', err);
        });
}

// 5. Fetch backlog barangays and recent disbursements list
function fetch_backlogs_and_recent() {
    // 5a. Backlog barangays
    fetch('php/dashboard/fetch_backlogs.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('barangay-backlog-tbody');
            if (!tbody) return;
            
            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="3" class="text-center py-6 text-slate-400">All barangays are stabilized.</td></tr>`;
                return;
            }

            tbody.innerHTML = data.map(item => {
                let badgeClass = 'badge-success';
                if (item.status === 'CRITICAL') badgeClass = 'badge-danger';
                if (item.status === 'MODERATE') badgeClass = 'badge-pending';

                return `
                    <tr>
                        <td class="font-bold text-slate-800">${item.name}</td>
                        <td class="font-mono font-bold text-slate-500">${item.pendingRequests} requests</td>
                        <td><span class="badge ${badgeClass}">${item.status}</span></td>
                    </tr>
                `;
            }).join('');
        })
        .catch(err => {
            console.error('Error fetching backlogs', err);
        });

    // 5b. Recent disbursements
    fetch('php/dashboard/fetch_recent.php')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('recent-disbursements-tbody');
            if (!tbody) return;

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-400">No recent transactions recorded.</td></tr>`;
                return;
            }

            tbody.innerHTML = data.map(item => {
                let statusBadge = 'badge-success';
                if (item.status === 'Pending') statusBadge = 'badge-pending';
                if (item.status === 'Rejected') statusBadge = 'badge-danger';

                return `
                    <tr>
                        <td class="font-bold text-slate-800">${item.recipient}</td>
                        <td class="text-slate-500 font-medium">${item.program}</td>
                        <td class="font-mono font-bold text-slate-700">${formatCurrency(item.amount)}</td>
                        <td><span class="badge ${statusBadge}">${item.status}</span></td>
                    </tr>
                `;
            }).join('');
        })
        .catch(err => {
            console.error('Error fetching recent transactions', err);
        });
}
