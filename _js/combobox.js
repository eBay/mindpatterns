/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

const Expander = require('makeup-expander');
const Listbox = require('./listbox.js');
const Util = require('./util.js');

function onTextboxKeyDown(e) {
    // up and down keys should not move caret
    if (e.keyCode === 38 || e.keyCode === 40) {
        e.preventDefault();
    }

    // down arrow key should always expand listbox
    if (e.keyCode === 40) {
        if (this._expander.expanded === false) {
            this._expander.expanded = true;
        }
    }

    // escape key should always collapse listbox
    if (e.keyCode === 27) {
        if (this._expander.expanded === true) {
            this._expander.expanded = false;
            this._listboxWidget._activeDescendant.reset();
        }
    }

    // for manual selection, ENTER should not submit form when there is an active descendant
    if (this._options.autoSelect === false && e.keyCode === 13 && this._inputEl.getAttribute('aria-activedescendant')) {
        e.preventDefault();
        const widget = this;
        this._inputEl.value = Util.nodeListToArray(this._listboxWidget.items).filter(
            el => !el.hidden
        )[this._listboxWidget._activeDescendant.index].innerText;
        this._listboxWidget._activeDescendant.reset();

        setTimeout(function() {
            widget._expander.collapse();
        }, 150);
    }
}

function onTextboxInput(e) {
    if (this._expander.expanded === false) {
        this._expander.expanded = true;
    }

    if (this._autocompleteType === 'list') {
        const widget = this;
        const numChars = widget._inputEl.value.length;
        const currentValue = widget._inputEl.value.toLowerCase();

        if (numChars === 0) {
            this._listboxWidget._activeDescendant.reset();
            widget._listboxWidget.items.forEach(el => el.hidden = false);
        } else {
            const matchedItems = Util.nodeListToArray(widget._listboxWidget.items).filter((el) => {
                return el.innerText.substring(0, numChars).toLowerCase() === currentValue;
            });

            const unmatchedItems = Util.nodeListToArray(widget._listboxWidget.items).filter((el) => {
                return el.innerText.substring(0, numChars).toLowerCase() !== currentValue;
            });

            matchedItems.forEach((el) => el.hidden = false);
            unmatchedItems.forEach((el) => el.hidden = true);
        }
    }
}

function onListboxClick(e) {
    const widget = this;
    const el = e.target;
    const elIndex = el.dataset.makeupIndex;

    this._inputEl.value = Util.nodeListToArray(this._listboxWidget.items).filter(
        el => !el.hidden
    )[elIndex].innerText;

    setTimeout(function() {
        widget._expander.collapse();
    }, 150);
}

function onListboxActiveDescendantChange(e) {
    if (this._options.autoSelect === true) {
        this._inputEl.value = Util.nodeListToArray(this._listboxWidget.items).filter(
            el => !el.hidden
        )[e.detail.toIndex].innerText;
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
        this._autocompleteType = this._inputEl.getAttribute('aria-autocomplete');

        this._inputEl.setAttribute('autocomplete', 'off');
        this._inputEl.setAttribute('role', 'combobox');

        this._listboxEl.hidden = false;

        this._listboxWidget = new Listbox(this._listboxEl, {
            activeDescendantClassName: 'combobox__option--active',
            autoReset: -1,
            autoSelect: false,
            focusableElement: this._inputEl,
            listboxOwnerElement: this._el,
            useAriaChecked: false,
            useAriaSelected: false
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
        this._onListboxActiveDescendantChangeListener = onListboxActiveDescendantChange.bind(this);
        this._onTextboxKeyDownListener = onTextboxKeyDown.bind(this);
        this._onTextboxInputListener = onTextboxInput.bind(this);

        this._el.classList.add('combobox--js');

        this.wake();
    }

    get autocomplete() {
        return this._inputEl.getAttribute('aria-autocomplete');
    }

    sleep() {
        this._listboxEl.removeEventListener('click', this._onListboxClickListener);
        this._listboxEl.removeEventListener('listbox-active-descendant-change', this._onListboxActiveDescendantChangeListener);
        this._inputEl.removeEventListener('keydown', this._onTextboxKeyDownListener);
        this._inputEl.removeEventListener('input', this._onTextboxInputListener);
    }

    wake() {
        if (this._destroyed !== true) {
            this._listboxEl.addEventListener('click', this._onListboxClickListener);
            this._listboxEl.addEventListener('listbox-active-descendant-change', this._onListboxActiveDescendantChangeListener);
            this._inputEl.addEventListener('keydown', this._onTextboxKeyDownListener);
            this._inputEl.addEventListener('input', this._onTextboxInputListener);
        }
    }

    destroy() {
        this._destroyed = true;

        this.sleep();

        this._onListboxClickListener = null;
        this._onListboxActiveDesendanctChangeListener = null;
        this._onTextboxKeyDownListener = null;
        this._onTextboxInputsListener = null;
    }
}
