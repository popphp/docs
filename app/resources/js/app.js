import Alpine from 'alpinejs'
import persist from '@alpinejs/persist'
import hljs from 'highlight.js/lib/core'
import php from 'highlight.js/lib/languages/php'
import phpTemplate from 'highlight.js/lib/languages/php-template'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import bash from 'highlight.js/lib/languages/bash'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import yaml from 'highlight.js/lib/languages/yaml'
import plaintext from 'highlight.js/lib/languages/plaintext'

import { copyCode, manageVersion, setActiveNav } from './modules/main'

window.Alpine = Alpine
window.setActiveNav = setActiveNav

Alpine.plugin(persist)
Alpine.store('darkMode', {
  on: Alpine.$persist(false).as('darkMode'),

  toggle () {
    this.on = !this.on
    this.on
      ? document.querySelector('body').classList.add('dark')
      : document.querySelector('body').classList.remove('dark')
  }
})

Alpine.store('navigationOpen', false)
Alpine.data('copyCode', copyCode)
Alpine.data('manageVersion', manageVersion)
Alpine.data('setActiveNav', setActiveNav)
Alpine.start()

// set initial page state after store is initialized
if (Alpine.store('darkMode').on === true) {
  document.querySelector('body').classList.add('dark')
}

hljs.registerLanguage('php', php)
hljs.registerLanguage('php-template', phpTemplate)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('plaintext', plaintext)

hljs.highlightAll()
