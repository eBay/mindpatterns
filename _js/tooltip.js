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

var defaultOptions = {
  contentSelector: '.tooltip__content, [role=tooltip]',
  hostSelector: '.tooltip__host, [aria-describedby]'
};

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl, selectedOptions) {
    _classCallCheck(this, _class);

    this._options = _extends({}, defaultOptions, selectedOptions);
    this._el = widgetEl;
    this.expander = new Expander(widgetEl, {
      autoCollapse: true,
      contentSelector: this._options.contentSelector,
      hostSelector: this._options.hostSelector,
      expandOnFocus: true,
      expandOnHover: true
    });
    this._destroyed = false;
    this.wake();

    this._el.classList.add('tooltip--js');
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this.expander.expandOnFocus = false;
      this.expander.expandOnHover = false;
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this.expander.expandOnFocus = true;
        this.expander.expandOnHover = true;
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
    }
  }]);

  return _class;
}();