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
    const isSelected = clickedTab.getAttribute('aria-selected') === 'true';

    clickedTab.setAttribute('aria-selected', !isSelected);
    clickedTab.setAttribute('aria-expanded', !isSelected);
}

import nextID from 'makeup-next-id';
import * as RovingTabindex from 'makeup-roving-tabindex';
import * as scrollKeyPreventer from 'makeup-prevent-scroll-keys';
import * as keyEmitter from 'makeup-key-emitter';

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;
        const tabs = document.querySelectorAll('.accordion-legacy__tab');
        const panels = document.querySelectorAll('.accordion-legacy__panel');

        // ensure the widget has an ID
        nextID(widgetEl, 'accordion-legacy');

        // add appropriate ARIA roles
        widgetEl.setAttribute('role', 'tablist');

        tabs.forEach(function(el) {
            el.setAttribute('role', 'tab');
            el.setAttribute('aria-selected', 'false');
        });

        panels.forEach(function(el) {
            el.setAttribute('role', 'tabpanel');
            el.setAttribute('aria-hidden', 'true');
        });

        // all panels are labelled and controlled by their respective tab
        tabs.forEach(function(el, idx) {
            const tabId = `${widgetEl.id }-tab-${ idx}`;
            const panelId = `${widgetEl.id }-panel-${ idx}`;
            const panelEl = panels[idx];

            el.id = tabId;
            el.setAttribute('aria-controls', panelId);

            panelEl.id = panelId;
            panelEl.setAttribute('aria-labelledby', tabId);
        });

        // create a roving tab index on headings
        RovingTabindex.createLinear(widgetEl, '.accordion-legacy__tab');

        // listen for common keyboard commands
        keyEmitter.addKeyDown(widgetEl);

        // call plugin to prevent page scroll
        scrollKeyPreventer.add(widgetEl);

        // add mouse and keyboard listeners
        widgetEl.addEventListener('click', onMouseToggle);
        widgetEl.addEventListener('spacebarKeyDown', onKeyboardToggle);
        widgetEl.addEventListener('enterKeyDown', onKeyboardToggle);

        // mark widget as initialised
        widgetEl.classList.add('accordion-legacy--js');
    }

    destroy() {
        this._el.removeEventListener('click', onMouseToggle);
        this._el.removeEventListener('spacebarKeyDown', onKeyboardToggle);
        this._el.removeEventListener('enterKeyDown', onKeyboardToggle);
    }
}
