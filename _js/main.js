/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

pageWidgets = [];

document.addEventListener("DOMContentLoaded", function(e) {
    var Util = require('./util.js');
    var Accordion = require('./accordion.js');
    var AccordionLegacy = require('./accordion-legacy.js');
    var Expando = require('./expando.js');
    var Tabs = require('./tabs.js');

    document.querySelectorAll('.accordion').forEach(function(accordionEl) {
        pageWidgets.push(new Accordion(accordionEl, { autoCollapse: accordionEl.hasAttribute('data-makeup-accordion-auto-collapse')}));
    });

    document.querySelectorAll('.accordion-legacy').forEach(function(accordionEl) {
        pageWidgets.push(new AccordionLegacy(accordionEl));
    });

    document.querySelectorAll('.tabs').forEach(function(tabsEl) {
        tabsEl.addEventListener('tabs-change', Util.logEvent);

        pageWidgets.push(new Tabs(tabsEl));
    });

    document.querySelectorAll('.expando').forEach(function(expandoEl) {
        expandoEl.addEventListener('expando-toggle', Util.logEvent);

        pageWidgets.push(new Expando(expandoEl));
    });
});
