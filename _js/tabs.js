'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function linkTabToPanel(widgetID, el, i) {
    el.setAttribute('id', widgetID + '-tab-' + i);
    el.setAttribute('aria-controls', widgetID + '-panel-' + i);
}

function linkPanelToTab(widgetID, el, i) {
    el.setAttribute('id', widgetID + '-panel-' + i);
    el.setAttribute('aria-labelledby', widgetID + '-tab-' + i);
}

function removeLink(el) {
    el.setAttribute('role', 'presentation');
    el.removeAttribute('href');
}

function onRovingTabindexChange(e) {
    var tabs = Util.querySelectorAllToArray('.tabs__item', this._el);
    var panels = Util.querySelectorAllToArray('.tabs__panel', this._el);
    var currentTab = tabs[e.detail.fromIndex];
    var newTab = tabs[e.detail.toIndex];
    var currentPanel = panels[e.detail.fromIndex];
    var newPanel = panels[e.detail.toIndex];

    currentTab.setAttribute('aria-selected', 'false');
    currentPanel.hidden = true;

    newTab.setAttribute('aria-selected', 'true');
    newPanel.hidden = false;

    this._el.dispatchEvent(new CustomEvent('tabsChange', {
        detail: {
            toIndex: e.detail.toIndex,
            fromIndex: e.detail.fromIndex
        }
    }));
}

var Util = require('./util.js');
var NextID = require('makeup-next-id');
var RovingTabindex = require('makeup-roving-tabindex');
var ScrollKeyPreventer = require('makeup-prevent-scroll-keys');
var KeyEmitter = require('makeup-key-emitter');

var defaultOptions = {
    initialIndex: 0
};

module.exports = function () {
    function _class(widgetEl, selectedOptions) {
        var _this = this;

        _classCallCheck(this, _class);

        this._options = _extends({}, defaultOptions, selectedOptions);

        this._onRovingTabindexChangeListener = onRovingTabindexChange.bind(this);

        // cache the root element
        this._el = widgetEl;

        var tabList = this._el.querySelector('.tabs__items', this._el);
        var tabs = Util.querySelectorAllToArray('.tabs__item', this._el);
        var panels = Util.querySelectorAllToArray('.tabs__panel', this._el);
        var links = Util.querySelectorAllToArray('a', tabList);

        this.tabs = tabs;
        this.panels = panels;

        // cache the initialIndex
        var initialIndex = this._options.initialIndex;

        // sanitize the initialIndex
        if (initialIndex < 0 || initialIndex >= tabs.length) {
            initialIndex = 0;
        }

        // ensure the widget has an ID
        NextID(widgetEl, 'tabs');

        // add static roles
        tabList.setAttribute('role', 'tablist');
        tabs.forEach(function (el) {
            return el.setAttribute('role', 'tab');
        });
        panels.forEach(function (el) {
            return el.setAttribute('role', 'tabpanel');
        });

        // set the selected tab to true
        tabs[initialIndex].setAttribute('aria-selected', 'true');

        // set all unselected tabs to false
        tabs.filter(function (el, i) {
            return i !== initialIndex;
        }).forEach(function (el) {
            return el.setAttribute('aria-selected', 'false');
        });

        // hide all unselected panels
        panels.filter(function (el, i) {
            return i !== initialIndex;
        }).forEach(function (el) {
            return el.hidden = true;
        });

        // all tabs control their respective panel
        tabs.forEach(function (el, i) {
            return linkTabToPanel(_this._el.id, el, i);
        });

        // all panels are labelled  by their respective tab
        panels.forEach(function (el, i) {
            return linkPanelToTab(_this._el.id, el, i);
        });

        // remove link behaviour and semantics
        links.forEach(function (el) {
            return removeLink(el);
        });

        // create a roving tab index
        var rovingTabindex = RovingTabindex.createLinear(this._el, '[role=tab]', { wrap: true });

        // listen for changes to roving tab index
        this._el.addEventListener('rovingTabindexChange', this._onRovingTabindexChangeListener);

        // prevent page scroll when scroll keys are pressed
        ScrollKeyPreventer.add(tabList);

        // mark the widget as progressively enhanced
        this._el.classList.add('tabs--js');
    }

    return _class;
}();
