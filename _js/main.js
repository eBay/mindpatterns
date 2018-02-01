/**
* Copyright 2015 eBay Inc.
*
* Use of this source code is governed by a MIT-style
* license that can be found in the LICENSE file or at
* https://opensource.org/licenses/MIT.
*/

$(function() {
    var Accordion = require('./accordion.js');

    function nodeListToArray(nodeList) {
        return Array.prototype.slice.call(nodeList);
    }

    $('.skipto').skipTo();

    nodeListToArray(document.querySelectorAll('.accordion')).forEach(function(el) {
        return new Accordion(el);
    })
});
