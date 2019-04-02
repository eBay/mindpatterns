/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const ScrollKeyPreventer = require('makeup-prevent-scroll-keys');

function nodeListToArray(nodeList) {
    return Array.prototype.slice.call(nodeList);
}

function onClick(e) {
    this.open = !(this.open === true);
}

function onKeyup(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
        this.open = !(this.open === true);
    }
}

function isDetailsTagSupported() {
    return document.createElement('details').open !== undefined;
}

function toggleElements(els) {
    els.forEach(function(el, i) {
        if (el.hasAttribute('hidden')) {
            el.removeAttribute('hidden');
        } else {
            el.setAttribute('hidden', '');
        }
    });
}

module.exports = class {
    constructor(widgetEl) {
        if (!isDetailsTagSupported()) {
            this._el = widgetEl;
            this._summaryEl = widgetEl.querySelector('summary');
            this._onClickListener = onClick.bind(this);
            this._onKeyupListener = onKeyup.bind(this);
            this._childElements = nodeListToArray(this._el.children).filter(el => el.tagName.toUpperCase() !== 'SUMMARY');

            if (this._el.hasAttribute('open')) {
                this._el.setAttribute('data-makeup-open','');
                this._el.removeAttribute('open');
            } else {
                this._childElements.forEach(function(el, i) {
                    el.setAttribute('hidden', '');
                });
            }

            this._summaryEl.setAttribute('tabindex', '0');
            this._summaryEl.setAttribute('role', 'group');
            this._summaryEl.setAttribute('aria-roledescription', 'summary');

            this.wake();
        } else {
            return widgetEl;
        }
    }

    get open() {
        return this._el.hasAttribute('data-makeup-open');
    }

    set open(bool) {
        if (bool === true) {
            this._el.setAttribute('data-makeup-open','');

        } else {
            this._el.removeAttribute('data-makeup-open');
        }
        toggleElements(this._childElements);
        this._el.dispatchEvent(new CustomEvent('details-toggle'));
    }

    sleep() {
        this._summaryEl.removeEventListener('click', this._onClickListener);
        this._summaryEl.removeEventListener('keyup', this._onKeyupListener);
        ScrollKeyPreventer.remove(this._summaryEl);
    }

    wake() {
        if (!this._destroyed === true) {
            this._summaryEl.addEventListener('click', this._onClickListener);
            this._summaryEl.addEventListener('keyup', this._onKeyupListener);
            ScrollKeyPreventer.add(this._summaryEl);
        }
    }

    destroy() {
        this._destroyed = true;

        this.sleep();

        this._onClickListener = null;
        this._onKeyupListener = null;
    }
}
