/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onClick() {
    window.location = this._anchorEl.getAttribute('href');
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;

        if (widgetEl.tagName.toLowerCase() !== 'a') {
            this._anchorEl = widgetEl.querySelector('a');
            this._onClickListener = onClick.bind(this);
            this.wake();
        }
    }

    sleep() {
        this._el.removeEventListener('click', this._onClickListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._el.addEventListener('click', this._onClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onClickListener = null;
    }
}
