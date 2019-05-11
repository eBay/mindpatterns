/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onClick(e) {
    this._el.classList.remove('star-rating--unselected');
}

module.exports = class {
    constructor(widgetEl) {
        this._el = widgetEl;
        this._stars = widgetEl.querySelectorAll('input');

        const isChecked = widgetEl.querySelectorAll('input:checked').length > 0;

        if (isChecked === false) {
            widgetEl.classList.add('star-rating--unselected');
        }

        this._onClickListener = onClick.bind(this);

        this._el.classList.add('star-rating--js');

        this.wake();
    }

    sleep() {
        this._el.removeEventListener('click', this._onClickListener, {once: true});
    }

    wake() {
        if (this._destroyed !== true) {
            this._el.addEventListener('click', this._onClickListener, {once: true});
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onClickListener = null;
    }
}
