// EVALOOP Results Page JavaScript

let modelsData = [];
let temperatureData = [];
let charts = {};

document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer first, then initialize results page
    EVALOOP.initPageLayout().then(() => {
        loadData();
        initializeNavigation();
        initializeFilters();
    }).catch(error => {
        console.error('Error loading page layout:', error);
        // Continue with results page initialization even if header/footer fail
        loadData();
        initializeNavigation();
        initializeFilters();
    });
});

// Load data
async function loadData() {
    const possiblePaths = [
        'assets/data/results.json',
        './assets/data/results.json',
        '/assets/data/results.json'
    ];
    
    const tempPaths = [
        'assets/data/temperature_comp.json',
        './assets/data/temperature_comp.json',
        '/assets/data/temperature_comp.json'
    ];
    
    let dataLoaded = false;
    let tempDataLoaded = false;
    
    // Load models data
    for (const path of possiblePaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const data = await response.json();
                modelsData = data.models;
                dataLoaded = true;
                console.log(`Successfully loaded ${modelsData.length} models from ${path}`);
                break;
            }
        } catch (error) {
            console.log(`Failed to load from ${path}:`, error.message);
        }
    }
    
    // Load temperature data
    for (const path of tempPaths) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                temperatureData = await response.json();
                tempDataLoaded = true;
                console.log(`Successfully loaded ${temperatureData.length} temperature tasks from ${path}`);
                break;
            }
        } catch (error) {
            console.log(`Failed to load temperature data from ${path}:`, error.message);
        }
    }
    
    if (!dataLoaded) {
        console.warn('Could not load data from any path, using embedded fallback data');
        loadEmbeddedData();
        return;
    }
    
    if (!tempDataLoaded) {
        console.warn('Could not load temperature data, temperature chart will not be available');
    }
    
    // Update overview stats
    updateOverviewStats();
    
    // Update key findings
    updateKeyFindings();
    
    // Update statistics table
    updateStatisticsTable();
    
    // Initialize all visualizations
    initializeCharts();
    populateHeatmap();
}

// Fallback embedded data
function loadEmbeddedData() {
    modelsData = [
        {
            "rank": 1,
            "name": "o3-mini",
            "organization": "OpenAI",
            "aslScore": 7.457,
            "successRate": 85.2,
            "avgTime": 1.15,
            "robustnessScore": 88.5,
            "testDate": "2024-05-15",
            "trend": "up",
            "details": {
                "totalTests": 1265,
                "passed": 1197,
                "failed": 68,
                "categories": {
                    "algorithms": 95.2,
                    "dataStructures": 93.8,
                    "systemDesign": 88.4,
                    "debugging": 91.7
                }
            }
        },
        {
            "rank": 2,
            "name": "Qwen2.5-Coder-32B",
            "organization": "Alibaba",
            "aslScore": 7.385,
            "successRate": 91.2,
            "avgTime": 1.18,
            "robustnessScore": 87.3,
            "testDate": "2024-01-15",
            "trend": "up",
            "details": {
                "totalTests": 1265,
                "passed": 1154,
                "failed": 111,
                "categories": {
                    "algorithms": 92.1,
                    "dataStructures": 90.5,
                    "systemDesign": 86.9,
                    "debugging": 89.3
                }
            }
        },
        {
            "rank": 3,
            "name": "Gemini-Ultra",
            "organization": "Google",
            "aslScore": 87.4,
            "successRate": 89.8,
            "avgTime": 1.35,
            "robustnessScore": 85.1,
            "testDate": "2024-01-15",
            "trend": "stable",
            "details": {
                "totalTests": 1265,
                "passed": 1136,
                "failed": 129,
                "categories": {
                    "algorithms": 90.3,
                    "dataStructures": 88.7,
                    "systemDesign": 84.2,
                    "debugging": 87.6
                }
            }
        },
        {
            "rank": 4,
            "name": "GPT-4",
            "organization": "OpenAI",
            "aslScore": 85.2,
            "successRate": 87.5,
            "avgTime": 1.45,
            "robustnessScore": 83.8,
            "testDate": "2024-01-15",
            "trend": "down",
            "details": {
                "totalTests": 1265,
                "passed": 1107,
                "failed": 158,
                "categories": {
                    "algorithms": 88.4,
                    "dataStructures": 86.9,
                    "systemDesign": 82.7,
                    "debugging": 85.3
                }
            }
        },
        {
            "rank": 5,
            "name": "Claude-3-Sonnet",
            "organization": "Anthropic",
            "aslScore": 82.9,
            "successRate": 85.3,
            "avgTime": 1.08,
            "robustnessScore": 81.2,
            "testDate": "2024-01-15",
            "trend": "up",
            "details": {
                "totalTests": 1265,
                "passed": 1079,
                "failed": 186,
                "categories": {
                    "algorithms": 85.7,
                    "dataStructures": 84.2,
                    "systemDesign": 80.1,
                    "debugging": 83.4
                }
            }
        },
        {
            "rank": 6,
            "name": "Gemini-Pro",
            "organization": "Google",
            "aslScore": 79.6,
            "successRate": 82.1,
            "avgTime": 1.12,
            "robustnessScore": 78.3,
            "testDate": "2024-01-15",
            "trend": "stable"
        },
        {
            "rank": 7,
            "name": "Llama-3-70B",
            "organization": "Meta",
            "aslScore": 76.8,
            "successRate": 79.4,
            "avgTime": 1.67,
            "robustnessScore": 75.2,
            "testDate": "2024-01-15",
            "trend": "up"
        },
        {
            "rank": 8,
            "name": "Mixtral-8x7B",
            "organization": "Mistral AI",
            "aslScore": 73.2,
            "successRate": 76.8,
            "avgTime": 1.54,
            "robustnessScore": 71.9,
            "testDate": "2024-01-15",
            "trend": "up"
        },
        {
            "rank": 9,
            "name": "GPT-3.5-Turbo",
            "organization": "OpenAI",
            "aslScore": 68.4,
            "successRate": 71.2,
            "avgTime": 0.98,
            "robustnessScore": 67.1,
            "testDate": "2024-01-15",
            "trend": "stable"
        },
        {
            "rank": 10,
            "name": "CodeLlama-34B",
            "organization": "Meta",
            "aslScore": 65.7,
            "successRate": 68.9,
            "avgTime": 1.43,
            "robustnessScore": 64.3,
            "testDate": "2024-01-15",
            "trend": "down"
        }
    ];
    
    
    // Update overview stats
    updateOverviewStats();
    
    // Update key findings
    updateKeyFindings();
    
    // Update statistics table
    updateStatisticsTable();
    
    // Initialize all visualizations
    initializeCharts();
    populateHeatmap();
}

// Update overview statistics
function updateOverviewStats() {
    const statBoxes = document.querySelectorAll('.stat-box');
    if (statBoxes.length > 0 && modelsData.length > 0) {
        // Calculate average ASL score
        const totalASL = modelsData.reduce((sum, model) => sum + model.aslScore, 0);
        const avgASL = totalASL / modelsData.length;
        
        statBoxes.forEach(box => {
            const textElement = box.querySelector('p.text-muted');
            if (textElement) {
                const valueElement = box.querySelector('.stat-value');
                if (valueElement) {
                    // Update Models Tested count
                    if (textElement.textContent.includes('Models Tested')) {
                        valueElement.textContent = modelsData.length;
                    }
                    // Update Average ASL
                    else if (textElement.textContent.includes('Average ASL')) {
                        valueElement.textContent = avgASL.toFixed(1);
                    }
                    // Other stats like MBPP+ Tasks, Max Loops are methodology constants
                }
            }
        });
    }
}

// Update key findings section
function updateKeyFindings() {
    if (modelsData.length === 0) return;
    
    // Find the best model (rank 1)
    const bestModel = modelsData.find(model => model.rank === 1);
    
    // Calculate performance drop range from drop field
    const drops = modelsData
        .filter(model => model.drop && !isNaN(parseFloat(model.drop)))
        .map(model => parseFloat(model.drop));
    
    const minDrop = Math.min(...drops);
    const maxDrop = Math.max(...drops);
    
    // Update the key findings list items
    const findingsList = document.querySelector('.insight-card ul');
    if (findingsList && bestModel) {
        const listItems = findingsList.querySelectorAll('li');
        
        // Update first finding - best model
        if (listItems[0]) {
            listItems[0].textContent = `${bestModel.name} achieves the highest ASL score of ${bestModel.aslScore.toFixed(3)}`;
        }
        
        // Update second finding - performance drop range
        if (listItems[1] && drops.length > 0) {
            listItems[1].textContent = `EVALOOP induces ${minDrop.toFixed(2)}%-${maxDrop.toFixed(2)}% absolute drop in pass@1 performance within 10 loops`;
        }
    }
}

// Update statistics table with calculated metrics
function updateStatisticsTable() {
    if (modelsData.length === 0) return;
    
    const tableBody = document.getElementById('statisticsTableBody');
    if (!tableBody) return;
    
    // Calculate statistics for ASL Score
    const aslScores = modelsData.map(model => model.aslScore);
    const aslStats = calculateStatistics(aslScores);
    
    // Calculate statistics for Success Rate (convert to percentage)
    const successRates = modelsData.map(model => model.successRate * 100);
    const successStats = calculateStatistics(successRates);
    
    // Calculate statistics for Performance Drop
    const performanceDrops = modelsData
        .filter(model => model.drop && !isNaN(parseFloat(model.drop)))
        .map(model => parseFloat(model.drop));
    const dropStats = calculateStatistics(performanceDrops);
    
    // Clear existing content
    tableBody.innerHTML = '';
    
    // Add ASL Score row
    const aslRow = document.createElement('tr');
    aslRow.innerHTML = `
        <td>ASL Score</td>
        <td>${aslStats.mean.toFixed(1)}</td>
        <td>${aslStats.median.toFixed(1)}</td>
        <td>${aslStats.stdDev.toFixed(1)}</td>
        <td>${aslStats.min.toFixed(1)}</td>
        <td>${aslStats.max.toFixed(1)}</td>
    `;
    tableBody.appendChild(aslRow);
    
    // Add Success Rate row
    const successRow = document.createElement('tr');
    successRow.innerHTML = `
        <td>Success Rate (%)</td>
        <td>${successStats.mean.toFixed(1)}</td>
        <td>${successStats.median.toFixed(1)}</td>
        <td>${successStats.stdDev.toFixed(1)}</td>
        <td>${successStats.min.toFixed(1)}</td>
        <td>${successStats.max.toFixed(1)}</td>
    `;
    tableBody.appendChild(successRow);
    
    // Add Performance Drop row (only if we have drop data)
    if (performanceDrops.length > 0) {
        const dropRow = document.createElement('tr');
        dropRow.innerHTML = `
            <td>Performance Drop (%)</td>
            <td>${dropStats.mean.toFixed(2)}</td>
            <td>${dropStats.median.toFixed(2)}</td>
            <td>${dropStats.stdDev.toFixed(2)}</td>
            <td>${dropStats.min.toFixed(2)}</td>
            <td>${dropStats.max.toFixed(2)}</td>
        `;
        tableBody.appendChild(dropRow);
    }
}

// Helper function to calculate statistics
function calculateStatistics(values) {
    if (values.length === 0) return { mean: 0, median: 0, stdDev: 0, min: 0, max: 0 };
    
    // Sort values for median calculation
    const sorted = [...values].sort((a, b) => a - b);
    
    // Calculate mean
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    // Calculate median
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    
    // Calculate standard deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    // Min and max
    const min = Math.min(...values);
    const max = Math.max(...values);
    
    return { mean, median, stdDev, min, max };
}

// Initialize smooth scroll navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.results-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offset = targetSection.offsetTop - 120;
                window.scrollTo({
                    top: offset,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize category filters
function initializeFilters() {
    const filterTags = document.querySelectorAll('.filter-tag');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterByCategory(category);
        });
    });
}

// Filter by category
function filterByCategory(category) {
    // Update category comparison chart based on filter
    if (charts.categoryComparison) {
        if (category === 'all') {
            charts.categoryComparison.data.datasets[0].hidden = false;
            charts.categoryComparison.data.datasets[1].hidden = false;
            charts.categoryComparison.data.datasets[2].hidden = false;
            charts.categoryComparison.data.datasets[3].hidden = false;
        } else {
            const categoryIndex = {
                'algorithms': 0,
                'datastructures': 1,
                'systemdesign': 2,
                'debugging': 3
            };
            
            charts.categoryComparison.data.datasets.forEach((dataset, index) => {
                dataset.hidden = index !== categoryIndex[category];
            });
        }
        charts.categoryComparison.update();
    }
}

// Initialize all charts
function initializeCharts() {
    // Performance Distribution Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx) {
        const scores = modelsData.map(m => m.aslScore);
        const bins = createHistogramBins(scores, 10);
        
        charts.performance = new Chart(performanceCtx, {
            type: 'bar',
            data: {
                labels: bins.labels,
                datasets: [{
                    label: 'Number of Models',
                    data: bins.counts,
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false
                    },
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'ASL Score Range'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Models'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Scatter Chart - Success Rate vs ASL
    const scatterCtx = document.getElementById('scatterChart');
    if (scatterCtx) {
        const scatterData = modelsData.map(m => ({
            x: m.successRate * 100, // Convert decimal to percentage
            y: m.aslScore,
            label: m.name
        }));
        
        charts.scatter = new Chart(scatterCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Models',
                    data: scatterData,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw.label}: ASL ${context.raw.y.toFixed(1)}, Success ${context.raw.x.toFixed(1)}%`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Success Rate (%)'
                        },
                        min: 20,
                        max: 90
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ASL Score'
                        },
                        min: 0,
                        max: 8
                    }
                }
            }
        });
    }
    
    // Temperature Analysis Chart
    const timeCtx = document.getElementById('timeChart');
    if (timeCtx && temperatureData.length > 0) {
        // Sort tasks by greedy values (like in logic.py)
        const sortedData = [...temperatureData].sort((a, b) => a.greedy - b.greedy);
        
        // Calculate averages for the lines
        const greedyAvg = temperatureData.reduce((sum, d) => sum + d.greedy, 0) / temperatureData.length;
        const tempAvg = temperatureData.reduce((sum, d) => sum + d.temperature, 0) / temperatureData.length;
        
        // Take a sample of tasks for better visibility (e.g., every 5th task or max 50 tasks)
        const sampleSize = Math.min(50, sortedData.length);
        const step = Math.max(1, Math.floor(sortedData.length / sampleSize));
        const sampledData = sortedData.filter((_, index) => index % step === 0);
        
        charts.time = new Chart(timeCtx, {
            type: 'bar',
            data: {
                labels: sampledData.map(d => d.task_id),
                datasets: [
                    {
                        label: 'Greedy',
                        data: sampledData.map(d => d.greedy),
                        backgroundColor: 'rgba(248, 161, 154, 0.7)', // Light red/pink with transparency
                        borderColor: '#F8A19A',
                        borderWidth: 0,
                        type: 'bar',
                        order: 2,
                        barPercentage: 1.0,
                        categoryPercentage: 0.8
                    },
                    {
                        label: 'Temperature',
                        data: sampledData.map(d => d.temperature),
                        backgroundColor: '#C75246', // Darker red as in logic.py
                        borderColor: '#C75246',
                        borderWidth: 0,
                        type: 'bar',
                        order: 1,
                        barPercentage: 1.0,
                        categoryPercentage: 0.8
                    },
                    {
                        label: `Greedy Avg: ${greedyAvg.toFixed(2)}`,
                        data: Array(sampledData.length).fill(greedyAvg),
                        type: 'line',
                        borderColor: '#F8A19A',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        backgroundColor: 'transparent',
                        pointRadius: 0,
                        tension: 0
                    },
                    {
                        label: `Temperature Avg: ${tempAvg.toFixed(2)}`,
                        data: Array(sampledData.length).fill(tempAvg),
                        type: 'line',
                        borderColor: '#C75246',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        backgroundColor: 'transparent',
                        pointRadius: 0,
                        tension: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                elements: {
                    bar: {
                        categoryPercentage: 0.8,
                        barPercentage: 1.0
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Tasks (Sorted by Greedy Pass Rate)'
                        },
                        ticks: {
                            display: false // Hide task IDs as they would be too crowded
                        },
                        stacked: false,
                        offset: false,
                        grid: {
                            offset: false
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Average Sustainable Loops'
                        },
                        beginAtZero: true,
                        max: 10,
                        stacked: false
                    }
                },
                plugins: [{
                    id: 'overlappingBars',
                    beforeDatasetsDraw: function(chart) {
                        // Custom plugin to force overlapping bars
                        const meta0 = chart.getDatasetMeta(0);
                        const meta1 = chart.getDatasetMeta(1);
                        
                        if (meta0 && meta1) {
                            // Force both datasets to use the same x positions
                            meta1.data.forEach((bar, index) => {
                                if (meta0.data[index]) {
                                    bar.x = meta0.data[index].x;
                                }
                            });
                        }
                    }
                }, {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                }],
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    } else if (timeCtx) {
        // Show message if temperature data is not available
        timeCtx.getContext('2d').fillText('Temperature data not available', 10, 30);
    }
    
    // Category Comparison Chart
    const categoryCtx = document.getElementById('categoryComparisonChart');
    if (categoryCtx) {
        const top5 = modelsData.slice(0, 5).filter(m => m.details);
        
        charts.categoryComparison = new Chart(categoryCtx, {
            type: 'bar',
            data: {
                labels: top5.map(m => m.name),
                datasets: [
                    {
                        label: 'Algorithms',
                        data: top5.map(m => m.details.categories.algorithms),
                        backgroundColor: 'rgba(37, 99, 235, 0.8)'
                    },
                    {
                        label: 'Data Structures',
                        data: top5.map(m => m.details.categories.dataStructures),
                        backgroundColor: 'rgba(16, 185, 129, 0.8)'
                    },
                    {
                        label: 'System Design',
                        data: top5.map(m => m.details.categories.systemDesign),
                        backgroundColor: 'rgba(245, 158, 11, 0.8)'
                    },
                    {
                        label: 'Debugging',
                        data: top5.map(m => m.details.categories.debugging),
                        backgroundColor: 'rgba(239, 68, 68, 0.8)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Score (%)'
                        }
                    }
                }
            }
        });
    }
    
    // Organization Trends Chart
    const orgCtx = document.getElementById('orgTrendsChart');
    if (orgCtx) {
        const orgData = aggregateByOrganization();
        
        charts.orgTrends = new Chart(orgCtx, {
            type: 'bar',
            data: {
                labels: orgData.map(org => org.name),
                datasets: [
                    {
                        label: 'ASL Score',
                        data: orgData.map(org => org.avgASL),
                        backgroundColor: 'rgba(37, 99, 235, 0.8)',
                        borderColor: 'rgba(37, 99, 235, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Success Rate (%)',
                        data: orgData.map(org => org.avgSuccess * 100),
                        backgroundColor: 'rgba(16, 185, 129, 0.8)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label;
                                const value = context.raw;
                                if (label === 'ASL Score') {
                                    return `${label}: ${value.toFixed(2)}`;
                                } else {
                                    return `${label}: ${value.toFixed(1)}%`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Organization'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'ASL Score'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1);
                            }
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Pass Rate (%)'
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + '%';
                            }
                        },
                        grid: {
                            drawOnChartArea: false,
                        }
                    }
                }
            }
        });
    }
    
    // Size vs Performance Chart
    const sizeCtx = document.getElementById('sizePerformanceChart');
    if (sizeCtx) {
        // Simulated size data (in production, this would come from actual data)
        const sizeData = modelsData.map(m => ({
            x: Math.random() * 150 + 10, // Simulated model size in billions
            y: m.aslScore,
            label: m.name
        }));
        
        charts.sizePerformance = new Chart(sizeCtx, {
            type: 'bubble',
            data: {
                datasets: [{
                    label: 'Models',
                    data: sizeData.map(d => ({
                        ...d,
                        r: 5 + (d.y / 10) // Bubble size based on score
                    })),
                    backgroundColor: 'rgba(139, 92, 246, 0.6)',
                    borderColor: 'rgba(139, 92, 246, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.raw.label}: ${context.raw.x.toFixed(0)}B params, ASL ${context.raw.y.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Model Size (Billion Parameters)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ASL Score'
                        },
                        min: 60,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Model Size vs ASL Chart
    const modelSizeCtx = document.getElementById('modelSizeChart');
    if (modelSizeCtx) {
        // Filter models that have size data (exclude null values)
        const modelsWithSize = modelsData.filter(m => m.size !== null && m.size !== undefined);
        
        // Convert size to number and create scatter data
        const scatterData = modelsWithSize.map(m => ({
            x: parseFloat(m.size),
            y: m.aslScore,
            label: m.name,
            organization: m.organization
        }));
        
        charts.modelSize = new Chart(modelSizeCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Models',
                    data: scatterData,
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                return `${point.label}: ${point.x}B params, ASL ${point.y.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'logarithmic',
                        title: {
                            display: true,
                            text: 'Model Size (Billion Parameters)'
                        },
                        min: 1,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + 'B';
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'ASL Score'
                        },
                        min: 0,
                        max: 8
                    }
                }
            }
        });
    }
}

// Populate heatmap table
function populateHeatmap() {
    const heatmapTable = document.getElementById('heatmapTable');
    if (!heatmapTable) return;
    
    const top10 = modelsData.slice(0, 10);
    
    top10.forEach(model => {
        const row = document.createElement('tr');
        
        // Model name cell
        const nameCell = document.createElement('td');
        nameCell.innerHTML = `<strong>${model.name}</strong>`;
        row.appendChild(nameCell);
        
        // Category scores (use details if available, otherwise generate)
        const categories = model.details ? [
            model.details.categories.algorithms,
            model.details.categories.dataStructures,
            model.details.categories.systemDesign,
            model.details.categories.debugging
        ] : [
            85 + Math.random() * 10,
            85 + Math.random() * 10,
            80 + Math.random() * 10,
            85 + Math.random() * 10
        ];
        
        categories.forEach(score => {
            const cell = document.createElement('td');
            cell.className = 'heatmap-cell';
            cell.style.backgroundColor = getHeatmapColor(score);
            cell.textContent = score.toFixed(1) + '%';
            row.appendChild(cell);
        });
        
        // Overall ASL score
        const aslCell = document.createElement('td');
        aslCell.className = 'heatmap-cell';
        aslCell.style.backgroundColor = getHeatmapColor(model.aslScore);
        aslCell.innerHTML = `<strong>${model.aslScore.toFixed(1)}</strong>`;
        row.appendChild(aslCell);
        
        heatmapTable.appendChild(row);
    });
}

// Helper function to create histogram bins
function createHistogramBins(data, numBins) {
    // Create integer-based bins (1-2, 2-3, 3-4, etc.)
    const min = Math.floor(Math.min(...data));
    const max = Math.ceil(Math.max(...data));
    
    const bins = {
        labels: [],
        counts: []
    };
    
    // Create bins from min to max with integer boundaries
    for (let i = min; i < max; i++) {
        const start = i;
        const end = i + 1;
        bins.labels.push(`${start}-${end}`);
        bins.counts.push(data.filter(d => d >= start && d < end).length);
    }
    
    return bins;
}

// Aggregate data by organization
function aggregateByOrganization() {
    const orgMap = {};
    
    modelsData.forEach(model => {
        if (!orgMap[model.organization]) {
            orgMap[model.organization] = {
                name: model.organization,
                models: []
            };
        }
        orgMap[model.organization].models.push(model);
    });
    
    return Object.values(orgMap).map(org => ({
        name: org.name,
        avgASL: org.models.reduce((sum, m) => sum + m.aslScore, 0) / org.models.length,
        avgSuccess: org.models.reduce((sum, m) => sum + m.successRate, 0) / org.models.length,
        avgTime: org.models.reduce((sum, m) => sum + m.avgTime, 0) / org.models.length,
        avgRobustness: org.models.reduce((sum, m) => sum + m.robustnessScore, 0) / org.models.length
    }));
}

// Get color for charts
function getColor(index, alpha = 1) {
    const colors = [
        `rgba(37, 99, 235, ${alpha})`,
        `rgba(16, 185, 129, ${alpha})`,
        `rgba(245, 158, 11, ${alpha})`,
        `rgba(239, 68, 68, ${alpha})`,
        `rgba(139, 92, 246, ${alpha})`
    ];
    return colors[index % colors.length];
}

// Get heatmap color based on value
function getHeatmapColor(value) {
    // Normalize value to 0-1 range (assuming 60-100 scale)
    const normalized = (value - 60) / 40;
    
    if (normalized < 0.25) {
        return 'rgba(239, 68, 68, 0.8)'; // Red
    } else if (normalized < 0.5) {
        return 'rgba(245, 158, 11, 0.8)'; // Orange
    } else if (normalized < 0.75) {
        return 'rgba(251, 191, 36, 0.8)'; // Yellow
    } else {
        return 'rgba(16, 185, 129, 0.8)'; // Green
    }
}

// Download data functions
function downloadData(type) {
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch(type) {
        case 'full':
            content = JSON.stringify({
                metadata: {
                    version: '1.0',
                    date: new Date().toISOString(),
                    models_count: modelsData.length
                },
                models: modelsData
            }, null, 2);
            filename = 'evaloop_full_dataset.json';
            mimeType = 'application/json';
            break;
            
        case 'summary':
            content = convertToCSV(modelsData.map(m => ({
                rank: m.rank,
                name: m.name,
                organization: m.organization,
                asl_score: m.aslScore,
                success_rate: m.successRate,
                avg_time: m.avgTime,
                robustness_score: m.robustnessScore
            })));
            filename = 'evaloop_summary.csv';
            mimeType = 'text/csv';
            break;
            
        case 'detailed':
            alert('Excel export would require additional library implementation');
            return;
            
        case 'plots':
            alert('Plot export would require server-side implementation');
            return;
    }
    
    // Create and trigger download
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Convert data to CSV
function convertToCSV(data) {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
        headers.map(header => {
            const value = row[header];
            return typeof value === 'string' && value.includes(',') 
                ? `"${value}"` 
                : value;
        }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
}

// Animate stats on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(value => {
                animateValue(value);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe stat boxes
document.querySelectorAll('.stat-box').forEach(box => {
    observer.observe(box);
});

// Animate value
function animateValue(element) {
    const target = parseFloat(element.textContent.replace(',', ''));
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

// Format number with commas
function formatNumber(num) {
    if (num >= 1000) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    return num.toString();
}
