/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function linkTabToPanel(widgetID, el, i) {
    el.setAttribute('id', widgetID + '-tab-' + i);
    el.setAttribute('aria-controls', widgetID + '-panel-' + i);
}

function linkPanelToTab(widgetID, el, i) {
    el.setAttribute('id', widgetID + '-panel-' + i);
    el.setAttribute('aria-labelledby', widgetID + '-tab-' + i);
}

function removeLink(el) {
    el.setAttribute('role', 'presentation')
    el.removeAttribute('href');
}

function onRovingTabindexChange(e) {
    this.tabs[e.detail.fromIndex].setAttribute('aria-selected', 'false');
    this.panels[e.detail.fromIndex].hidden = true;

    this.tabs[e.detail.toIndex].setAttribute('aria-selected', 'true');
    this.panels[e.detail.toIndex].hidden = false;

    this._el.dispatchEvent(new CustomEvent('tabsChange', {
        detail: {
            fromIndex: e.detail.fromIndex,
            toIndex: e.detail.toIndex
        }
    }));
}

const Util = require('./util.js');
const NextID = require('makeup-next-id');
const RovingTabindex = require('makeup-roving-tabindex');
const ScrollKeyPreventer = require('makeup-prevent-scroll-keys');
const KeyEmitter = require('makeup-key-emitter');

const defaultOptions = {
    initialIndex: 0
};

module.exports = class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);

        this._onRovingTabindexChangeListener = onRovingTabindexChange.bind(this);

        // cache the root element
        this._el = widgetEl;

        const tabList = this._el.querySelector('.tabs__items', this._el);
        const tabs = Util.querySelectorAllToArray('.tabs__item', this._el);
        const panels = Util.querySelectorAllToArray('.tabs__panel', this._el);
        const links = Util.querySelectorAllToArray('a', tabList);

        this.tabs = tabs;
        this.panels = panels;

        // cache the initialIndex
        let initialIndex = this._options.initialIndex;

        // sanitize the initialIndex
        if (initialIndex < 0 || initialIndex >= tabs.length) {
            initialIndex = 0;
        }

        // ensure the widget has an ID
        NextID(widgetEl, 'tabs');

        // add static roles
        tabList.setAttribute('role', 'tablist');
        tabs.forEach(el => el.setAttribute('role', 'tab'));
        panels.forEach(el => el.setAttribute('role', 'tabpanel'));

        // set the selected tab to true
        tabs[initialIndex].setAttribute('aria-selected', 'true');

        // set all unselected tabs to false
        tabs.filter((el, i) => i !== initialIndex).forEach(el => el.setAttribute('aria-selected', 'false'));

        // hide all unselected panels
        panels.filter((el, i) => i !== initialIndex).forEach(el => el.hidden = true);

        // all tabs control their respective panel
        tabs.forEach((el, i) => linkTabToPanel(this._el.id, el, i));

        // all panels are labelled  by their respective tab
        panels.forEach((el, i) => linkPanelToTab(this._el.id, el, i));

        // remove link behaviour and semantics
        links.forEach(el => removeLink(el));

        // create a roving tab index
        const rovingTabindex = RovingTabindex.createLinear(this._el, '[role=tab]', { wrap: true });

        // listen for changes to roving tab index
        this._el.addEventListener('rovingTabindexChange', this._onRovingTabindexChangeListener);

        // prevent page scroll when scroll keys are pressed
        ScrollKeyPreventer.add(tabList);

        // mark the widget as progressively enhanced
        this._el.classList.add('tabs--js');
    }

    destroy() {
        this._el.removeEventListener('rovingTabindexChange', this._onRovingTabindexChangeListener);

        this._onRovingTabindexChangeListener = null;
    }
}
