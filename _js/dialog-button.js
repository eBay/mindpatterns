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
function onClick() {
  this._dialogWidget.open = true;
}

function onClose() {
  this._el.focus();
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl, dialogWidget) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._dialogWidget = dialogWidget;
    this._dialogEl = dialogWidget._el;
    this._destroyed = false;
    this._onClickListener = onClick.bind(this);
    this._onDialogCloseListener = onClose.bind(this);

    this._el.classList.add('dialog-button--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._el.removeEventListener('click');

      this._dialogEl.removeEventListener('dialog-close', this._onDialogCloseListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._el.addEventListener('click', this._onClickListener);

        this._dialogEl.addEventListener('dialog-close', this._onDialogCloseListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onClickListener = null;
      this._onDialogCloseListener = null;
    }
  }]);

  return _class;
}();