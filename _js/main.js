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

  document.querySelectorAll('.accordion').forEach(function (widgetEl) {
    pageWidgets.push(new Accordion(widgetEl, {
      autoCollapse: widgetEl.hasAttribute('data-makeup-accordion-auto-collapse')
    }));
  });
  document.querySelectorAll('.accordion-legacy').forEach(function (widgetEl) {
    pageWidgets.push(new AccordionLegacy(widgetEl));
  });
  document.querySelectorAll('.tabs').forEach(function (widgetEl) {
    widgetEl.addEventListener('tabs-change', Util.logEvent);
    pageWidgets.push(new Tabs(widgetEl));
  });
  document.querySelectorAll('.expando').forEach(function (widgetEl) {
    widgetEl.addEventListener('expando-toggle', Util.logEvent);
    pageWidgets.push(new Expando(widgetEl));
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
});