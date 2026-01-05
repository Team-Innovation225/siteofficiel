/* ==========================================================================
   Team Innovation - Professional Portfolio JavaScript
   ========================================================================== */

// ==========================================================================
// Lenis Smooth Scroll Initialization - Ultra Smooth Configuration
// ==========================================================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
    autoResize: true,
    wheelMultiplier: 1,
    normalizeWheel: true,
});

// RAF pour Lenis avec meilleure performance
let rafId;
function raf(time) {
    lenis.raf(time);
    rafId = requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Stop RAF when page is hidden for better performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(rafId);
    } else {
        requestAnimationFrame(raf);
    }
});

// Listen to scroll events from Lenis
lenis.on('scroll', (e) => {
    // Custom scroll handler if needed
});

// ==========================================================================
// Initialize Lucide Icons
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Add lenis class to html for better control
    document.documentElement.classList.add('lenis');
    
    lucide.createIcons();
    initializePortfolio();
});

// ==========================================================================
// Portfolio Initialization
// ==========================================================================
function initializePortfolio() {
    setupNavigation();
    setupScrollEffects();
    setupMemberCards();
    setupBackButtons();
    setupCounterAnimations();
    setupIntersectionObserver();
    setupPageTransitions();
    handleInitialRoute();
}

// ==========================================================================
// Navigation Management
// ==========================================================================
function setupNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-nav') === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            
            if (targetId.startsWith('#member')) {
                return;
            }
            
            if (targetId === '#home') {
                showHomePage();
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                lenis.scrollTo(targetSection, {
                    offset: -80,
                    duration: 1.5,
                    easing: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
                });
            }
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

// ==========================================================================
// Scroll Effects
// ==========================================================================
function setupScrollEffects() {
    // Parallax effect for gradient orbs - optimized with RAF
    const orbs = document.querySelectorAll('.gradient-orb');
    let ticking = false;
    let lastScrollY = 0;
    
    const updateParallax = () => {
        const scrolled = window.scrollY;
        
        orbs.forEach((orb, index) => {
            const speed = 0.3 + (index * 0.15);
            const yPos = -(scrolled * speed);
            orb.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    };
    
    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };
    
    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        requestTick();
    }, { passive: true });
}

// ==========================================================================
// Member Cards & Page Navigation
// ==========================================================================
function setupMemberCards() {
    const memberCards = document.querySelectorAll('.member-card');
    
    memberCards.forEach(card => {
        // Click to navigate
        card.addEventListener('click', () => {
            const memberId = card.getAttribute('data-member');
            if (memberId) {
                showMemberPage(memberId);
            }
        });
        
        // 3D tilt effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `
                translateY(-16px) 
                scale(1.02) 
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
            `;
            
            // Update gradient position based on mouse
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${xPercent}%`);
            card.style.setProperty('--mouse-y', `${yPercent}%`);
        });
        
        // Reset on mouse leave
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
        
        // Sparkle effect on hover
        card.addEventListener('mouseenter', () => {
            createSparkles(card);
        });
    });
}

// Create sparkle particles effect
function createSparkles(card) {
    const sparkleCount = 8;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 1 + 0.5;
        
        sparkle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${Math.random() > 0.5 ? '#2563eb' : '#8b5cf6'};
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            pointer-events: none;
            z-index: 10;
            animation: sparkleFloat ${duration}s ease-out ${delay}s forwards;
            opacity: 0;
        `;
        
        card.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, (duration + delay) * 1000 + 100);
    }
}

// Add sparkle animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes sparkleFloat {
        0% {
            opacity: 0;
            transform: translateY(0) scale(0);
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0;
            transform: translateY(-30px) scale(1);
        }
    }
`;
document.head.appendChild(style);

function showHomePage() {
    // Hide all member pages
    const memberPages = document.querySelectorAll('.member-page');
    memberPages.forEach(page => {
        page.classList.remove('page-active');
        page.style.display = 'none';
    });
    
    // Show home page
    const homePage = document.getElementById('home-page');
    homePage.style.display = 'block';
    setTimeout(() => {
        homePage.classList.add('page-active');
    }, 10);
    
    // Scroll to top smoothly with Lenis
    lenis.scrollTo(0, { 
        duration: 1,
        immediate: false
    });
    
    // Update URL
    window.history.pushState({ page: 'home' }, '', '#home');
    
    // Reinitialize icons for home page
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function showMemberPage(memberId) {
    // Hide home page
    const homePage = document.getElementById('home-page');
    homePage.classList.remove('page-active');
    setTimeout(() => {
        homePage.style.display = 'none';
    }, 300);
    
    // Hide all member pages
    const memberPages = document.querySelectorAll('.member-page');
    memberPages.forEach(page => {
        page.classList.remove('page-active');
        page.style.display = 'none';
    });
    
    // Show selected member page
    const memberPage = document.getElementById(`${memberId}-page`);
    if (memberPage) {
        memberPage.style.display = 'block';
        setTimeout(() => {
            memberPage.classList.add('page-active');
        }, 10);
    }
    
    // Scroll to top smoothly with Lenis
    lenis.scrollTo(0, { 
        duration: 1,
        immediate: false
    });
    
    // Update URL
    window.history.pushState({ page: memberId }, '', `#${memberId}`);
    
    // Reinitialize icons for member page
    setTimeout(() => {
        lucide.createIcons();
    }, 100);
}

function setupBackButtons() {
    const backButtons = document.querySelectorAll('.back-btn');
    
    backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            showHomePage();
        });
    });
}

// ==========================================================================
// Browser History Management
// ==========================================================================
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.page) {
        if (event.state.page === 'home') {
            showHomePage();
        } else {
            showMemberPage(event.state.page);
        }
    } else {
        handleInitialRoute();
    }
});

function handleInitialRoute() {
    const hash = window.location.hash;
    
    if (!hash || hash === '#home' || hash === '#') {
        showHomePage();
    } else if (hash.startsWith('#member')) {
        const memberId = hash.substring(1);
        showMemberPage(memberId);
    } else {
        showHomePage();
        // Scroll to section after a delay
        setTimeout(() => {
            const section = document.querySelector(hash);
            if (section) {
                lenis.scrollTo(section, {
                    offset: -80,
                    duration: 1.2
                });
            }
        }, 500);
    }
}

// ==========================================================================
// Page Transitions
// ==========================================================================
function setupPageTransitions() {
    // Add fade-in animation to elements when they become visible
    const fadeElements = document.querySelectorAll(
        '.member-card, .stat-card, .value-item, .detail-card, .achievement-card'
    );
    
    fadeElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
}

// ==========================================================================
// Intersection Observer for Scroll Animations
// ==========================================================================
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.member-card, .stat-card, .value-item, .detail-card, .achievement-card, .project-featured'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ==========================================================================
// Counter Animations
// ==========================================================================
function setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-card-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ==========================================================================
// Stat Numbers Animation (Hero Section)
// ==========================================================================
function animateStatNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const hasPlus = text.includes('+');
        const number = parseInt(text.replace('+', ''));
        
        let current = 0;
        const increment = number / 60;
        
        const updateStat = () => {
            current += increment;
            
            if (current < number) {
                stat.textContent = Math.floor(current) + (hasPlus ? '+' : '');
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = number + (hasPlus ? '+' : '');
            }
        };
        
        updateStat();
    });
}

// Trigger stat animation when hero is visible
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStatNumbers();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    heroObserver.observe(heroSection);
}

// ==========================================================================
// Smooth Anchor Links
// ==========================================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Skip if it's a member page link or handled by navigation
        if (href.startsWith('#member') || href === '#home') {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            lenis.scrollTo(target, {
                offset: -80,
                duration: 1.5,
                easing: (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
            });
        }
    });
});

// ==========================================================================
// Typing Effect for Member Quotes
// ==========================================================================
function setupTypingEffect() {
    const quotes = document.querySelectorAll('.member-quote');
    
    quotes.forEach(quote => {
        const text = quote.textContent;
        quote.textContent = '';
        quote.style.opacity = '1';
        
        let index = 0;
        
        const typeWriter = () => {
            if (index < text.length) {
                quote.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 30);
            }
        };
        
        const quoteObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    quoteObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        quoteObserver.observe(quote);
    });
}

// Initialize typing effect after a delay
setTimeout(setupTypingEffect, 1000);

// ==========================================================================
// Skill Badges Hover Effects
// ==========================================================================
document.querySelectorAll('.skill-badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// ==========================================================================
// Project Card Tilt Effect
// ==========================================================================
const projectFeatured = document.querySelector('.project-featured');

if (projectFeatured) {
    projectFeatured.addEventListener('mousemove', (e) => {
        const rect = projectFeatured.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 40;
        const rotateY = (centerX - x) / 40;
        
        projectFeatured.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    projectFeatured.addEventListener('mouseleave', () => {
        projectFeatured.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ==========================================================================
// Performance Optimization
// ==========================================================================
// Debounce function for scroll events
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

// Lazy load images
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

// ==========================================================================
// Accessibility Enhancements
// ==========================================================================
// Keyboard navigation for cards
document.querySelectorAll('.member-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// Focus management for page transitions
function manageFocus() {
    const firstFocusable = document.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

// ==========================================================================
// Console Easter Egg
// ==========================================================================
console.log(
    '%c🚀 Team Innovation',
    'font-size: 24px; font-weight: bold; color: #2563eb;'
);
console.log(
    '%cBuilding the future of tech, one project at a time.',
    'font-size: 14px; color: #475569;'
);
console.log(
    '%cInterested in collaborating? Let\'s talk!',
    'font-size: 12px; color: #8b5cf6;'
);

// ==========================================================================
// Analytics & Tracking (Placeholder)
// ==========================================================================
// Add your analytics code here
// Example: Google Analytics, Mixpanel, etc.

// ==========================================================================
// Error Handling
// ==========================================================================
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ==========================================================================
// Export functions for testing (if needed)
// ==========================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showHomePage,
        showMemberPage,
        animateCounter
    };
}