"use strict";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/
var Expander = require('makeup-expander');

var Listbox = require('./listbox.js');

function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function onTextboxKeyDown(e) {
  // up and down keys should not move caret
  if (e.keyCode === 38 || e.keyCode === 40) {
    e.preventDefault();
  } // for manual selection, ENTER should not submit form when listbox is open


  if (this._expander.isExpanded() && !this._options.autoSelect && e.keyCode === 13) {
    e.preventDefault();
    var widget = this;
    this._inputEl.value = this._listboxWidget.items[this._listboxWidget._activeDescendant.index].innerText;
    setTimeout(function () {
      widget._expander.collapse();
    }, 150);
  }
}

function onTextboxInput(e) {
  var widget = this;
  var numChars = widget._inputEl.value.length;

  var currentValue = widget._inputEl.value.toLowerCase();

  var matchedItems = nodeListToArray(widget._listboxWidget.items).filter(function (el) {
    return el.innerText.substring(0, numChars).toLowerCase() === currentValue;
  });
  var unmatchedItems = nodeListToArray(widget._listboxWidget.items).filter(function (el) {
    return el.innerText.substring(0, numChars).toLowerCase() !== currentValue;
  });
  matchedItems.forEach(function (el) {
    return el.hidden = false;
  });
  unmatchedItems.forEach(function (el) {
    return el.hidden = true;
  });
}

function onListboxClick(e) {
  var widget = this;
  setTimeout(function () {
    widget._expander.collapse();
  }, 150);
}

function onListboxChange(e) {
  this._inputEl.value = e.detail.optionValue;

  if (!this._options.autoSelect) {
    this._listboxWidget.clear();
  }
}

var defaultOptions = {
  autoSelect: true
};

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl, selectedOptions) {
    _classCallCheck(this, _class);

    this._options = _extends({}, defaultOptions, selectedOptions);
    this._el = widgetEl;
    this._inputEl = this._el.querySelector('input');
    this._listboxEl = this._el.querySelector('.combobox__listbox');
    this._autocompleteType = this._inputEl.getAttribute('aria-autocomplete');

    this._inputEl.setAttribute('autocomplete', 'off');

    this._inputEl.setAttribute('role', 'combobox');

    this._listboxEl.hidden = false;
    this._listboxWidget = new Listbox(this._listboxEl, {
      autoReset: -1,
      autoSelect: this._options.autoSelect,
      focusableElement: this._inputEl,
      listboxOwnerElement: this._el
    });
    this._expander = new Expander(this._el, {
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
    this._onTextboxInputListener = onTextboxInput.bind(this);

    this._el.classList.add('combobox--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._listboxEl.removeEventListener('click', this._onListboxClickListener);

      this._listboxEl.removeEventListener('listbox-change', this._onListboxChangeListener);

      this._inputEl.removeEventListener('keydown', this._onTextboxKeyDownListener);

      this._inputEl.removeEventListener('input', this._onTextboxInputListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._listboxEl.addEventListener('click', this._onListboxClickListener);

        this._listboxEl.addEventListener('listbox-change', this._onListboxChangeListener);

        this._inputEl.addEventListener('keydown', this._onTextboxKeyDownListener);

        this._inputEl.addEventListener('input', this._onTextboxInputListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onListboxClickListener = null;
      this._onListboxChangeListener = null;
      this._onTextboxKeyDownListener = null;
      this._onTextboxInputsListener = null;
    }
  }, {
    key: "autocomplete",
    get: function get() {
      return this._inputEl.getAttribute('aria-autocomplete');
    }
  }]);

  return _class;
}();