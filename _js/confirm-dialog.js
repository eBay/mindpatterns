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

        this._windowEl = this._el.querySelector('.confirm-dialog__window');
        this._closeButtonEl = this._el.querySelector('.confirm-dialog__close');
        this._declineButtonEl = this._el.querySelector('.confirm-dialog__decline');
        this._acceptButtonEl = this._el.querySelector('.confirm-dialog__accept');

        this._onCloseButtonClickListener = onCloseButtonClick.bind(this);
        this._onKeyDownListener = onKeyDown.bind(this);

        this._el.classList.add('confirm-dialog--js');

        this.wake();

        if (this._el.hidden !== true) {
            document.body.classList.add('has-modal');
            this._acceptButtonEl.focus();
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
            this._acceptButtonEl.focus();
            Modal.modal(this._el);
        } else {
            Modal.unmodal();
            this._el.dispatchEvent(new CustomEvent('dialog-close'));
            document.body.classList.remove('has-modal');
        }
    }

    sleep() {
        this._closeButtonEl.removeEventListener('click', this._onCloseButtonClickListener);
        this._declineButtonEl.removeEventListener('click', this._onCloseButtonClickListener);
        this._acceptButtonEl.removeEventListener('click', this._onCloseButtonClickListener);
        this._windowEl.removeEventListener('keydown', this._onKeyDownListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._closeButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._declineButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._acceptButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._windowEl.addEventListener('keydown', this._onKeyDownListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();

        this._onCloseButtonClickListener = null;
    }
}
