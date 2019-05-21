/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Expander = require('makeup-expander');
const Listbox = require('./listbox.js');

function onTextboxKeyDown(e) {
    // up and down keys should not move caret
    if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
    }

    // for manual selection, ENTER and SPACEBAR should not submit form when listbox is open
    if (this._expander.isExpanded() && !this._options.autoSelect && (e.keyCode === 13 || e.keyCode === 32)) {
        e.preventDefault();
        const widget = this;
        this._inputEl.value = this._listboxWidget.items[this._listboxWidget._activeDescendant.index].innerText;
        setTimeout(function() {
            widget._expander.collapse();
        }, 150);
    }
}

function onListboxClick(e) {
    const widget = this;
    setTimeout(function() {
        widget._expander.collapse();
    }, 150);
}

function onListboxChange(e) {
    this._inputEl.value = e.detail.optionValue;
    if (!this._options.autoSelect) {
        this._listboxWidget.clear();
    }
}

const defaultOptions = {
    autoSelect: true
};

module.exports = class {
    constructor(widgetEl, selectedOptions) {
        this._options = Object.assign({}, defaultOptions, selectedOptions);
        this._el = widgetEl;
        this._inputEl = this._el.querySelector('input');
        this._listboxEl = this._el.querySelector('.combobox__listbox');


        this._inputEl.setAttribute('autocomplete', 'off');
        this._listboxEl.hidden = false;

        this._listboxWidget = new Listbox(this._listboxEl, {
            autoReset: -1,
            autoSelect: this._options.autoSelect,
            focusableElement: this._inputEl,
            listboxOwnerElement: this._el
        });

        this._expander = new Expander(this._el,  {
            collapseOnClickOut: true,
            collapseOnFocusOut: true,
            contentSelector: '.combobox__listbox',
            expandedClass: 'combobox--expanded',
            expandOnFocus: true,
            hostSelector: 'input'
        });

        this._destroyed = false;

        this._onListboxClickListener = onListboxClick.bind(this);
        this._onListboxChangeListener = onListboxChange.bind(this);
        this._onTextboxKeyDownListener = onTextboxKeyDown.bind(this);

        this._el.classList.add('combobox--js');

        this.wake();
    }

    sleep() {
        this._listboxEl.removeEventListener('click', this._onListboxClickListener);
        this._listboxEl.removeEventListener('listbox-change', this._onListboxChangeListener);
        this._inputEl.removeEventListener('keydown', this._onTextboxKeyDownListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._listboxEl.addEventListener('click', this._onListboxClickListener);
            this._listboxEl.addEventListener('listbox-change', this._onListboxChangeListener);
            this._inputEl.addEventListener('keydown', this._onTextboxKeyDownListener);
        }
    }

    destroy() {
        this._destroyed = true;

        this.sleep();

        this._onListboxClickListener = null;
        this._onListboxChangeListener = null;
        this._onTextboxKeyDownListener = null;
    }
}
