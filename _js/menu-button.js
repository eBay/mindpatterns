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
  this._menuEl.hidden = false;
}

function onMenuKeyDown(e) {
  if (e.keyCode === 27) {
    this._expander.collapse();

    this._buttonEl.focus();
  }
}

function onMenuItemSelect(e) {
  var widget = this;
  setTimeout(function (e) {
    widget._expander.collapse();

    widget._buttonEl.focus();
  }, 150);
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._buttonEl = this._el.querySelector('button');
    this._menuEl = this._el.querySelector('.menu');
    this._expander = new Expander(this._el, {
      collapseOnClick: true,
      collapseOnClickOut: true,
      collapseOnFocusOut: true,
      contentSelector: '.menu',
      expandedClass: 'menu-button--expanded',
      expandOnClick: true,
      focusManagement: 'focusable',
      hostSelector: 'button'
    });
    this._menuEl = this._el.querySelector('.menu');
    this._destroyed = false;
    this._onButtonFirstClickListener = onButtonFirstClick.bind(this);
    this._onMenuKeyDownListener = onMenuKeyDown.bind(this);
    this._onMenuItemSelectListener = onMenuItemSelect.bind(this);

    this._el.classList.add('menu-button--js');

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._buttonEl.removeEventListener('click', this._onButtonFirstClickListener);

      this._menuEl.removeEventListener('keydown', this._onMenuKeyDownListener);

      this._menuEl.removeEventListener('menu-select', this._onMenuItemSelectListener);

      this._menuEl.removeEventListener('menu-toggle', this._onMenuItemSelectListener);

      this._menuEl.removeEventListener('menu-change', this._onMenuItemSelectListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._buttonEl.addEventListener('click', this._onButtonFirstClickListener, {
          once: true
        });

        this._menuEl.addEventListener('keydown', this._onMenuKeyDownListener);

        this._menuEl.addEventListener('menu-select', this._onMenuItemSelectListener);

        this._menuEl.addEventListener('menu-toggle', this._onMenuItemSelectListener);

        this._menuEl.addEventListener('menu-change', this._onMenuItemSelectListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onButtonFirstClickListener = null;
      this._onMenuKeyDownListener = null;
      this._onMenuItemSelectListener = null;
    }
  }]);

  return _class;
}();