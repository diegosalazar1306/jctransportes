const PAGE_ORDER = { inicio: 0, acerca: 1, servicios: 2 };

function getPageId() {
    return document.body.dataset.page || 'inicio';
}

function pageIdFromPath(pathname) {
    let p = pathname.replace(/\/index\.html?$/i, '').replace(/\/$/, '');
    const segments = p.split('/').filter(Boolean);
    const last = segments[segments.length - 1] || '';
    if (last === 'servicios') return 'servicios';
    if (last === 'acerca-de') return 'acerca';
    return 'inicio';
}

function pathsEquivalent(a, b) {
    return normalizePathname(a) === normalizePathname(b);
}

function normalizePathname(pathname) {
    let p = pathname.replace(/\/index\.html?$/i, '') || '/';
    if (p !== '/' && !p.endsWith('/')) {
        if (/\/acerca-de$/i.test(p) || /\/servicios$/i.test(p)) {
            p += '/';
        } else if (pageIdFromPath(`${p}/`) === 'inicio') {
            const parts = p.split('/').filter(Boolean);
            if (parts.length === 1) p += '/';
        }
    }
    return p;
}

/** Raíz del sitio (sin /acerca-de ni /servicios) para href absolutos a partir del pathname */
function getSiteRootPath() {
    let p = window.location.pathname.replace(/\/index\.html?$/i, '');
    if (/\/acerca-de\/?$/i.test(p)) {
        p = p.replace(/\/acerca-de\/?$/i, '');
    } else if (/\/servicios\/?$/i.test(p)) {
        p = p.replace(/\/servicios\/?$/i, '');
    }
    if (!p || p === '/') return '/';
    return p.endsWith('/') ? p : `${p}/`;
}

function hrefForPage(pageId) {
    const root = getSiteRootPath();
    if (pageId === 'inicio') {
        return root === '/' ? '/' : root;
    }
    const base = root === '/' ? '' : root.replace(/\/$/, '');
    if (pageId === 'acerca') {
        return base === '' ? '/acerca-de/' : `${base}/acerca-de/`;
    }
    return base === '' ? '/servicios/' : `${base}/servicios/`;
}

/** Tras cada navegación SPA el <nav> sigue en el DOM: hay que refrescar href para que no dependan de la carpeta actual */
function updateNavbarHrefs() {
    document.querySelectorAll('.nav-link[data-nav]').forEach((a) => {
        const id = a.dataset.nav;
        if (id === 'inicio') a.setAttribute('href', hrefForPage('inicio'));
        else if (id === 'acerca') a.setAttribute('href', hrefForPage('acerca'));
        else if (id === 'servicios') a.setAttribute('href', hrefForPage('servicios'));
    });

    const logo = document.querySelector('.nav-logo');
    if (logo) logo.setAttribute('href', hrefForPage('inicio'));

    const cta = document.querySelector('.nav-cta');
    if (cta) {
        const inicio = hrefForPage('inicio');
        const path = inicio === '/' ? '/#contacto' : `${inicio.replace(/\/?$/, '')}/#contacto`;
        cta.setAttribute('href', path);
    }
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

function waitAnimationEnd(el, ms = 620) {
    return new Promise((resolve) => {
        const fallback = prefersReducedMotion() ? 0 : ms;
        const done = () => resolve();
        const t = setTimeout(done, fallback);
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

function normalizeFetchPath(pathname, search) {
    let path = pathname;
    if (/\/acerca-de$/i.test(path) && !path.endsWith('/')) path += '/';
    if (/\/servicios$/i.test(path) && !path.endsWith('/')) path += '/';
    if (path !== '/' && !path.endsWith('/') && pageIdFromPath(path) === 'inicio') {
        const segs = path.split('/').filter(Boolean);
        if (segs.length === 1) path += '/';
    }
    return path + (search || '');
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
    const pathSame = pathsEquivalent(url.pathname, window.location.pathname);
    const searchSame = url.search === window.location.search;

    if (pathSame && searchSame && url.hash) {
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

    if (pathSame && searchSame && !url.hash && destPageId === fromPageId) {
        return;
    }

    const main = document.getElementById('page-transition');
    if (!main) {
        window.location.href = urlString;
        return;
    }

    isNavigating = true;
    document.documentElement.classList.add('is-page-transitioning');
    document.body.classList.add('is-page-transitioning');

    const forward = PAGE_ORDER[destPageId] > PAGE_ORDER[fromPageId];
    const fetchPath = normalizeFetchPath(url.pathname, url.search);

    main.classList.remove('pt-exit-forward', 'pt-exit-back', 'pt-enter-forward', 'pt-enter-back');
    const exitClass = forward ? 'pt-exit-forward' : 'pt-exit-back';

    const fetchPromise = (async () => {
        const res = await fetch(fetchPath, {
            credentials: 'same-origin',
            redirect: 'follow',
            headers: { Accept: 'text/html' },
        });
        if (!res.ok) throw new Error('fetch failed');
        return res.text();
    })();

    let exitPromise = Promise.resolve();
    if (!prefersReducedMotion()) {
        main.classList.add(exitClass);
        exitPromise = waitAnimationEnd(main, 620);
    }

    let html;
    try {
        [html] = await Promise.all([fetchPromise, exitPromise]);
    } catch {
        main.classList.remove('pt-exit-forward', 'pt-exit-back', 'pt-enter-forward', 'pt-enter-back');
        document.documentElement.classList.remove('is-page-transitioning');
        document.body.classList.remove('is-page-transitioning');
        isNavigating = false;
        window.location.href = url.href;
        return;
    }

    const doc = new DOMParser().parseFromString(html, 'text/html');
    const newMain = doc.getElementById('page-transition');
    if (!newMain) {
        main.classList.remove('pt-exit-forward', 'pt-exit-back', 'pt-enter-forward', 'pt-enter-back');
        document.documentElement.classList.remove('is-page-transitioning');
        document.body.classList.remove('is-page-transitioning');
        isNavigating = false;
        window.location.href = url.href;
        return;
    }

    const urlForBar = normalizeFetchPath(url.pathname, url.search) + (url.hash || '');

    if (!isPopState) {
        history.pushState({ page: destPageId }, '', urlForBar);
    }

    document.body.dataset.page = destPageId;
    if (doc.title) document.title = doc.title;

    main.innerHTML = newMain.innerHTML;
    main.classList.remove('pt-exit-forward', 'pt-exit-back');

    if (!prefersReducedMotion()) {
        void main.offsetWidth;
        main.classList.add(forward ? 'pt-enter-forward' : 'pt-enter-back');
    }

    updateNavActive(destPageId);
    updateNavbarHrefs();
    setupScrollAnimations();
    window.scrollTo(0, 0);

    if (!prefersReducedMotion()) {
        await waitAnimationEnd(main, 620);
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

    document.documentElement.classList.remove('is-page-transitioning');
    document.body.classList.remove('is-page-transitioning');
    isNavigating = false;
    closeNavMenu();
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

    if (a.target && a.target !== '_self') return;

    const destPageId = pageIdFromPath(url.pathname);
    const fromPageId = getPageId();
    const pathSame = pathsEquivalent(url.pathname, window.location.pathname);
    const searchSame = url.search === window.location.search;

    if (pathSame && searchSame && url.hash) {
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

    if (pathSame && searchSame && !url.hash && destPageId === fromPageId) {
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
updateNavbarHrefs();
