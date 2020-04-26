/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Modal = require('makeup-modal');
const Focusables = require('makeup-focusables');
const transition = require('./transition');

function doFocusManagement(dialogWidget) {
    const autoFocusEl = dialogWidget._el.querySelector('[autofocus]');

    if (autoFocusEl) {
        autoFocusEl.focus();
    } else if (dialogWidget._confirmButtonEl) {
        dialogWidget._confirmButtonEl.focus();
    } else {
        dialogWidget.focusables[0].focus();
    }
}

function onOpenTransitionEnd() {
    console.log('onOpenTransitionEnd');
    this._el.hidden = false;
    this._cancelTransition = undefined;
    document.body.classList.add('has-modal');

    doFocusManagement(this);

    Modal.modal(this._el);
    this._el.dispatchEvent(new CustomEvent('dialog-open'));
    this.observeEvents();
}

function onCloseTransitionEnd() {
    console.log('onCloseTransitionEnd');
    Modal.unmodal();
    document.body.classList.remove('has-modal');
    this._el.hidden = true;
    this._el.dispatchEvent(new CustomEvent('dialog-close'));
    this._cancelTransition = undefined;
    this.observeEvents();
}

function onRejectButtonClick(e) {
    this.open = false;
}

function onConfirmButtonClick(e) {
    this.open = false;
}

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

        this._hasTransitions = this._el.dataset.makeupDialogHasTransitions === "true";

        this._windowEl = this._el.querySelector('.dialog__window');
        this._closeButtonEl = this._el.querySelector('.dialog__close');
        this._confirmButtonEl = this._el.querySelector('.dialog__confirm');
        this._rejectButtonEl = this._el.querySelector('.dialog__reject');

        this._onCloseButtonClickListener = onCloseButtonClick.bind(this);
        this._onConfirmButtonClickListener = onConfirmButtonClick.bind(this);
        this._onRejectButtonClickListener = onRejectButtonClick.bind(this);
        this._onKeyDownListener = onKeyDown.bind(this);
        this._onOpenTransitionEndListener = onOpenTransitionEnd.bind(this);
        this._onCloseTransitionEndListener = onCloseTransitionEnd.bind(this);

        this._el.classList.add('dialog--js');

        if (this.open) {
            document.body.classList.add('has-modal');
            doFocusManagement(this);
            Modal.modal(this._el);
        }

        this.observeEvents();
    }

    get focusables() {
        return Focusables(this._windowEl);
    }

    get open() {
        return !this._el.hidden;
    }

    set open(bool) {
        if (this._hasTransitions) {
            this.unobserveEvents();

            if (this._cancelTransition) {
                this._cancelTransition();
            }

            if (bool === true) {
                this._cancelTransition = transition(this._el, 'dialog--show', this._onOpenTransitionEndListener);
            } else {
                this._cancelTransition = transition(this._el, 'dialog--hide', this._onCloseTransitionEndListener);
            }
        } else {
            const eventType = (bool === true) ? 'dialog-open' : 'dialog-close';

            this._el.hidden = !bool;
            doFocusManagement(this);
            this._el.dispatchEvent(new CustomEvent(eventType));
        }
    }

    unobserveEvents() {
        this._el.removeEventListener('click', this._onCloseButtonClickListener);
        this._el.removeEventListener('keydown', this._onKeyDownListener);

        if (this._confirmButtonEl) {
            this._confirmButtonEl.removeEventListener('click', this._onConfirmButtonClickListener);
        }

        if (this._rejectButtonEl) {
            this._rejectButtonEl.removeEventListener('click', this._onRejectButtonClickListener);
        }
    }

    observeEvents() {
        if (this._destroyed !== true) {
            this._closeButtonEl.addEventListener('click', this._onCloseButtonClickListener);
            this._windowEl.addEventListener('keydown', this._onKeyDownListener);

            if (this._confirmButtonEl) {
                this._confirmButtonEl.addEventListener('click', this._onConfirmButtonClickListener);
            }

            if (this._rejectButtonEl) {
                this._rejectButtonEl.addEventListener('click', this._onRejectButtonClickListener);
            }
        }
    }

    destroy() {
        this._destroyed = true;
        this.unobserveEvents();

        this._onCloseButtonClickListener = null;
        this._onConfirmButtonClickListener = null;
        this._onRejectButtonClickListener = null;
        this._onKeyDownListener = null;
        this._onOpenTransitionEndListener = null;
        this._onCloseTransitionEndListener = null;
    }
}
