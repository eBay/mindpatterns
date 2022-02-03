/**
* this is a very rudimentary (and unfinished!) approach to polyfilling the details element
* please use this one instead:
* https://github.com/javan/details-element-polyfill
*/

function onClick() {
    this.open = !(this.open === true);
}

function onKeydown(e) {
    if (e.keyCode === 32) {
        e.preventDefault();
    }
}

function onKeyup(e) {
    if (e.keyCode === 13 || e.keyCode === 32) {
        this.open = !(this.open === true);
    }
}

function isDetailsTagSupported() {
    return document.createElement('details').open !== undefined;
}

function hideElements(els) {
    els.forEach(el => el.setAttribute('hidden', ''));
}

function showElements(els) {
    els.forEach(el => el.removeAttribute('hidden'));
}

export default class {
    constructor(widgetEl) {
        this._isPolyfill = !isDetailsTagSupported();
        this._el = widgetEl;

        if (this._isPolyfill) {
            this._destroyed = false;
            this._summaryEl = widgetEl.querySelector('summary');
            this._onClickListener = onClick.bind(this);
            this._onKeydownListener = onKeydown.bind(this);
            this._onKeyupListener = onKeyup.bind(this);
            this._childElements = [...this._el.children].filter(
                el => el.tagName.toUpperCase() !== 'SUMMARY'
            );

            if (this._el.hasAttribute('open')) {
                this._el.setAttribute('data-makeup-open', '');
                this._el.removeAttribute('open');
            } else {
                this._childElements.forEach(function(el) {
                    el.setAttribute('hidden', '');
                });
            }

            this._summaryEl.setAttribute('tabindex', '0');
            this._summaryEl.setAttribute('role', 'group');
            this._summaryEl.setAttribute('aria-roledescription', 'summary');

            this.wake();
        }
    }

    get open() {
        if (this._isPolyfill) {
            return this._el.hasAttribute('data-makeup-open');
        }
        return this._el.open;
    }

    set open(bool) {
        if (this._isPolyfill) {
            if (bool === true) {
                this._el.setAttribute('data-makeup-open', '');
                showElements(this._childElements);
            } else {
                this._el.removeAttribute('data-makeup-open');
                hideElements(this._childElements);
            }
            this._el.dispatchEvent(new CustomEvent('details-toggle'));
        } else {
            this._el.open = bool;
        }
    }

    sleep() {
        if (this._isPolyfill) {
            this._summaryEl.removeEventListener('click', this._onClickListener);
            this._summaryEl.removeEventListener('keydown', this._onKeydownListener);
            this._summaryEl.removeEventListener('keyup', this._onKeyupListener);
        }
    }

    wake() {
        if (this._isPolyfill && this._destroyed !== true) {
            this._summaryEl.addEventListener('click', this._onClickListener);
            this._summaryEl.addEventListener('keydown', this._onKeydownListener);
            this._summaryEl.addEventListener('keyup', this._onKeyupListener);
        }
    }

    destroy() {
        if (this._isPolyfill) {
            this._destroyed = true;

            this.sleep();

            this._onClickListener = null;
            this._onKeydownListener = null;
            this._onKeyupListener = null;
        }
    }
}
