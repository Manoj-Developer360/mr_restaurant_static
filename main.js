/**
 * MR Restaurant — main.js
 * Handles: sticky header, mobile nav, scroll reveal,
 *          menu filter, counter animation, active nav links,
 *          contact form
 */

(function () {
    'use strict';

    /* ─── DOM refs ─────────────────────────────── */
    const header    = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');
    const navItems  = document.querySelectorAll('.nav-link');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const foodCards  = document.querySelectorAll('.food-card');
    const form       = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMsg');

    /* ─── 1. STICKY HEADER ──────────────────────── */
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 40);
        updateActiveNav();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    /* ─── 2. HAMBURGER MENU ─────────────────────── */
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        navLinks.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on nav link click
    navItems.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (
            navLinks.classList.contains('open') &&
            !navLinks.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
            closeMenu();
        }
    });

    function closeMenu() {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
    }

    /* ─── 3. ACTIVE NAV LINKS ON SCROLL ────────── */
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        const scrollY = window.scrollY + 120;

        sections.forEach(section => {
            const top    = section.offsetTop;
            const height = section.offsetHeight;
            const id     = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }

    /* ─── 4. SCROLL REVEAL ──────────────────────── */
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    /* ─── 5. STAGGERED CARD DELAYS ──────────────── */
    // Apply transition-delay to cards that have data-delay
    document.querySelectorAll('[data-delay]').forEach(card => {
        const delay = parseInt(card.getAttribute('data-delay'), 10) || 0;
        card.style.transitionDelay = `${delay}ms`;
    });

    /* ─── 6. MENU FILTER ────────────────────────── */
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            foodCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const show = filter === 'all' || category === filter;

                if (show) {
                    card.classList.remove('hidden');
                    // Re-trigger hover lift by forcing a reflow
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(16px)';
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        });
                    });
                } else {
                    card.classList.add('hidden');
                    // Reset inline styles when hiding
                    card.style.opacity = '';
                    card.style.transform = '';
                    card.style.transition = '';
                }
            });
        });
    });

    /* ─── 7. COUNTER ANIMATION ──────────────────── */
    const counters = document.querySelectorAll('.stat-num[data-count]');

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));

    function animateCounter(el) {
        const target   = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1600; // ms
        const start    = performance.now();

        function update(now) {
            const elapsed  = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out quad
            const eased    = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    /* ─── 8. CONTACT FORM ───────────────────────── */
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic field validation
            const name  = form.querySelector('#nameInput').value.trim();
            const email = form.querySelector('#emailInput').value.trim();
            const msg   = form.querySelector('#msgInput').value.trim();

            if (!name || !email || !msg) return;

            // Simulate sending
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Sending…';

            setTimeout(() => {
                successMsg.textContent = '✅ Thank you, ' + name + '! Your message has been received. We\'ll get back to you within 24 hours.';
                successMsg.classList.add('visible');
                form.reset();
                btn.disabled = false;
                btn.textContent = 'Send Message';

                // Auto-hide after 7s
                setTimeout(() => successMsg.classList.remove('visible'), 7000);
            }, 900);
        });
    }

    /* ─── 9. SMOOTH ANCHOR SCROLL ───────────────── */
    // Enhances native smooth scroll for older browsers
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

})();