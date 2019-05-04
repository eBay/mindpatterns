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
var dataSetKey = 'data-makeup-accordion-index';
var defaultOptions = {
  autoCollapse: false
};

function onToggle(e) {
  var itemIndex = e.target.getAttribute(dataSetKey);
  var isOpen = this._detailsWidgets[itemIndex].open === true;

  if (this._options.autoCollapse === true && isOpen) {
    var otherWidgets = this._detailsWidgets.filter(function (item, index) {
      return index != itemIndex;
    });

    otherWidgets.forEach(function (widget) {
      return widget.open = false;
    });
  }
}

function addToggleListener(detailsEl, i) {
  detailsEl.addEventListener('toggle', this._onToggleListener);
}

function removeToggleListener(detailsEl, i) {
  detailsEl.removeEventListener('toggle', this._onToggleListener);
}

function createDetailsWidget(el, i) {
  el.setAttribute(dataSetKey, i);

  this._detailsWidgets.push(el);
}

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl, selectedOptions) {
    _classCallCheck(this, _class);

    this._options = _extends({}, defaultOptions, selectedOptions); // cache the root element

    this._el = widgetEl;
    this._onToggleListener = onToggle.bind(this);
    this._detailsWidgets = [];

    var detailsEls = this._el.querySelectorAll('.accordion__details');

    detailsEls.forEach(createDetailsWidget.bind(this));
    this.enableEvents(); // mark the widget as progressively enhanced

    this._el.classList.add('accordion--js');
  }

  _createClass(_class, [{
    key: "disableEvents",
    value: function disableEvents() {
      this._el.querySelectorAll('.accordion__details').forEach(removeToggleListener.bind(this));
    }
  }, {
    key: "enableEvents",
    value: function enableEvents() {
      if (this._destroyed !== true) {
        this._el.querySelectorAll('.accordion__details').forEach(addToggleListener.bind(this));
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.disableEvents();
      this._onToggleListener = null;
    }
  }]);

  return _class;
}();