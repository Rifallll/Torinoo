// Traffic ML Analysis - Frontend Logic

let featureChart = null;
let hourlyChart = null;
let trafficDistChart = null;

// Display statistics
function displayStatistics(stats) {
    const statsDiv = document.getElementById('statistics');
    statsDiv.innerHTML = `
        <div class="stat-item"><strong>Total Records:</strong> ${stats.row_count.toLocaleString()}</div>
        <div class="stat-item"><strong>Date Range:</strong> ${stats.date_range.start} to ${stats.date_range.end}</div>
        <div class="stat-item"><strong>Detectors:</strong> ${stats.detector_count}</div>
        <div class="stat-item"><strong>Avg Flow:</strong> ${stats.flow_stats.mean.toFixed(2)}</div>
        <div class="stat-item"><strong>Avg Speed:</strong> ${stats.speed_stats.mean.toFixed(2)} km/h</div>
    `;
}


// Train model
document.getElementById('trainBtn').addEventListener('click', async () => {
    const statusDiv = document.getElementById('trainingStatus');
    const trainBtn = document.getElementById('trainBtn');
    
    statusDiv.innerHTML = '<span class="loading">Training model (sampling 100k records)...</span>';
    trainBtn.disabled = true;
    
    try {
        const response = await fetch('/api/train', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            statusDiv.innerHTML = '<span class="success">Model trained successfully!</span>';
            displayMetrics(data.metrics);
            displayFeatureImportance(data.feature_importance);
            document.getElementById('predictBtn').disabled = false;
            loadCorrelations();
        } else {
            statusDiv.innerHTML = `<span class="error">Error: ${data.error}</span>`;
        }
    } catch (error) {
        statusDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    } finally {
        trainBtn.disabled = false;
    }
});

// Display metrics
function displayMetrics(metrics) {
    const metricsDiv = document.getElementById('metrics');
    const sampledInfo = metrics.sampled_size ? `(sampled from ${metrics.total_size.toLocaleString()})` : '';
    metricsDiv.innerHTML = `
        <div class="metrics-grid">
            <div class="metric"><span class="metric-value">${metrics.r2_score.toFixed(4)}</span><span class="metric-label">R² Score</span></div>
            <div class="metric"><span class="metric-value">${metrics.mae.toFixed(2)}</span><span class="metric-label">MAE</span></div>
            <div class="metric"><span class="metric-value">${metrics.rmse.toFixed(2)}</span><span class="metric-label">RMSE</span></div>
            <div class="metric"><span class="metric-value">${metrics.train_size.toLocaleString()}</span><span class="metric-label">Train Size</span></div>
            <div class="metric"><span class="metric-value">${metrics.test_size.toLocaleString()}</span><span class="metric-label">Test Size</span></div>
        </div>
        <p class="sample-info">${sampledInfo}</p>
    `;
}

// Prediction
document.getElementById('predictForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const resultDiv = document.getElementById('predictionResult');
    
    const hour = document.getElementById('predHour').value;
    const weekday = document.getElementById('predWeekday').value;
    const detid = document.getElementById('predDetid').value;
    
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hour: parseInt(hour), weekday: parseInt(weekday), detid: parseInt(detid) })
        });
        const data = await response.json();
        
        if (data.error) {
            resultDiv.innerHTML = `<span class="error">Error: ${data.error}</span>`;
        } else {
            const categoryClass = data.category.toLowerCase();
            resultDiv.innerHTML = `
                <div class="prediction-result">
                    <div class="pred-main">
                        <span class="pred-value">${data.prediction.toFixed(2)}</span>
                        <span class="pred-label">Predicted Flow</span>
                    </div>
                    <div class="pred-confidence">
                        <span>95% CI: [${data.confidence_low.toFixed(2)}, ${data.confidence_high.toFixed(2)}]</span>
                    </div>
                    <div class="pred-category ${categoryClass}">
                        <span>Traffic: ${data.category}</span>
                        <span>Index: ${data.traffic_index.toFixed(1)}</span>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        resultDiv.innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
});


// Feature importance chart
function displayFeatureImportance(importance) {
    const ctx = document.getElementById('featureChart').getContext('2d');
    
    if (featureChart) featureChart.destroy();
    
    const labels = Object.keys(importance);
    const values = Object.values(importance);
    
    featureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Feature Importance',
                data: values,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } }
        }
    });
}

// Load chart data
async function loadChartData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        
        if (!data.error) {
            displayHourlyChart(data.hourly_flow);
            displayTrafficDistChart(data.traffic_distribution);
        }
    } catch (error) {
        console.error('Error loading chart data:', error);
    }
}

// Hourly flow chart
function displayHourlyChart(hourlyFlow) {
    const ctx = document.getElementById('hourlyChart').getContext('2d');
    
    if (hourlyChart) hourlyChart.destroy();
    
    const labels = Object.keys(hourlyFlow).sort((a, b) => parseInt(a) - parseInt(b));
    const values = labels.map(h => hourlyFlow[h]);
    
    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels.map(h => `${h}:00`),
            datasets: [{
                label: 'Average Flow',
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: { responsive: true }
    });
}

// Traffic distribution chart
function displayTrafficDistChart(distribution) {
    const ctx = document.getElementById('trafficDistChart').getContext('2d');
    
    if (trafficDistChart) trafficDistChart.destroy();
    
    trafficDistChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(distribution),
            datasets: [{
                data: Object.values(distribution),
                backgroundColor: ['#4CAF50', '#FFC107', '#F44336']
            }]
        },
        options: { responsive: true }
    });
}

// Load correlations
async function loadCorrelations() {
    try {
        const response = await fetch('/api/correlation');
        const data = await response.json();
        
        if (data.correlations) {
            const corrDiv = document.getElementById('correlations');
            let html = '<div class="correlation-list">';
            for (const [feature, corr] of Object.entries(data.correlations)) {
                const color = corr > 0 ? 'positive' : 'negative';
                html += `<div class="corr-item ${color}"><span>${feature}</span><span>${corr.toFixed(4)}</span></div>`;
            }
            html += '</div>';
            corrDiv.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading correlations:', error);
    }
}

// Apply filters
document.getElementById('applyFilters').addEventListener('click', async () => {
    const params = new URLSearchParams();
    
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;
    const detid = document.getElementById('filterDetid').value;
    const hourStart = document.getElementById('filterHourStart').value;
    const hourEnd = document.getElementById('filterHourEnd').value;
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    if (detid) params.append('detid', detid);
    if (hourStart) params.append('hour_start', hourStart);
    if (hourEnd) params.append('hour_end', hourEnd);
    
    document.getElementById('filterResults').innerHTML = '<span class="loading">Filtering...</span>';
    
    try {
        const response = await fetch(`/api/data?${params}`);
        const data = await response.json();
        
        if (!data.error) {
            document.getElementById('filterResults').innerHTML = `<span class="success">Found ${data.total_records.toLocaleString()} records</span>`;
            displayHourlyChart(data.hourly_flow);
            displayTrafficDistChart(data.traffic_distribution);
        } else {
            document.getElementById('filterResults').innerHTML = `<span class="error">Error: ${data.error}</span>`;
        }
    } catch (error) {
        document.getElementById('filterResults').innerHTML = `<span class="error">Error: ${error.message}</span>`;
    }
});

// Auto-load data on page load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/statistics');
        const stats = await response.json();
        
        if (!stats.error) {
            displayStatistics(stats);
            document.getElementById('trainBtn').disabled = false;
            loadChartData();
            loadAnalysis(); // Load analysis charts
        } else {
            document.getElementById('statistics').innerHTML = '<span class="error">Error loading data</span>';
        }
    } catch (error) {
        document.getElementById('statistics').innerHTML = '<span class="error">Error: ' + error.message + '</span>';
    }
});


// New chart instances
let weekdayWeekendChart = null;
let hourlyCongestionChart = null;
let dailyCongestionChart = null;
let flowComparisonChart = null;

// Load analysis data
async function loadAnalysis() {
    try {
        const response = await fetch('/api/analysis');
        const data = await response.json();
        
        if (!data.error) {
            displayWeekdayWeekendChart(data.weekday_vs_weekend);
            displayHourlyCongestionChart(data.hourly_congestion);
            displayDailyCongestionChart(data.daily_congestion);
            displayPeakHours(data.peak_hours);
            displayFlowComparisonChart(data.weekday_hourly_flow, data.weekend_hourly_flow);
        }
    } catch (error) {
        console.error('Error loading analysis:', error);
    }
}

// Weekday vs Weekend bar chart
function displayWeekdayWeekendChart(data) {
    const ctx = document.getElementById('weekdayWeekendChart').getContext('2d');
    
    if (weekdayWeekendChart) weekdayWeekendChart.destroy();
    
    weekdayWeekendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Avg Flow', 'Avg Speed', 'Avg Occupancy', 'Traffic Index'],
            datasets: [
                {
                    label: 'Weekday',
                    data: [
                        data.weekday.avg_flow,
                        data.weekday.avg_speed,
                        data.weekday.avg_occ,
                        data.weekday.avg_traffic_index
                    ],
                    backgroundColor: 'rgba(99, 102, 241, 0.7)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Weekend',
                    data: [
                        data.weekend.avg_flow,
                        data.weekend.avg_speed,
                        data.weekend.avg_occ,
                        data.weekend.avg_traffic_index
                    ],
                    backgroundColor: 'rgba(236, 72, 153, 0.7)',
                    borderColor: 'rgba(236, 72, 153, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

// Hourly congestion chart
function displayHourlyCongestionChart(data) {
    const ctx = document.getElementById('hourlyCongestionChart').getContext('2d');
    
    if (hourlyCongestionChart) hourlyCongestionChart.destroy();
    
    const hours = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const values = hours.map(h => data[h]);
    
    // Color based on congestion level
    const colors = values.map(v => {
        if (v <= 33) return 'rgba(16, 185, 129, 0.7)';
        if (v <= 66) return 'rgba(245, 158, 11, 0.7)';
        return 'rgba(239, 68, 68, 0.7)';
    });
    
    hourlyCongestionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: hours.map(h => `${h}:00`),
            datasets: [{
                label: 'Traffic Index',
                data: values,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8', maxRotation: 45 }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, max: 100 }
            }
        }
    });
}

// Daily congestion chart
function displayDailyCongestionChart(data) {
    const ctx = document.getElementById('dailyCongestionChart').getContext('2d');
    
    if (dailyCongestionChart) dailyCongestionChart.destroy();
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const values = days.map(d => data[d] || 0);
    
    const colors = values.map(v => {
        if (v <= 33) return 'rgba(16, 185, 129, 0.7)';
        if (v <= 66) return 'rgba(245, 158, 11, 0.7)';
        return 'rgba(239, 68, 68, 0.7)';
    });
    
    dailyCongestionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: days,
            datasets: [{
                label: 'Traffic Index',
                data: values,
                backgroundColor: colors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' }, max: 100 }
            }
        }
    });
}

// Peak hours display
function displayPeakHours(peaks) {
    const container = document.getElementById('peakHours');
    let html = '<div class="peak-hours-list">';
    
    peaks.forEach((p, i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '📍';
        html += `
            <div class="peak-item">
                <span class="peak-medal">${medal}</span>
                <span class="peak-time">${p.hour}:00</span>
                <span class="peak-index" style="color: ${p.index > 66 ? '#f87171' : p.index > 33 ? '#fbbf24' : '#34d399'}">
                    Index: ${p.index}
                </span>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Flow comparison chart (weekday vs weekend by hour)
function displayFlowComparisonChart(weekdayFlow, weekendFlow) {
    const ctx = document.getElementById('flowComparisonChart').getContext('2d');
    
    if (flowComparisonChart) flowComparisonChart.destroy();
    
    const hours = Array.from({length: 24}, (_, i) => i);
    
    flowComparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours.map(h => `${h}:00`),
            datasets: [
                {
                    label: 'Weekday',
                    data: hours.map(h => weekdayFlow[h] || 0),
                    borderColor: 'rgba(99, 102, 241, 1)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Weekend',
                    data: hours.map(h => weekendFlow[h] || 0),
                    borderColor: 'rgba(236, 72, 153, 1)',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#94a3b8' } }
            },
            scales: {
                x: { ticks: { color: '#94a3b8', maxRotation: 45 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

// Update auto-load to include analysis - already handled above
