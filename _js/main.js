/**
* Copyright 2019 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

document.addEventListener("DOMContentLoaded", function(e) {
    var Util = require('./util.js');
    var AccordionLegacy = require('./accordion-legacy.js');
    var Tabs = require('./tabs.js');

    Util.querySelectorAllToArray('.accordion-legacy').forEach(function(el) {
        return new AccordionLegacy(el);
    });

    Util.querySelectorAllToArray('.tabs').forEach(function(el) {
        el.addEventListener('tabsChange', function(e) {
            // console.log(e.detail);
        });
        return new Tabs(el);
    });
});
