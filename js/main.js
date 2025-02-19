// Smooth scrolling with offset adjustment
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top;
            const offsetPosition = targetPosition + window.pageYOffset - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add error handling
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Fix experience item hover effect
document.querySelectorAll('.experience-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        item.style.background = `
            linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
            radial-gradient(
                circle at ${x}px ${y}px,
                rgba(100, 255, 218, 0.2),
                transparent 50%
            ) border-box
        `;
    });

    // Add this mouseleave handler
    item.addEventListener('mouseleave', () => {
        item.style.background = `
            linear-gradient(var(--card-bg), var(--card-bg)) padding-box,
            linear-gradient(145deg, rgba(100, 255, 218, 0.1), transparent) border-box
        `;
    });
});

// Add section visibility animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Research Filtering
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const publicationCards = document.querySelectorAll('.publication-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const group = this.parentElement;
            group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const activeStatus = document.querySelector('.filter-group:first-child .filter-btn.active').dataset.filter;
            const activeDomain = document.querySelector('.filter-group:last-child .filter-btn.active').dataset.domain;

            // First hide/show the domain sections
            document.querySelectorAll('.research-domain').forEach(domain => {
                const domainTitle = domain.querySelector('.domain-title').textContent.toLowerCase();
                domain.style.display = (activeDomain === 'all' || domainTitle.includes(activeDomain)) ? 'block' : 'none';
            });

            // Then filter the cards within visible sections
            document.querySelectorAll('.publication-card').forEach(card => {
                const matchesStatus = activeStatus === 'all' || card.dataset.status === activeStatus;
                const matchesDomain = activeDomain === 'all' || card.dataset.domain === activeDomain;
                
                if (matchesStatus && matchesDomain) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });

            updatePublicationCount();
        });
    });
});

// Add smooth reveal animation for publication cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.publication-card').forEach(card => {
    cardObserver.observe(card);
});

// Add search functionality
const searchInput = document.getElementById('publicationSearch');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const publicationCards = document.querySelectorAll('.publication-card');

        publicationCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const role = card.querySelector('.pub-role').textContent.toLowerCase();
            const status = card.querySelector('.pub-status').textContent.toLowerCase();

            const matches = title.includes(searchTerm) || 
                          role.includes(searchTerm) || 
                          status.includes(searchTerm);

            card.style.display = matches ? 'block' : 'none';
        });
    });
}

// Add animation when filtering
function animateCards() {
    const cards = document.querySelectorAll('.publication-card[style="display: block"]');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
    });
}

// Add sorting functionality
const sortSelect = document.getElementById('publicationSort');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const cards = Array.from(document.querySelectorAll('.publication-card'));
        const sortBy = this.value;
        
        cards.sort((a, b) => {
            switch(sortBy) {
                case 'newest':
                    return getDate(b) - getDate(a);
                case 'oldest':
                    return getDate(a) - getDate(b);
                case 'title':
                    return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
                case 'status':
                    return a.dataset.status.localeCompare(b.dataset.status);
                default:
                    return 0;
            }
        });

        const container = cards[0].parentNode;
        cards.forEach(card => container.appendChild(card));
        updatePublicationCount();
        animateCards();
    });
}

// Helper function to extract date from publication
function getDate(card) {
    const statusText = card.querySelector('.pub-status').textContent;
    // Extract date from status text or use a default date
    const dateMatch = statusText.match(/\d{4}/);
    return dateMatch ? parseInt(dateMatch[0]) : 0;
}

// Update publication count
function updatePublicationCount() {
    const visibleCount = document.querySelectorAll('.publication-card[style="display: block"]').length;
    const totalCount = document.querySelectorAll('.publication-card').length;
    
    document.getElementById('visibleCount').textContent = visibleCount;
    document.getElementById('totalCount').textContent = totalCount;
}

// Call updatePublicationCount on page load
document.addEventListener('DOMContentLoaded', () => {
    updatePublicationCount();
    // Also call it after any filtering
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', updatePublicationCount);
    });
});

// Neural Network Background Animation
function initNetworkAnimation() {
    const canvas = document.getElementById('networkCanvas');
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let connections = [];

    // Set canvas size
    function setCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create nodes
    function createNodes() {
        nodes = [];
        const nodeCount = Math.floor(canvas.width * canvas.height / 50000);
        
        for(let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5
            });
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update nodes
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if(node.x < 0 || node.x > canvas.width) node.vx *= -1;
            if(node.y < 0 || node.y > canvas.height) node.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(100, 255, 218, 0.5)';
            ctx.fill();
        });

        // Draw connections
        nodes.forEach((node1, i) => {
            nodes.slice(i + 1).forEach(node2 => {
                const dx = node2.x - node1.x;
                const dy = node2.y - node1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if(distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(node1.x, node1.y);
                    ctx.lineTo(node2.x, node2.y);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${0.2 * (1 - distance/100)})`;
                    ctx.stroke();
                }
            });
        });

        requestAnimationFrame(animate);
    }

    createNodes();
    animate();
}

// Initialize network animation when DOM is loaded
document.addEventListener('DOMContentLoaded', initNetworkAnimation); 