/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Expander = require('makeup-expander');
const Listbox = require('./listbox.js');

function onButtonFirstClick(e) {
    this.listbox.el.hidden = false;
}

function onListboxKeyDown(e) {
    if (e.keyCode === 13 || e.keyCode === 27 || e.keyCode === 32) {
        const widget = this;
        e.preventDefault();
        setTimeout(function() {
            widget._expander.collapse();
            widget._buttonEl.focus();
        }, 100);
    }
}

function onListboxClick(e) {
    const widget = this;
    setTimeout(function() {
        widget._expander.collapse();
        widget._buttonEl.focus();
    }, 150);
}

function onListboxChange(e) {
    const fromValue = this._buttonEl.children[0].innerText;
    const toValue = e.detail.optionValue;
    this._buttonEl.children[0].innerText = toValue;
    this.el.dispatchEvent(new CustomEvent('listbox-button-change', {
        detail: {
            fromValue: fromValue,
            toValue: toValue
        }
    }));
}

const defaultOptions = {
    autoSelect: true
};

module.exports = class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);
        this.el = widgetEl;
        this._buttonEl = this.el.querySelector('button');

        this.listbox = new Listbox(this.el.querySelector('.listbox-button__listbox'), {
            autoSelect: this._options.autoSelect
        });

        this._expander = new Expander(this.el,  {
            alwaysDoFocusManagement: true,
            collapseOnClick: true,
            collapseOnClickOut: true,
            collapseOnFocusOut: true,
            contentSelector: '.listbox-button__listbox',
            expandedClass: 'listbox-button--expanded',
            expandOnClick: true,
            focusManagement: 'focusable',
            hostSelector: 'button'
        });

        this._destroyed = false;

        this._onButtonFirstClickListener = onButtonFirstClick.bind(this);
        this._onListboxClickListener = onListboxClick.bind(this);
        this._onListboxKeyDownListener = onListboxKeyDown.bind(this);
        this._onListboxChangeListener = onListboxChange.bind(this);

        this.el.classList.add('listbox-button--js');

        this.wake();
    }

    sleep() {
        this._buttonEl.removeEventListener('click', this._onButtonFirstClickListener);
        this.listbox.el.removeEventListener('click', this._onListboxClickListener);
        this.listbox.el.removeEventListener('keydown', this._onListboxKeyDownListener);
        this.listbox.el.removeEventListener('listbox-change', this._onListboxChangeListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._buttonEl.addEventListener('click', this._onButtonFirstClickListener, { once: true });
            this.listbox.el.addEventListener('click', this._onListboxClickListener);
            this.listbox.el.addEventListener('keydown', this._onListboxKeyDownListener);
            this.listbox.el.addEventListener('listbox-change', this._onListboxChangeListener);
        }
    }

    destroy() {
        this._destroyed = true;

        this.sleep();

        this._onButtonFirstClickListener = null;
        this._onListboxClickListener = null;
        this._onListboxKeyDownListener = null;
        this._onListboxChangeListener = null;
    }
}
