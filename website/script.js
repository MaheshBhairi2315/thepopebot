// Steam & Bean Coffee Shop - Interactive Script
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initNavigation();
    initMenuTabs();
    initSmoothScroll();
    initScrollAnimations();
    initMobileMenu();
    initCart();
    initForms();
});

// Navigation scroll effect
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add shadow and reduce padding on scroll
        if (currentScroll > 50) {
            navbar.style.boxShadow = '0 2px 20px rgba(44, 36, 32, 0.1)';
            navbar.querySelector('.nav-container').style.padding = '0.875rem 2rem';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.querySelector('.nav-container').style.padding = '1.25rem 2rem';
        }
        
        // Update active nav link
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Menu tab switching functionality
function initMenuTabs() {
    const tabs = document.querySelectorAll('.menu-tab');
    const categories = document.querySelectorAll('.menu-category');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const categoryId = tab.dataset.category;
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Show selected category with animation
            const selectedCategory = document.querySelector(`.menu-category[data-category="${categoryId}"]`);
            if (selectedCategory) {
                selectedCategory.classList.add('active');
            }
        });
    });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .about-text, .menu-item');
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
}

// Handle the animation class
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Mobile menu functionality
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuBtn) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        
        // Toggle menu visibility
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = '';
            navLinks.style.flexDirection = '';
            navLinks.style.position = '';
            navLinks.style.top = '';
            navLinks.style.left = '';
            navLinks.style.right = '';
            navLinks.style.background = '';
            navLinks.style.padding = '';
            navLinks.style.boxShadow = '';
            navLinks.style.flexDirection = '';
            navLinks.style.gap = '';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(255, 253, 248, 0.98)';
            navLinks.style.padding = '1.5rem';
            navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
            navLinks.style.gap = '1rem';
        }
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.style.display = '';
            menuBtn.classList.remove('active');
        });
    });
}

// Cart functionality
function initCart() {
    let cartCount = 0;
    const cartCountEl = document.querySelector('.cart-count');
    const cartBtn = document.querySelector('.cart-btn');
    
    // Add to cart on menu item click
    document.querySelectorAll('.menu-item').forEach(item => {
        item.style.cursor = 'pointer';
        item.title = 'Click to add to cart';
        
        item.addEventListener('click', () => {
            cartCount++;
            cartCountEl.textContent = cartCount;
            
            // Animate cart
            cartBtn.style.transform = 'scale(1.2)';
            setTimeout(() => {
                cartBtn.style.transform = 'scale(1)';
            }, 200);
            
            // Show toast notification
            showToast('Item added to cart!');
        });
    });
    
    // Cart button click
    cartBtn.addEventListener('click', () => {
        if (cartCount === 0) {
            showToast('Your cart is empty');
        } else {
            showToast(`You have ${cartCount} item(s) in your cart`);
        }
    });
}

// Toast notification
function showToast(message) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Toast styles
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        background: '#6F4E37',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        fontWeight: '500',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        transition: 'opacity 0.3s ease'
    });
    
    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Form handling
function initForms() {
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Thank you! Your message has been sent.');
            contactForm.reset();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email) {
                showToast('Welcome to the Steam & Bean family!');
                newsletterForm.reset();
            }
        });
    }
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        
        if (hero && scrolled < window.innerHeight) {
            const rate = scrolled * 0.3;
            hero.style.backgroundPosition = `center ${-rate}px`;
        }
    }
});

// Button hover sound effect (optional - requires audio file)
// Uncomment if you want to add sound
/*
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        // Play subtle hover sound
        new Audio('hover.mp3').play().catch(() => {});
    });
});
*/

// Lazy loading for images (if real images are added)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Performance: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Back to top button (optional)
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
Object.assign(backToTopBtn.style, {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: '#6F4E37',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.25rem',
    boxShadow: '0 4px 15px rgba(111, 78, 55, 0.4)',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    zIndex: '999'
});

document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', debounce(() => {
    if (window.pageYOffset > 500) {
        backToTopBtn.style.display = 'flex';
        setTimeout(() => {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
        }, 10);
    } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.transform = 'translateY(20px)';
        setTimeout(() => {
            backToTopBtn.style.display = 'none';
        }, 300);
    }
}, 100));

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Add hover effect to back to top button
backToTopBtn.addEventListener('mouseenter', () => {
    backToTopBtn.style.transform = 'scale(1.1)';
});

backToTopBtn.addEventListener('mouseleave', () => {
    backToTopBtn.style.transform = 'scale(1)';
});

// Preload critical animations
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        // Preload any heavy resources here
        console.log('Coffee shop website loaded successfully! ☕');
    });
} else {
    setTimeout(() => {
        console.log('Coffee shop website loaded successfully! ☕');
    }, 1000);
}