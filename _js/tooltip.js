/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

import Expander from 'makeup-expander';

const defaultOptions = {
    contentSelector: '.tooltip__content, [role=tooltip]',
    hostSelector: '.tooltip__host, [aria-describedby]'
};

export default class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);

        this._el = widgetEl;

        this.expander = new Expander(widgetEl, {
            autoCollapse: true,
            contentSelector: this._options.contentSelector,
            hostSelector: this._options.hostSelector,
            expandOnFocus: true,
            expandOnHover: true
        });

        this._destroyed = false;

        this.wake();

        this._el.classList.add('tooltip--js');
    }

    sleep() {
        this.expander.expandOnFocus = false;
        this.expander.expandOnHover = false;
    }

    wake() {
        if (this._destroyed !== true) {
            this.expander.expandOnFocus = true;
            this.expander.expandOnHover = true;
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();
    }
}
