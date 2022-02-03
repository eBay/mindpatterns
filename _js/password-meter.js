/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onInput() {
    this._meterEl.value = this._inputEl.value.length;
    const displayValue = getDisplayValue(this._meterEl.value);
    if (this._valueEl.innerText !== displayValue) {
        this._valueEl.innerText = displayValue;
    }
}

function getDisplayValue(level) {
    let label;

    if (level >= 12) {
        label = 'strong';
    } else if (level >= 8) {
        label = 'weak';
    } else {
        label = 'dangerous';
    }

    return label;
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;
        this._meterEl = widgetEl.querySelector('meter');
        this._inputEl = document.getElementById(widgetEl.dataset.for);
        this._valueEl = widgetEl.querySelector('.password-meter__value');

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
