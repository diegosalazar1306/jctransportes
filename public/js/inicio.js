const PAGE_ORDER = { inicio: 0, acerca: 1, servicios: 2 };

function getPageId() {
    return document.body.dataset.page || 'inicio';
}

function pageIdFromPath(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    if (last === 'servicios') return 'servicios';
    if (last === 'acerca-de') return 'acerca';
    return 'inicio';
}

function updateNavActive(pageId) {
    document.querySelectorAll('.nav-link[data-nav]').forEach((link) => {
        link.classList.toggle('active', link.dataset.nav === pageId);
    });
}

function closeNavMenu() {
    document.querySelector('.nav-menu')?.classList.remove('active');
    document.querySelector('.nav-toggle')?.classList.remove('active');
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

let scrollObserver = null;

function setupScrollAnimations() {
    if (scrollObserver) scrollObserver.disconnect();

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);

    document.querySelectorAll('.service-card').forEach((card) => {
        scrollObserver.observe(card);
    });

    const contactSection = document.querySelector('.contact-section');
    if (contactSection) scrollObserver.observe(contactSection);

    document.querySelectorAll('.service-card').forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
}

function waitAnimationEnd(el) {
    return new Promise((resolve) => {
        const ms = prefersReducedMotion() ? 0 : 450;
        const done = () => resolve();
        const t = setTimeout(done, ms);
        if (prefersReducedMotion()) return;
        el.addEventListener(
            'animationend',
            () => {
                clearTimeout(t);
                done();
            },
            { once: true }
        );
    });
}

let isNavigating = false;

async function navigateToUrl(urlString, { isPopState = false } = {}) {
    if (isNavigating) return;

    let url;
    try {
        url = new URL(urlString, window.location.href);
    } catch {
        return;
    }

    if (url.origin !== window.location.origin) {
        window.location.href = urlString;
        return;
    }

    const destPageId = pageIdFromPath(url.pathname);
    const fromPageId = getPageId();
    const samePath =
        url.pathname === window.location.pathname && url.search === window.location.search;

    if (samePath && url.hash) {
        if (destPageId === fromPageId) {
            const target = document.querySelector(url.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'start',
                });
            }
            closeNavMenu();
            return;
        }
    }

    if (samePath && !url.hash && destPageId === fromPageId) {
        return;
    }

    const main = document.getElementById('page-transition');
    if (!main) {
        window.location.href = urlString;
        return;
    }

    isNavigating = true;
    document.body.classList.add('is-page-transitioning');

    const forward = PAGE_ORDER[destPageId] > PAGE_ORDER[fromPageId];

    if (!prefersReducedMotion()) {
        main.classList.remove('pt-exit-forward', 'pt-exit-back', 'pt-enter-forward', 'pt-enter-back');
        main.classList.add(forward ? 'pt-exit-forward' : 'pt-exit-back');
        await waitAnimationEnd(main);
    }

    try {
        const res = await fetch(url.pathname + url.search, {
            credentials: 'same-origin',
            redirect: 'follow',
        });
        if (!res.ok) throw new Error('fetch failed');

        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const newMain = doc.getElementById('page-transition');
        if (!newMain) {
            window.location.href = urlString;
            return;
        }

        if (!isPopState) {
            history.pushState({ page: destPageId }, '', url.pathname + url.search + url.hash);
        }

        document.body.dataset.page = destPageId;
        if (doc.title) document.title = doc.title;

        main.innerHTML = newMain.innerHTML;
        main.classList.remove('pt-exit-forward', 'pt-exit-back');

        if (!prefersReducedMotion()) {
            main.classList.add(forward ? 'pt-enter-forward' : 'pt-enter-back');
        }

        updateNavActive(destPageId);
        setupScrollAnimations();
        window.scrollTo(0, 0);

        if (!prefersReducedMotion()) {
            await waitAnimationEnd(main);
            main.classList.remove('pt-enter-forward', 'pt-enter-back');
        }

        if (url.hash) {
            requestAnimationFrame(() => {
                document.querySelector(url.hash)?.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'start',
                });
            });
        }
    } catch {
        window.location.href = urlString;
    } finally {
        document.body.classList.remove('is-page-transitioning');
        isNavigating = false;
        closeNavMenu();
    }
}

document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

    const href = a.getAttribute('href');
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let url;
    try {
        url = new URL(href, window.location.href);
    } catch {
        return;
    }

    if (url.origin !== window.location.origin) return;

    const destPageId = pageIdFromPath(url.pathname);
    const fromPageId = getPageId();
    const samePath =
        url.pathname === window.location.pathname && url.search === window.location.search;

    if (samePath && url.hash) {
        if (destPageId === fromPageId) {
            e.preventDefault();
            const target = document.querySelector(url.hash);
            if (target) {
                target.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'start',
                });
            }
            closeNavMenu();
            return;
        }
    }

    if (samePath && !url.hash && destPageId === fromPageId) {
        e.preventDefault();
        return;
    }

    e.preventDefault();
    navigateToUrl(url.href);
});

window.addEventListener('popstate', () => {
    navigateToUrl(window.location.href, { isPopState: true });
});

document.addEventListener('click', (e) => {
    const toggle = e.target.closest('.nav-toggle');
    if (!toggle) return;
    document.querySelector('.nav-menu')?.classList.toggle('active');
    toggle.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-link')) return;
    closeNavMenu();
});

setupScrollAnimations();
