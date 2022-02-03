/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const dataSetKey = 'data-makeup-accordion-index';

const defaultOptions = {
    autoCollapse: false
};

function onToggle(e) {
    const itemIndex = parseInt(e.target.getAttribute(dataSetKey), 10);
    const isOpen = this._detailsWidgets[itemIndex].open === true;

    if (this._options.autoCollapse === true && isOpen) {
        const otherWidgets = this._detailsWidgets.filter((item, index) => index !== itemIndex);
        otherWidgets.forEach(widget => (widget.open = false));
    }
}

function addToggleListener(detailsEl) {
    detailsEl.addEventListener('toggle', this._onToggleListener);
}

function removeToggleListener(detailsEl) {
    detailsEl.removeEventListener('toggle', this._onToggleListener);
}

function createDetailsWidget(el, i) {
    el.setAttribute(dataSetKey, i);
    this._detailsWidgets.push(el);
}

export default class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);

        // cache the root element
        this._el = widgetEl;

        this._onToggleListener = onToggle.bind(this);

        this._detailsWidgets = [];

        const detailsEls = this._el.querySelectorAll('.accordion__details');

        detailsEls.forEach(createDetailsWidget.bind(this));

        this.enableEvents();

        // mark the widget as progressively enhanced
        this._el.classList.add('accordion--js');
    }

    disableEvents() {
        this._el.querySelectorAll('.accordion__details').forEach(removeToggleListener.bind(this));
    }

    enableEvents() {
        if (this._destroyed !== true) {
            this._el.querySelectorAll('.accordion__details').forEach(addToggleListener.bind(this));
        }
    }

    destroy() {
        this._destroyed = true;

        this.disableEvents();

        this._onToggleListener = null;
    }
}
