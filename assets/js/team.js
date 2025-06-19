
// Navigation entre les pages
function showHome() {
    // Masquer toutes les pages membres
    const memberPages = document.querySelectorAll('.member-page');
    memberPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Afficher la page d'accueil
    document.getElementById('home-page').style.display = 'block';
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mettre à jour l'URL sans recharger la page
    history.pushState(null, null, '#home');
}

function showMemberPage(memberId) {
    // Masquer la page d'accueil
    document.getElementById('home-page').style.display = 'none';
    
    // Masquer toutes les pages membres
    const memberPages = document.querySelectorAll('.member-page');
    memberPages.forEach(page => {
        page.style.display = 'none';
    });
    
    // Afficher la page du membre sélectionné
    const memberPage = document.getElementById(memberId + '-page');
    if (memberPage) {
        memberPage.style.display = 'block';
    }
    
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Mettre à jour l'URL sans recharger la page
    history.pushState(null, null, '#' + memberId);
}

// Gestion de l'historique du navigateur
window.addEventListener('popstate', function(event) {
    const hash = window.location.hash;
    
    if (hash === '#home' || hash === '') {
        showHome();
    } else if (hash.startsWith('#member')) {
        showMemberPage(hash.substring(1));
    } else {
        showHome();
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
});

// Animation au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.member-card, .stat, .project-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('fade-in-up');
        }
    });
}

// Navigation fluide pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#home') {
            e.preventDefault();
            showHome();
        } else if (href.startsWith('#member')) {
            e.preventDefault();
            showMemberPage(href.substring(1));
        } else if (href.startsWith('#') && href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Effet parallaxe léger sur le hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Animation des compteurs de stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
            }
        };
        
        // Observer pour déclencher l'animation quand visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialiser les animations au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Gérer l'état initial en fonction de l'URL
    const hash = window.location.hash;
    
    if (hash === '' || hash === '#home') {
        showHome();
    } else if (hash.startsWith('#member')) {
        showMemberPage(hash.substring(1));
    } else {
        showHome();
        setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }
    
    animateCounters();
    animateOnScroll();
});

// Effet de typing pour les citations
function typeWriterEffect(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    
    typeWriter();
}

// Appliquer l'effet de typing aux citations quand elles deviennent visibles
const quotes = document.querySelectorAll('.member-quote');
quotes.forEach(quote => {
    const originalText = quote.textContent;
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                typeWriterEffect(quote, originalText);
                observer.unobserve(entry.target);
            }
        });
    });
    observer.observe(quote);
});

// Configurer les événements de clic pour les cartes des membres
document.querySelectorAll('.member-card').forEach(card => {
    const onclickAttr = card.getAttribute('onclick');
    if (onclickAttr) {
        const match = onclickAttr.match(/'([^']+)'/);
        if (match && match[1]) {
            const memberId = match[1];
            card.addEventListener('click', () => showMemberPage(memberId));
        }
    }
});