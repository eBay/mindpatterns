'use strict';

const defaultOptions = {
    bem: {
        button: 'pulldown__button',
        collapsed: 'pulldown--collapsed',
        item: 'pulldown__item',
        marker: 'pulldown__marker'
    },
    strings: {
        collapsed: 'Show more',
        expanded: 'Show less'
    },
    customElementMode: false
};

export default class {
    constructor(el, selectedOptions) {
        this.options = Object.assign({}, defaultOptions, selectedOptions);

        this.el = el;

        this._onClickListener = this._onClick.bind(this);

        if (!this.options.customElementMode) {
            this._mutationObserver = new MutationObserver(this._onMutation);
            this._observeMutations();
            this._observeEvents();
        }
    }

    _observeMutations() {
        if (!this.options.customElementMode) {
            this._mutationObserver.observe(this._buttonEl, {
                attributes: true,
                childList: false,
                subtree: false
            });
        }
    }

    _unobserveMutations() {
        if (!this.options.customElementMode) {
            this._mutationObserver.disconnect();
        }
    }

    _observeEvents() {
        this._buttonEl.addEventListener('click', this._onClickListener);
    }

    _unobserveEvents() {
        this._buttonEl.removeEventListener('click', this._onClickListener);
    }

    _onClick() {
        this.toggle();
    }

    _onMutation(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                // console.log(mutation);
            }
        }
    }

    _destroy() {
        this._unobserveMutations();
        this._unobserveEvents();
        this._onClickListener = null;
    }

    get _itemEl() {
        return this.el.querySelector(`.${this.options.bem.item}`);
    }

    get _itemSiblingEls() {
        return this.el.querySelectorAll('.pulldown__item ~ *');
    }

    get _buttonEl() {
        return this.el.querySelector(`.${this.options.bem.button}`);
    }

    get _markerEl() {
        return this.el.querySelector(`.${this.options.bem.marker}`);
    }

    set expanded(isExpanded) {
        this._unobserveMutations();

        if (isExpanded) {
            // add a marker class to remember place in list
            this._itemEl.previousElementSibling.classList.add(this.options.bem.marker);
            // remove the collapsed class
            this.el.classList.remove(this.options.bem.collapsed);
            // update the button text
            this._buttonEl.innerText = this.options.strings.expanded;
            // make the first new item programmatically focusables
            this._itemEl.nextElementSibling.setAttribute('tabindex', '-1');
            // set focus on the new button
            this._itemEl.nextElementSibling.focus();
            // move button to end of list
            this.el.appendChild(this._itemEl);
        } else {
            // move button back in place
            this.el.insertBefore(this._itemEl, this._markerEl.nextElementSibling);
            // remove the marker class
            this._markerEl.classList.remove(this.options.bem.marker);
            // add the collapsed class
            this.el.classList.add(this.options.bem.collapsed);
            // update the button text
            this._buttonEl.innerText = this.options.strings.collapsed;
            // set focus on the button
            this._buttonEl.focus();
        }

        this.el.dispatchEvent(new CustomEvent('makeup-pulldown-toggle', {
            detail: {
                expanded: this.expanded
            }
        }));

        this._observeMutations();
    }

    get expanded() {
        return this.el.classList.contains(this.options.bem.collapsed) === false;
    }

    set disabled(isDisabled) {
        this._unobserveMutations();
        this._buttonEl.setAttribute('aria-disabled', isDisabled.toString());
        this._buttonEl.setAttribute('tabindex', isDisabled ? '-1' : '0');
        this._observeMutations();
    }

    get disabled() {
        return this._buttonEl.getAttribute('aria-disabled') === 'true';
    }

    toggle() {
        if (!this.disabled) {
            this.expanded = !(this.expanded);
        }
    }
}
