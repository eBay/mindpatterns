/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onClick() {
    this.expanded = !this.expanded;
}

function hideElements(els) {
    els.forEach(el => el.setAttribute('hidden', ''));
}

function showElements(els) {
    els.forEach(el => el.removeAttribute('hidden'));
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;

        this._destroyed = false;
        this._buttonEl = widgetEl.querySelector('.expando__button');
        this._onClickListener = onClick.bind(this);
        this._childElements = [...this._el.children].filter(
            el => el.tagName.toUpperCase() !== 'BUTTON'
        );

        if (this._buttonEl.getAttribute('aria-expanded') !== 'true') {
            hideElements(this._childElements);
        }

        this.wake();
    }

    get expanded() {
        return this._buttonEl.getAttribute('aria-expanded') === 'true';
    }

    set expanded(bool) {
        if (bool === true) {
            showElements(this._childElements);
        } else {
            hideElements(this._childElements);
        }
        this._buttonEl.setAttribute('aria-expanded', bool);
        this._el.dispatchEvent(new CustomEvent('expando-toggle'));
    }

    sleep() {
        this._buttonEl.removeEventListener('click', this._onClickListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._buttonEl.addEventListener('click', this._onClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onClickListener = null;
    }
}
