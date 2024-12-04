/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const defaultOptions = {
    autoCollapse: false
};

function browserSupportsNameAttribute() {
    return "name" in document.createElement('details');
}

function onToggle(e) {
    if (browserSupportsNameAttribute() === false) {
        const item = e.target;
        const groupName = item.getAttribute('name');
  
        // TODO: use ToggleEvent newState property instead of item.open when supported
        if (groupName !== null && item.open === true) {
            this.items
                .filter(
                    (groupItem) => groupItem !== item && groupItem.open === true && groupItem.getAttribute('name') === groupName
                )
                .forEach(
                    (groupItem) => groupItem.open = false
                );
        }
    }
}

function addToggleListener(detailsEl) {
    detailsEl.addEventListener('toggle', this._onToggleListener);
}

function removeToggleListener(detailsEl) {
    detailsEl.removeEventListener('toggle', this._onToggleListener);
}

export default class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);

        // cache the root element
        this._el = widgetEl;

        this._onToggleListener = onToggle.bind(this);

        this.enableEvents();

        // mark the widget as progressively enhanced
        this._el.classList.add('accordion--js');
    }

    get items() {
        return [...this._el.querySelectorAll('.accordion__details')];
    }

    disableEvents() {
        this.items.forEach(removeToggleListener.bind(this));
    }

    enableEvents() {
        if (this._destroyed !== true) {
            this.items.forEach(addToggleListener.bind(this));
        }
    }

    destroy() {
        this._destroyed = true;

        this.disableEvents();

        this._onToggleListener = null;
    }
}
