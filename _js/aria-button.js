/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onClick() {
    this._el.dispatchEvent(new CustomEvent('aria-button-click'));
}

function onKeyDown(e) {
    if (e.keyCode === 32 || e.keyCode === 13) {
        e.preventDefault();
        this._el.dispatchEvent(new CustomEvent('aria-button-click'));
    }
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;

        this._destroyed = false;

        this._onKeyDownListener = onKeyDown.bind(this);
        this._onClickListener = onClick.bind(this);

        // add button semantics
        this._el.setAttribute('role', 'button');

        this._el.setAttribute('tabindex', '0');

        this._el.classList.add('aria-button--js');

        this.wake();
    }

    sleep() {
        this._el.removeEventListener('keydown', this._onKeyDownListener);
        this._el.removeEventListener('click', this._onClickListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._el.addEventListener('keydown', this._onKeyDownListener);
            this._el.addEventListener('click', this._onClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onKeyDownListener = null;
        this._onClickListener = null;
    }
}
