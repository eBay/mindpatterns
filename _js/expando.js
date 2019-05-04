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
function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
}

function onClick(e) {
  this.expanded = !this.expanded;
}

function hideElements(els) {
  els.forEach(function (el) {
    return el.setAttribute('hidden', '');
  });
}

function showElements(els) {
  els.forEach(function (el) {
    return el.removeAttribute('hidden');
  });
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl) {
    _classCallCheck(this, _class);

    this._el = widgetEl;
    this._destroyed = false;
    this._buttonEl = widgetEl.querySelector('.expando__button');
    this._onClickListener = onClick.bind(this);
    this._childElements = nodeListToArray(this._el.children).filter(function (el) {
      return el.tagName.toUpperCase() !== 'BUTTON';
    });

    if (this._buttonEl.getAttribute('aria-expanded') !== 'true') {
      hideElements(this._childElements);
    }

    this.wake();
  }

  _createClass(_class, [{
    key: "sleep",
    value: function sleep() {
      this._buttonEl.removeEventListener('click', this._onClickListener);
    }
  }, {
    key: "wake",
    value: function wake() {
      if (this._destroyed !== true) {
        this._buttonEl.addEventListener('click', this._onClickListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.sleep();
      this._onClickListener = null;
    }
  }, {
    key: "expanded",
    get: function get() {
      return this._buttonEl.getAttribute('aria-expanded') === 'true';
    },
    set: function set(bool) {
      if (bool === true) {
        showElements(this._childElements);
      } else {
        hideElements(this._childElements);
      }

      this._buttonEl.setAttribute('aria-expanded', bool);

      this._el.dispatchEvent(new CustomEvent('expando-toggle'));
    }
  }]);

  return _class;
}();