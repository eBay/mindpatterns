/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onMouseToggle(e) {
    toggle(e.target);
}

function onKeyboardToggle(e) {
    toggle(e.detail.target);
}

function toggle(clickedTab) {
    var isSelected = clickedTab.getAttribute('aria-selected') === 'true';

    clickedTab.setAttribute('aria-selected', !isSelected);
    clickedTab.setAttribute('aria-expanded', !isSelected);
}

const Util = require('./util.js');
const NextID = require('makeup-next-id');
const RovingTabindex = require('makeup-roving-tabindex');
const scrollKeyPreventer = require('makeup-prevent-scroll-keys');
const keyEmitter = require('makeup-key-emitter');

module.exports = class {
    constructor(widgetEl) {
        this._el = widgetEl;
        const items = Util.querySelectorAllToArray('.accordion__item');
        const tabs = Util.querySelectorAllToArray('.accordion__tab');
        const panels = Util.querySelectorAllToArray('.accordion__panel');

        // ensure the widget has an ID
        NextID(widgetEl, 'accordion');

        // add appropriate ARIA roles
        widgetEl.setAttribute('role', 'tablist');

        tabs.forEach(function(el) {
            el.setAttribute('role', 'tab');
            el.setAttribute('aria-selected', 'false');
        });

        panels.forEach(function(el) {
            el.setAttribute('role', 'tabpanel')
            el.setAttribute('aria-hidden', 'true');
        });

        // all panels are labelled and controlled by their respective tab
        tabs.forEach(function(el, idx) {
            const tabId = widgetEl.id + '-tab-' + idx;
            const panelId = widgetEl.id + '-panel-' + idx;
            const panelEl = panels[idx];

            el.id = tabId;
            el.setAttribute('aria-controls', panelId);

            panelEl.id = panelId;
            panelEl.setAttribute('aria-labelledby', tabId);
        });

        // create a roving tab index on headings
        RovingTabindex.createLinear(widgetEl, '.accordion__tab');

        // listen for common keyboard commands
        keyEmitter.addKeyDown(widgetEl);

        // call plugin to prevent page scroll
        scrollKeyPreventer.add(widgetEl);

        // add mouse and keyboard listeners
        widgetEl.addEventListener('click', onMouseToggle);
        widgetEl.addEventListener('spacebarKeyDown', onKeyboardToggle);
        widgetEl.addEventListener('enterKeyDown', onKeyboardToggle);

        // mark widget as initialised
        widgetEl.classList.add('accordion--js');
    }

    destroy() {
        this._el.removeEventListener('click', onMouseToggle);
        this._el.removeEventListener('spacebarKeyDown', onKeyboardToggle);
        this._el.removeEventListener('enterKeyDown', onKeyboardToggle);
    }
}
