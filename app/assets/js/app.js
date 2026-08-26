import '../css/app.css';
import Alpine from 'alpinejs';

/**
 * Write to the clipboard, falling back to a hidden field where the async clipboard API is
 * unavailable or blocked (http, older Safari). Same helper the marketing site uses.
 */
async function writeClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
    } catch (e) {
        const field = document.createElement('textarea');
        field.value = text;
        document.body.appendChild(field);
        field.select();
        document.execCommand('copy');
        document.body.removeChild(field);
    }
}

/**
 * Copy-to-clipboard for a code window. Copies the window's own <pre> text so the sample is never
 * duplicated into an attribute; a window may set data-copy to override what gets copied.
 */
Alpine.data('copyCode', () => ({
    copied: false,

    async copy() {
        const win = this.$el.closest('.code-window');
        const pre = win.querySelector('pre');

        await writeClipboard(win.dataset.copy ?? (pre ? pre.textContent : ''));
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 1800);
    },
}));

/**
 * Marks the on-this-page rail entry for whichever section is currently on screen. Watches the
 * headings the view builder gave anchors to, and keeps the topmost visible one lit.
 */
Alpine.data('reading', () => ({
    init() {
        const links = new Map();

        this.$el.querySelectorAll('.rail-link').forEach((link) => {
            const target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
            if (target) {
                links.set(target, link);
            }
        });

        if (!links.size || !('IntersectionObserver' in window)) {
            return;
        }

        const seen = new Set();

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    seen.add(entry.target);
                } else {
                    seen.delete(entry.target);
                }
            });

            const ordered = [...links.keys()].filter((target) => seen.has(target));
            const current = ordered[0] ?? null;

            links.forEach((link, target) => {
                link.classList.toggle('rail-link-active', target === current);
            });
        }, { rootMargin: '-80px 0px -70% 0px' });

        links.forEach((link, target) => observer.observe(target));
    },
}));

/**
 * Shell state shared by the header, the drawer and the search overlay, so a button in one does
 * not need a reference to the other.
 */
Alpine.store('docs', {
    dark: false,
    nav: false,
    search: false,

    init() {
        try {
            this.dark = localStorage.getItem('pop-theme') === 'dark';
        } catch (e) {
            this.dark = document.documentElement.classList.contains('dark');
        }
    },

    toggleTheme() {
        this.dark = !this.dark;
        document.documentElement.classList.toggle('dark', this.dark);
        try {
            localStorage.setItem('pop-theme', this.dark ? 'dark' : 'light');
        } catch (e) {}
    },

    toggleNav() {
        this.nav = !this.nav;
        document.body.classList.toggle('overflow-hidden', this.nav);
    },

    closeNav() {
        this.nav = false;
        document.body.classList.remove('overflow-hidden');
    },

    openSearch() {
        this.search = true;
        this.closeNav();
        document.body.classList.add('overflow-hidden');
    },

    closeSearch() {
        this.search = false;
        document.body.classList.remove('overflow-hidden');
    },
});

/**
 * Search over the generated index. The index is fetched once, on first open, so a visitor who
 * never searches never downloads it.
 */
Alpine.data('docsSearch', () => ({
    query: '',
    cursor: 0,
    pages: [],
    loading: false,
    loaded: false,

    init() {
        this.$watch('$store.docs.search', (open) => {
            if (!open) {
                return;
            }
            this.load();
            this.$nextTick(() => this.$refs.field.focus());
        });

        this.$watch('query', () => { this.cursor = 0; });

        window.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                Alpine.store('docs').openSearch();
            }
        });
    },

    async load() {
        if (this.loaded || this.loading) {
            return;
        }
        this.loading = true;
        try {
            const response = await fetch('/search-index.json');
            this.pages = await response.json();
            this.loaded = true;
        } catch (e) {
            this.pages = [];
        }
        this.loading = false;
    },

    /**
     * Page title, then summary, then heading text. A heading match links straight to its anchor,
     * which is the difference between "this page mentions it" and "here it is".
     */
    get flat() {
        const q = this.query.trim().toLowerCase();
        const hits = [];

        this.pages.forEach((page) => {
            const inTitle = page.title.toLowerCase().includes(q);
            const inBlurb = (page.summary || '').toLowerCase().includes(q);

            if (q === '' || inTitle || inBlurb) {
                hits.push({
                    key: page.slug,
                    section: page.section,
                    title: page.title,
                    summary: page.summary,
                    href: page.slug,
                    rank: inTitle || q === '' ? 0 : 1,
                });
                return;
            }

            (page.headings || []).forEach((heading) => {
                if (heading.text.toLowerCase().includes(q)) {
                    hits.push({
                        key: page.slug + '#' + heading.id,
                        section: page.section,
                        title: heading.text,
                        summary: page.title,
                        href: page.slug + '#' + heading.id,
                        rank: 2,
                    });
                }
            });
        });

        return hits
            .sort((a, b) => a.rank - b.rank)
            .slice(0, 40)
            .map((hit, index) => ({ ...hit, index }));
    },

    get groups() {
        const order = [];
        const bucket = {};

        this.flat.forEach((hit) => {
            if (!bucket[hit.section]) {
                bucket[hit.section] = [];
                order.push(hit.section);
            }
            bucket[hit.section].push(hit);
        });

        return order.map((section) => ({ section, hits: bucket[section] }));
    },

    move(step) {
        const total = this.flat.length;
        if (!total) {
            return;
        }
        this.cursor = (this.cursor + step + total) % total;
        this.$nextTick(() => {
            const active = this.$refs.results.querySelector('.hit-active');
            if (active) {
                active.scrollIntoView({ block: 'nearest' });
            }
        });
    },

    open() {
        const hit = this.flat[this.cursor];
        if (hit) {
            window.location.href = hit.href;
        }
    },
}));

window.Alpine = Alpine;
Alpine.start();
