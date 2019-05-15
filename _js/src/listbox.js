/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const ActiveDescendant = require('makeup-active-descendant');
const PreventScrollKeys = require('makeup-prevent-scroll-keys');

function onFocus(e) {
    if (this._mouseDownFlag !== true && this.index === -1) {
        this._activeDescendant.index = 0;
        this.items[0].setAttribute('aria-checked', 'true');
    }
    this._mouseDownFlag = false;
}

function onMouseDown(e) {
    this._mouseDownFlag = true;
}

function _onActiveDescendantChange(e) {
    console.log(e);
    const fromEl = this.items[e.detail.fromIndex];
    const toEl =  this.items[e.detail.toIndex];

    if (fromEl) fromEl.setAttribute('aria-checked', 'false');

    if (toEl) {
        toEl.setAttribute('aria-checked', 'true');

        console.log(toEl.innerText);

        this._el.dispatchEvent(new CustomEvent('listbox-change', {
            detail: {
                optionValue: toEl.innerText
            }
        }));
    }
}

module.exports = class {
    constructor(widgetEl) {
        this._el = widgetEl;
        this._listboxEl = this._el.querySelector('[role=listbox]');

        this._listboxEl.setAttribute('tabindex', '0');

        this._activeDescendant = ActiveDescendant.createLinear(
            this._el,
            this._listboxEl,
            this._listboxEl,
            '[role=option]',
            {
                autoReset: null
            }
        );

        PreventScrollKeys.add(this._el);

        this._onFocusListener = onFocus.bind(this);
        this._onMouseDownListener = onMouseDown.bind(this);
        this._onActiveDescendantChangeListener = _onActiveDescendantChange.bind(this);

        this._el.classList.add('listbox--js');

        this.wake();
    }

    get index() {
        return Array.prototype.slice.call(this.items).findIndex(function(el) {
            return el.getAttribute('aria-checked') === 'true';
        });
    }

    get items() {
        return this._listboxEl.querySelectorAll('[role=option]');
    }

    sleep() {
        this._listboxEl.removeEventListener('focus', this._onFocusListener);
        this._listboxEl.removeEventListener('mousedown', this._onMouseDownListener);
        this._el.removeEventListener('activeDescendantChange', this._onActiveDescendantChangeListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._listboxEl.addEventListener('focus', this._onFocusListener);
            this._listboxEl.addEventListener('mousedown', this._onMouseDownListener);
            this._el.addEventListener('activeDescendantChange', this._onActiveDescendantChangeListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();

        this._onFocusListener = null;
        this._onMouseDownListener = null;
        this._onActiveDescendantChangeListener = null;
    }
}
