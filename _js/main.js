"use strict";

/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/
var Expander = require('makeup-expander');

var pageWidgets = [];
document.addEventListener("DOMContentLoaded", function (e) {
  var Util = require('./util.js');

  var Accordion = require('./accordion.js');

  var AccordionLegacy = require('./accordion-legacy.js');

  var Expando = require('./expando.js');

  var Tabs = require('./tabs.js');

  var Tooltip = require('./tooltip.js');

  var DialogButton = require('./dialog-button.js');

  var AriaButton = require('./aria-button.js');

  var HijaxButton = require('./hijax-button.js');

  var StarRating = require('./star-rating.js');

  document.querySelectorAll('.accordion').forEach(function (widgetEl) {
    pageWidgets.push(new Accordion(widgetEl, {
      autoCollapse: widgetEl.hasAttribute('data-makeup-accordion-auto-collapse')
    }));
  });
  document.querySelectorAll('.accordion-legacy').forEach(function (widgetEl) {
    pageWidgets.push(new AccordionLegacy(widgetEl));
  });
  document.querySelectorAll('.native-button, .stealth-button').forEach(function (widgetEl) {
    pageWidgets.push(widgetEl);
    widgetEl.addEventListener('click', function () {
      alert(this);
    });
  });
  document.querySelectorAll('.aria-button').forEach(function (widgetEl) {
    pageWidgets.push(new AriaButton(widgetEl));
    widgetEl.addEventListener('aria-button-click', function (e) {
      alert(this);
    });
  });
  document.querySelectorAll('.fake-menu').forEach(function (widgetEl) {
    pageWidgets.push(new Expander(widgetEl, {
      expandOnClick: true,
      collapseOnFocusOut: true,
      collapseOnClickOut: true,
      contentSelector: '.fake-menu__content',
      focusManagement: 'focusable',
      hostSelector: '.fake-menu__host'
    }));
  });
  document.querySelectorAll('.hijax-button').forEach(function (widgetEl) {
    pageWidgets.push(new HijaxButton(widgetEl));
    widgetEl.addEventListener('hijax-button-click', function (e) {
      alert(this);
    });
  });
  document.querySelectorAll('.tabs').forEach(function (widgetEl) {
    widgetEl.addEventListener('tabs-change', Util.logEvent);
    pageWidgets.push(new Tabs(widgetEl));
  });
  document.querySelectorAll('.dialog-button').forEach(function (widgetEl) {
    pageWidgets.push(new DialogButton(widgetEl));
  });
  document.querySelectorAll('.expando').forEach(function (widgetEl) {
    widgetEl.addEventListener('expando-toggle', Util.logEvent);
    pageWidgets.push(new Expando(widgetEl));
  });
  document.querySelectorAll('.page-notice--attention').forEach(function (widgetEl) {
    widgetEl.setAttribute('tabindex', '-1');
    setTimeout(function onTimeout() {
      widgetEl.focus();
    }, 250);
  });
  document.querySelectorAll('.star-rating').forEach(function (widgetEl) {
    pageWidgets.push(new StarRating(widgetEl));
  });
  document.querySelectorAll('.tooltip').forEach(function (widgetEl) {
    pageWidgets.push(new Tooltip(widgetEl));
  });
  document.querySelectorAll('.infotip').forEach(function (widgetEl) {
    pageWidgets.push(new Expander(widgetEl, {
      contentSelector: '.infotip__content',
      expandOnClick: true,
      collapseOnClick: true,
      hostSelector: '.infotip__host'
    }));
  });
  document.querySelectorAll('.flyout--click').forEach(function (widgetEl) {
    pageWidgets.push(new Expander(widgetEl, {
      contentSelector: '.flyout__content',
      expandOnClick: true,
      collapseOnClick: true,
      hostSelector: '.flyout__host'
    }));
  });
  document.querySelectorAll('.flyout--focus').forEach(function (widgetEl) {
    pageWidgets.push(new Expander(widgetEl, {
      contentSelector: '.flyout__content',
      expandOnFocus: true,
      autoCollapse: true,
      hostSelector: '.flyout__host'
    }));
  });
  document.querySelectorAll('.flyout--hover').forEach(function (widgetEl) {
    pageWidgets.push(new Expander(widgetEl, {
      contentSelector: '.flyout__content',
      expandOnFocus: true,
      expandOnHover: true,
      autoCollapse: true,
      hostSelector: '.flyout__host'
    }));
  });
});