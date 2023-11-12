import {toggleSidebar, copyCode, setActiveNav}  from './modules/main';
import Alpine from 'alpinejs';
import persist from '@alpinejs/persist';
import hljs from 'highlight.js/lib/core';
import php from 'highlight.js/lib/languages/php';
import phpTemplate from 'highlight.js/lib/languages/php-template';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';
import bash from 'highlight.js/lib/languages/bash';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import yaml from 'highlight.js/lib/languages/yaml';
import plaintext from 'highlight.js/lib/languages/plaintext';

// Then register the languages you need

window.Alpine        = Alpine;
window.toggleSidebar = toggleSidebar;
window.copyCode      = copyCode;
window.setActiveNav  = setActiveNav;

Alpine.plugin(persist);
Alpine.store('darkMode', {
    on: Alpine.$persist(false).as('darkMode'),

    init() {
        if (this.on) {
            document.querySelector('a.dark-icon > svg:first-child').style.display = 'none';
            document.querySelector('a.dark-icon > svg:last-child').style.display = 'block';
            document.querySelector('a.home').style.backgroundImage = 'url(/assets/img/pop-php-logo-white2.png)';
            Alpine.$persist({ value: true }).as('darkMode')
        } else {
            document.querySelector('a.dark-icon > svg:first-child').style.display = 'block';
            document.querySelector('a.dark-icon > svg:last-child').style.display = 'none';
            document.querySelector('a.home').style.backgroundImage = 'url(/assets/img/pop-php-logo2.png)';
            Alpine.$persist({ value: false }).as('darkMode')
        }
    },

    toggle() {
        this.on = ! this.on;
        this.init();
    }
})
Alpine.start();
Alpine.store('darkMode').init();

hljs.registerLanguage('php', php);
hljs.registerLanguage('php-template', phpTemplate);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('plaintext', plaintext);

hljs.highlightAll();
