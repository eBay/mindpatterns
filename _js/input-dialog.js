/**
* Copyright 2020 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Modal = require('makeup-modal');

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

        this._windowEl = this._el.querySelector('.input-dialog__window');
        this._closeButtonEl = this._el.querySelector('.input-dialog__close');
        this._cancelButtonEl = this._el.querySelector('.input-dialog__cancel');
        this._submitButtonEl = this._el.querySelector('.input-dialog__submit');
        this._inputEl = this._el.querySelector('.input-dialog__input');

        this._onCloseButtonClickListener = onCloseButtonClick.bind(this);
        this._onKeyDownListener = onKeyDown.bind(this);

        this._el.classList.add('input-dialog--js');

        this.wake();

        if (this._el.hidden !== true) {
            document.body.classList.add('has-modal');
            this._inputEl.focus();
            Modal.modal(this._el);
        }
    }

    get open() {
        return !this._el.hidden;
    }

    set open(bool) {
        this._el.hidden = !bool;

        if (bool === true) {
            document.body.classList.add('has-modal');
            this._inputEl.focus();
            Modal.modal(this._el);
        } else {
            Modal.unmodal();
            this._el.dispatchEvent(new CustomEvent('dialog-close'));
            document.body.classList.remove('has-modal');
        }
    }

    sleep() {
        this._closeButtonEl.removeEventListener('click', this._onCloseButtonClickListener);
        this._cancelButtonEl.removeEventListener('click', this._onCloseButtonClickListener);
        this._submitButtonEl.removeEventListener('click', this._onCloseButtonClickListener);
        this._windowEl.removeEventListener('keydown', this._onKeyDownListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._closeButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._cancelButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._submitButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._windowEl.addEventListener('keydown', this._onKeyDownListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();

        this._onCloseButtonClickListener = null;
    }
}
