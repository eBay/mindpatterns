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
var ActiveDescendant = require('makeup-active-descendant');

var PreventScrollKeys = require('makeup-prevent-scroll-keys');

function onFocus(e) {
  if (this._mouseDownFlag !== true && this.index === -1) {
    this._activeDescendant.index = 0;
    this.items[0].setAttribute('aria-checked', 'true');
  }

  this._mouseDownFlag = false;
}

function onMouseDown(e) {
  this._mouseDownFlag = true;
}

function _onActiveDescendantChange(e) {
  console.log(e);
  var fromEl = this.items[e.detail.fromIndex];
  var toEl = this.items[e.detail.toIndex];
  if (fromEl) fromEl.setAttribute('aria-checked', 'false');

  if (toEl) {
    toEl.setAttribute('aria-checked', 'true');
    console.log(toEl.innerText);

    this._el.dispatchEvent(new CustomEvent('listbox-change', {
      detail: {
        optionValue: toEl.innerText
      }
    }));
  }
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._listboxEl = this._el.querySelector('[role=listbox]');

    this._listboxEl.setAttribute('tabindex', '0');

    this._activeDescendant = ActiveDescendant.createLinear(this._el, this._listboxEl, this._listboxEl, '[role=option]', {
      autoReset: null
    });
    PreventScrollKeys.add(this._el);
    this._onFocusListener = onFocus.bind(this);
    this._onMouseDownListener = onMouseDown.bind(this);
    this._onActiveDescendantChangeListener = _onActiveDescendantChange.bind(this);

    this._el.classList.add('listbox--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._listboxEl.removeEventListener('focus', this._onFocusListener);

      this._listboxEl.removeEventListener('mousedown', this._onMouseDownListener);

      this._el.removeEventListener('activeDescendantChange', this._onActiveDescendantChangeListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._listboxEl.addEventListener('focus', this._onFocusListener);

        this._listboxEl.addEventListener('mousedown', this._onMouseDownListener);

        this._el.addEventListener('activeDescendantChange', this._onActiveDescendantChangeListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onFocusListener = null;
      this._onMouseDownListener = null;
      this._onActiveDescendantChangeListener = null;
    }
  }, {
    key: "index",
    get: function get() {
      return Array.prototype.slice.call(this.items).findIndex(function (el) {
        return el.getAttribute('aria-checked') === 'true';
      });
    }
  }, {
    key: "items",
    get: function get() {
      return this._listboxEl.querySelectorAll('[role=option]');
    }
  }]);

  return _class;
}();