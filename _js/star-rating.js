/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onClick(e) {
    if (e.target.tagName.toLowerCase() === 'input') {
        this.index = Array.prototype.indexOf.call(this._items, e.target.parentNode);
    }
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;
        this._items = widgetEl.querySelectorAll('.radio');

        const checkedItem = widgetEl.querySelector('input:checked');

        if (checkedItem) {
            this.index = Array.prototype.indexOf.call(this._items, checkedItem.parentNode);
        }

        this._onClickListener = onClick.bind(this);

        this._el.classList.add('star-rating--js');

        this.observe();
    }

    set index(newIndex) {
        this._items.forEach(function(el, i) {
            if (i <= newIndex) {
                el.classList.add('radio--checked');
            } else {
                el.classList.remove('radio--checked');
            }
        });
    }

    unobserve() {
        this._el.removeEventListener('click', this._onClickListener);
    }

    observe() {
        if (this._destroyed !== true) {
            this._el.addEventListener('click', this._onClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.unobserve();
        this._onClickListener = null;
    }
}
