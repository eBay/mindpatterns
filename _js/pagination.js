/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onClick(e) {
    if (this.items[this.index] !== e.target) {
        this.index = e.target.dataset.paginationIndex;
    }
}

function onPrevClick() {
    this.index = this.index - 1;
}

function onNextClick() {
    this.index = this.index + 1;
}

export default class {
    constructor(widgetEl) {
        this._el = widgetEl;
        this._prevButton = widgetEl.querySelector('.pagination__previous');
        this._nextButton = widgetEl.querySelector('.pagination__next');
        this._listEl = widgetEl.querySelector('ol');
        this._liveRegionEl = widgetEl.querySelector('.pagination__index');

        if (widgetEl.tagName.toLowerCase() !== 'nav') {
            this.items.forEach(function(el, index) {
                el.setAttribute('data-pagination-index', index);
            });
            this._onClickListener = onClick.bind(this);
            this._onPrevClickListener = onPrevClick.bind(this);
            this._onNextClickListener = onNextClick.bind(this);
            this.wake();
        }
    }

    get index() {
        return [...this.items].findIndex(function(el) {
            return el.getAttribute('aria-current') === 'page';
        });
    }

    set index(i) {
        if (i >= 0 && i < this.items.length) {
            this.items[this.index].removeAttribute('aria-current');
            this.items[i].setAttribute('aria-current', 'page');

            this._liveRegionEl.innerText = parseInt(i, 10) + 1;

            this._prevButton.setAttribute('aria-disabled', this.atFirst ? 'true' : 'false');
            this._nextButton.setAttribute('aria-disabled', this.atLast ? 'true' : 'false');
        }
    }

    get atFirst() {
        return this.index === 0;
    }

    get atLast() {
        return this.index === (this.items.length - 1);
    }

    get items() {
        return this._listEl.querySelectorAll('button');
    }

    sleep() {
        this._listEl.removeEventListener('click', this._onClickListener);
        this._prevButton.removeEventListener('click', this._onPrevClickListener);
        this._nextButton.removeEventListener('click', this._onNextClickListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._listEl.addEventListener('click', this._onClickListener);
            this._prevButton.addEventListener('click', this._onPrevClickListener);
            this._nextButton.addEventListener('click', this._onNextClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onClickListener = null;
        this._onPrevClickListener = null;
        this._onNextClickListener = null;
    }
}
