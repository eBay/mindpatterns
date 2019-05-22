/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const RovingTabIndex = require('makeup-roving-tabindex');
const PreventScrollKeys = require('makeup-prevent-scroll-keys');

function onKeyDown(e) {
    if (e.keyCode === 13) {
        e.preventDefault();
        processMenuItemAction(this._el, e.target);
    }
    else if (e.keyCode === 32) {
        processMenuItemAction(this._el, e.target);
    }
}

function onClick(e) {
    processMenuItemAction(this._el, e.target);
}

function processMenuItemAction(widgetEl, menuItemEl) {
    switch (menuItemEl.getAttribute('role')) {
        case 'menuitemcheckbox':
            doMenuItemCheckbox(widgetEl, menuItemEl);
            break;
        case 'menuitemradio':
            doMenuItemRadio(widgetEl, menuItemEl, widgetEl.querySelectorAll(`[data-menuitemradio-name=${menuItemEl.dataset.menuitemradioName}]`));
            break;
        default:
            doMenuItem(widgetEl, menuItemEl);
            break;
    }
}

function doMenuItem(widgetEl, menuItemEl) {
    widgetEl.dispatchEvent(new CustomEvent('menu-select', {
        detail: {
            el: menuItemEl
        }
    }));
}

function doMenuItemCheckbox(widgetEl, menuItemEl) {
    menuItemEl.setAttribute('aria-checked', (menuItemEl.getAttribute('aria-checked') === 'true') ? 'false' : 'true');

    widgetEl.dispatchEvent(new CustomEvent('menu-toggle', {
        detail: {
            el: menuItemEl,
            checked: menuItemEl.getAttribute('aria-checked')
        }
    }));
}

function doMenuItemRadio(widgetEl, menuItemEl, radioGroupEls) {
    radioGroupEls.forEach(function(el) {
        el.setAttribute('aria-checked', 'false');
    });

    menuItemEl.setAttribute('aria-checked', 'true');

    widgetEl.dispatchEvent(new CustomEvent('menu-change', {
        detail: {
            el: menuItemEl
        }
    }));
}

module.exports = class {
    constructor(widgetEl) {
        this._el = widgetEl;

        this._rovingTabIndex = RovingTabIndex.createLinear(this._el, '[role^=menuitem]' , {
            autoReset: 0
        });

        PreventScrollKeys.add(this._el);

        this._onKeyDownListener = onKeyDown.bind(this);
        this._onClickListener = onClick.bind(this);

        this._el.classList.add('menu--js');

        this.wake();
    }

    get items() {
        return this._el.querySelectorAll('[role^=menuitem]');
    }

    sleep() {
        this._el.removeEventListener('keydown', this._onKeyDownListener);
        this._el.removeEventListener('click', this._onClickListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._el.addEventListener('keydown', this._onKeyDownListener);
            this._el.addEventListener('click', this._onClickListener);
        }
    }

    destroy() {
        this._destroyed = true;
        this.sleep();

        this._onKeyDownListener = null;
        this._onClickListener = null;
    }
}
