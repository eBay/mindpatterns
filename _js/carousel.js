/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onPrevClick() {
    this.index--;
}

function onNextClick() {
    this.index++;
}

function init(el, elIndex) {
    if (elIndex < this._itemsPerSlide) {
        this._indexesInViewport.push(elIndex);
    } else {
        el.hidden = true;
    }
}

export default class {
    constructor(widgetEl) {
        // get fixed, structural elements first
        this._el = widgetEl;
        this._listEl = widgetEl.querySelector('.carousel__list');
        this._prevButton = widgetEl.querySelector('.carousel__previous');
        this._nextButton = widgetEl.querySelector('.carousel__next');
        this._liveRegionEl = widgetEl.querySelector('.carousel__index');

        this._itemsPerSlide = parseInt(widgetEl.dataset.itemsPerSlide, 10) || 1;
        this._numSlides = Math.round(this.items.length / this._itemsPerSlide);
        this._indexesInViewport = [];
        this._index = 0;

        this.items.forEach((el, index) => el.setAttribute('data-carousel-index', index));

        this._onPrevClickListener = onPrevClick.bind(this);
        this._onNextClickListener = onNextClick.bind(this);

        this.items.forEach(init.bind(this));

        this.wake();

        this._el.classList.add('carousel--js');
    }

    get index() {
        return this._index;
    }

    set index(newIndex) {
        if (newIndex > -1 && newIndex < this._numSlides) {
            let newIndexesInViewport;
            const oldIndex = this.index;
            const shiftViewportLeft = (val) => val + this._itemsPerSlide;
            const shiftViewportRight = (val) => val - this._itemsPerSlide;

            if (newIndex > this.index) {
                newIndexesInViewport = this._indexesInViewport.map(shiftViewportLeft, this);
            }

            if (newIndex < this.index) {
                newIndexesInViewport = this._indexesInViewport.map(shiftViewportRight, this);
            }

            // map current viewport indexes to element array
            const oldItemsInViewport = this._indexesInViewport.map(function(val) {
                return this.items[val];
            }, this);

            // map new viewport indexes to element array
            const newItemsInViewport = newIndexesInViewport.map(function(val) {
                return this.items[val];
            }, this);

            // unhide new slide items
            newItemsInViewport.forEach((el) => (el.hidden = false));

            // hide old slide items
            oldItemsInViewport.forEach((el) => (el.hidden = true));

            // update model
            this._indexesInViewport = newIndexesInViewport;
            this._index = newIndex;

            // update pagination button state
            if (newIndex === 0) {
                this._prevButton.setAttribute('aria-disabled', 'true');
                this._nextButton.setAttribute('aria-disabled', 'false');
            } else if (newIndex === (this._numSlides - 1)) {
                this._prevButton.setAttribute('aria-disabled', 'false');
                this._nextButton.setAttribute('aria-disabled', 'true');
            } else {
                this._prevButton.setAttribute('aria-disabled', 'false');
                this._nextButton.setAttribute('aria-disabled', 'false');
            }

            this._liveRegionEl.innerText = newIndex + 1;

            this._el.dispatchEvent(new CustomEvent('carousel-pagination', {
                detail: {
                    fromIndex: oldIndex,
                    toIndex: newIndex
                }
            }));
        }
    }

    get items() {
        return this._listEl.querySelectorAll('li');
    }

    atFirstSlide() {
        return this.index === 0;
    }

    atLastSlide() {
        return this.index === this._numSlides - 1;
    }

    sleep() {
        this._prevButton.removeEventListener('click', this._onPrevClickListener);
        this._nextButton.removeEventListener('click', this._onNextClickListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._prevButton.addEventListener('click', this._onPrevClickListener);
            this._nextButton.addEventListener('click', this._onNextClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
        this._onPrevClickListener = null;
        this._onNextClickListener = null;
    }
}
