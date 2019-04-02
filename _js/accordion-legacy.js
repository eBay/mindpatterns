'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function onMouseToggle(e) {
    toggle(e.target);
}

function onKeyboardToggle(e) {
    toggle(e.detail.target);
}

function toggle(clickedTab) {
    var isSelected = clickedTab.getAttribute('aria-selected') === 'true';

    clickedTab.setAttribute('aria-selected', !isSelected);
    clickedTab.setAttribute('aria-expanded', !isSelected);
}

var Util = require('./util.js');
var NextID = require('makeup-next-id');
var RovingTabindex = require('makeup-roving-tabindex');
var scrollKeyPreventer = require('makeup-prevent-scroll-keys');
var keyEmitter = require('makeup-key-emitter');

module.exports = function () {
    function _class(widgetEl) {
        _classCallCheck(this, _class);

        this._el = widgetEl;
        var items = Util.querySelectorAllToArray('.accordion-legacy__item');
        var tabs = Util.querySelectorAllToArray('.accordion-legacy__tab');
        var panels = Util.querySelectorAllToArray('.accordion-legacy__panel');

        // ensure the widget has an ID
        NextID(widgetEl, 'accordion-legacy');

        // add appropriate ARIA roles
        widgetEl.setAttribute('role', 'tablist');

        tabs.forEach(function (el) {
            el.setAttribute('role', 'tab');
            el.setAttribute('aria-selected', 'false');
        });

        panels.forEach(function (el) {
            el.setAttribute('role', 'tabpanel');
            el.setAttribute('aria-hidden', 'true');
        });

        // all panels are labelled and controlled by their respective tab
        tabs.forEach(function (el, idx) {
            var tabId = widgetEl.id + '-tab-' + idx;
            var panelId = widgetEl.id + '-panel-' + idx;
            var panelEl = panels[idx];

            el.id = tabId;
            el.setAttribute('aria-controls', panelId);

            panelEl.id = panelId;
            panelEl.setAttribute('aria-labelledby', tabId);
        });

        // create a roving tab index on headings
        RovingTabindex.createLinear(widgetEl, '.accordion-legacy__tab');

        // listen for common keyboard commands
        keyEmitter.addKeyDown(widgetEl);

        // call plugin to prevent page scroll
        scrollKeyPreventer.add(widgetEl);

        // add mouse and keyboard listeners
        widgetEl.addEventListener('click', onMouseToggle);
        widgetEl.addEventListener('spacebarKeyDown', onKeyboardToggle);
        widgetEl.addEventListener('enterKeyDown', onKeyboardToggle);

        // mark widget as initialised
        widgetEl.classList.add('accordion-legacy--js');
    }

    _createClass(_class, [{
        key: 'destroy',
        value: function destroy() {
            this._el.removeEventListener('click', onMouseToggle);
            this._el.removeEventListener('spacebarKeyDown', onKeyboardToggle);
            this._el.removeEventListener('enterKeyDown', onKeyboardToggle);
        }
    }]);

    return _class;
}();
