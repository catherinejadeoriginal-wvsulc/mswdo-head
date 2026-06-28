/**
 * Chart.js Offline Fallback Engine
 * If CDN is not available (offline use), this script mocks the Chart class
 * and draws clean, elegant visual representations directly on HTML5 Canvas.
 */
if (typeof Chart === 'undefined') {
    window.Chart = class OfflineChart {
        constructor(canvas, config) {
            this.canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;
            this.config = config;
            this.ctx = this.canvas.getContext('2d');
            this.draw();
        }

        destroy() {
            // Clear canvas
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
        }

        draw() {
            const ctx = this.ctx;
            const canvas = this.canvas;
            if (!ctx || !canvas) return;

            // Set internal resolution matching CSS dimensions
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width || 300;
            canvas.height = rect.height || 200;

            const width = canvas.width;
            const height = canvas.height;

            ctx.clearRect(0, 0, width, height);

            if (this.config.type === 'doughnut') {
                this.drawDoughnut(ctx, width, height);
            } else if (this.config.type === 'bar') {
                this.drawBar(ctx, width, height);
            }
        }

        drawDoughnut(ctx, width, height) {
            const centerX = width / 2;
            const centerY = height / 2 - 10;
            const radius = Math.min(centerX, centerY) * 0.75;
            const dataset = this.config.data.datasets[0];
            const data = dataset.data;
            const colors = dataset.backgroundColor || ['#003fb1', '#10b981', '#f59e0b', '#0ea5e9'];

            const total = data.reduce((sum, val) => sum + val, 0);
            if (total === 0) return;

            let startAngle = -Math.PI / 2;

            // Draw doughnut slices
            for (let i = 0; i < data.length; i++) {
                const sliceAngle = (data[i] / total) * 2 * Math.PI;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
                ctx.arc(centerX, centerY, radius * 0.65, startAngle + sliceAngle, startAngle, true);
                ctx.closePath();
                ctx.fillStyle = colors[i % colors.length];
                ctx.fill();
                startAngle += sliceAngle;
            }

            // Draw clean legend below
            const labels = this.config.data.labels || [];
            ctx.font = 'bold 9px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            let legendX = 20;
            const legendY = height - 15;
            const itemWidth = (width - 40) / Math.max(1, labels.length);

            for (let i = 0; i < labels.length; i++) {
                const x = legendX + (i * itemWidth) + (itemWidth / 2);
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(x - 20, legendY, 4, 0, 2 * Math.PI);
                ctx.fill();

                ctx.fillStyle = '#64748b';
                // Shorten labels if too long
                let label = labels[i];
                if (label.length > 10) label = label.slice(0, 8) + '...';
                ctx.fillText(label, x, legendY);
            }
        }

        drawBar(ctx, width, height) {
            const datasets = this.config.data.datasets;
            const labels = this.config.data.labels || [];
            const spentData = datasets[0].data || [];
            const forecastData = datasets[1] ? datasets[1].data : null;

            const paddingLeft = 35;
            const paddingRight = 15;
            const paddingTop = 15;
            const paddingBottom = 25;

            const plotWidth = width - paddingLeft - paddingRight;
            const plotHeight = height - paddingTop - paddingBottom;

            // Find max value for scaling
            let maxVal = 10;
            spentData.forEach(v => { if (v > maxVal) maxVal = v; });
            if (forecastData) {
                forecastData.forEach(v => { if (v > maxVal) maxVal = v; });
            }
            maxVal = Math.ceil(maxVal * 1.1); // Add margin

            // Draw Y Grid lines & Labels
            ctx.strokeStyle = '#f1f5f9';
            ctx.fillStyle = '#94a3b8';
            ctx.font = '8px JetBrains Mono, monospace';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';

            const gridLines = 4;
            for (let i = 0; i <= gridLines; i++) {
                const y = paddingTop + plotHeight - (i / gridLines) * plotHeight;
                const val = (i / gridLines) * maxVal;

                ctx.beginPath();
                ctx.moveTo(paddingLeft, y);
                ctx.lineTo(width - paddingRight, y);
                ctx.stroke();

                ctx.fillText(val.toFixed(1), paddingLeft - 6, y);
            }

            // Draw X Labels and Bars
            const barCount = labels.length;
            const barGap = 6;
            const groupWidth = plotWidth / barCount;
            const singleBarWidth = forecastData ? (groupWidth - barGap * 2) / 2 : (groupWidth - barGap * 2);

            ctx.textAlign = 'center';
            ctx.font = 'bold 9px Inter, sans-serif';

            for (let i = 0; i < barCount; i++) {
                const groupX = paddingLeft + (i * groupWidth);
                const xLabel = groupX + (groupWidth / 2);

                // Draw X Label
                ctx.fillStyle = '#64748b';
                ctx.fillText(labels[i], xLabel, height - 10);

                // Draw Spent Bar
                const spentHeight = (spentData[i] / maxVal) * plotHeight;
                const spentY = paddingTop + plotHeight - spentHeight;
                ctx.fillStyle = '#003fb1'; // Primary blue
                ctx.beginPath();
                ctx.roundRect(groupX + barGap, spentY, singleBarWidth, spentHeight, 3);
                ctx.fill();

                // Draw Forecast Bar
                if (forecastData) {
                    const forecastHeight = (forecastData[i] / maxVal) * plotHeight;
                    const forecastY = paddingTop + plotHeight - forecastHeight;
                    ctx.fillStyle = '#a855f7'; // Purple forecast
                    ctx.beginPath();
                    ctx.roundRect(groupX + barGap + singleBarWidth, forecastY, singleBarWidth, forecastHeight, 3);
                    ctx.fill();
                }
            }
        }
    };
}
