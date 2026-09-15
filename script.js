const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================
// Navbar background + scroll progress bar
// =========================================
const navbar = document.getElementById('navbar');
const backToTopBtn = document.querySelector('.back-to-top');
const scrollProgress = document.getElementById('scroll-progress');

function onScrollChrome() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (backToTopBtn) {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    }

    if (scrollProgress) {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }
}

window.addEventListener('scroll', onScrollChrome, { passive: true });
onScrollChrome();

// =========================================
// Mobile Menu Toggle
// =========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
            }
        });
    });
}

// =========================================
// Smooth Scrolling for same-page anchors
// =========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');

        // Bare "#" (back-to-top) scrolls to the top of the page
        if (targetId === '#') {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: prefersReducedMotion ? 'auto' : 'smooth'
            });
        }
    });
});

// =========================================
// Global scroll reveal — sections slide up into view
// =========================================

// Auto-tag the standard section blocks so every page gets the interaction
// without hand-marking each element.
const AUTO_REVEAL_SELECTOR = [
    '.section-header',
    '.about-content',
    '.about-stats',
    '.news-rail',
    '.city-wrapper',
    '.research-grid',
    '.projects-wrapper',
    '.skills-grid',
    '.publications-list',
    '.awards-grid',
    '.leadership-grid',
    '.gallery-grid',
    '.logo-strip',
    '.collab-cards',
    '.edu-grid',
    '.certifications',
    '.tabs-container',
    '.research-block',
    '.contact-wrapper'
].join(', ');

document.querySelectorAll(AUTO_REVEAL_SELECTOR).forEach(el => el.classList.add('reveal'));

// Grid-style containers stagger their children as they enter.
document.querySelectorAll('.research-grid, .projects-grid, .skills-grid, .awards-grid, .leadership-grid, .gallery-grid, .news-rail')
    .forEach(grid => {
        grid.classList.add('reveal-stagger');
        Array.from(grid.children).forEach((child, i) => {
            child.style.transitionDelay = Math.min(i * 60, 480) + 'ms';
        });
    });

const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('active'));
} else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    // threshold 0: tall blocks (e.g. long publication lists) never reach a
    // fixed visible ratio on first paint, so reveal as soon as any part enters.
    }, { threshold: 0, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(el => revealObserver.observe(el));
}

// =========================================
// Tabs — switching + sliding underline indicator
// =========================================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const tabIndicator = document.querySelector('.tab-indicator');

function positionTabIndicator(btn) {
    if (!tabIndicator || !btn) return;
    const headerRect = btn.parentElement.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    tabIndicator.style.left = (btnRect.left - headerRect.left) + 'px';
    tabIndicator.style.width = btnRect.width + 'px';
}

if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
            positionTabIndicator(btn);
        });
    });

    positionTabIndicator(document.querySelector('.tab-btn.active'));
    window.addEventListener('resize', () => {
        positionTabIndicator(document.querySelector('.tab-btn.active'));
    });
}

// =========================================
// Stat counters — count up on first reveal
// =========================================
const statItems = document.querySelectorAll('.stat-item h3');

function animateCounter(el) {
    const raw = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2];

    if (prefersReducedMotion) {
        el.textContent = target + suffix;
        return;
    }

    const duration = 1200;
    const start = performance.now ? performance.now() : Date.now();

    function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target + suffix;
        }
    }

    requestAnimationFrame(tick);
}

if (statItems.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    statItems.forEach(el => counterObserver.observe(el));
}

// =========================================
// Cursor-tracked glow on project and news cards
// =========================================
document.querySelectorAll('.project-card, .news-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--x', x + '%');
        card.style.setProperty('--y', y + '%');
    });
});

// =========================================
// Hero video — pause when offscreen or tab hidden
// =========================================
(function manageHeroVideo() {
    const video = document.querySelector('.hero-video');
    if (!video) return;

    if (prefersReducedMotion) {
        video.pause();
        video.removeAttribute('autoplay');
        return;
    }

    // Some browsers reject autoplay until the element is explicitly played.
    const tryPlay = () => {
        const attempt = video.play();
        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(() => { /* poster image remains visible */ });
        }
    };
    tryPlay();

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            video.pause();
        } else {
            tryPlay();
        }
    });

    if ('IntersectionObserver' in window) {
        const heroObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tryPlay();
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.05 });

        heroObserver.observe(video);
    }
})();

// =========================================
// Email links — copy the address as a fallback
// mailto: silently does nothing when no mail client is registered,
// so every email link also copies the address and confirms it.
// =========================================
(function () {
    const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
    if (!mailLinks.length) return;

    let toast;
    let toastTimer;

    function showToast(message) {
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'copy-toast';
            toast.setAttribute('role', 'status');
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('is-visible');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
    }

    function copy(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        }
        // Fallback for file:// and older browsers
        const field = document.createElement('textarea');
        field.value = text;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        try {
            document.execCommand('copy');
        } finally {
            document.body.removeChild(field);
        }
        return Promise.resolve();
    }

    mailLinks.forEach(link => {
        const address = link.getAttribute('href').replace(/^mailto:/, '').split('?')[0];
        if (!link.title) link.title = address;

        link.addEventListener('click', function () {
            copy(address)
                .then(() => showToast(address + ' copied to clipboard'))
                .catch(() => showToast(address));
        });
    });
})();

// =========================================
// News & Updates — show only the top entries by default,
// reveal the rest with a toggle button.
// =========================================
(function () {
    const toggle = document.getElementById('newsToggle');
    const more = document.getElementById('newsMore');
    if (!toggle || !more) return;

    const showLabel = 'Show earlier updates';
    const hideLabel = 'Show fewer updates';
    const label = toggle.querySelector('.news-toggle-label');

    toggle.addEventListener('click', function () {
        const isHidden = more.hasAttribute('hidden');
        if (isHidden) {
            more.removeAttribute('hidden');
            toggle.setAttribute('aria-expanded', 'true');
            if (label) label.textContent = hideLabel;
        } else {
            more.setAttribute('hidden', '');
            toggle.setAttribute('aria-expanded', 'false');
            if (label) label.textContent = showLabel;
            toggle.scrollIntoView({ block: 'nearest', behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });
})();
