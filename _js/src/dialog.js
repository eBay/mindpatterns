/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Modal = require('makeup-modal');
const Focusables = require('makeup-focusables');

function onCloseButtonClick(e) {
    this.open = false;
}

function onKeyDown(e) {
    if (e.keyCode === 27) {
        this.open = false;
    }
}

module.exports = class {
    constructor(widgetEl) {
        this._el = widgetEl;

        this._windowEl = this._el.querySelector('.dialog__window');
        this._closeButtonEl = this._el.querySelector('.dialog__close');

        this._onCloseButtonClickListener = onCloseButtonClick.bind(this);
        this._onKeyDownListener = onKeyDown.bind(this);

        this._el.classList.add('dialog--js');

        this.wake();
    }

    get focusables() {
        return Focusables(this._windowEl);
    }

    set open(bool) {
        this._el.hidden = !bool;

        if (bool === true) {
            this._el.open = true;
            document.body.classList.add('has-modal');
            this.focusables[0].focus();
            Modal.modal(this._el);
        } else {
            Modal.unmodal();
            this._el.open = false;
            this._el.dispatchEvent(new CustomEvent('dialog-close'));
            document.body.classList.remove('has-modal');
        }
    }

    sleep() {
        this._el.removeEventListener('click', this._onCloseButtonClickListener);
        this._el.removeEventListener('keydown', this._onKeyDownListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._closeButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._windowEl.addEventListener('keydown', this._onKeyDownListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();

        this._onCloseButtonClickListener = null;
    }
}
