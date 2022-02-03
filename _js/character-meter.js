/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onInput() {
    const charCount = this._inputEl.value.length;

    if (charCount === this._lowValue || charCount === this._highValue) {
        this._el.setAttribute('aria-live', 'polite');
    } else {
        // throttle live region updates
        this._el.setAttribute('aria-live', 'off');
    }

    const displayValue = getDisplayValue(charCount, this._maxlength);

    this._meterEl.value = charCount;

    // only update live region if there's been a change in text
    if (this._valueEl.innerText !== displayValue) {
        this._valueEl.innerText = displayValue;
    }
}

function getDisplayValue(count, limit) {
    const remainder = limit - count;

    return `${remainder} / ${limit}`;
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;
        this._meterEl = widgetEl.querySelector('meter');
        this._inputEl = document.getElementById(widgetEl.dataset.for);
        this._valueEl = widgetEl.querySelector('.character-meter__value');

        this._maxlength = parseInt(this._inputEl.getAttribute('maxlength'), 10);
        this._highValue = parseInt(this._meterEl.getAttribute('high'), 10);
        this._lowValue = parseInt(this._meterEl.getAttribute('low'), 10);

        this._destroyed = false;

        this._onInputListener = onInput.bind(this);

        this.wake();
    }

    sleep() {
        this._inputEl.removeEventListener('input', this._onInputListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._inputEl.addEventListener('input', this._onInputListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onInputListener = null;
    }
}
