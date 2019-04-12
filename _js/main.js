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
    var Details = require('./details.js');
    var Tabs = require('./tabs.js');

    Util.querySelectorAllToArray('.accordion').forEach(function(accordionEl) {
        pageWidgets.push(new Accordion(accordionEl, { autoCollapse: accordionEl.hasAttribute('data-makeup-accordion-auto-collapse')}));
    });

    Util.querySelectorAllToArray('.accordion-legacy').forEach(function(accordionEl) {
        pageWidgets.push(new AccordionLegacy(accordionEl));
    });

    Util.querySelectorAllToArray('.tabs').forEach(function(tabsEl) {
        tabsEl.addEventListener('tabs-change', Util.logEvent);

        pageWidgets.push(new Tabs(tabsEl));
    });

    Util.querySelectorAllToArray('.details').forEach(function(detailsEl) {
        // this event will be fired by browsers that don't support details element
        detailsEl.addEventListener('details-toggle', Util.logEvent);
        // this event will be fired by browsers that DO support details element
        detailsEl.addEventListener('toggle', Util.logEvent);

        pageWidgets.push(new Details(detailsEl));
    });
});
