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
var nodeListToArray = function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList);
};

function linkTabToPanel(widgetID, el, i) {
  el.setAttribute('id', widgetID + '-tab-' + i);
  el.setAttribute('aria-controls', widgetID + '-panel-' + i);
}

function linkPanelToTab(widgetID, el, i) {
  el.setAttribute('id', widgetID + '-panel-' + i);
  el.setAttribute('aria-labelledby', widgetID + '-tab-' + i);
}

function disableLink(el) {
  el.setAttribute('role', 'presentation');
  el.removeAttribute('href');
}

function onRovingTabindexChange(e) {
  this.tabs[e.detail.fromIndex].setAttribute('aria-selected', 'false');
  this.panels[e.detail.fromIndex].hidden = true;
  this.tabs[e.detail.toIndex].setAttribute('aria-selected', 'true');
  this.panels[e.detail.toIndex].hidden = false;

  this._el.dispatchEvent(new CustomEvent('tabs-change', {
    detail: {
      fromIndex: e.detail.fromIndex,
      toIndex: e.detail.toIndex
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

module.exports =
/*#__PURE__*/
function () {
  function _class(widgetEl, selectedOptions) {
    var _this = this;

    _classCallCheck(this, _class);

    this._options = _extends({}, defaultOptions, selectedOptions);
    this._onRovingTabindexChangeListener = onRovingTabindexChange.bind(this); // cache the root element

    this._el = widgetEl;

    var tabList = this._el.querySelector('.tabs__items');

    var tabs = this._el.querySelectorAll('.tabs__item');

    var panels = this._el.querySelectorAll('.tabs__panel');

    var links = tabList.querySelectorAll('a');
    this.tabs = tabs;
    this.panels = panels; // cache the initialIndex

    var initialIndex = this._options.initialIndex; // sanitize the initialIndex

    if (initialIndex < 0 || initialIndex >= tabs.length) {
      initialIndex = 0;
    } // ensure the widget has an ID


    NextID(widgetEl, 'tabs'); // add static roles

    tabList.setAttribute('role', 'tablist');
    tabs.forEach(function (el) {
      return el.setAttribute('role', 'tab');
    });
    panels.forEach(function (el) {
      return el.setAttribute('role', 'tabpanel');
    }); // set the selected tab to true

    tabs[initialIndex].setAttribute('aria-selected', 'true'); // set all unselected tabs to false

    nodeListToArray(tabs).filter(function (el, i) {
      return i !== initialIndex;
    }).forEach(function (el) {
      return el.setAttribute('aria-selected', 'false');
    }); // hide all unselected panels

    nodeListToArray(panels).filter(function (el, i) {
      return i !== initialIndex;
    }).forEach(function (el) {
      return el.hidden = true;
    }); // all tabs control their respective panel

    tabs.forEach(function (el, i) {
      return linkTabToPanel(_this._el.id, el, i);
    }); // all panels are labelled  by their respective tab

    panels.forEach(function (el, i) {
      return linkPanelToTab(_this._el.id, el, i);
    }); // remove link behaviour and semantics

    links.forEach(function (el) {
      return disableLink(el);
    }); // create a roving tab index

    var rovingTabindex = RovingTabindex.createLinear(this._el, '[role=tab]', {
      wrap: true
    });
    this.enableEvents(); // prevent page scroll when scroll keys are pressed

    ScrollKeyPreventer.add(tabList); // mark the widget as progressively enhanced

    this._el.classList.add('tabs--js');
  }

  _createClass(_class, [{
    key: "disableEvents",
    value: function disableEvents() {
      this._el.removeEventListener('rovingTabindexChange', this._onRovingTabindexChangeListener);
    }
  }, {
    key: "enableEvents",
    value: function enableEvents() {
      if (this._destroyed !== true) {
        // listen for changes to roving tab index
        this._el.addEventListener('rovingTabindexChange', this._onRovingTabindexChangeListener);
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._destroyed = true;
      this.disableEvents();
      this._onRovingTabindexChangeListener = null;
    }
  }]);

  return _class;
}();