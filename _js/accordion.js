'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

var Util = require('./util.js');
var Details = require('./details.js');

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
    // this event will be fired by browsers that DO NOT support details element
    detailsEl.addEventListener('details-toggle', this._onToggleListener);
    // this event will be fired by browsers that DO support details element
    detailsEl.addEventListener('toggle', this._onToggleListener);
}

function removeToggleListener(detailsEl, i) {
    // this event will be fired by browsers that DO NOT support details element
    detailsEl.removeEventListener('details-toggle', this._onToggleListener);
    // this event will be fired by browsers that DO support details element
    detailsEl.removeEventListener('toggle', this._onToggleListener);
}

function createDetailsWidget(el, i) {
    el.setAttribute(dataSetKey, i);
    this._detailsWidgets.push(new Details(el));
}

module.exports = function () {
    function _class(widgetEl, selectedOptions) {
        _classCallCheck(this, _class);

        this._options = _extends({}, defaultOptions, selectedOptions);

        // cache the root element
        this._el = widgetEl;

        this._onToggleListener = onToggle.bind(this);

        this._detailsWidgets = [];

        var detailsEls = Util.querySelectorAllToArray('.accordion__details', this._el);

        detailsEls.forEach(createDetailsWidget.bind(this));

        this.enableEvents();

        // mark the widget as progressively enhanced
        this._el.classList.add('accordion--js');
    }

    _createClass(_class, [{
        key: 'disableEvents',
        value: function disableEvents() {
            Util.querySelectorAllToArray('.accordion__details', this._el).forEach(removeToggleListener.bind(this));
        }
    }, {
        key: 'enableEvents',
        value: function enableEvents() {
            if (this._destroyed !== true) {
                Util.querySelectorAllToArray('.accordion__details', this._el).forEach(addToggleListener.bind(this));
            }
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this._destroyed = true;

            this.disableEvents();

            this._onToggleListener = null;
        }
    }]);

    return _class;
}();