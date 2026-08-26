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

window.Alpine = Alpine;
Alpine.start();
