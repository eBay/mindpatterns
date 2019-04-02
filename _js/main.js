/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

function logEvent(e) {
    console.log(e);
}

pageWidgets = [];

document.addEventListener("DOMContentLoaded", function(e) {
    var Util = require('./util.js');
    var AccordionLegacy = require('./accordion-legacy.js');
    var Details = require('./details.js');
    var Tabs = require('./tabs.js');

    Util.querySelectorAllToArray('.accordion-legacy').forEach(function(accordionEl) {
        pageWidgets.push(new AccordionLegacy(accordionEl));
    });

    Util.querySelectorAllToArray('.tabs').forEach(function(tabsEl) {
        tabsEl.addEventListener('tabs-change', logEvent);

        pageWidgets.push(new Tabs(tabsEl));
    });

    Util.querySelectorAllToArray('.details').forEach(function(detailsEl) {
        // this event will be fired by browsers that don't support details element
        detailsEl.addEventListener('details-toggle', logEvent);
        // this event will be fired by browsers that DO support details element
        detailsEl.addEventListener('toggle', logEvent);

        pageWidgets.push(new Details(detailsEl));
    });
});
