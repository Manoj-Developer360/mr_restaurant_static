/**
 * MR Restaurant — main.js
 */

document.addEventListener('DOMContentLoaded', function () {

    /* ─── JS ACTIVE FLAG ─────────────────────────── */
    document.body.classList.add('js-ready');

    /* ─── DOM refs ───────────────────────────────── */
    var header     = document.getElementById('header');
    var hamburger  = document.getElementById('hamburger');
    var navLinks   = document.getElementById('navLinks');
    var navItems   = document.querySelectorAll('.nav-link');
    var filterBtns = document.querySelectorAll('.filter-btn');
    var foodCards  = document.querySelectorAll('.food-card');
    var form       = document.getElementById('contactForm');
    var successMsg = document.getElementById('successMsg');

    /* ─── 1. STICKY HEADER ───────────────────────── */
    function onScroll() {
        if (!header) return;
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateActiveNav();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ─── 2. HAMBURGER MENU ──────────────────────── */
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function () {
            var isOpen = hamburger.classList.toggle('open');
            navLinks.classList.toggle('open', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        navItems.forEach(function (link) {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('click', function (e) {
            if (
                navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !hamburger.contains(e.target)
            ) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    function closeMenu() {
        if (!hamburger || !navLinks) return;
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
    }

    /* ─── 3. ACTIVE NAV ON SCROLL ────────────────── */
    var sections = document.querySelectorAll('section[id]');

    function updateActiveNav() {
        var scrollY = window.scrollY + 120;
        sections.forEach(function (section) {
            var top    = section.offsetTop;
            var height = section.offsetHeight;
            var id     = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navItems.forEach(function (link) {
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    /* ─── 4. SCROLL REVEAL ───────────────────────── */
    if ('IntersectionObserver' in window) {
        var revealObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0 });

        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            revealObserver.observe(el);
        });
    } else {
        // Fallback: just show everything if IntersectionObserver not supported
        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            el.classList.add('revealed');
        });
    }

    /* ─── 5. MENU FILTER ─────────────────────────── */
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');
            var filter = btn.getAttribute('data-filter');

            foodCards.forEach(function (card) {
                var category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                    card.classList.remove('hidden');
                } else {
                    card.style.display = 'none';
                    card.classList.add('hidden');
                }
            });
        });
    });

    /* ─── 6. COUNTER ANIMATION ───────────────────── */
    var counters = document.querySelectorAll('.stat-num[data-count]');

    function animateCounter(el) {
        var target   = parseInt(el.getAttribute('data-count'), 10);
        var duration = 1600;
        var start    = performance.now();

        function update(now) {
            var elapsed  = now - start;
            var progress = Math.min(elapsed / duration, 1);
            var eased    = 1 - (1 - progress) * (1 - progress);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(function (el) {
            counterObserver.observe(el);
        });
    } else {
        // Fallback: just set final values
        counters.forEach(function (el) {
            el.textContent = parseInt(el.getAttribute('data-count'), 10).toLocaleString();
        });
    }

    /* ─── 7. CONTACT FORM ────────────────────────── */
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name  = document.getElementById('nameInput').value.trim();
            var email = document.getElementById('emailInput').value.trim();
            var msg   = document.getElementById('msgInput').value.trim();
            if (!name || !email || !msg) return;

            var btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Sending…';

            setTimeout(function () {
                if (successMsg) {
                    successMsg.textContent = '✅ Thank you, ' + name + '! We\'ll get back to you within 24 hours.';
                    successMsg.classList.add('visible');
                }
                form.reset();
                btn.disabled = false;
                btn.textContent = 'Send Message';
                setTimeout(function () {
                    if (successMsg) successMsg.classList.remove('visible');
                }, 7000);
            }, 900);
        });
    }

    /* ─── 8. SMOOTH SCROLL ───────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

});