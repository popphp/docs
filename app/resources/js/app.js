import {toggleSidebar, copyCode}  from './modules/main';
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';
import hljs from 'highlight.js/lib/core';
import php from 'highlight.js/lib/languages/php';

// Then register the languages you need

window.Alpine        = Alpine;
window.toggleSidebar = toggleSidebar;
window.copyCode      = copyCode;

Alpine.plugin(persist);
Alpine.store('darkMode', {
    on: Alpine.$persist(false).as('darkMode'),

    init() {
        if (this.on) {
            document.querySelector('a.dark-icon > svg:first-child').style.display = 'none';
            document.querySelector('a.dark-icon > svg:last-child').style.display = 'block';
            document.querySelector('header').style.backgroundImage = 'url(/assets/img/pop-php-logo-white2.png)';
            Alpine.$persist({ value: true }).as('darkMode')
        } else {
            document.querySelector('a.dark-icon > svg:first-child').style.display = 'block';
            document.querySelector('a.dark-icon > svg:last-child').style.display = 'none';
            document.querySelector('header').style.backgroundImage = 'url(/assets/img/pop-php-logo2.png)';
            Alpine.$persist({ value: false }).as('darkMode')
        }
        return false;
    },

    toggle() {
        this.on = ! this.on;
        return this.init();
    }
})
Alpine.start();
Alpine.store('darkMode').init();

hljs.registerLanguage('php', php);
hljs.highlightAll();
