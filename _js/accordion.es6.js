/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

function onMouseToggle(e) {
    toggle(e.target);
}

function onKeyboardToggle(e) {
    toggle(e.detail.target);
}

function toggle(selectedTab) {
    var isSelected = selectedTab.getAttribute('aria-selected') === 'true';

    selectedTab.setAttribute('aria-selected', !isSelected);
    selectedTab.getAttribute('aria-expanded', !isSelected);
}

const NextID = require('makeup-next-id');
const RovingTabindex = require('makeup-roving-tabindex');
const scrollKeyPreventer = require('makeup-prevent-scroll-keys');
const keyEmitter = require('makeup-key-emitter');

module.exports = class {
    constructor(widgetEl) {
        this._el = widgetEl;
        const items = nodeListToArray(widgetEl.querySelectorAll('.accordion__item'));
        const tabs = nodeListToArray(widgetEl.querySelectorAll('.accordion__tab'));
        const panels = nodeListToArray(widgetEl.querySelectorAll('.accordion__panel'));

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
