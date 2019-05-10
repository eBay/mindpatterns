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
var Modal = require('makeup-modal');

var Focusables = require('makeup-focusables');

function onClose(e) {
  this._el.hidden = true;

  this._el.dispatchEvent(new CustomEvent('dialog-close'));
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._windowEl = this._el.querySelector('.dialog__window');
    this._closeButtonEl = this._el.querySelector('.dialog__close');
    this._onCloseButtonClickListener = onClose.bind(this);

    this._el.classList.add('dialog--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._el.removeEventListener('click', this._onCloseButtonClickListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._closeButtonEl.addEventListener('click', this._onCloseButtonClickListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onCloseButtonClickListener = null;
    }
  }, {
    key: "focusables",
    get: function get() {
      return Focusables(this._windowEl);
    }
  }, {
    key: "open",
    set: function set(bool) {
      this._el.hidden = !bool;

      if (bool === true) {
        this._el.open = true;
        this.focusables[0].focus();
        Modal.modal(this._el);
      } else {
        Modal.unmodal();
        this._el.open = false;
      }
    }
  }]);

  return _class;
}();