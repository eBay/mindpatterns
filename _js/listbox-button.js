"use strict";

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

function onButtonFirstClick(e) {
  this._listboxEl.hidden = false;
}

function onListboxDone(e) {
  this._expander.collapse();

  this._buttonEl.focus();
}

function onListboxKeyDown(e) {
  if (e.keyCode === 13 || e.keyCode === 27 || e.keyCode === 32) {
    e.preventDefault();

    this._expander.collapse();

    this._buttonEl.focus();
  }
}

function onListboxClick(e) {
  var _this = this;

  setTimeout(function () {
    _this._expander.collapse();

    _this._buttonEl.focus();
  }, 150);
}

function onListboxChange(e) {
  this._buttonEl.innerText = e.detail.optionValue;
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._buttonEl = this._el.querySelector('button');
    this._listboxEl = this._el.querySelector('.listbox');
    this._expander = new Expander(this._el, {
      alwaysDoFocusManagement: true,
      collapseOnClick: true,
      collapseOnClickOut: true,
      collapseOnFocusOut: true,
      contentSelector: '.listbox',
      expandOnClick: true,
      focusManagement: 'focusable',
      hostSelector: 'button'
    });
    this._destroyed = false;
    this._onButtonFirstClickListener = onButtonFirstClick.bind(this);
    this._onListboxDoneListener = onListboxDone.bind(this);
    this._onListboxClickListener = onListboxClick.bind(this);
    this._onListboxKeyDownListener = onListboxKeyDown.bind(this);
    this._onListboxChangeListener = onListboxChange.bind(this);

    this._el.classList.add('listbox-button--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._buttonEl.removeEventListener('click', this._onButtonFirstClickListener);

      this._listboxEl.removeEventListener('listbox-done', this._onListboxDoneListener);

      this._listboxEl.removeEventListener('click', this._onListboxClickListener);

      this._listboxEl.removeEventListener('keydown', this._onListboxKeyDownListener);

      this._listboxEl.removeEventListener('listbox-change', this._onListboxChangeListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._buttonEl.addEventListener('click', this._onButtonFirstClickListener, {
          once: true
        });

        this._listboxEl.addEventListener('listbox-done', this._onListboxDoneListener);

        this._listboxEl.addEventListener('click', this._onListboxClickListener);

        this._listboxEl.addEventListener('keydown', this._onListboxKeyDownListener);

        this._listboxEl.addEventListener('listbox-change', this._onListboxChangeListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onButtonFirstClickListener = null;
      this._onListboxDoneListener = null;
      this._onListboxClickListener = null;
      this._onListboxKeyDownListener = null;
      this._onListboxChangeListener = null;
    }
  }]);

  return _class;
}();