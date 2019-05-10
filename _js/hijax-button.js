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
var onClick = function onClick(e) {
  return e.preventDefault();
};

function onKeyDown(e) {
  if (e.keyCode === 32) {
    e.preventDefault();
    e.type = 'click';

    this._el.trigger(e);
  }
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._destroyed = false;
    this._onKeyDownListener = onKeyDown.bind(this);
    this._onClickListener = onClick.bind(this); // add button semantics

    this._el.setAttribute('role', 'button');

    this._el.classList.add('hijax-button--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._el.removeEventListener('keydown');

      this._el.removeEventListener('click');
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._el.addEventListener('keydown', this._onKeyDownListener);

        this._el.addEventListener('click', this._onClickListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onKeyDownListener = null;
      this._onClickListener = null;
    }
  }]);

  return _class;
}();