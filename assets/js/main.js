// EVALOOP Main JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load results data first, then initialize components
    loadResultsData().then(() => {
        initCounterAnimation();
        loadTopModels();
        initSmoothScroll();
        initNavbarHighlight();
    }).catch(error => {
        console.error('Error loading results data:', error);
        // Initialize with fallback values if data loading fails
        initCounterAnimation();
        loadTopModels();
        initSmoothScroll();
        initNavbarHighlight();
    });
});

// Global variable to store results data
let resultsData = null;

// Load Results Data from JSON file
async function loadResultsData() {
    try {
        const response = await fetch('assets/data/results.json');
        if (!response.ok) {
            throw new Error('Failed to load results data');
        }
        resultsData = await response.json();
        
        // Update counter values dynamically
        updateStatsCounters();
        
        return resultsData;
    } catch (error) {
        console.error('Error loading results data:', error);
        throw error;
    }
}

// Update statistics counters with data from results.json
function updateStatsCounters() {
    if (!resultsData || !resultsData.models) {
        return;
    }
    
    const modelsCount = resultsData.models.length;
    const highestAslScore = Math.max(...resultsData.models.map(model => model.aslScore));
    
    // Find counters by their associated text labels
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const statCard = counter.closest('.stat-card');
        if (statCard) {
            const label = statCard.querySelector('p').textContent.trim();
            
            if (label === 'Models Evaluated') {
                counter.setAttribute('data-target', modelsCount);
            } else if (label === 'Highest ASL Score') {
                counter.setAttribute('data-target', highestAslScore.toFixed(3));
            }
        }
    });
}

// Counter Animation for Statistics
function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Animation speed
    
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const increment = target / speed;
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            
            if (current < target) {
                // Check if it's a decimal number
                if (target % 1 !== 0) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.ceil(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                // Set final value
                if (target % 1 !== 0) {
                    counter.textContent = target.toFixed(1);
                } else {
                    counter.textContent = target;
                }
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer to trigger animation when visible
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

// Helper function to convert rank change to trend
function getTrendFromRankChange(rankChange) {
    if (!rankChange || rankChange === "=") {
        return "stable";
    }
    
    const change = parseInt(rankChange.replace(/[^-\d]/g, ''));
    if (rankChange.startsWith('+')) {
        return "up"; // Positive rank change means moving up in the ranking
    } else if (rankChange.startsWith('-')) {
        return "down"; // Negative rank change means moving down in the ranking
    }
    
    return "stable";
}

// Load Top Models Data
function loadTopModels() {
    // Use data from results.json if available, otherwise fallback to hardcoded data
    let topModels = [];
    
    if (resultsData && resultsData.models) {
        // Get top 5 models from the loaded data
        topModels = resultsData.models.slice(0, 5).map(model => ({
            rank: model.rank,
            name: model.name,
            aslScore: model.aslScore,
            successRate: model.successRate * 100, // Convert to percentage
            trend: getTrendFromRankChange(model.rankChange)
        }));
    } else {
        // Fallback data if results.json is not loaded
        topModels = [
            {
                rank: 1,
                name: "o3-mini",
                aslScore: 7.457,
                successRate: 85.2,
                trend: "up"
            },
            {
                rank: 2,
                name: "Qwen2.5-Coder-32B",
                aslScore: 7.385,
                successRate: 82.5,
                trend: "up"
            },
            {
                rank: 3,
                name: "gpt-4.1",
                aslScore: 7.356,
                successRate: 84.1,
                trend: "stable"
            },
            {
                rank: 4,
                name: "o4-mini",
                aslScore: 7.320,
                successRate: 83.5,
                trend: "up"
            },
            {
                rank: 5,
                name: "gpt-4.1-mini",
                aslScore: 7.291,
                successRate: 82.3,
                trend: "up"
            }
        ];
    }
    
    const tableBody = document.getElementById('topModelsTable');
    
    if (tableBody) {
        tableBody.innerHTML = '';
        
        topModels.forEach((model, index) => {
            const row = createModelRow(model);
            tableBody.appendChild(row);
            
            // Add animation delay
            setTimeout(() => {
                row.classList.add('fade-in');
            }, index * 100);
        });
    }
}

// Create Model Table Row
function createModelRow(model) {
    const row = document.createElement('tr');
    row.style.opacity = '0';
    row.style.animation = 'fadeIn 0.5s ease-out forwards';
    
    // Determine rank badge class
    let rankBadgeClass = 'rank-badge';
    if (model.rank <= 3) {
        rankBadgeClass += ` rank-${model.rank}`;
    } else {
        rankBadgeClass += ' bg-light text-dark';
    }
    
    // Determine trend icon
    let trendIcon = '';
    let trendColor = '';
    switch(model.trend) {
        case 'up':
            trendIcon = 'bi-arrow-up-circle-fill';
            trendColor = 'text-success';
            break;
        case 'down':
            trendIcon = 'bi-arrow-down-circle-fill';
            trendColor = 'text-danger';
            break;
        default:
            trendIcon = 'bi-dash-circle-fill';
            trendColor = 'text-warning';
    }
    
    row.innerHTML = `
        <td class="text-center">
            <span class="${rankBadgeClass}">${model.rank}</span>
        </td>
        <td>
            <strong>${model.name}</strong>
        </td>
        <td class="text-center">
            <span class="badge bg-primary">${model.aslScore.toFixed(1)}</span>
        </td>
        <td class="text-center">
            ${model.successRate.toFixed(1)}%
        </td>
        <td class="text-center">
            <i class="bi ${trendIcon} ${trendColor}"></i>
        </td>
    `;
    
    return row;
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for navbar height
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Highlight Active Navigation Item
function initNavbarHighlight() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Utility function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Utility function to copy text to clipboard
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

// Add copy functionality for code blocks
document.addEventListener('click', function(e) {
    if (e.target.matches('.copy-btn')) {
        const codeBlock = e.target.closest('.code-block');
        if (codeBlock) {
            const code = codeBlock.querySelector('code').textContent;
            copyToClipboard(code);
            
            // Show feedback
            const originalText = e.target.innerHTML;
            e.target.innerHTML = '<i class="bi bi-check"></i> Copied!';
            e.target.classList.add('btn-success');
            
            setTimeout(() => {
                e.target.innerHTML = originalText;
                e.target.classList.remove('btn-success');
            }, 2000);
        }
    }
});

// Add loading state management
function showLoading(element) {
    element.innerHTML = `
        <div class="text-center p-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
}

function hideLoading(element) {
    element.innerHTML = '';
}

// Export functions for use in other scripts
window.EVALOOP = {
    formatNumber,
    copyToClipboard,
    showLoading,
    hideLoading
};
